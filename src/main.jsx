import React from 'react';
import { createRoot } from 'react-dom/client';
import posthog from 'posthog-js';
import App from './App.jsx';
import './styles.css';

// Initialize PostHog once, before the app renders. Guarded so we never double-init
// if PostHog was already loaded elsewhere (e.g. an inline snippet).
if (!posthog.__loaded) {
  posthog.init('phc_oLamCba6dgmoD8B4xsnFMtxczXvNABumYs6nKnmtBvwa', {
    api_host: 'https://us.i.posthog.com',
    // Autocapture, rage clicks and dead clicks send the clicked element's
    // text, i.e. the quiz answer ("Yes, I have pain or swelling"). Only the
    // explicit events in src/lib/track.js are sent.
    autocapture: false,
    rageclick: false,
    capture_dead_clicks: false,
    // If session replay is enabled for the project, mask all text and inputs
    // so recordings can't show questions or answers.
    session_recording: { maskAllInputs: true, maskTextSelector: '*' }
  });
}

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
