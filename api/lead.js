import { writeKlaviyoLead } from '../src/lib/klaviyoLead.js';

// Vercel Node function. Same behavior as the Vite dev/preview middleware.
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    res.status(405).end();
    return;
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body;
    await writeKlaviyoLead(body || {});
    res.status(204).end();
  } catch (error) {
    const status = error?.status === 400 || error?.message === 'invalid email' ? 400 : 502;
    res.status(status).json({ error: status === 400 ? 'invalid email' : 'save failed' });
  }
}
