import React, { useState, useMemo } from 'react';
import { AGENT_TYPES } from '../constants';
import { isNearConnectionPath, isNearExistingNode } from '../utils';
import { SuggestionNode } from './SuggestionNode';

// 8 positions around the agent (every 45 degrees)
const SUGGESTION_ANGLES = [0, 45, 90, 135, 180, 225, 270, 315];

export const SuggestionRing = React.memo(({ 
  agentId, 
  agentPosition, 
  isVisible, 
  onSuggestionClick, 
  existingPositions, 
  connections, 
  agents, 
  humanOperators, 
  onSuggestionHover 
}) => {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const distance = 140;
  
  // Get the absolute position of this agent for collision detection
  const thisAgent = agents.find(a => a.id === agentId);
  const agentAbsolutePos = thisAgent ? thisAgent.position : { x: 0, y: 0 };
  
  // Calculate which suggestions are valid (not blocked)
  const suggestions = useMemo(() => {
    if (!isVisible) return [];
    
    return SUGGESTION_ANGLES.map((angle, index) => {
      const angleRad = (angle * Math.PI) / 180;
      const x = Math.cos(angleRad) * distance;
      const y = Math.sin(angleRad) * distance;
      
      // Relative position for rendering (since we're inside a translated group)
      const relativePos = { x, y };
      
      // Absolute position for collision detection against other nodes/paths
      const absolutePos = { 
        x: agentAbsolutePos.x + x, 
        y: agentAbsolutePos.y + y 
      };
      
      // Check if blocked by another node (use absolute positions)
      const allAbsolutePositions = [
        ...agents.map(a => a.position),
        ...humanOperators.map(h => h.position)
      ].filter(p => !(p.x === agentAbsolutePos.x && p.y === agentAbsolutePos.y)); // Exclude self
      
      const isBlockedByNode = isNearExistingNode(absolutePos, allAbsolutePositions, 90);
      
      // Check if blocked by a connection path (use absolute positions)
      const isBlockedByPath = isNearConnectionPath(
        absolutePos, 
        connections, 
        agents, 
        humanOperators, 
        agentId, 
        45 // threshold - tighter to allow more suggestions
      );
      
      return {
        angle,
        x,
        y,
        relativePos,
        absolutePos,
        index,
        isBlocked: isBlockedByNode || isBlockedByPath
      };
    }).filter(s => !s.isBlocked);
  }, [isVisible, agentAbsolutePos, agents, humanOperators, connections, agentId, distance]);
  
  if (!isVisible || suggestions.length === 0) return null;
  
  const agentTypes = Object.values(AGENT_TYPES);
  
  const handleSuggestionEnter = (index) => {
    setHoveredIndex(index);
    onSuggestionHover(true);
  };
  
  const handleSuggestionLeave = () => {
    setHoveredIndex(null);
    onSuggestionHover(false);
  };
  
  return (
    <g transform={`translate(${agentPosition.x}, ${agentPosition.y})`}>
      {suggestions.map((suggestion, i) => (
        <SuggestionNode 
          key={`suggestion-${suggestion.angle}`} 
          position={suggestion.relativePos} 
          agentType={agentTypes[i % agentTypes.length]}
          onClick={(e) => { 
            e.stopPropagation(); 
            onSuggestionClick(suggestion.relativePos); 
          }}
          isHovered={hoveredIndex === suggestion.index} 
          onMouseEnter={() => handleSuggestionEnter(suggestion.index)} 
          onMouseLeave={handleSuggestionLeave}
          animationDelay={i * 30}
        />
      ))}
    </g>
  );
});

SuggestionRing.displayName = 'SuggestionRing';
