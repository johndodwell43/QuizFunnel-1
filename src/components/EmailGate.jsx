import React, { useEffect, useState } from 'react';

// Same shape smile.klyrosdental.com/quiz uses before it accepts an address.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function EmailGate({ onContinue }) {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      document.getElementById('quiz-email')?.focus();
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  const submit = async (event) => {
    event.preventDefault();
    if (submitting) return;
    const address = email.trim();
    if (address.length < 3 || address.length > 254 || !EMAIL_RE.test(address)) {
      setError('Enter your email to continue.');
      return;
    }
    setError('');
    setSubmitting(true);
    try {
      await onContinue(address);
    } catch (err) {
      setError(err instanceof Error ? err.message : "We couldn't save your email. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main data-screen-label="Email gate">
      <form data-testid="quiz-email-gate" noValidate onSubmit={submit}>
        <h1
          style={{
            fontSize: 'clamp(34px, 5.5vw, 44px)',
            lineHeight: 1.15,
            fontWeight: 700,
            margin: '0 0 12px 0',
            textWrap: 'pretty'
          }}
        >
          Where should we send your case check?
        </h1>
        <p
          id="quiz-email-microcopy"
          style={{
            fontSize: 'clamp(18px, 3vw, 21px)',
            lineHeight: 1.5,
            color: '#454e5c',
            margin: '0 0 22px 0'
          }}
        >
          We’ll email your results. A licensed dentist still reviews every case before anything is made.
        </p>
        <label htmlFor="quiz-email" style={{ display: 'block', fontSize: 16, fontWeight: 700, marginBottom: 8 }}>
          Email
        </label>
        <input
          id="quiz-email"
          name="email"
          type="email"
          required
          autoComplete="email"
          inputMode="email"
          value={email}
          aria-describedby="quiz-email-microcopy"
          aria-invalid={error ? 'true' : 'false'}
          onChange={(event) => setEmail(event.target.value)}
          style={{
            width: '100%',
            boxSizing: 'border-box',
            minHeight: 66,
            border: 'none',
            borderRadius: 16,
            background: '#ffffff',
            color: '#111827',
            fontSize: 18,
            fontFamily: 'inherit',
            padding: '16px 18px',
            marginBottom: 12,
            boxShadow: '0 2px 10px rgba(17,24,39,0.07)'
          }}
        />
        {error ? (
          <p role="alert" data-testid="quiz-email-error" style={{ margin: '0 0 12px 0', fontSize: 16, lineHeight: 1.4, color: '#8a2b2b' }}>
            {error}
          </p>
        ) : null}
        <button
          type="submit"
          disabled={submitting}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: 66,
            width: '100%',
            border: 'none',
            background: '#2F5BEA',
            color: '#ffffff',
            borderRadius: 16,
            fontSize: 21,
            fontWeight: 700,
            fontFamily: 'inherit',
            cursor: 'pointer'
          }}
        >
          Continue →
        </button>
      </form>
    </main>
  );
}
