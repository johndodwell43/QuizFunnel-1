import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { writeKlaviyoLead } from './src/lib/klaviyoLead.js';

function readBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on('data', (chunk) => chunks.push(chunk));
    req.on('end', () => {
      try {
        const raw = Buffer.concat(chunks).toString('utf8');
        resolve(raw ? JSON.parse(raw) : {});
      } catch (error) {
        reject(error);
      }
    });
    req.on('error', reject);
  });
}

// Local stand-in for api/lead.js so dev and preview can save a lead.
function leadApi() {
  const handle = async (req, res) => {
    if (req.method !== 'POST') {
      res.statusCode = 405;
      res.end();
      return;
    }
    try {
      const body = await readBody(req);
      await writeKlaviyoLead(body);
      res.statusCode = 204;
      res.end();
    } catch (error) {
      const status = error?.status === 400 || error?.message === 'invalid email' ? 400 : 502;
      res.statusCode = status;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ error: status === 400 ? 'invalid email' : 'save failed' }));
    }
  };

  return {
    name: 'lead-api',
    configureServer(server) {
      server.middlewares.use('/api/lead', handle);
    },
    configurePreviewServer(server) {
      server.middlewares.use('/api/lead', handle);
    }
  };
}

export default defineConfig({
  plugins: [react(), leadApi()],
  build: { outDir: 'dist' }
});
