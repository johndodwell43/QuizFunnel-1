import { saveQuizLead } from './saveLead.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    res.status(405).json({ ok: false });
    return;
  }

  let body = req.body;
  if (typeof body === 'string') {
    try {
      body = JSON.parse(body || '{}');
    } catch {
      res.status(400).json({ ok: false });
      return;
    }
  }

  try {
    await saveQuizLead(body || {});
    res.status(200).json({ ok: true });
  } catch (error) {
    const status = error.statusCode === 400 ? 400 : 502;
    res.status(status).json({ ok: false });
  }
}
