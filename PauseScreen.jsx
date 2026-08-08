import React from 'react';

const COPY = {
  healing: {
    title: "Let's pick this up a little later.",
    body:
      "Thanks for telling us. Based on your answer, we can't send your case to a dentist in our network just yet. Dentists usually want the gums to settle for a few months after a tooth is taken out, since a partial is made to match the shape of your mouth that day.",
    tip2: 'Your own dentist can tell you when your mouth is ready for a partial.'
  },
  loose: {
    title: "Let's start with your own dentist.",
    body:
      "Thanks for telling us. Based on your answer, we can't send your case to a dentist in our network right now. Loose or shifting teeth are something a dentist needs to look at in person first, and only they can say what it means for you.",
    tip2: 'Your own dentist can look at this in person and tell you what it means for a partial.'
  },
  pain: {
    title: "Let's start with your own dentist.",
    body:
      "Thanks for telling us. Based on your answer, we can't send your case to a dentist in our network right now. Pain or swelling is something a dentist needs to look at in person, and only they can say what is going on.",
    tip2: 'Your own dentist can look at this in person and tell you what it means for a partial.'
  }
};

const TIP_1 = "We're keeping your spot. Nothing has been charged and nothing has been ordered.";
const TIP_3 = "When your dentist says the time is right, come back and finish the quiz. We'll be here.";

function Bullet({ children }) {
  return (
    <li style={{ display: 'flex', gap: 10 }}>
      <span style={{ flexShrink: 0, width: 8, height: 8, borderRadius: '50%', background: '#2F5BEA', marginTop: 9 }} />
      <span>{children}</span>
    </li>
  );
}

export default function PauseScreen({ kind, onRestart }) {
  const copy = COPY[kind] || COPY.pain;

  return (
    <main data-screen-label="See a dentist first">
      <div
        style={{
          width: 68,
          height: 68,
          borderRadius: '50%',
          background: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 18,
          boxShadow: '0 2px 10px rgba(17,24,39,0.07)'
        }}
      >
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#2F5BEA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          <path d="M12 9v4" />
          <path d="M12 16h.01" />
        </svg>
      </div>

      <h1 style={{ fontSize: 'clamp(30px, 5vw, 40px)', lineHeight: 1.15, fontWeight: 700, margin: '0 0 12px 0', textWrap: 'pretty' }}>
        {copy.title}
      </h1>
      <p style={{ fontSize: 'clamp(18px, 3vw, 21px)', lineHeight: 1.55, color: '#454e5c', margin: '0 0 20px 0' }}>
        {copy.body}
      </p>

      <div style={{ background: '#ffffff', borderRadius: 20, boxShadow: '0 2px 10px rgba(17,24,39,0.07)', padding: '20px 22px', marginBottom: 22 }}>
        <h2 style={{ margin: '0 0 12px 0', fontSize: 20, fontWeight: 700 }}>Where things stand</h2>
        <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 11, fontSize: 17, lineHeight: 1.45, color: '#454e5c' }}>
          <Bullet>{TIP_1}</Bullet>
          <Bullet>{copy.tip2}</Bullet>
          <Bullet>{TIP_3}</Bullet>
        </ul>
      </div>

      <button
        onClick={onRestart}
        style={{
          width: '100%',
          minHeight: 66,
          border: 'none',
          borderRadius: 16,
          background: '#2F5BEA',
          color: '#ffffff',
          fontSize: 20,
          fontWeight: 700,
          cursor: 'pointer'
        }}
      >
        Back to the start
      </button>

      <p style={{ fontSize: 15, lineHeight: 1.5, color: '#6b7381', margin: '14px 0 0 0', textAlign: 'center' }}>
        Klyros handles the paperwork and shipping. We don't practice dentistry and nothing here is
        dental advice — only a dentist who sees you in person can tell you what is right for you.
      </p>
    </main>
  );
}
