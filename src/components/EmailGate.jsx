import React, { useEffect, useId, useRef, useState } from 'react';
import { LINKS } from '../config.js';
import { STEP6_EN, step6Headline, step6Subhead } from '../i18n/step6.js';
import { isValidEmail, normalizeFirstName } from '../lib/email.js';
import { persistQuizLead } from '../lib/lead.js';
import { trackEmailGateViewed, trackLeadCaptured } from '../lib/track.js';

// Locked accent for this screen. White text on this fill clears WCAG AA.
// The privacy link sits on white so the same blue clears AA there too.
const STEP6_ACCENT = '#2563eb';

const errorStyle = {
  fontSize: 16,
  lineHeight: 1.45,
  color: '#991b1b',
  margin: '8px 0 0 0'
};

const labelStyle = {
  display: 'block',
  fontSize: 16,
  fontWeight: 700,
  lineHeight: 1.4,
  marginBottom: 8,
  color: '#111827'
};

const inputStyle = {
  width: '100%',
  minHeight: 48,
  borderRadius: 16,
  border: '1px solid #475569',
  background: '#ffffff',
  boxShadow: '0 2px 10px rgba(17,24,39,0.07)',
  fontSize: 16,
  lineHeight: 1.4,
  padding: '12px 16px',
  boxSizing: 'border-box',
  color: '#111827'
};

export default function EmailGate({ initialEmail = '', initialFirstName = '', onSuccess }) {
  const emailId = useId();
  const nameId = useId();
  const emailErrorId = useId();
  const nameErrorId = useId();
  const headingId = useId();
  const emailRef = useRef(null);
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
    if (!isValidEmail(nextEmail)) {
      setEmailError(STEP6_EN.emailError);
      setSaveError('');
      emailRef.current?.focus();
      return;
    }
    const nextName = normalizeFirstName(firstName);
    if (nextName === null) {
      setEmailError('');
      setNameError(STEP6_EN.nameError);
      setSaveError('');
      return;
    }

    lock.current = true;
    setSubmitting(true);
    setEmailError('');
    setNameError('');
    setSaveError('');
    try {
      const saved = await persistQuizLead({ email: nextEmail, firstName: nextName });
      trackLeadCaptured(Boolean(saved.firstName));
      onSuccess(saved);
    } catch {
      lock.current = false;
      setSubmitting(false);
      setSaveError(STEP6_EN.saveError);
    }
  }

  return (
    <main data-screen-label="Send results">
      <h1
        id={headingId}
        style={{
          fontSize: 'clamp(34px, 5.5vw, 44px)',
          lineHeight: 1.15,
          fontWeight: 700,
          margin: '0 0 12px 0',
          textWrap: 'pretty'
        }}
      >
        {step6Headline()}
      </h1>
      <p
        style={{
          fontSize: 'clamp(18px, 3vw, 21px)',
          lineHeight: 1.5,
          color: '#454e5c',
          margin: '0 0 24px 0'
        }}
      >
        {step6Subhead()}
      </p>

      <form onSubmit={onSubmit} noValidate aria-labelledby={headingId}>
        <div style={{ marginBottom: 18 }}>
          <label htmlFor={emailId} style={labelStyle}>
            {STEP6_EN.emailLabel}
          </label>
          <input
            ref={emailRef}
            id={emailId}
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
            aria-describedby={emailError ? emailErrorId : undefined}
            onChange={(event) => {
              setEmailError('');
              setSaveError('');
              setEmail(event.target.value);
            }}
            style={{
              ...inputStyle,
              borderColor: emailError ? '#991b1b' : '#475569'
            }}
          />
          {emailError ? (
            <p id={emailErrorId} role="alert" style={errorStyle}>
              {emailError}
            </p>
          ) : null}
        </div>

        <div style={{ marginBottom: 18 }}>
          <label htmlFor={nameId} style={labelStyle}>
            {STEP6_EN.firstNameLabel}{' '}
            <span style={{ fontWeight: 400, color: '#374151' }}>
              {STEP6_EN.firstNameHelper}
            </span>
          </label>
          <input
            id={nameId}
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
            style={{
              ...inputStyle,
              borderColor: nameError ? '#991b1b' : '#475569'
            }}
          />
          {nameError ? (
            <p id={nameErrorId} role="alert" style={errorStyle}>
              {nameError}
            </p>
          ) : null}
        </div>

        <button
          type="submit"
          disabled={submitting}
          aria-busy={submitting}
          style={{
            width: '100%',
            minHeight: 56,
            border: 'none',
            borderRadius: 16,
            background: STEP6_ACCENT,
            color: '#ffffff',
            fontSize: 18,
            fontWeight: 700,
            cursor: submitting ? 'wait' : 'pointer'
          }}
        >
          {STEP6_EN.button}
        </button>

        {saveError ? (
          <p role="alert" style={errorStyle}>
            {saveError}
          </p>
        ) : null}

        <p
          style={{
            margin: '16px 0 0 0',
            background: '#ffffff',
            borderRadius: 16,
            padding: '14px 16px',
            fontSize: 16,
            lineHeight: 1.5,
            color: '#111827'
          }}
        >
          {STEP6_EN.privacy}{' '}
          <a href={LINKS.privacy} style={{ color: STEP6_ACCENT, fontWeight: 700, textDecoration: 'underline' }}>
            {STEP6_EN.privacyLink}
          </a>
        </p>
      </form>
    </main>
  );
}
