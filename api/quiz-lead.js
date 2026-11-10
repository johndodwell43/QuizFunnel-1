import { saveQuizLead } from './saveLead.js';

function logLeadFailure(status, reason) {
  const safeStatus = Number(status) || 0;
  const safeReason = String(reason || 'save-failed').replace(/[^a-z0-9-]/gi, '').slice(0, 40) || 'save-failed';
  console.error(`quiz-lead failed status=${safeStatus} reason=${safeReason}`);
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    logLeadFailure(405, 'method');
    res.status(405).json({ ok: false });
    return;
  }

  let body = req.body;
  if (typeof body === 'string') {
    try {
      body = JSON.parse(body || '{}');
    } catch {
      logLeadFailure(400, 'invalid-json');
      res.status(400).json({ ok: false });
      return;
    }
  }

  try {
    await saveQuizLead(body || {});
    res.status(200).json({ ok: true });
  } catch (error) {
    const status = error.statusCode === 400 ? 400 : 502;
    logLeadFailure(status, error.reason || (status === 400 ? 'invalid-lead' : 'save-failed'));
    res.status(status).json({ ok: false });
  }
}
