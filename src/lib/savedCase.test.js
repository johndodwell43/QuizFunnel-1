import test from 'node:test';
import assert from 'node:assert/strict';
import { SAVED_CASE_KEY, isCompleteCase, loadSavedCase, parseSavedCase, saveCase } from './savedCase.js';

function memory() {
  const m = new Map();
  return { getItem: (k) => (m.has(k) ? m.get(k) : null), setItem: (k, v) => m.set(k, String(v)), raw: m };
}

test('saves and loads a one-arch case', () => {
  const s = memory();
  assert.equal(saveCase('upper', { upper: '2', lower: '4' }, s, 1000), true);
  assert.deepEqual(loadSavedCase(s, 2000), { arch: 'upper', teeth: { upper: '2', lower: null } });
});

test('saves and loads a both-arch case', () => {
  const s = memory();
  saveCase('both', { upper: '3', lower: '6+' }, s, 1000);
  assert.deepEqual(loadSavedCase(s, 2000), { arch: 'both', teeth: { upper: '3', lower: '6+' } });
});

test('does not save an incomplete case', () => {
  const s = memory();
  assert.equal(saveCase('both', { upper: '3', lower: null }, s), false);
  assert.equal(saveCase(null, { upper: '3' }, s), false);
  assert.equal(s.raw.size, 0);
});

test('expires after 30 days', () => {
  const s = memory();
  saveCase('lower', { lower: '1' }, s, 0);
  assert.ok(loadSavedCase(s, 29 * 864e5));
  assert.equal(loadSavedCase(s, 31 * 864e5), null);
});

test('ignores junk and bad values', () => {
  assert.equal(parseSavedCase('not json'), null);
  assert.equal(parseSavedCase(JSON.stringify({ arch: 'upper', teeth: { upper: '99' }, t: Date.now() })), null);
  assert.equal(parseSavedCase(JSON.stringify({ arch: 'sideways', teeth: { upper: '1' }, t: Date.now() })), null);
  assert.equal(isCompleteCase({ arch: 'lower', teeth: { lower: 'most' } }), true);
});

test('only arch and tooth counts are stored', () => {
  const s = memory();
  saveCase('upper', { upper: '2' }, s, 5);
  assert.deepEqual(Object.keys(JSON.parse(s.raw.get(SAVED_CASE_KEY))).sort(), ['arch', 't', 'teeth']);
});

test('storage errors never throw', () => {
  const broken = { getItem() { throw new Error('blocked'); }, setItem() { throw new Error('blocked'); } };
  assert.equal(loadSavedCase(broken), null);
  assert.equal(saveCase('upper', { upper: '1' }, broken), false);
});
