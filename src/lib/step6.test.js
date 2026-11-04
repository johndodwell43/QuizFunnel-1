import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { QUIZ_CREDIT_ENABLED } from '../config.js';
import { STEP6_EN, STEP6_ES, STEP6_ES_STATUS, step6Headline, step6Subhead } from '../i18n/step6.js';
import { isValidEmail, normalizeFirstName } from './email.js';
import { saveQuizLead } from '../../api/saveLead.js';
import { buildKlaviyoRequests, buildLeadPayload } from './leadPayload.js';

const BANNED = /credit toward|store credit|KLY-3741|KLY-6741|qualif|approved|\bfree\b|guaranteed|no dentist needed/i;

test('store credit stays off and the subhead is the locked sentence', () => {
  assert.equal(QUIZ_CREDIT_ENABLED, false);
  assert.equal(step6Subhead(), "We'll email your partial options and your price.");
  assert.equal(step6Headline('credit-toward-your-order'), STEP6_EN.h1);
  assert.equal(step6Headline(true), 'Where should we send your results?');
  assert.doesNotMatch(step6Subhead(), /credit/i);
});

test('English copy matches the locked step 6 strings', () => {
  assert.equal(STEP6_EN.h1, 'Where should we send your results?');
  assert.equal(STEP6_EN.emailLabel, 'Email');
  assert.equal(STEP6_EN.firstNameLabel, 'First name');
  assert.equal(STEP6_EN.firstNameHelper, '(optional, so we know what to call you)');
  assert.equal(STEP6_EN.button, 'Show my results');
  assert.equal(STEP6_EN.privacy, 'We only save your email and first name. Unsubscribe anytime.');
  assert.equal(STEP6_EN.privacyLink, 'Privacy Policy');
  assert.equal(STEP6_EN.emailError, 'Please enter a valid email so we can send your results.');
  assert.doesNotMatch(JSON.stringify(STEP6_EN), BANNED);
  assert.doesNotMatch(STEP6_EN.emailLabel, /required/i);
});

test('Spanish step 6 copy is waiting on a human review', () => {
  assert.equal(STEP6_ES_STATUS, 'PENDING HUMAN REVIEW');
  for (const value of Object.values(STEP6_ES)) {
    assert.equal(value, 'PENDING HUMAN REVIEW');
  }
});

test('the lead payload is email plus an optional first name', () => {
  assert.deepEqual(buildLeadPayload({ email: ' Ada@Example.com ', firstName: '  Ada  ' }), {
    email: 'Ada@Example.com',
    firstName: 'Ada'
  });
  assert.deepEqual(
    buildLeadPayload({
      email: 'ada@example.com',
      firstName: '',
      answers: { pain: 'yes', arch: 'upper' },
      utm_source: 'facebook',
      note: 'swelling on the left'
    }),
    { email: 'ada@example.com' }
  );

  const bodies = JSON.stringify(buildKlaviyoRequests({ email: 'ada@example.com', firstName: 'Ada' }));
  assert.match(bodies, /Ada/);
  assert.match(bodies, /ada@example.com/);
  assert.doesNotMatch(bodies, /pain|arch|utm_|swelling|answers|credit|KLY-/i);

  assert.equal(isValidEmail('not-an-email'), false);
  assert.equal(isValidEmail('ada@example.com'), true);
  assert.equal(normalizeFirstName(''), '');
  assert.equal(normalizeFirstName('Ada Marie'), 'Ada Marie');
  assert.equal(normalizeFirstName('my tooth hurts badly'), null);
});

test('the Klaviyo request drops quiz answers', async () => {
  const calls = [];
  const original = globalThis.fetch;
  globalThis.fetch = async (url, init) => {
    calls.push({ url: String(url), body: JSON.parse(init.body) });
    return { ok: true };
  };
  try {
    const saved = await saveQuizLead({
      email: 'ada@example.com',
      firstName: 'Ada',
      answers: { pain: 'yes' },
      utm_source: 'facebook'
    });
    assert.deepEqual(saved, { email: 'ada@example.com', firstName: 'Ada' });
  } finally {
    globalThis.fetch = original;
  }
  assert.ok(calls.length >= 2);
  const encoded = JSON.stringify(calls);
  assert.match(encoded, /a\.klaviyo\.com\/client\/profiles/);
  assert.match(encoded, /a\.klaviyo\.com\/client\/events/);
  assert.match(encoded, /Quiz Results Requested/);
  assert.match(encoded, /quiz_utm_source/);
  assert.doesNotMatch(encoded, /pain|answers|swelling|quiz_arch|credit toward|KLY-/i);
});

test('the email screen source does not ship credit or unreviewed Spanish', () => {
  const source = readFileSync(new URL('../components/EmailGate.jsx', import.meta.url), 'utf8');
  assert.match(source, /#2563eb/);
  assert.doesNotMatch(source, /#377CCF|Find Your Fit|PENDING HUMAN REVIEW|STEP6_ES/);
  assert.doesNotMatch(source, BANNED);
});
