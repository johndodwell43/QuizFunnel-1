import React, { useEffect, useId, useRef, useState } from 'react';
import { EMAIL_CONSENT_DEFAULT, EMAIL_CONSENT_TEXT } from '../lib/consent.js';
import { isValidEmail, resolveEmailMarketingConsent } from '../lib/email.js';
import { persistQuizLead } from '../lib/lead.js';
import { clearPendingQuizLead, rememberPendingQuizLead, scheduleLeadRetry } from '../lib/pendingLead.js';
import { trackEmailGateViewed, trackLeadCaptured } from '../lib/track.js';

export default function EmailGate({
  initialEmail = '',
  initialEmailConsent = EMAIL_CONSENT_DEFAULT,
  onSuccess
}) {
  const emailId = useId();
  const emailConsentId = useId();
  const [email, setEmail] = useState(initialEmail);
  const [emailChecked, setEmailChecked] = useState(initialEmailConsent === true);
  const [submitting, setSubmitting] = useState(false);
  const lock = useRef(false);
  const emailReady = isValidEmail(email);

  useEffect(() => {
    trackEmailGateViewed();
  }, []);

  async function onSubmit(event) {
    event.preventDefault();
    if (lock.current) return;

    const nextEmail = email.trim();
    if (!isValidEmail(nextEmail)) return;
    const localLead = {
      email: nextEmail,
      phone: '',
      emailMarketingConsent: resolveEmailMarketingConsent(emailChecked),
      smsConsent: false
    };

    lock.current = true;
    setSubmitting(true);
    rememberPendingQuizLead(localLead);
    try {
      const saved = await persistQuizLead(localLead);
      clearPendingQuizLead();
      trackLeadCaptured();
      onSuccess(saved);
    } catch (error) {
      console.error('Lead save failed', error);
      onSuccess(localLead);
      scheduleLeadRetry(localLead);
    }
  }

  return (
    <main className="email-gate" data-screen-label="Email">
      <div className="email-gate-art">
        <img
          src="/gate-hero.jpg"
          alt="Smiling adult"
          width="1200"
          height="460"
          fetchpriority="high"
        />
      </div>
      <h1 className="email-gate-title">Where should we send your results?</h1>

      <form onSubmit={onSubmit} noValidate>
        <div className="email-gate-fields">
          <div className="email-gate-field">
            <label htmlFor={emailId} className="email-gate-label">
              Email <span className="email-gate-tag">Required</span>
            </label>
            <input
              id={emailId}
              className="email-gate-input"
              name="email"
              type="email"
              inputMode="email"
              autoComplete="email"
              autoCapitalize="none"
              autoCorrect="off"
              spellCheck={false}
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </div>
        </div>

        <div className="email-gate-consents">
          <label htmlFor={emailConsentId} className="email-gate-consent">
            <input
              id={emailConsentId}
              className="email-gate-check"
              name="email-marketing-consent"
              type="checkbox"
              checked={emailChecked}
              onChange={(event) => setEmailChecked(event.target.checked)}
            />
            <span className="email-gate-consent-copy">{EMAIL_CONSENT_TEXT}</span>
          </label>
        </div>

        <button type="submit" className="email-gate-submit" disabled={!emailReady || submitting}>
          {submitting ? 'Sending…' : 'Continue'}
        </button>
      </form>
    </main>
  );
}
