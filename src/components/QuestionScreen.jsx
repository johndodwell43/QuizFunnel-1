import React from 'react';

export default function QuestionScreen({ question, sel, onPick }) {
  return (
    <main className="question-screen" data-screen-label={question.label}>
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

      <div
        className={question.layout === 'tiles' ? 'answer-grid answer-tiles' : 'answer-grid'}
        style={
          question.layout === 'tiles'
            ? { display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 12 }
            : { display: 'flex', flexDirection: 'column', gap: 12 }
        }
      >
        {question.opts.map(([label, value], i) => {
          const on = sel === i;
          const tile = question.layout === 'tiles' && /^\d/.test(value);
          if (tile) {
            return (
              <button
                key={value}
                onClick={() => onPick(question.key, value, i)}
                aria-label={`${label} ${value === '1' ? 'tooth' : 'teeth'}`}
                style={{
                  minHeight: 72,
                  border: 'none',
                  borderRadius: 20,
                  background: on ? '#111827' : '#ffffff',
                  color: on ? '#ffffff' : '#111827',
                  boxShadow: '0 2px 10px rgba(17,24,39,0.07)',
                  cursor: 'pointer',
                  fontSize: 28,
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                {label}
              </button>
            );
          }
          return (
            <button
              key={value}
              onClick={() => onPick(question.key, value, i)}
              style={{
                width: '100%',
                gridColumn: question.layout === 'tiles' ? '1 / -1' : undefined,
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
        className="question-note-wrap"
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
        <p className="question-note" style={{ fontSize: 18, lineHeight: 1.5, margin: 0, textAlign: 'left', maxWidth: 460 }}>
          A dentist licensed in your state reviews your answers and decides whether they can take
          on your case. Your Klyros support team guides you from kit to finished partial.
        </p>
      </div>
    </main>
  );
}
