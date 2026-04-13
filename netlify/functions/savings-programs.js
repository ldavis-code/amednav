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
  const table = process.env.SAVINGS_PROGRAMS || 'savings_programs';
  const params = event.queryStringParameters || {};

  try {
    // Programs for a specific medication
    if (params.medicationId) {
      const rows = await sql`
        SELECT * FROM savings_programs
        WHERE medication_id = ${params.medicationId}
        ORDER BY program_type, program_name
      `;
      return { statusCode: 200, headers, body: JSON.stringify({ programs: rows.map(formatProgram) }) };
    }

    // Filter by program type (copay_card, pap, foundation)
    if (params.type) {
      const rows = await sql`
        SELECT * FROM savings_programs
        WHERE program_type = ${params.type}
        ORDER BY program_name
      `;
      return { statusCode: 200, headers, body: JSON.stringify({ programs: rows.map(formatProgram) }) };
    }

    // Search by name
    if (params.search) {
      const term = `%${params.search}%`;
      const rows = await sql`
        SELECT * FROM savings_programs
        WHERE program_name ILIKE ${term} OR manufacturer ILIKE ${term}
        ORDER BY program_name
      `;
      return { statusCode: 200, headers, body: JSON.stringify({ programs: rows.map(formatProgram) }) };
    }

    // All programs
    const rows = await sql`SELECT * FROM savings_programs ORDER BY program_type, program_name`;
    return { statusCode: 200, headers, body: JSON.stringify({ programs: rows.map(formatProgram) }) };

  } catch (error) {
    console.error('Savings programs query error:', error);
    return { statusCode: 500, headers, body: JSON.stringify({ error: 'Database query failed' }) };
  }
}

function formatProgram(row) {
  return {
    id: row.id,
    programId: row.program_id,
    programName: row.program_name,
    programType: row.program_type,
    manufacturer: row.manufacturer,
    medicationId: row.medication_id,
    url: row.url,
    phone: row.phone,
    eligibility: row.eligibility,
    maxBenefit: row.max_benefit,
    incomeLimit: row.income_limit,
    notes: row.notes,
  };
}
