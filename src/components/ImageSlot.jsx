import React, { useState } from 'react';

/**
 * Drop a real photo at the given /images/... path and it renders.
 * Until then it shows a neutral placeholder so layout never shifts.
 */
export default function ImageSlot({ src, alt, height = 300, radius = 12, label }) {
  const [failed, setFailed] = useState(false);

  return (
    <div
      style={{
        width: '100%',
        height,
        background: '#f2f5fa',
        borderRadius: radius,
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      {failed ? (
        <span
          style={{
            fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
            fontSize: 12,
            color: '#8a93a3',
            textAlign: 'center',
            padding: '0 10px'
          }}
        >
          {label || alt}
        </span>
      ) : (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          onError={() => setFailed(true)}
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
        />
      )}
    </div>
  );
}
