import React, { useState } from 'react';

// Shown when an answer means we can't take the case right now
// (tooth removed in the last 90 days, pain or swelling, loose teeth).
// One question: start over? Big buttons, same look as the quiz.
const btn = (on) => ({
  width: '100%',
  minHeight: 72,
  border: on ? '2px solid #111827' : '2px solid #8ec2f7',
  borderRadius: 20,
  background: on ? '#111827' : '#ffffff',
  color: on ? '#ffffff' : '#111827',
  boxShadow: '0 2px 10px rgba(37,99,235,0.08)',
  cursor: 'pointer',
  fontSize: 22,
  fontWeight: 700,
  textAlign: 'left',
  padding: '18px 22px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 12
});

const Chevron = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.35, flexShrink: 0 }}>
    <path d="M9 18l6-6-6-6" />
  </svg>
);

export default function PauseScreen({ onRestart }) {
  const [no, setNo] = useState(false);

  return (
    <main className="question-screen pause-screen" data-screen-label="Not a fit right now">
      <header className="question-card">
        <h1 style={{ fontSize: 'clamp(34px, 5.5vw, 44px)', lineHeight: 1.15, fontWeight: 700, margin: 0, textWrap: 'pretty' }}>
          It looks like you may not qualify right now.
        </h1>
      </header>
      <p style={{ fontSize: 'clamp(18px, 3vw, 21px)', lineHeight: 1.5, color: '#454e5c', margin: '0 0 24px 0', padding: '0 20px' }}>
        Would you like to start over?
      </p>

      <div className="answer-grid" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <button onClick={onRestart} style={btn(false)}>
          <span>Yes, start over</span>
          <Chevron />
        </button>
        <button onClick={() => setNo(true)} style={btn(no)} aria-pressed={no}>
          <span>No, thanks</span>
          <Chevron />
        </button>
      </div>

      {no && (
        <p role="status" style={{ fontSize: 19, lineHeight: 1.5, color: '#454e5c', margin: '22px 0 0 0', textAlign: 'center' }}>
          No problem. Thanks for checking with us. You can come back any time.
        </p>
      )}
    </main>
  );
}
