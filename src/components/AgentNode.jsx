import React, { useState, useMemo } from 'react';
import { AGENT_COLORS } from '../constants';
import { useSpringPosition } from '../hooks/useSpringPosition';
import { useSpringValue } from '../hooks/useSpringValue';
import { describeArc } from '../utils';
import { InwardPulseWaves } from './InwardPulseWaves';
import { BotIcon } from './BotIcon';
import { ActionButtonsSVG } from './ActionButtonsSVG';
import { SuggestionRing } from './SuggestionRing';

export const AgentNode = React.memo(({
  id,
  type,
  targetPosition,
  percentage = 0,
  size = 140,
  isSelected,
  isDragging,
  showPercentage,
  showActionButtons,
  showSuggestions,
  onMouseDown,
  onAgentEnter,
  onAgentLeave,
  onOuterRingEnter,
  onOuterRingLeave,
  onSuggestionHoverChange,
  onDelete,
  onConnectorClick,
  onABTestClick,
  onHumanClick,
  onSuggestionClick,
  existingPositions,
  connections,
  agents,
  humanOperators,
  suggestionPopupOpen
}) => {
  const colors = AGENT_COLORS[type];
  const [localHover, setLocalHover] = useState(false);
  
  const springPos = useSpringPosition(
    targetPosition.x,
    targetPosition.y,
    isDragging ? 0.5 : 0.15,
    isDragging ? 0.5 : 0.7
  );
  const scale = useSpringValue(isDragging ? 1.06 : localHover ? 1.02 : 1, 0.2, 0.7);
  
  const outerRadius = size / 2;
  const progressRadius = outerRadius - 12;
  const strokeWidth = 6;
  
  const gapDegrees = 100;
  const arcDegrees = 360 - gapDegrees;
  const progressDegrees = (percentage / 100) * arcDegrees;
  const startAngle = 230;
  const progressEndAngle = startAngle - progressDegrees;
  const trackEndAngle = startAngle - arcDegrees;
  const progressPath = percentage > 0 ? describeArc(0, 0, progressRadius, progressEndAngle, startAngle) : '';
  const trackPath = arcDegrees - progressDegrees > 0 ? describeArc(0, 0, progressRadius, trackEndAngle, progressEndAngle) : '';
  const gradientId = `nodeGrad-${id}`;
  
  const canShowUI = !isDragging && !suggestionPopupOpen;

  return (
    <g transform={`translate(${springPos.x}, ${springPos.y}) scale(${scale})`}>
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={colors.gradient[0]} />
          <stop offset="100%" stopColor={colors.gradient[1]} />
        </linearGradient>
        <filter id={`shadow-${id}`} x="-30%" y="-30%" width="160%" height="160%">
          <feDropShadow dx="0" dy="4" stdDeviation="8" floodColor="#000" floodOpacity="0.1" />
        </filter>
        <filter id="btnShadow" x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow dx="0" dy="4" stdDeviation="8" floodColor="#000" floodOpacity="0.12" />
        </filter>
      </defs>

      <circle
        cx={0}
        cy={0}
        r={200}
        fill="transparent"
        onMouseEnter={() => onOuterRingEnter(id)}
        onMouseLeave={() => onOuterRingLeave(id)}
      />

      {isDragging && (
        <ellipse
          cx={3}
          cy={8}
          rx={outerRadius * 0.8}
          ry={outerRadius * 0.3}
          fill="rgba(0,0,0,0.1)"
        />
      )}
      <InwardPulseWaves percentage={percentage} radius={outerRadius} color={colors.primary} id={id} />
      
      {isSelected && (
        <circle
          cx={0}
          cy={0}
          r={outerRadius + 6}
          fill="none"
          stroke={colors.primary}
          strokeWidth="2"
          strokeDasharray="6 4"
          opacity="0.8"
        >
          <animate
            attributeName="stroke-dashoffset"
            from="0"
            to="20"
            dur="0.8s"
            repeatCount="indefinite"
          />
        </circle>
      )}
      
      <g filter={`url(#shadow-${id})`}>
        <circle cx={0} cy={0} r={outerRadius} fill={colors.background} />
      </g>
      <circle
        cx={0}
        cy={0}
        r={outerRadius}
        fill="none"
        stroke={`url(#${gradientId})`}
        strokeWidth={2}
      />
      <circle
        cx={0}
        cy={0}
        r={outerRadius - 20}
        fill="none"
        stroke="rgba(0,0,0,0.03)"
        strokeWidth={18}
      />
      
      {arcDegrees - progressDegrees > 0 && (
        <path
          d={trackPath}
          fill="none"
          stroke="rgba(0,0,0,0.06)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />
      )}
      {percentage > 0 && (
        <path
          d={progressPath}
          fill="none"
          stroke={`url(#${gradientId})`}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />
      )}
      
      <g transform={`translate(-22, ${showPercentage ? -28 : -22})`}>
        <BotIcon color={colors.primary} secondaryColor={colors.secondary} size={44} />
      </g>
      <text
        x={0}
        y={showPercentage ? 28 : 0}
        fontSize={18}
        fontWeight="700"
        fontFamily="system-ui"
        fill={colors.primary}
        textAnchor="middle"
        opacity={showPercentage ? 0.9 : 0}
        style={{ transition: 'opacity 0.3s ease' }}
      >
        {percentage}%
      </text>
      
      {/* Agent circle - always draggable */}
      <circle
        cx={0}
        cy={0}
        r={outerRadius}
        fill="transparent"
        style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
        onMouseDown={(e) => onMouseDown(e, id)}
        onMouseEnter={() => { setLocalHover(true); onAgentEnter(id); }}
        onMouseLeave={() => { setLocalHover(false); onAgentLeave(id); }}
      />
      
      {/* Action Buttons */}
      {canShowUI && showActionButtons && (
        <ActionButtonsSVG
          isVisible={true}
          onConnectorClick={onConnectorClick}
          onABTestClick={onABTestClick}
          onHumanClick={onHumanClick}
        />
      )}
      
      {isSelected && (
        <g
          transform={`translate(${outerRadius - 10}, ${-outerRadius + 10})`}
          style={{ cursor: 'pointer', pointerEvents: 'all' }}
          onClick={(e) => {
            e.stopPropagation();
            onDelete(id);
          }}
        >
          <circle r={14} fill="#EF4444" filter={`url(#shadow-${id})`} />
          <path d="M-4 -4 L4 4 M4 -4 L-4 4" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
        </g>
      )}
      
      {canShowUI && showSuggestions && (
        <SuggestionRing
          agentId={id}
          agentPosition={{ x: 0, y: 0 }}
          isVisible={true}
          onSuggestionClick={onSuggestionClick}
          existingPositions={existingPositions}
          connections={connections}
          agents={agents}
          humanOperators={humanOperators}
          onSuggestionHover={(isHovered) => onSuggestionHoverChange(id, isHovered)}
        />
      )}
    </g>
  );
});

AgentNode.displayName = 'AgentNode';
