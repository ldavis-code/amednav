import test from 'node:test';
import assert from 'node:assert/strict';
import {mergeMedicationCatalog} from '../src/lib/mergeMedicationCatalog.js';

test('brands sharing a generic retain their own assistance join IDs', () => {
  const local = [{id:1,genericName:'same',brandName:'A'},{id:2,genericName:'same',brandName:'B'}];
  const result=mergeMedicationCatalog(local,[{id:2,genericName:'same',brandName:'B'},{id:1,genericName:'same',brandName:'A'}]);
  assert.deepEqual(result.map(m=>[m.id,m.dbId]),[[1,1],[2,2]]);
});
test('database corrections replace stale fields, including null and false', () => {
  const result=mergeMedicationCatalog([{id:1,notes:'old',generic_available:true,custom:'keep'}],[{id:1,notes:null,generic_available:false}]);
  assert.equal(result[0].notes,null);
  assert.equal(result[0].generic_available,false);
  assert.equal(result[0].custom,'keep');
});
test('deleted medications stay removed; new database records are included', () => {
  assert.deepEqual(mergeMedicationCatalog([{id:1}],[{id:2}]),[{id:2,dbId:2}]);
  assert.deepEqual(mergeMedicationCatalog([{id:1}],[]),[]);
});
test('legacy slugs match brands without collapsing products with the same generic', () => {
  const result=mergeMedicationCatalog([{id:'brand-a',genericName:'same',brandName:'A'}],[{id:1,genericName:'same',brandName:'A'},{id:2,genericName:'same',brandName:'B'}]);
  assert.deepEqual(result.map(m=>[m.id,m.dbId]),[['brand-a',1],[2,2]]);
});
