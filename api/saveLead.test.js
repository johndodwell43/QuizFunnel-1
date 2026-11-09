import test from 'node:test';
import assert from 'node:assert/strict';
import { isValidEmail, normalizePhone } from '../src/lib/email.js';
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
