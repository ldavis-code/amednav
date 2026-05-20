#!/usr/bin/env node
/**
 * Export from Neon to JSON
 *
 * Reads conditions, medications, and savings programs from Neon
 * and writes structured JSON files for the React app to consume.
 *
 * Generates two files:
 *   - src/data/liver_conditions.json (new nested structure for condition-first display)
 *   - src/data/medications.json (flat list, regenerated to match Neon - backs up existing)
 *
 * Usage:
 *   export DATABASE_URL='postgresql://...'
 *   node export_from_neon.js
 *
 * Optional flags:
 *   --liver-only        Only export liver (Hepatology) conditions
 *   --dry-run           Print summary but don't write files
 */

import { neon } from '@neondatabase/serverless';
import { writeFileSync, existsSync, copyFileSync, mkdirSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const LIVER_ONLY = process.argv.includes('--liver-only');
const DRY_RUN = process.argv.includes('--dry-run');

if (!process.env.DATABASE_URL) {
  console.error('Error: DATABASE_URL environment variable is required');
  process.exit(1);
}

const sql = neon(process.env.DATABASE_URL);

// Maps Neon's program_type values to the keys we want in JSON.
// Keeping copay cards and PAPs strictly separate per platform requirements.
const PROGRAM_TYPE_MAP = {
  'Copay Card': 'copay_cards',
  'Patient Assistance': 'patient_assistance',
  'Discount Program': 'discount_programs',
  'Free Trial': 'free_trials',
};

async function main() {
  console.log('=== TMN Neon Export ===\n');
  if (LIVER_ONLY) console.log('Mode: LIVER ONLY (Hepatology conditions)');
  if (DRY_RUN) console.log('Mode: DRY RUN (no files will be written)');
  console.log('');

  // --- 1. Load conditions ---
  console.log('Loading conditions...');
  const conditions = LIVER_ONLY
    ? await sql`SELECT * FROM conditions WHERE category = 'Hepatology' ORDER BY name`
    : await sql`SELECT * FROM conditions ORDER BY category, name`;
  console.log(`  Found ${conditions.length} conditions`);

  // --- 2. Load all condition_medications links ---
  console.log('Loading condition→medication links...');
  const conditionIds = conditions.map(c => c.id);
  const links = await sql`
    SELECT * FROM condition_medications WHERE condition_id = ANY(${conditionIds})
  `;
  console.log(`  Found ${links.length} links`);

  // --- 3. Load all medications referenced by those links ---
  const medicationIds = [...new Set(links.map(l => l.medication_id))];
  console.log('Loading medications...');
  const medications = medicationIds.length === 0
    ? []
    : await sql`SELECT * FROM medications WHERE id = ANY(${medicationIds}) ORDER BY brand_name`;
  console.log(`  Found ${medications.length} medications`);

  // --- 4. Load all savings programs for those medications ---
  console.log('Loading savings programs...');
  const savingsPrograms = medicationIds.length === 0
    ? []
    : await sql`SELECT * FROM savings_programs WHERE medication_id = ANY(${medicationIds})`;
  console.log(`  Found ${savingsPrograms.length} savings programs`);

  // --- 5. Audit: log blanks and unknowns so we know what's missing ---
  const blanks = savingsPrograms.filter(p => !p.program_type || p.program_type.trim() === '');
  const unknowns = savingsPrograms.filter(p => {
    const t = p.program_type;
    return t && t.trim() !== '' && !PROGRAM_TYPE_MAP[t];
  });

  if (blanks.length > 0) {
    console.log(`\n⚠️  ${blanks.length} savings programs have BLANK program_type (will be skipped):`);
    blanks.forEach(b => {
      const med = medications.find(m => m.id === b.medication_id);
      console.log(`     id=${b.id} medication=${med?.brand_name || '?'} name="${b.program_name || '(no name)'}"`);
    });
  }
  if (unknowns.length > 0) {
    console.log(`\n⚠️  ${unknowns.length} savings programs have UNRECOGNIZED program_type (will be skipped):`);
    [...new Set(unknowns.map(u => u.program_type))].forEach(t => console.log(`     "${t}"`));
  }

  // --- 6. Build the nested structure ---
  const linksByCondition = new Map();
  links.forEach(l => {
    if (!linksByCondition.has(l.condition_id)) linksByCondition.set(l.condition_id, []);
    linksByCondition.get(l.condition_id).push(l.medication_id);
  });

  const medById = new Map(medications.map(m => [m.id, m]));

  const programsByMedication = new Map();
  savingsPrograms.forEach(p => {
    const key = PROGRAM_TYPE_MAP[p.program_type];
    if (!key) return; // skip blanks and unknowns
    if (!programsByMedication.has(p.medication_id)) {
      programsByMedication.set(p.medication_id, {
        copay_cards: [],
        patient_assistance: [],
        discount_programs: [],
        free_trials: [],
      });
    }
    programsByMedication.get(p.medication_id)[key].push({
      id: p.id,
      program_name: p.program_name,
      max_savings: p.max_savings,
      application_url: p.application_url,
      phone_number: p.phone_number,
      eligibility: p.eligibility,
      notes: p.notes,
      last_verified: p.last_verified,
    });
  });

  const nestedConditions = conditions.map(c => {
    const medIds = linksByCondition.get(c.id) || [];
    const meds = medIds
      .map(id => medById.get(id))
      .filter(Boolean)
      .map(m => {
        const programs = programsByMedication.get(m.id) || {
          copay_cards: [], patient_assistance: [], discount_programs: [], free_trials: [],
        };
        return {
          id: m.id,
          brand_name: m.brand_name,
          generic_name: m.generic_name,
          manufacturer: m.manufacturer,
          drug_class: m.drug_class,
          has_generic: m.has_generic,
          typical_cost_range: m.typical_cost_range,
          notes: m.notes,
          ...programs,
        };
      });

    return {
      id: c.id,
      name: c.name,
      category: c.category,
      description: c.description,
      medication_count: meds.length,
      medications: meds,
    };
  });

  // --- 7. Build flat medications list (for backwards compatibility) ---
  const flatMedications = medications.map(m => ({
    id: m.id,
    brand_name: m.brand_name,
    generic_name: m.generic_name,
    manufacturer: m.manufacturer,
    drug_class: m.drug_class,
    has_generic: m.has_generic,
    typical_cost_range: m.typical_cost_range,
    notes: m.notes,
  }));

  // --- 8. Summary ---
  const summary = {
    exported_at: new Date().toISOString(),
    mode: LIVER_ONLY ? 'liver_only' : 'all_conditions',
    condition_count: conditions.length,
    medication_count: medications.length,
    savings_program_count: savingsPrograms.length - blanks.length - unknowns.length,
    skipped_blank_programs: blanks.length,
    skipped_unknown_programs: unknowns.length,
  };

  console.log('\n=== Summary ===');
  Object.entries(summary).forEach(([k, v]) => console.log(`  ${k}: ${v}`));

  // --- 9. Write files (unless dry run) ---
  if (DRY_RUN) {
    console.log('\nDry run complete. No files written.');
    return;
  }

  const dataDir = join(__dirname, 'src', 'data');
  if (!existsSync(dataDir)) {
    console.log(`\nCreating ${dataDir}...`);
    mkdirSync(dataDir, { recursive: true });
  }

  // Back up existing medications.json if present
  const medPath = join(dataDir, 'medications.json');
  if (existsSync(medPath)) {
    const backupPath = medPath + '.backup-' + Date.now();
    copyFileSync(medPath, backupPath);
    console.log(`\nBacked up existing medications.json → ${backupPath}`);
  }

  const nestedFile = LIVER_ONLY ? 'liver_conditions.json' : 'conditions.json';
  writeFileSync(
    join(dataDir, nestedFile),
    JSON.stringify({ metadata: summary, conditions: nestedConditions }, null, 2)
  );
  console.log(`Wrote ${join(dataDir, nestedFile)}`);

  writeFileSync(medPath, JSON.stringify(flatMedications, null, 2));
  console.log(`Wrote ${medPath}`);

  console.log('\n✓ Export complete.');
}

main().catch(e => {
  console.error('\n✗ Export failed:', e.message);
  process.exit(1);
});
