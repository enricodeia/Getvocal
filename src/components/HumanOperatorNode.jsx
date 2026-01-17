import React, { useState } from 'react';
import { HUMAN_COLORS } from '../constants';
import { useSpringPosition } from '../hooks/useSpringPosition';
import { useSpringValue } from '../hooks/useSpringValue';
import { HexagonShape } from './HexagonShape';

export const HumanOperatorNode = React.memo(({
  id,
  targetPosition,
  name = "Operator",
  isSelected,
  isDragging,
  onMouseDown,
  onDelete
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const springPos = useSpringPosition(
    targetPosition.x,
    targetPosition.y,
    isDragging ? 0.5 : 0.15,
    isDragging ? 0.5 : 0.7
  );
  const scale = useSpringValue(isDragging ? 1.06 : isHovered ? 1.02 : 1, 0.2, 0.7);

  return (
    <g
      transform={`translate(${springPos.x}, ${springPos.y}) scale(${scale})`}
      style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
      onMouseDown={(e) => onMouseDown?.(e, id)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <defs>
        <filter id={`humanShadow-${id}`} x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow dx="0" dy="4" stdDeviation="12" floodColor="#8B5CF6" floodOpacity="0.15" />
        </filter>
        <linearGradient id={`humanStroke-${id}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#C4B5FD" />
          <stop offset="100%" stopColor="#A78BFA" />
        </linearGradient>
      </defs>
      {isDragging && <ellipse cx={4} cy={12} rx={65} ry={25} fill="rgba(139, 92, 246, 0.12)" />}
      <g filter={`url(#humanShadow-${id})`}>
        <HexagonShape size={160} strokeColor={`url(#humanStroke-${id})`} strokeWidth={2.5} fill="white" />
      </g>
      {isSelected && (
        <g opacity="0.5">
          <HexagonShape size={175} strokeColor={HUMAN_COLORS.primary} strokeWidth={2} fill="none" />
        </g>
      )}
      <circle cx={0} cy={0} r={40} fill="#FDF2F8" stroke="#FBCFE8" strokeWidth={3} />
      <g>
        <circle cx={0} cy={-5} r={20} fill="#F9A8D4" />
        <circle cx={0} cy={-5} r={16} fill="#FDF2F8" />
        <circle cx={-6} cy={-8} r={2} fill="#374151" />
        <circle cx={6} cy={-8} r={2} fill="#374151" />
        <path d="M-5 0 Q0 5 5 0" stroke="#374151" strokeWidth="1.5" strokeLinecap="round" fill="none" />
      </g>
      <text
        x={0}
        y={65}
        fontSize={12}
        fill={HUMAN_COLORS.primary}
        textAnchor="middle"
        fontWeight="600"
        fontFamily="system-ui"
      >
        {name}
      </text>
      {isSelected && (
        <g
          transform="translate(60, -60)"
          style={{ cursor: 'pointer' }}
          onClick={(e) => {
            e.stopPropagation();
            onDelete?.(id);
          }}
        >
          <circle r={14} fill="#EF4444" />
          <path d="M-4 -4 L4 4 M4 -4 L-4 4" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
        </g>
      )}
    </g>
  );
});

HumanOperatorNode.displayName = 'HumanOperatorNode';
