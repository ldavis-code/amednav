#!/usr/bin/env node
/**
 * sync_programs_to_neon.js
 *
 * Syncs src/data/programs.json (editorial source of truth) into the Neon
 * `savings_programs` table. JSON groups programs as copayPrograms / papPrograms
 * / foundationPrograms; the table is flat with one row per (program, medication)
 * for copay/PAP entries and one row per foundation.
 *
 * Usage:
 *   node scripts/sync_programs_to_neon.js              # dry run (default)
 *   node scripts/sync_programs_to_neon.js --apply      # write to DB
 *   node scripts/sync_programs_to_neon.js --verbose    # log every row
 *
 * Reads DATABASE_URL (and optional SAVINGS_PROGRAMS table override) from the
 * environment; honors a local .env via dotenv.
 */

import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { neon } from '@neondatabase/serverless';
import 'dotenv/config';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PROGRAMS_JSON = resolve(__dirname, '../src/data/programs.json');

const args = new Set(process.argv.slice(2));
const APPLY = args.has('--apply');
const VERBOSE = args.has('--verbose');

const TYPE_MAP = {
    copayPrograms: 'copay_card',
    papPrograms: 'pap',
    foundationPrograms: 'foundation',
};

function buildRows(json) {
    const rows = [];
    for (const [group, programType] of Object.entries(TYPE_MAP)) {
        const programs = json[group] || {};
        for (const program of Object.values(programs)) {
            const base = {
                program_id: program.programId,
                program_name: program.name,
                program_type: programType,
                manufacturer: program.manufacturer ?? null,
                url: program.url ?? null,
                phone: program.phone ?? null,
                eligibility: program.eligibility ?? null,
                max_benefit: program.maxBenefit ?? null,
                income_limit: program.incomeLimit ?? null,
                notes: program.notes ?? null,
            };
            const meds = Array.isArray(program.medications) ? program.medications : [];
            if (meds.length === 0) {
                rows.push({ ...base, medication_id: null });
            } else {
                for (const medId of meds) {
                    rows.push({ ...base, medication_id: medId });
                }
            }
        }
    }
    return rows;
}

async function discoverColumns(sql, table) {
    const cols = await sql(
        `SELECT column_name, data_type
         FROM information_schema.columns
         WHERE table_name = $1`,
        [table]
    );
    return new Map(cols.map((c) => [c.column_name, c.data_type]));
}

function coerce(value, dataType) {
    if (value === null || value === undefined) return null;
    if (dataType === 'jsonb' || dataType === 'json') {
        return typeof value === 'string' ? value : JSON.stringify(value);
    }
    return value;
}

async function main() {
    if (!process.env.DATABASE_URL) {
        console.error('ERROR: DATABASE_URL is not set.');
        process.exit(1);
    }

    const table = process.env.SAVINGS_PROGRAMS || 'savings_programs';
    const json = JSON.parse(readFileSync(PROGRAMS_JSON, 'utf8'));
    const rows = buildRows(json);

    const byType = rows.reduce((acc, r) => {
        acc[r.program_type] = (acc[r.program_type] || 0) + 1;
        return acc;
    }, {});
    console.log(`Loaded ${rows.length} rows from programs.json`);
    console.log(`  by type: ${JSON.stringify(byType)}`);

    const sql = neon(process.env.DATABASE_URL);

    const schema = await discoverColumns(sql, table);
    if (schema.size === 0) {
        console.error(`ERROR: table "${table}" not found or has no columns.`);
        process.exit(1);
    }
    console.log(`Target table "${table}" has columns: ${[...schema.keys()].join(', ')}`);

    const wantCols = [
        'program_id', 'program_name', 'program_type', 'manufacturer',
        'medication_id', 'url', 'phone', 'eligibility',
        'max_benefit', 'income_limit', 'notes',
    ];
    const cols = wantCols.filter((c) => schema.has(c));
    const skipped = wantCols.filter((c) => !schema.has(c));
    if (skipped.length) {
        console.warn(`  (skipping fields not in table: ${skipped.join(', ')})`);
    }

    const existing = await sql(`SELECT COUNT(*)::int AS n FROM ${table}`);
    console.log(`Current row count in ${table}: ${existing[0].n}`);

    if (!APPLY) {
        console.log('\nDry run — no changes written. Re-run with --apply to sync.');
        if (VERBOSE) {
            for (const r of rows.slice(0, 5)) console.log('  sample:', r);
            if (rows.length > 5) console.log(`  ... and ${rows.length - 5} more`);
        }
        return;
    }

    console.log('\nApplying sync (DELETE + INSERT in a transaction)...');
    await sql('BEGIN');
    try {
        await sql(`DELETE FROM ${table}`);

        const placeholders = cols.map((_, i) => `$${i + 1}`).join(', ');
        const insertSql = `INSERT INTO ${table} (${cols.join(', ')}) VALUES (${placeholders})`;

        let inserted = 0;
        for (const row of rows) {
            const values = cols.map((c) => coerce(row[c], schema.get(c)));
            await sql(insertSql, values);
            inserted++;
            if (VERBOSE && inserted % 25 === 0) {
                console.log(`  inserted ${inserted}/${rows.length}`);
            }
        }
        await sql('COMMIT');
        console.log(`Done. Inserted ${inserted} rows into ${table}.`);
    } catch (err) {
        await sql('ROLLBACK');
        console.error('Sync failed — transaction rolled back.');
        throw err;
    }
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});
