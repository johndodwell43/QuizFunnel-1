import React from 'react';
import { createRoot } from 'react-dom/client';
import posthog from 'posthog-js';
import App from './App.jsx';
import './styles.css';

// Initialize PostHog once, before the app renders. Guarded so we never double-init
// if PostHog was already loaded elsewhere (e.g. an inline snippet).
if (!posthog.__loaded) {
  posthog.init('phc_oLamCba6dgmoD8B4xsnFMtxczXvNABumYs6nKnmtBvwa', {
    api_host: 'https://us.i.posthog.com'
  });
}

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
