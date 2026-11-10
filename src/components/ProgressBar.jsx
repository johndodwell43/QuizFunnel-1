import React from 'react';

export default function ProgressBar({ progress, gate = false }) {
  return (
    <div
      className={gate ? 'gate-progress' : undefined}
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={progress}
      style={{
        height: 6,
        background: gate ? '#cfe9ff' : 'rgba(255,255,255,0.7)',
        borderRadius: 3,
        overflow: 'hidden',
        marginBottom: gate ? 10 : 28
      }}
    >
      <div
        style={{
          height: '100%',
          width: `${progress}%`,
          background: '#2563eb',
          borderRadius: 3,
          transition: 'width 0.25s ease'
        }}
      />
    </div>
  );
}
