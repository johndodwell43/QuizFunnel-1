import React from 'react';
import ImageSlot from './ImageSlot.jsx';
import { DENTIST_LINE } from '../config.js';

const captionStyle = {
  margin: '8px 0 0 0',
  textAlign: 'center',
  fontSize: 18,
  fontWeight: 700,
  letterSpacing: '0.06em',
  color: '#454e5c'
};

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
      <div className="proof-pair">
        <figure className="proof-shot">
          <ImageSlot
            src="/images/beforecomp.png"
            alt="Lower space beside a metal-crowned molar, before a partial is seated"
            label="Before photo"
            fullFrame
            objectPosition="left center"
            radius={12}
          />
          <figcaption style={captionStyle}>BEFORE</figcaption>
        </figure>
        <figure className="proof-shot">
          <ImageSlot
            src="/images/aftercomp.png"
            alt="The same lower area with a custom partial seated"
            label="After photo"
            fullFrame
            objectPosition="center center"
            radius={12}
          />
          <figcaption style={captionStyle}>AFTER</figcaption>
        </figure>
      </div>

      <div style={{ padding: '18px 20px 22px', textAlign: 'center' }}>
        <p style={{ margin: '0 auto', maxWidth: 640, fontSize: 18, lineHeight: 1.5, color: '#454e5c' }}>
          These photos show the same lower area before a partial is seated and with a custom
          partial seated. {DENTIST_LINE}
        </p>
      </div>
    </div>
  );
}
