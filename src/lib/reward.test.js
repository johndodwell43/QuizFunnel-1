import assert from 'node:assert/strict';
import test from 'node:test';
import { emailCode, emailCodeFrom, isTaggedLink, rewardEarned, rewardParams, textRewardOffered } from './reward.js';

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

test('an email credit code is read from the link, and only our HELD- codes count', () => {
  assert.equal(emailCodeFrom('?discount=HELD-AB12CD34&utm_source=klaviyo'), 'HELD-AB12CD34');
  assert.equal(emailCodeFrom('?utm_source=klaviyo'), '');
  assert.equal(emailCodeFrom('?discount=KLYROS50'), '');                         // the text reward can't be typed in
  assert.equal(emailCodeFrom('?discount=HELD-%3Cscript%3E'), '');
  assert.equal(emailCodeFrom('?discount=HELD-'), '');
});

test('an email credit is kept for the visit and wins over the text reward', () => {
  const data = new Map();
  const sessionStorage = {
    getItem: (k) => (data.has(k) ? data.get(k) : null),
    setItem: (k, v) => data.set(k, String(v))
  };
  globalThis.window = { sessionStorage, location: { search: '?utm_source=klaviyo&utm_medium=email' } };
  try {
    // No email credit: our tagged link is offered the text reward, and earning it adds KLYROS50.
    assert.equal(textRewardOffered(), true);
    data.set('klyros_sms_reward', '1');
    assert.deepEqual(rewardParams(), { discount: 'KLYROS50' });

    // Arrives from a credit email: that code goes to the cart, and the text reward steps aside.
    window.location.search = '?discount=HELD-AB12CD34&utm_source=klaviyo&utm_medium=email';
    assert.equal(emailCode(), 'HELD-AB12CD34');
    window.location.search = '';                                                 // later page in the same visit
    assert.equal(emailCode(), 'HELD-AB12CD34');
    assert.equal(textRewardOffered(), false);
    assert.equal(rewardEarned(), false);
    assert.deepEqual(rewardParams(), { discount: 'HELD-AB12CD34' });
  } finally {
    delete globalThis.window;
  }
});
