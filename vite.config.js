import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { saveQuizLead } from './api/saveLead.js';

function readRequestBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on('data', (chunk) => chunks.push(chunk));
    req.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
    req.on('error', reject);
  });
}

// Dev stand-in for the Vercel function at api/quiz-lead.js.
function quizLeadDevApi() {
  return {
    name: 'quiz-lead-dev-api',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const path = (req.url || '').split('?')[0];
        if (path !== '/api/quiz-lead') {
          next();
          return;
        }
        if (req.method !== 'POST') {
          res.statusCode = 405;
          res.setHeader('content-type', 'application/json');
          res.end(JSON.stringify({ ok: false }));
          return;
        }
        try {
          const raw = await readRequestBody(req);
          const body = raw ? JSON.parse(raw) : {};
          await saveQuizLead(body);
          res.statusCode = 200;
          res.setHeader('content-type', 'application/json');
          res.end(JSON.stringify({ ok: true }));
        } catch (error) {
          res.statusCode = error.statusCode === 400 ? 400 : 502;
          res.setHeader('content-type', 'application/json');
          res.end(JSON.stringify({ ok: false }));
        }
      });
    }
  };
}

export default defineConfig({
  plugins: [react(), quizLeadDevApi()],
  build: { outDir: 'dist' }
});
