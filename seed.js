// AMedNav Database Seed Script
// This script imports all 5 CSV files into your Neon database.
//
// HOW TO RUN (tell Claude Code to do this):
//   1. Make sure your CSV files are in the same folder as this script
//   2. Run: npm install @neondatabase/serverless csv-parse
//   3. Run: node seed.js
//
// IMPORTANT: Set your DATABASE_URL environment variable first:
//   On Mac/Linux: export DATABASE_URL="your-neon-connection-string"
//   On Windows:   set DATABASE_URL="your-neon-connection-string"
//   (Or Claude Code can read it from your .env file)
//
// UPDATED April 16, 2026:
//   - Added manufacturer_rebrand column to savings_programs
//     (run ALTER TABLE savings_programs ADD COLUMN manufacturer_rebrand TEXT;
//     in Neon first if it's not already there)
//   - Filename corrected: medications.csv (was medications (1).csv)

import { neon } from '@neondatabase/serverless';
import { parse } from 'csv-parse/sync';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const sql = neon(process.env.DATABASE_URL);

function readCSV(filename) {
  const filePath = join(__dirname, filename);
  const content = readFileSync(filePath, 'utf-8');
  return parse(content, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
  });
}

function toBool(val) {
  if (val === 'true' || val === '1' || val === 'yes') return true;
  return false;
}

async function seedConditions() {
  console.log('Importing conditions...');
  const rows = readCSV('conditions.csv');
  for (const row of rows) {
    await sql`
      INSERT INTO conditions (id, name, category, description, created_at)
      VALUES (
        ${parseInt(row.id)},
        ${row.name},
        ${row.category || null},
        ${row.description || null},
        ${row.created_at || new Date().toISOString()}
      )
      ON CONFLICT (id) DO UPDATE SET
        name = EXCLUDED.name,
        category = EXCLUDED.category,
        description = EXCLUDED.description
    `;
  }
  console.log(`  ✓ Imported ${rows.length} conditions`);
}

async function seedMedications() {
  console.log('Importing medications...');
  const rows = readCSV('medications.csv');
  for (const row of rows) {
    await sql`
      INSERT INTO medications (id, generic_name, brand_name, manufacturer, drug_class, has_generic, typical_cost_range, notes, last_verified, created_at)
      VALUES (
        ${parseInt(row.id)},
        ${row.generic_name},
        ${row.brand_name || null},
        ${row.manufacturer || null},
        ${row.drug_class || null},
        ${toBool(row.has_generic)},
        ${row.typical_cost_range || null},
        ${row.notes || null},
        ${row.last_verified || null},
        ${row.created_at || new Date().toISOString()}
      )
      ON CONFLICT (id) DO UPDATE SET
        generic_name = EXCLUDED.generic_name,
        brand_name = EXCLUDED.brand_name,
        manufacturer = EXCLUDED.manufacturer,
        drug_class = EXCLUDED.drug_class,
        has_generic = EXCLUDED.has_generic,
        typical_cost_range = EXCLUDED.typical_cost_range,
        notes = EXCLUDED.notes,
        last_verified = EXCLUDED.last_verified
    `;
  }
  console.log(`  ✓ Imported ${rows.length} medications`);
}

async function seedSavingsPrograms() {
  console.log('Importing savings programs...');
  const rows = readCSV('savings_programs.csv');
  for (const row of rows) {
    await sql`
      INSERT INTO savings_programs (id, medication_id, program_name, program_type, eligibility, max_savings, application_url, phone_number, notes, last_verified, created_at, manufacturer_rebrand)
      VALUES (
        ${parseInt(row.id)},
        ${row.medication_id ? parseInt(row.medication_id) : null},
        ${row.program_name},
        ${row.program_type || null},
        ${row.eligibility || null},
        ${row.max_savings || null},
        ${row.application_url || null},
        ${row.phone_number || null},
        ${row.notes || null},
        ${row.last_verified || null},
        ${row.created_at || new Date().toISOString()},
        ${row.manufacturer_rebrand || null}
      )
      ON CONFLICT (id) DO UPDATE SET
        program_name = EXCLUDED.program_name,
        program_type = EXCLUDED.program_type,
        eligibility = EXCLUDED.eligibility,
        max_savings = EXCLUDED.max_savings,
        application_url = EXCLUDED.application_url,
        phone_number = EXCLUDED.phone_number,
        notes = EXCLUDED.notes,
        last_verified = EXCLUDED.last_verified,
        manufacturer_rebrand = EXCLUDED.manufacturer_rebrand
    `;
  }
  console.log(`  ✓ Imported ${rows.length} savings programs`);
}

async function seedDiscountPrograms() {
  console.log('Importing discount programs...');
  const rows = readCSV('discount_programs.csv');
  for (const row of rows) {
    await sql`
      INSERT INTO discount_programs (id, program_name, pharmacy_name, price_point, url, description, created_at)
      VALUES (
        ${parseInt(row.id)},
        ${row.program_name},
        ${row.pharmacy_name || null},
        ${row.price_point || null},
        ${row.url || null},
        ${row.description || null},
        ${row.created_at || new Date().toISOString()}
      )
      ON CONFLICT (id) DO UPDATE SET
        program_name = EXCLUDED.program_name,
        pharmacy_name = EXCLUDED.pharmacy_name,
        price_point = EXCLUDED.price_point,
        url = EXCLUDED.url
    `;
  }
  console.log(`  ✓ Imported ${rows.length} discount programs`);
}

async function seedConditionMedications() {
  console.log('Importing condition-medication links...');
  const rows = readCSV('condition_medications.csv');
  for (const row of rows) {
    await sql`
      INSERT INTO condition_medications (id, condition_id, medication_id)
      VALUES (
        ${parseInt(row.id)},
        ${parseInt(row.condition_id)},
        ${parseInt(row.medication_id)}
      )
      ON CONFLICT (id) DO NOTHING
    `;
  }
  console.log(`  ✓ Imported ${rows.length} condition-medication links`);
}

async function main() {
  console.log('\n🌱 AMedNav Database Seed Starting...\n');
  try {
    await seedConditions();
    await seedMedications();
    await seedSavingsPrograms();
    await seedDiscountPrograms();
    await seedConditionMedications();
    console.log('\n✅ All data imported successfully!\n');
  } catch (err) {
    console.error('\n❌ Error during import:', err.message);
    console.error(err);
    process.exit(1);
  }
}

main();
