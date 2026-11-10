import { isValidEmail, normalizeFirstName, phoneForLead, resolveSmsConsent } from './email.js';
import { persistQuizLead } from './lead.js';

export const PENDING_LEAD_KEY = 'klyros_pending_quiz_lead';
export const LEAD_RETRY_DELAYS_MS = [300, 900];

export function toPendingLead(lead) {
  const phone = phoneForLead(lead?.phone);
  const record = {
    email: String(lead?.email || '').trim(),
    firstName: normalizeFirstName(lead?.firstName),
    emailMarketingConsent: lead?.emailMarketingConsent === true,
    smsConsent: resolveSmsConsent(lead?.smsConsent, phone)
  };
  if (phone) record.phone = phone;
  return record;
}

function writePending(storage, record) {
  try {
    storage.setItem(PENDING_LEAD_KEY, JSON.stringify(record));
  } catch {
    // Private browsing can block storage. The quiz still continues.
  }
}

export function storePendingLead(lead, storage) {
  const record = toPendingLead(lead);
  if (!isValidEmail(record.email)) return null;
  writePending(storage, record);
  return record;
}

export async function retryPendingLead(lead, { send, storage, sleep, delays = LEAD_RETRY_DELAYS_MS }) {
  const record = storePendingLead(lead, storage);
  if (!record) return 'cleared';
  for (const delay of delays) {
    await sleep(delay);
    try {
      await send(record);
      try {
        storage.removeItem(PENDING_LEAD_KEY);
      } catch {
        // The send succeeded. A storage failure does not change that.
      }
      return 'sent';
    } catch {
      // One more attempt remains, or the stored entry stays for the next visit.
    }
  }
  return 'stored';
}

export async function resendPendingLead({ send, storage }) {
  let raw = null;
  try {
    raw = storage.getItem(PENDING_LEAD_KEY);
  } catch {
    return 'empty';
  }
  if (!raw) return 'empty';
  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch {
    storage.removeItem(PENDING_LEAD_KEY);
    return 'cleared';
  }
  const record = toPendingLead(parsed);
  if (!isValidEmail(record.email)) {
    storage.removeItem(PENDING_LEAD_KEY);
    return 'cleared';
  }
  try {
    await send(record);
    storage.removeItem(PENDING_LEAD_KEY);
    return 'sent';
  } catch {
    return 'kept';
  }
}

function delayMs(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

let active = null;

function runExclusive(task) {
  if (active) return active;
  active = Promise.resolve()
    .then(task)
    .finally(() => {
      active = null;
    });
  return active;
}

export function rememberPendingQuizLead(lead) {
  try {
    storePendingLead(lead, localStorage);
  } catch {
    // Storage can be blocked. The save attempt still runs.
  }
}

export function scheduleLeadRetry(lead) {
  const record = toPendingLead(lead);
  if (!isValidEmail(record.email)) return;
  rememberPendingQuizLead(record);
  runExclusive(() =>
    retryPendingLead(record, {
      send: persistQuizLead,
      storage: localStorage,
      sleep: delayMs
    })
  );
}

export function clearPendingQuizLead() {
  try {
    localStorage.removeItem(PENDING_LEAD_KEY);
  } catch {
    // Storage can be blocked. The quiz still continues.
  }
}

export function resumePendingQuizLead() {
  runExclusive(() =>
    resendPendingLead({
      send: persistQuizLead,
      storage: localStorage
    })
  );
}
