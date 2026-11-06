import React, { useEffect, useId, useRef, useState } from 'react';
import { LINKS } from '../config.js';
import { isValidEmail, normalizeFirstName } from '../lib/email.js';
import { persistQuizLead } from '../lib/lead.js';
import { trackEmailGateViewed, trackLeadCaptured, trackQuizEmailSubmit } from '../lib/track.js';

const CONSENT = 'Email is required. We save the address and first name only. Unsubscribe anytime.';

export default function EmailGate({ initialEmail = '', initialFirstName = '', savedLead = null, onSuccess }) {
  const emailId = useId();
  const nameId = useId();
  const emailErrorId = useId();
  const nameErrorId = useId();
  const saveErrorId = useId();
  const consentId = useId();
  const emailRef = useRef(null);
  const nameRef = useRef(null);
  const lock = useRef(false);
  const [email, setEmail] = useState(initialEmail);
  const [firstName, setFirstName] = useState(initialFirstName);
  const [emailError, setEmailError] = useState('');
  const [nameError, setNameError] = useState('');
  const [saveError, setSaveError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    trackEmailGateViewed();
  }, []);

  async function onSubmit(event) {
    event.preventDefault();
    if (lock.current) return;

    const nextEmail = email.trim();
    const nextName = normalizeFirstName(firstName);
    const nextEmailError = isValidEmail(nextEmail) ? '' : 'Enter a valid email to continue.';
    const nextNameError = nextName === null ? 'Use a first name, or leave it blank.' : '';
    setEmailError(nextEmailError);
    setNameError(nextNameError);
    setSaveError('');
    if (nextEmailError) {
      emailRef.current?.focus();
      return;
    }
    if (nextNameError) {
      nameRef.current?.focus();
      return;
    }

    if (
      savedLead &&
      savedLead.email === nextEmail &&
      (savedLead.firstName || '') === nextName
    ) {
      onSuccess(savedLead);
      return;
    }

    lock.current = true;
    setSubmitting(true);
    try {
      const saved = await persistQuizLead({ email: nextEmail, firstName: nextName });
      trackLeadCaptured();
      trackQuizEmailSubmit();
      onSuccess(saved);
    } catch {
      lock.current = false;
      setSubmitting(false);
      setSaveError("We couldn't save that just now. Please try again.");
      emailRef.current?.focus();
    }
  }

  return (
    <main data-screen-label="Step 1">
      <figure style={{ margin: '0 0 8px 0' }}>
        <div className="lead-pair">
          <img
            className="lead-photo lead-photo-before"
            src="/images/beforecomp.png"
            alt="Lower space beside a metal-crowned molar, before a partial is seated"
            width="640"
            height="480"
          />
          <img
            className="lead-photo"
            src="/images/aftercomp.png"
            alt="The same lower area with a custom partial seated"
            width="640"
            height="480"
          />
        </div>
        <figcaption className="lead-copy" style={{ margin: '8px 0 0 0', textAlign: 'center' }}>
          Results vary. Each case is reviewed by a licensed dentist.
        </figcaption>
      </figure>

      <h1 className="lead-title">You're 1 step closer to your new smile.</h1>

      <form onSubmit={onSubmit} noValidate>
        <div style={{ marginBottom: 10 }}>
          <label className="lead-label" htmlFor={nameId}>
            First name <span style={{ fontWeight: 400 }}>(optional, so we know what to call you)</span>
          </label>
          <input
            ref={nameRef}
            id={nameId}
            className="lead-input"
            name="given-name"
            type="text"
            autoComplete="given-name"
            maxLength={40}
            value={firstName}
            aria-invalid={nameError ? 'true' : 'false'}
            aria-describedby={nameError ? nameErrorId : undefined}
            onChange={(event) => {
              setNameError('');
              setSaveError('');
              setFirstName(event.target.value);
            }}
          />
          {nameError ? (
            <p id={nameErrorId} role="alert" className="lead-copy" style={{ color: '#9b2c2c', margin: '8px 0 0 0' }}>
              {nameError}
            </p>
          ) : null}
        </div>

        <div style={{ marginBottom: 8 }}>
          <label className="lead-label" htmlFor={emailId}>
            Email
          </label>
          <input
            ref={emailRef}
            id={emailId}
            className="lead-input"
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            autoCapitalize="none"
            autoCorrect="off"
            spellCheck={false}
            required
            aria-required="true"
            value={email}
            aria-invalid={emailError ? 'true' : 'false'}
            aria-describedby={[consentId, emailError ? emailErrorId : '', saveError ? saveErrorId : ''].filter(Boolean).join(' ')}
            onChange={(event) => {
              setEmailError('');
              setSaveError('');
              setEmail(event.target.value);
            }}
          />
          {emailError ? (
            <p id={emailErrorId} role="alert" className="lead-copy" style={{ color: '#9b2c2c', margin: '8px 0 0 0' }}>
              {emailError}
            </p>
          ) : null}
        </div>

        <p id={consentId} className="lead-copy" style={{ margin: '4px 0 0 0' }}>
          {CONSENT}
        </p>
        <p style={{ margin: '0 0 12px 0' }}>
          <a className="lead-copy lead-policy" href={LINKS.privacy}>
            Privacy Policy
          </a>
        </p>

        {saveError ? (
          <p id={saveErrorId} role="alert" className="lead-copy" style={{ color: '#9b2c2c', margin: '0 0 12px 0' }}>
            {saveError}
          </p>
        ) : null}

        <button
          type="submit"
          className="lead-submit"
          disabled={submitting}
          aria-busy={submitting}
          aria-describedby={saveError ? saveErrorId : undefined}
        >
          {submitting ? 'Sending…' : 'Continue'}
        </button>
      </form>
    </main>
  );
}
