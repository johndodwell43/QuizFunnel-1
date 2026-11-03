// Owned-list lead for the quiz email gate.
// Env (never hardcoded):
//   KLAVIYO_API_KEY, or KLAVIYO_API_KEY_A + KLAVIYO_API_KEY_B, or KLAVIYO_API_KEY_B64
//   KLAVIYO_LIST_ID
// Missing key or list id returns 501. No quiz answers are accepted or stored.

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const KLAVIYO = 'https://a.klaviyo.com/api';
const REVISION = '2024-10-15';
const SAVE_ERROR = "We couldn't save your email. Please try again.";

function readJoinedSecret(name) {
  const partA = process.env[`${name}_A`];
  const partB = process.env[`${name}_B`];
  if (partA && partB) return `${partA}${partB}`;
  if (process.env[name]) return process.env[name];
  const encoded = process.env[`${name}_B64`];
  if (!encoded) return '';
  try {
    return Buffer.from(encoded, 'base64').toString('utf8');
  } catch {
    return '';
  }
}

export function leadConfig() {
  return {
    apiKey: readJoinedSecret('KLAVIYO_API_KEY').trim(),
    listId: (process.env.KLAVIYO_LIST_ID || '').trim()
  };
}

function send(res, status, body) {
  if (typeof res.status === 'function') {
    res.status(status).json(body);
    return;
  }
  res.statusCode = status;
  res.setHeader('content-type', 'application/json; charset=utf-8');
  res.end(JSON.stringify(body));
}

async function readJson(req) {
  if (req.body && typeof req.body === 'object' && !Buffer.isBuffer(req.body)) return req.body;
  if (typeof req.body === 'string') {
    try {
      return JSON.parse(req.body);
    } catch {
      return null;
    }
  }
  const chunks = [];
  for await (const chunk of req) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }
  if (!chunks.length) return {};
  try {
    return JSON.parse(Buffer.concat(chunks).toString('utf8'));
  } catch {
    return null;
  }
}

function validEmail(value) {
  if (typeof value !== 'string') return '';
  const email = value.trim();
  if (email.length < 3 || email.length > 254 || !EMAIL_RE.test(email)) return '';
  return email;
}

async function klaviyo(apiKey, path, body) {
  const response = await fetch(`${KLAVIYO}${path}`, {
    method: 'POST',
    headers: {
      Authorization: `Klaviyo-API-Key ${apiKey}`,
      revision: REVISION,
      accept: 'application/json',
      'content-type': 'application/json'
    },
    body: JSON.stringify(body)
  });
  const text = await response.text();
  let payload = {};
  if (text) {
    try {
      payload = JSON.parse(text);
    } catch {
      payload = {};
    }
  }
  return { ok: response.ok, status: response.status, payload };
}

function profileIdFromConflict(payload) {
  const errors = Array.isArray(payload?.errors) ? payload.errors : [];
  for (const error of errors) {
    const id = error?.meta?.duplicate_profile_id;
    if (typeof id === 'string' && id) return id;
  }
  return '';
}

export async function saveQuizLead(email, fetchImpl) {
  const previous = globalThis.fetch;
  if (fetchImpl) globalThis.fetch = fetchImpl;
  try {
    const { apiKey, listId } = leadConfig();
    if (!apiKey || !listId) {
      return {
        status: 501,
        body: {
          ok: false,
          error:
            'TODO: set KLAVIYO_API_KEY and KLAVIYO_LIST_ID before leads can be saved. KLAVIYO_API_KEY_A plus KLAVIYO_API_KEY_B are used when both are set. KLAVIYO_API_KEY_B64 is the base64 fallback.'
        }
      };
    }

    const created = await klaviyo(apiKey, '/profiles/', {
      data: { type: 'profile', attributes: { email } }
    });
    let profileId = created.payload?.data?.id || '';
    if (!created.ok) {
      profileId = profileIdFromConflict(created.payload);
      if (!(created.status === 409 && profileId)) {
        return { status: 502, body: { ok: false, error: SAVE_ERROR } };
      }
    }

    const listed = await klaviyo(apiKey, `/lists/${encodeURIComponent(listId)}/relationships/profiles/`, {
      data: [{ type: 'profile', id: profileId }]
    });
    if (!listed.ok) return { status: 502, body: { ok: false, error: SAVE_ERROR } };

    // Event is the send hook. A Klaviyo flow on this metric delivers the case-check email.
    // No quiz answers are included. Results do not exist at the gate.
    const event = await klaviyo(apiKey, '/events/', {
      data: {
        type: 'event',
        attributes: {
          properties: { source: 'quiz_gate' },
          metric: {
            data: { type: 'metric', attributes: { name: 'Case check captured' } }
          },
          profile: {
            data: { type: 'profile', attributes: { email } }
          }
        }
      }
    });
    if (!event.ok) return { status: 502, body: { ok: false, error: SAVE_ERROR } };

    return { status: 200, body: { ok: true, persisted: true, emailed: false } };
  } finally {
    if (fetchImpl) globalThis.fetch = previous;
  }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    send(res, 405, { ok: false, error: 'Method not allowed.' });
    return;
  }
  const body = await readJson(req);
  const email = validEmail(body?.email);
  if (!email) {
    send(res, 400, { ok: false, error: 'Enter a valid email.' });
    return;
  }
  try {
    const result = await saveQuizLead(email);
    send(res, result.status, result.body);
  } catch {
    send(res, 502, { ok: false, error: SAVE_ERROR });
  }
}
