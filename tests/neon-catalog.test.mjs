import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

// Run the real handlers with a database double: no credentials or writes.
async function runHandler(file, params, rows) {
  const source = await readFile(new URL(`../netlify/functions/${file}.js`, import.meta.url), 'utf8');
  const calls = [];
  const replacement = `const neon = () => async (query, values) => {
    globalThis.__catalogCalls.push({query, values});
    return ${JSON.stringify(rows)};
  };`;
  globalThis.__catalogCalls = calls;
  const oldUrl = process.env.DATABASE_URL;
  process.env.DATABASE_URL = 'mock-only';
  try {
    const module = await import(`data:text/javascript;base64,${Buffer.from(source.replace("import { neon } from '@neondatabase/serverless';", replacement)).toString('base64')}#${Math.random()}`);
    const result = await module.handler({ queryStringParameters: params });
    assert.equal(result.statusCode, 200);
    return { data: JSON.parse(result.body), calls };
  } finally {
    if (oldUrl === undefined) delete process.env.DATABASE_URL;
    else process.env.DATABASE_URL = oldUrl;
    delete globalThis.__catalogCalls;
  }
}

test('medication category search uses the observed Neon column and preserves false generic flags', async () => {
  const {data, calls} = await runHandler('medications', {category:'HBV Antiviral'}, [{id:1, drug_class:'HBV Antiviral', has_generic:false, notes:'Review note', last_verified:'2026-05-20'}]);
  assert.match(calls[0].query, /WHERE drug_class = \$1/);
  assert.deepEqual(calls[0].values, ['HBV Antiviral']);
  assert.equal(data.medications[0].category, 'HBV Antiviral');
  assert.equal(data.medications[0].generic_available, false);
  assert.equal(data.medications[0].notes, 'Review note');
});

test('programs retain application details and normalize the labels used by patient grouping', async () => {
  const rows = ['Copay Card','Patient Assistance','Discount Program','Free Trial'].map((program_type,id) => ({id, program_type, application_url:'https://example.org/apply', phone_number:'800-555-0100', max_savings:'See eligibility', manufacturer_rebrand:'Example'}));
  const {data} = await runHandler('savings-programs', {}, rows);
  assert.deepEqual(data.programs.map(p=>p.programType), ['copay_card','pap','discount_program','free_trial']);
  for(const p of data.programs) {
    assert.equal(p.url, 'https://example.org/apply');
    assert.equal(p.phone, '800-555-0100');
    assert.equal(p.maxBenefit, 'See eligibility');
  }
});

test('PAP filtering accepts Neon display labels and existing API labels', async () => {
  const {calls} = await runHandler('savings-programs', {type:'pap'}, []);
  assert.deepEqual(calls[0].values, ['Patient Assistance','pap']);
});

test('manufacturer search references an existing Neon column', async () => {
  const {calls} = await runHandler('savings-programs', {search:'Example'}, []);
  assert.match(calls[0].query, /manufacturer_rebrand ILIKE \$1/);
  assert.deepEqual(calls[0].values, ['%Example%']);
});

test('condition medication lookup returns the category alias from drug_class', async () => {
  const {calls} = await runHandler('condition-med-links', {conditionId:'111'}, []);
  assert.match(calls[0].query, /m.drug_class AS category/);
  assert.deepEqual(calls[0].values, ['111']);
});
