import React from 'react';

export default function ProgressBar({ progress }) {
  return (
    <div
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={progress}
      style={{
        height: 6,
        background: 'rgba(255,255,255,0.7)',
        borderRadius: 3,
        overflow: 'hidden',
        marginBottom: 28
      }}
    >
      <div
        style={{
          height: '100%',
          width: `${progress}%`,
          background: '#2F5BEA',
          borderRadius: 3,
          transition: 'width 0.25s ease'
        }}
      />
    </div>
  );
}
