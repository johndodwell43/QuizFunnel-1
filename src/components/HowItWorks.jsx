import React from 'react';

const STEPS = [
  ['We mail you everything', 'Your kit comes in 2 days. Everything you need is inside.'],
  [
    'You make a mold at home',
    'Take as many tries as you want, free. A guide, an app, and step-by-step help are right there with you.'
  ],
  [
    'A dentist checks it',
    'Send photos — private and secure. You hear back in 1 to 2 days. Nothing is made until they say yes.'
  ],
  [
    'Your partial is made just for you',
    'A licensed US lab builds it to fit only your mouth. About 10 business days, then 2-day mail to your door.'
  ]
];

export default function HowItWorks() {
  return (
    <>
      <h2 style={{ margin: '4px 0 16px 0', fontSize: 26, fontWeight: 700 }}>How it works</h2>
      <ol style={{ listStyle: 'none', margin: '0 0 8px 0', padding: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
        {STEPS.map(([title, body], i) => (
          <li
            key={title}
            style={{
              display: 'flex',
              gap: 14,
              alignItems: 'flex-start',
              background: '#ffffff',
              borderRadius: 16,
              boxShadow: '0 2px 10px rgba(17,24,39,0.06)',
              padding: '16px 18px'
            }}
          >
            <span
              style={{
                flexShrink: 0,
                width: 40,
                height: 40,
                borderRadius: '50%',
                background: '#2F5BEA',
                color: '#ffffff',
                fontSize: 20,
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              {i + 1}
            </span>
            <span style={{ display: 'block' }}>
              <strong style={{ display: 'block', fontSize: 19, lineHeight: 1.25, color: '#111827', marginBottom: 4 }}>
                {title}
              </strong>
              <span style={{ display: 'block', fontSize: 16, lineHeight: 1.5, color: '#5b6472' }}>{body}</span>
            </span>
          </li>
        ))}
      </ol>
    </>
  );
}
