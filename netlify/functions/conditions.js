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
      const rows = await sql(
        `SELECT id, name, category, description FROM ${table} WHERE id = $1 LIMIT 1`,
        [params.id]
      );
      if (rows.length === 0) {
        return { statusCode: 404, headers, body: JSON.stringify({ error: 'Condition not found' }) };
      }
      return { statusCode: 200, headers, body: JSON.stringify({ condition: formatCondition(rows[0]) }) };
    }

    // Search by name or description
    if (params.search) {
      const term = `%${params.search}%`;
      const rows = await sql(
        `SELECT id, name, category, description FROM ${table} WHERE name ILIKE $1 OR description ILIKE $1 ORDER BY name`,
        [term]
      );
      return { statusCode: 200, headers, body: JSON.stringify({ conditions: rows.map(formatCondition) }) };
    }

    // Filter by category (exact match)
    if (params.category) {
      const rows = await sql(
        `SELECT id, name, category, description FROM ${table} WHERE category = $1 ORDER BY name`,
        [params.category]
      );
      return { statusCode: 200, headers, body: JSON.stringify({ conditions: rows.map(formatCondition) }) };
    }

    // All conditions
    const rows = await sql(`SELECT id, name, category, description FROM ${table} ORDER BY name`);
    return { statusCode: 200, headers, body: JSON.stringify({ conditions: rows.map(formatCondition) }) };

  } catch (error) {
    console.error('Conditions query error:', error);
    return { statusCode: 500, headers, body: JSON.stringify({ error: 'Database query failed' }) };
  }
}

function formatCondition(row) {
  return {
    id: row.id,
    name: row.name,
    category: row.category,
    description: row.description,
  };
}
