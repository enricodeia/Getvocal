import React, { useMemo } from 'react';
import { AGENT_COLORS, PORT_POSITIONS } from '../constants';
import { useSpringPosition } from '../hooks/useSpringPosition';

export const SmoothConnection = React.memo(({
  fromAgent,
  toAgent,
  flowLevel = 1,
  agentRadius = 70
}) => {
  const colors = AGENT_COLORS[fromAgent.type];
  const dx = toAgent.position.x - fromAgent.position.x;
  const dy = toAgent.position.y - fromAgent.position.y;
  
  let fromPort, toPort;
  if (Math.abs(dx) > Math.abs(dy)) {
    fromPort = dx > 0 ? 'right' : 'left';
    toPort = dx > 0 ? 'left' : 'right';
  } else {
    fromPort = dy > 0 ? 'bottom' : 'top';
    toPort = dy > 0 ? 'top' : 'bottom';
  }
  
  const fromPortPos = PORT_POSITIONS[fromPort];
  const toPortPos = PORT_POSITIONS[toPort];
  const fromPos = {
    x: fromAgent.position.x + fromPortPos.x * (agentRadius + 2),
    y: fromAgent.position.y + fromPortPos.y * (agentRadius + 2)
  };
  const toPos = {
    x: toAgent.position.x + toPortPos.x * (agentRadius + 2),
    y: toAgent.position.y + toPortPos.y * (agentRadius + 2)
  };
  
  const from = useSpringPosition(fromPos.x, fromPos.y, 0.1, 0.65);
  const to = useSpringPosition(toPos.x, toPos.y, 0.1, 0.65);

  const pathD = useMemo(() => {
    const pdx = to.x - from.x;
    const pdy = to.y - from.y;
    if (Math.abs(pdx) < 60 && Math.abs(pdy) < 60) {
      return `M ${from.x} ${from.y} L ${to.x} ${to.y}`;
    }
    const isHorizontal = fromPort === 'left' || fromPort === 'right';
    const cornerRadius = 20;
    if (isHorizontal) {
      const midX = from.x + pdx / 2;
      const rad = Math.min(cornerRadius, Math.abs(pdx) / 4, Math.abs(pdy) / 2);
      const dirY = pdy > 0 ? 1 : -1;
      if (Math.abs(pdy) < rad * 2) {
        return `M ${from.x} ${from.y} L ${to.x} ${to.y}`;
      }
      return `M ${from.x} ${from.y} L ${midX - rad} ${from.y} Q ${midX} ${from.y} ${midX} ${from.y + rad * dirY} L ${midX} ${to.y - rad * dirY} Q ${midX} ${to.y} ${midX + rad * (pdx > 0 ? 1 : -1)} ${to.y} L ${to.x} ${to.y}`;
    } else {
      const midY = from.y + pdy / 2;
      const rad = Math.min(cornerRadius, Math.abs(pdy) / 4, Math.abs(pdx) / 2);
      const dirX = pdx > 0 ? 1 : -1;
      if (Math.abs(pdx) < rad * 2) {
        return `M ${from.x} ${from.y} L ${to.x} ${to.y}`;
      }
      return `M ${from.x} ${from.y} L ${from.x} ${midY - rad * (pdy > 0 ? 1 : -1)} Q ${from.x} ${midY} ${from.x + rad * dirX} ${midY} L ${to.x - rad * dirX} ${midY} Q ${to.x} ${midY} ${to.x} ${midY + rad * (pdy > 0 ? 1 : -1)} L ${to.x} ${to.y}`;
    }
  }, [from, to, fromPort]);

  const dur = 0.9 / flowLevel;

  return (
    <g>
      <path
        d={pathD}
        fill="none"
        stroke="rgba(0,0,0,0.06)"
        strokeWidth="14"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d={pathD}
        fill="none"
        stroke="rgba(148,163,184,0.15)"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {Array.from({ length: flowLevel }).map((_, i) => (
        <path
          key={i}
          d={pathD}
          fill="none"
          stroke={colors.primary}
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray="8 16"
          opacity="0.8"
          style={{
            animation: `flowAnim ${dur}s linear infinite`,
            animationDelay: `${(i * dur) / flowLevel}s`
          }}
        />
      ))}
      <circle cx={to.x} cy={to.y} r={5} fill={colors.primary} />
    </g>
  );
});

SmoothConnection.displayName = 'SmoothConnection';
