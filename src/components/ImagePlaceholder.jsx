import React from 'react';

// Visible stand-in only. Not an image, so it has no alt text and is omitted
// from any product schema. Hidden from assistive tech on purpose.
export default function ImagePlaceholder({ text, ratio = '1 / 1' }) {
  return (
    <div aria-hidden="true" className="ph" style={{ aspectRatio: ratio }}>
      <span>{text}</span>
    </div>
  );
}
