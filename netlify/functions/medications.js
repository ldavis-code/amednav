import { neon } from '@neondatabase/serverless';

const headers = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Cache-Control': 'public, max-age=300',
};

export async function handler(event) {
  if (!process.env.DATABASE_URL) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: 'DATABASE_URL not configured' }) };
  }

  const sql = neon(process.env.DATABASE_URL);
  const table = process.env.MEDICATIONS || 'medications';
  const params = event.queryStringParameters || {};

  try {
    // Single medication by ID
    if (params.id) {
      const rows = await sql(`SELECT * FROM ${table} WHERE id = $1 LIMIT 1`, [params.id]);
      if (rows.length === 0) {
        return { statusCode: 404, headers, body: JSON.stringify({ error: 'Medication not found' }) };
      }
      return { statusCode: 200, headers, body: JSON.stringify({ medication: formatMedication(rows[0]) }) };
    }

    // Search by name
    if (params.search) {
      const term = `%${params.search}%`;
      const rows = await sql(
        `SELECT * FROM ${table} WHERE brand_name ILIKE $1 OR generic_name ILIKE $1 ORDER BY brand_name`,
        [term]
      );
      return { statusCode: 200, headers, body: JSON.stringify({ medications: rows.map(formatMedication) }) };
    }

    // Filter by category
    if (params.category) {
      const rows = await sql(
        `SELECT * FROM ${table} WHERE category = $1 ORDER BY brand_name`,
        [params.category]
      );
      return { statusCode: 200, headers, body: JSON.stringify({ medications: rows.map(formatMedication) }) };
    }

    // All medications
    const rows = await sql(`SELECT * FROM ${table} ORDER BY brand_name`);
    return { statusCode: 200, headers, body: JSON.stringify({ medications: rows.map(formatMedication) }) };

  } catch (error) {
    console.error('Medications query error:', error);
    return { statusCode: 500, headers, body: JSON.stringify({ error: 'Database query failed' }) };
  }
}

function formatMedication(row) {
  return {
    id: row.id,
    brandName: row.brand_name,
    genericName: row.generic_name,
    rxcui: row.rxcui,
    category: row.category,
    manufacturer: row.manufacturer,
    stage: row.stage,
    commonOrgans: row.common_organs,
    papUrl: row.pap_url,
    cost_tier: row.cost_tier,
    generic_available: row.generic_available,
    typical_copay_tier: row.typical_copay_tier,
    papProgramId: row.pap_program_id,
    copayUrl: row.copay_url,
    copayProgramId: row.copay_program_id,
    supportUrl: row.support_url,
    medicarePartDUrl: row.medicare_part_d_url,
    medicare2026Note: row.medicare_2026_note,
  };
}
