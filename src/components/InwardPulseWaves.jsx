import React, { useMemo } from 'react';
import { getLoadConfig } from '../utils';

export const InwardPulseWaves = React.memo(({ percentage, radius, color, id }) => {
  const config = useMemo(() => getLoadConfig(percentage), [percentage]);
  const { waves, duration, delay, opacity, strokeWidth } = config;
  const startRadius = radius + 30;
  const endRadius = radius + 1;
  
  return (
    <g>
      <defs>
        <linearGradient id={`waveGrad-${id}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={color} stopOpacity={opacity} />
          <stop offset="100%" stopColor={color} stopOpacity={opacity * 0.5} />
        </linearGradient>
      </defs>
      {Array.from({ length: waves }).map((_, i) => (
        <circle
          key={`wave-${id}-${i}`}
          cx={0}
          cy={0}
          r={startRadius}
          fill="none"
          stroke={`url(#waveGrad-${id})`}
          strokeWidth={strokeWidth}
          opacity={0}
        >
          <animate
            attributeName="r"
            values={`${startRadius};${endRadius}`}
            dur={`${duration}s`}
            begin={`${i * delay}s`}
            repeatCount="indefinite"
            calcMode="spline"
            keySplines="0.4 0 0.2 1"
            keyTimes="0;1"
          />
          <animate
            attributeName="opacity"
            values={`0;${opacity};${opacity * 0.7};0`}
            keyTimes="0;0.15;0.65;1"
            dur={`${duration}s`}
            begin={`${i * delay}s`}
            repeatCount="indefinite"
          />
        </circle>
      ))}
    </g>
  );
});

InwardPulseWaves.displayName = 'InwardPulseWaves';
