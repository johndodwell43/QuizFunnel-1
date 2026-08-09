import React from 'react';
import ImageSlot from './ImageSlot.jsx';

export default function ProofBlock() {
  return (
    <div
      id="proof-section"
      style={{
        margin: '0 0 26px 0',
        background: '#ffffff',
        borderRadius: 20,
        boxShadow: '0 2px 10px rgba(17,24,39,0.07)',
        overflow: 'hidden'
      }}
    >
      <div style={{ background: '#111827', color: '#ffffff', fontSize: 13, fontWeight: 700, letterSpacing: '0.08em', padding: '10px 16px' }}>
        KLYROS · REAL PATIENT RESULT
      </div>

      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: '16px 16px 0 16px' }}>
        <div style={{ flex: '1 1 0', minWidth: 0 }}>
          <ImageSlot src="/images/beforecomp.png" alt="Before photo" label="Before photo" height={300} />
          <p style={{ margin: '8px 0 0 0', textAlign: 'center', fontSize: 13, fontWeight: 700, letterSpacing: '0.08em', color: '#6b7381' }}>
            BEFORE
          </p>
        </div>
        <div style={{ flex: '1 1 0', minWidth: 0 }}>
          <ImageSlot src="/images/aftercomp.png" alt="After photo" label="After photo" height={300} />
          <p style={{ margin: '8px 0 0 0', textAlign: 'center', fontSize: 13, fontWeight: 700, letterSpacing: '0.08em', color: '#6b7381' }}>
            AFTER
          </p>
        </div>
      </div>

      <div style={{ padding: '18px 20px', textAlign: 'center' }}>
        <p style={{ margin: '0 auto', maxWidth: 620, fontSize: 17, lineHeight: 1.5, color: '#454e5c' }}>
          This patient was missing a lower back molar — one of the teeth you count on most for
          chewing. With her custom Klyros partial in place, she can bite and chew again.
        </p>
      </div>
    </div>
  );
}
