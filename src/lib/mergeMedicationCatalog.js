// Database IDs identify products; generic names alone can match several brands.
// Keep bundled-only fields for compatibility, but refresh fields supplied by Neon.
export function mergeMedicationCatalog(fallback, database) {
  const normalize = value => String(value || '').trim().toLowerCase();
  const used = new Set();
  const merged = fallback.flatMap(local => {
    let match = database.find(row => String(row.id) === String(local.dbId ?? local.id));
    if (!match && typeof local.id === 'string' && !/^\d+$/.test(local.id)) {
      const candidates = database.filter(row => normalize(row.genericName) === normalize(local.genericName));
      match = candidates.find(row => normalize(row.brandName) === normalize(local.brandName));
      if (!match && candidates.length === 1) match = candidates[0];
    }
    // A successful database response is authoritative, including removed records.
    if (!match || used.has(match.id)) return [];
    used.add(match.id);
    const definedFields = Object.fromEntries(Object.entries(match).filter(([,value]) => value !== undefined));
    return [{...local, ...definedFields, id:local.id, dbId:match.id}];
  });
  return [...merged, ...database.filter(row => !used.has(row.id)).map(row => ({...row, dbId:row.id}))];
}
