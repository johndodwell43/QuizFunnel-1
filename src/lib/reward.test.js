import assert from 'node:assert/strict';
import test from 'node:test';
import { isTaggedLink } from './reward.js';

const attr = (q) => {
  const p = new URLSearchParams(q);
  return {
    source: (p.get('utm_source') || '').toLowerCase(),
    medium: (p.get('utm_medium') || '').toLowerCase(),
    clicked: Boolean(p.get('fbclid') || p.get('gclid') || p.get('ttclid'))
  };
};

test('only our own tagged links earn the text reward', () => {
  assert.equal(isTaggedLink(attr('?utm_source=ig_bio')), true);
  assert.equal(isTaggedLink(attr('?utm_source=klaviyo&utm_medium=email')), true);
  assert.equal(isTaggedLink(attr('')), false);                                   // direct / Google
  assert.equal(isTaggedLink(attr('?utm_source=facebook&utm_medium=paid')), false);
  assert.equal(isTaggedLink(attr('?utm_source=ig_bio&fbclid=abc')), false);     // ad click wins
  assert.equal(isTaggedLink(attr('?utm_source=ig_bio&utm_medium=cpc')), false);
});
