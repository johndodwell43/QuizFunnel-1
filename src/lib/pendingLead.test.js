import test from 'node:test';
import assert from 'node:assert/strict';
import {
  PENDING_LEAD_KEY,
  resendPendingLead,
  retryPendingLead,
  toPendingLead
} from './pendingLead.js';

function memoryStorage(initial) {
  const data = new Map(initial || []);
  return {
    getItem(key) {
      return data.has(key) ? data.get(key) : null;
    },
    setItem(key, value) {
      data.set(key, String(value));
    },
    removeItem(key) {
      data.delete(key);
    }
  };
}

test('a pending lead stores contact fields and consent only', () => {
  const record = toPendingLead({
    email: 'results@example.com',
    firstName: "  O'Brien-José 123!! ",
    phone: '12345',
    emailMarketingConsent: true,
    smsConsent: true,
    arch: 'upper',
    teeth: '1',
    extraction: 'yes',
    pain: 'yes',
    loose: 'yes'
  });
  assert.deepEqual(record, {
    email: 'results@example.com',
    firstName: "O'Brien-José",
    emailMarketingConsent: true,
    smsConsent: false
  });
  assert.equal(JSON.stringify(record).includes('upper'), false);
  assert.equal(JSON.stringify(record).includes('yes'), false);
});

test('a failed lead is retried twice and then stored', async () => {
  const storage = memoryStorage();
  let calls = 0;
  const result = await retryPendingLead(
    {
      email: 'results@example.com',
      firstName: 'Ada',
      phone: '(415) 555-0100',
      emailMarketingConsent: false,
      smsConsent: true
    },
    {
      send: async () => {
        calls += 1;
        throw new Error('lead-save-failed');
      },
      storage,
      sleep: async () => {},
      delays: [1, 1]
    }
  );
  assert.equal(calls, 2);
  assert.equal(result, 'stored');
  const stored = JSON.parse(storage.getItem(PENDING_LEAD_KEY));
  assert.deepEqual(Object.keys(stored).sort(), [
    'email',
    'emailMarketingConsent',
    'firstName',
    'phone',
    'smsConsent'
  ]);
  assert.equal(stored.phone, '+14155550100');
  assert.equal(stored.smsConsent, true);
  assert.equal(stored.emailMarketingConsent, false);
});

test('the second retry clears the pending lead', async () => {
  const storage = memoryStorage();
  let calls = 0;
  const result = await retryPendingLead(
    { email: 'results@example.com', firstName: 'Ada', emailMarketingConsent: true, smsConsent: false },
    {
      send: async () => {
        calls += 1;
        if (calls === 1) throw new Error('lead-save-failed');
      },
      storage,
      sleep: async () => {},
      delays: [1, 1]
    }
  );
  assert.equal(result, 'sent');
  assert.equal(calls, 2);
  assert.equal(storage.getItem(PENDING_LEAD_KEY), null);
});

test('a stored lead is resent on the next opportunity and cleared on success', async () => {
  const storage = memoryStorage([
    [PENDING_LEAD_KEY, JSON.stringify({
      email: 'results@example.com',
      firstName: 'Ada9',
      phone: '+14155550100',
      emailMarketingConsent: true,
      smsConsent: true,
      arch: 'upper'
    })]
  ]);
  let sent = null;
  const ok = await resendPendingLead({
    send: async (record) => {
      sent = record;
    },
    storage
  });
  assert.equal(ok, 'sent');
  assert.equal(sent.firstName, 'Ada');
  assert.equal(sent.arch, undefined);
  assert.equal(storage.getItem(PENDING_LEAD_KEY), null);

  storage.setItem(PENDING_LEAD_KEY, JSON.stringify({ email: 'results@example.com', firstName: 'Ada' }));
  const kept = await resendPendingLead({
    send: async () => {
      throw new Error('lead-save-failed');
    },
    storage
  });
  assert.equal(kept, 'kept');
  assert.ok(storage.getItem(PENDING_LEAD_KEY));
});
