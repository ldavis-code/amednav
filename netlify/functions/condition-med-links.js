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
  const table = process.env.CONDITION_MED_LINKS || 'condition_med_links';
  const params = event.queryStringParameters || {};

  try {
    // Medications for a specific condition
    if (params.conditionId) {
      const rows = await sql`
        SELECT cml.*, m.brand_name, m.generic_name, m.category
        FROM condition_med_links cml
        JOIN medications m ON m.id = cml.medication_id
        WHERE cml.condition_id = ${params.conditionId}
        ORDER BY m.brand_name
      `;
      return { statusCode: 200, headers, body: JSON.stringify({ links: rows }) };
    }

    // Conditions for a specific medication
    if (params.medicationId) {
      const rows = await sql`
        SELECT cml.*, c.name as condition_name
        FROM condition_med_links cml
        JOIN conditions c ON c.id = cml.condition_id
        WHERE cml.medication_id = ${params.medicationId}
        ORDER BY c.name
      `;
      return { statusCode: 200, headers, body: JSON.stringify({ links: rows }) };
    }

    // All links
    const rows = await sql`
      SELECT cml.*, m.brand_name, m.generic_name, c.name as condition_name
      FROM condition_med_links cml
      LEFT JOIN medications m ON m.id = cml.medication_id
      LEFT JOIN conditions c ON c.id = cml.condition_id
      ORDER BY c.name, m.brand_name
    `;
    return { statusCode: 200, headers, body: JSON.stringify({ links: rows }) };

  } catch (error) {
    console.error('Condition-med links query error:', error);
    return { statusCode: 500, headers, body: JSON.stringify({ error: 'Database query failed' }) };
  }
}
