import React from 'react';

export const BotIcon = ({ color, secondaryColor, size = 44 }) => {
  const gradientId = `botGrad-${color.replace('#', '')}`;
  return (
    <svg width={size} height={size} viewBox="0 0 44 44" fill="none">
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={color} />
          <stop offset="100%" stopColor={secondaryColor || color} />
        </linearGradient>
      </defs>
      <g>
        <path d="M22 6V12" stroke={`url(#${gradientId})`} strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="22" cy="4" r="3" fill={`url(#${gradientId})`} />
        <rect x="8" y="12" width="28" height="22" rx="8" stroke={`url(#${gradientId})`} strokeWidth="2.5" fill="none" />
        <rect x="15" y="19" width="4" height="8" rx="2" fill={`url(#${gradientId})`} />
        <rect x="25" y="19" width="4" height="8" rx="2" fill={`url(#${gradientId})`} />
        <rect x="4" y="18" width="3" height="8" rx="1.5" fill={`url(#${gradientId})`} opacity="0.6" />
        <rect x="37" y="18" width="3" height="8" rx="1.5" fill={`url(#${gradientId})`} opacity="0.6" />
      </g>
    </svg>
  );
};
