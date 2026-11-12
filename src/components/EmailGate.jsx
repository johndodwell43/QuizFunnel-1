import React, { useEffect, useId, useRef, useState } from 'react';
import { LINKS } from '../config.js';
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
      <section className="gate-card">
        <h1 className="email-gate-title">
          <span className="step-tag">Step 1</span>{' '}
          to your <span className="u-smile">new smile</span>.
        </h1>
        <p className="email-gate-sub">
          Enter your email, then answer the 5 questions a licensed dentist uses to begin your case review.
        </p>

        <form onSubmit={onSubmit} noValidate>
          <label htmlFor={emailId} className="sr-only">
            Email
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
            placeholder="you@email.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
          <p className="email-gate-why">Your case results and next steps go here.</p>
          <button type="submit" className="email-gate-submit" disabled={!emailReady || submitting}>
            {submitting ? 'Sending…' : 'Continue'}
          </button>
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
        </form>
      </section>
      <p className="gate-foot">After the questions, you'll see your partial options and pricing.</p>
      <p className="gate-links">
        <a href={`${LINKS.home}/how-it-works`} target="_blank" rel="noopener">How it works</a>
        <span aria-hidden="true">·</span>
        <a href={`mailto:${LINKS.email}`}>Have a question? Contact us</a>
      </p>
      <div className="email-gate-art">
        <img
          src="/gate-hero.jpg"
          alt="Smiling adult"
          width="1200"
          height="460"
          fetchpriority="high"
        />
      </div>
    </main>
  );
}
