import test from 'node:test';
import assert from 'node:assert/strict';
import { isValidEmail, normalizePhone, resolveEmailMarketingConsent, resolveSmsConsent } from '../src/lib/email.js';
import { EMAIL_CONSENT_DEFAULT, EMAIL_CONSENT_TEXT, SMS_CONSENT_DEFAULT, SMS_CONSENT_TEXT } from '../src/lib/consent.js';
import { normalizeQuizLead } from './saveLead.js';

test('email is required before a lead can be saved', () => {
  assert.equal(isValidEmail(''), false);
  assert.equal(isValidEmail('not-an-email'), false);
  assert.throws(
    () => normalizeQuizLead({ email: '', phone: '' }),
    (error) => error.statusCode === 400
  );
  assert.throws(
    () => normalizeQuizLead({ email: 'not-an-email', phone: '' }),
    (error) => error.statusCode === 400
  );
});

test('phone is optional and a blank number is saved as empty', () => {
  const lead = normalizeQuizLead({
    email: 'results@example.com',
    firstName: '',
    phone: '   '
  });
  assert.equal(lead.email, 'results@example.com');
  assert.equal(lead.phone, '');
  assert.equal(normalizePhone(''), '');
  assert.equal(normalizePhone('(415) 555-0100'), '+14155550100');
  assert.throws(
    () => normalizeQuizLead({ email: 'results@example.com', phone: '123' }),
    (error) => error.statusCode === 400
  );
});

test('split consent defaults and locked copy', () => {
  assert.equal(EMAIL_CONSENT_DEFAULT, true);
  assert.equal(SMS_CONSENT_DEFAULT, false);
  assert.equal(
    EMAIL_CONSENT_TEXT,
    'Email me my results and updates from Klyros Dental. Unsubscribe anytime.'
  );
  assert.equal(
    SMS_CONSENT_TEXT,
    'Text me updates from Klyros Dental. Msg & data rates may apply. Msg frequency varies. Reply STOP to opt out.'
  );
});

test('email marketing consent follows the email box and does not require it to save', () => {
  assert.equal(resolveEmailMarketingConsent(true), true);
  assert.equal(resolveEmailMarketingConsent(false), false);
  assert.equal(resolveEmailMarketingConsent(undefined), false);

  const unchecked = normalizeQuizLead({
    email: 'results@example.com',
    phone: '',
    emailMarketingConsent: false,
    smsConsent: false
  });
  assert.equal(unchecked.emailMarketingConsent, false);
  assert.equal(unchecked.smsConsent, false);
});

test('SMS consent is true only when the SMS box is checked and a phone is entered', () => {
  assert.equal(resolveSmsConsent(false, ''), false);
  assert.equal(resolveSmsConsent(false, '+14155550100'), false);
  assert.equal(resolveSmsConsent(true, ''), false);
  assert.equal(resolveSmsConsent(true, '+14155550100'), true);

  const checkedWithoutPhone = normalizeQuizLead({
    email: 'results@example.com',
    phone: '',
    emailMarketingConsent: true,
    smsConsent: true
  });
  assert.equal(checkedWithoutPhone.phone, '');
  assert.equal(checkedWithoutPhone.smsConsent, false);
  assert.equal(checkedWithoutPhone.emailMarketingConsent, true);

  const optedIn = normalizeQuizLead({
    email: 'results@example.com',
    phone: '4155550100',
    emailMarketingConsent: false,
    smsConsent: true
  });
  assert.equal(optedIn.phone, '+14155550100');
  assert.equal(optedIn.smsConsent, true);
  assert.equal(optedIn.emailMarketingConsent, false);
});
