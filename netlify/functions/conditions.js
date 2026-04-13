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
  const table = process.env.CONDITIONS || 'conditions';
  const params = event.queryStringParameters || {};

  try {
    // Single condition by ID
    if (params.id) {
      const rows = await sql`SELECT * FROM conditions WHERE id = ${params.id} LIMIT 1`;
      if (rows.length === 0) {
        return { statusCode: 404, headers, body: JSON.stringify({ error: 'Condition not found' }) };
      }
      return { statusCode: 200, headers, body: JSON.stringify({ condition: rows[0] }) };
    }

    // Search by name
    if (params.search) {
      const term = `%${params.search}%`;
      const rows = await sql`
        SELECT * FROM conditions
        WHERE name ILIKE ${term} OR description ILIKE ${term}
        ORDER BY name
      `;
      return { statusCode: 200, headers, body: JSON.stringify({ conditions: rows }) };
    }

    // All conditions
    const rows = await sql`SELECT * FROM conditions ORDER BY name`;
    return { statusCode: 200, headers, body: JSON.stringify({ conditions: rows }) };

  } catch (error) {
    console.error('Conditions query error:', error);
    return { statusCode: 500, headers, body: JSON.stringify({ error: 'Database query failed' }) };
  }
}
