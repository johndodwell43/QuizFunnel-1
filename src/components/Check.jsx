import React from 'react';

// The blue (or light blue, on dark cards) checkmark used by every value list.
export default function Check({ stroke = '#2F5BEA', size = 18, marginTop = 3 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={stroke}
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ flexShrink: 0, marginTop }}
    >
      <path d="M20 6L9 17l-5-5" />
    </svg>
  );
}
