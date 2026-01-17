import React from 'react';
import { useSpringPosition } from '../hooks/useSpringPosition';

export const GradientConnection = React.memo(({ fromPos, toPos, id }) => {
  const from = useSpringPosition(fromPos.x, fromPos.y, 0.1, 0.65);
  const to = useSpringPosition(toPos.x, toPos.y, 0.1, 0.65);
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const pathD = Math.abs(dy) > Math.abs(dx)
    ? `M ${from.x} ${from.y} Q ${from.x} ${from.y + dy * 0.5} ${from.x + dx * 0.5} ${from.y + dy * 0.5} Q ${to.x} ${from.y + dy * 0.5} ${to.x} ${to.y}`
    : `M ${from.x} ${from.y} C ${from.x + dx * 0.4} ${from.y} ${to.x - dx * 0.4} ${to.y} ${to.x} ${to.y}`;
  
  return (
    <g>
      <defs>
        <linearGradient id={`humanGradient-${id}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#F47450" stopOpacity="0" />
          <stop offset="18.75%" stopColor="#F47450" stopOpacity="1" />
          <stop offset="83.65%" stopColor="#5D5FEF" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#5D5FEF" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path
        d={pathD}
        fill="none"
        stroke="rgba(139, 92, 246, 0.08)"
        strokeWidth="10"
        strokeLinecap="round"
      />
      <path
        d={pathD}
        fill="none"
        stroke={`url(#humanGradient-${id})`}
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path id={`motionPath-${id}`} d={pathD} fill="none" stroke="none" />
      {[0, 1, 2].map(i => (
        <circle key={i} r={3} fill="#F47450">
          <animateMotion dur="2.5s" repeatCount="indefinite" begin={`${i * 0.8}s`}>
            <mpath href={`#motionPath-${id}`} />
          </animateMotion>
          <animate
            attributeName="opacity"
            values="0;1;1;0"
            keyTimes="0;0.1;0.9;1"
            dur="2.5s"
            repeatCount="indefinite"
            begin={`${i * 0.8}s`}
          />
        </circle>
      ))}
    </g>
  );
});

GradientConnection.displayName = 'GradientConnection';
