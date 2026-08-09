import React from 'react';

export default function QuestionScreen({ question, sel, onPick }) {
  return (
    <main data-screen-label={question.label}>
      <h1
        style={{
          fontSize: 'clamp(34px, 5.5vw, 44px)',
          lineHeight: 1.15,
          fontWeight: 700,
          margin: '0 0 12px 0',
          textWrap: 'pretty'
        }}
      >
        {question.title}
      </h1>
      {question.sub ? (
        <p
          style={{
            fontSize: 'clamp(18px, 3vw, 21px)',
            lineHeight: 1.5,
            color: '#454e5c',
            margin: '0 0 28px 0'
          }}
        >
          {question.sub}
        </p>
      ) : (
        <div style={{ height: 16 }} />
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {question.opts.map(([label, value], i) => {
          const on = sel === i;
          return (
            <button
              key={value}
              onClick={() => onPick(question.key, value, i)}
              style={{
                width: '100%',
                minHeight: 72,
                border: 'none',
                borderRadius: 20,
                background: on ? '#111827' : '#ffffff',
                color: on ? '#ffffff' : '#111827',
                boxShadow: '0 2px 10px rgba(17,24,39,0.07)',
                cursor: 'pointer',
                fontSize: 22,
                fontWeight: 700,
                textAlign: 'left',
                padding: '18px 22px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 12
              }}
            >
              <span>{label}</span>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.35, flexShrink: 0 }}>
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
          );
        })}
      </div>

      <div
        style={{
          marginTop: 26,
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'center',
          gap: 8,
          color: '#5b6472'
        }}
      >
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 2 }}>
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          <path d="M9 12l2 2 4-4" />
        </svg>
        <p style={{ fontSize: 16, lineHeight: 1.5, margin: 0, textAlign: 'left', maxWidth: 460 }}>
          A Licensed Dentist in our network reviews your answers and decides whether they can take
          on your case. Klyros handles the paperwork and shipping — nothing is made until a dentist
          says yes.
        </p>
      </div>
    </main>
  );
}
