import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import quizLead from './api/quiz-lead.js';

function quizLeadDev() {
  return {
    name: 'quiz-lead-dev',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const path = (req.url || '').split('?')[0];
        if (path !== '/api/quiz-lead') {
          next();
          return;
        }
        try {
          await quizLead(req, res);
        } catch {
          if (!res.headersSent) {
            res.statusCode = 502;
            res.setHeader('content-type', 'application/json; charset=utf-8');
            res.end(JSON.stringify({ ok: false, error: "We couldn't save your email. Please try again." }));
          }
        }
      });
    }
  };
}

export default defineConfig({
  plugins: [react(), quizLeadDev()],
  build: { outDir: 'dist' }
});
