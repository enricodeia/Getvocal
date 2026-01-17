import React, { useState, useEffect } from 'react';
import { AGENT_COLORS } from '../constants';

export const SuggestionNode = React.memo(({
  position,
  agentType,
  onClick,
  isHovered,
  onMouseEnter,
  onMouseLeave,
  animationDelay = 0
}) => {
  const colors = AGENT_COLORS[agentType];
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), animationDelay);
    return () => clearTimeout(timer);
  }, [animationDelay]);
  
  return (
    <g
      transform={`translate(${position.x}, ${position.y})`}
      style={{
        cursor: 'pointer',
        opacity: isVisible ? 1 : 0,
        transition: 'opacity 0.3s ease-out'
      }}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <circle cx={0} cy={0} r={40} fill="transparent" />
      <circle
        cx={0}
        cy={0}
        r={isHovered ? 28 : 24}
        fill={isHovered ? colors.background : 'white'}
        stroke={colors.primary}
        strokeWidth={2.5}
        strokeDasharray={isHovered ? 'none' : '6 4'}
        opacity={isHovered ? 1 : 0.8}
        style={{ transition: 'all 0.2s ease' }}
      />
      <g opacity={isHovered ? 1 : 0.7} style={{ transition: 'opacity 0.2s ease' }}>
        <line x1={-10} y1={0} x2={10} y2={0} stroke={colors.primary} strokeWidth={3} strokeLinecap="round" />
        <line x1={0} y1={-10} x2={0} y2={10} stroke={colors.primary} strokeWidth={3} strokeLinecap="round" />
      </g>
      {isHovered && (
        <g transform="translate(0, 46)">
          <rect x={-40} y={-14} width={80} height={28} rx={8} fill={colors.primary} />
          <text x={0} y={4} fontSize={12} fill="white" textAnchor="middle" fontWeight="600" fontFamily="system-ui">
            Add Agent
          </text>
        </g>
      )}
    </g>
  );
});

SuggestionNode.displayName = 'SuggestionNode';
