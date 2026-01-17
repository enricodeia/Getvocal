import { GRID } from '../constants';

// ============================================
// UTILITY FUNCTIONS
// ============================================

export const snapToGrid = (value, gridSize = GRID.CELL_SIZE) => {
  return Math.round(value / gridSize) * gridSize;
};

export const getLoadConfig = (percentage) => {
  if (percentage <= 15) return { waves: 1, duration: 5.0, delay: 1.2, opacity: 0.2, strokeWidth: 1 };
  if (percentage <= 40) return { waves: 2, duration: 4.0, delay: 0.7, opacity: 0.3, strokeWidth: 1.5 };
  if (percentage <= 70) return { waves: 3, duration: 3.0, delay: 0.4, opacity: 0.45, strokeWidth: 2 };
  return { waves: 3, duration: 2.0, delay: 0.2, opacity: 0.6, strokeWidth: 2.5 };
};

// ============================================
// PATH COLLISION DETECTION
// ============================================

export const pointToSegmentDistance = (px, py, x1, y1, x2, y2) => {
  const dx = x2 - x1, dy = y2 - y1;
  const lengthSq = dx * dx + dy * dy;
  if (lengthSq === 0) return Math.sqrt((px - x1) ** 2 + (py - y1) ** 2);
  let t = Math.max(0, Math.min(1, ((px - x1) * dx + (py - y1) * dy) / lengthSq));
  return Math.sqrt((px - (x1 + t * dx)) ** 2 + (py - (y1 + t * dy)) ** 2);
};

// Get multiple points along a path (including curve approximation) for collision detection
const getPathPoints = (fromPos, toPos, numPoints = 12) => {
  const points = [];
  const dx = toPos.x - fromPos.x;
  const dy = toPos.y - fromPos.y;
  const dist = Math.sqrt(dx * dx + dy * dy);
  
  // Approximate the curved path used by SmoothConnection
  // The curves have rounded corners, so we sample more points
  const curvature = Math.min(dist * 0.25, 60);
  
  for (let i = 0; i <= numPoints; i++) {
    const t = i / numPoints;
    const x = fromPos.x + t * dx;
    // Add slight curve offset to better match the actual path shape
    const curveOffset = Math.sin(t * Math.PI) * curvature * 0.4;
    const y = fromPos.y + t * dy + (Math.abs(dy) < Math.abs(dx) ? curveOffset : 0);
    points.push({ x, y: fromPos.y + t * dy + (Math.abs(dx) < Math.abs(dy) ? 0 : curveOffset) });
  }
  
  // Also add the control points for rounded corners
  const midX = (fromPos.x + toPos.x) / 2;
  const midY = (fromPos.y + toPos.y) / 2;
  points.push({ x: midX, y: fromPos.y });
  points.push({ x: midX, y: toPos.y });
  points.push({ x: fromPos.x, y: midY });
  points.push({ x: toPos.x, y: midY });
  
  return points;
};

// Check if a suggestion point is near any connection path
export const isNearConnectionPath = (point, connections, agents, humanOperators, sourceAgentId, threshold = 55) => {
  for (const conn of connections) {
    // Skip connections FROM this agent (allow suggestions in outgoing directions)
    if (conn.from === sourceAgentId) continue;
    
    const fromNode = agents.find(a => a.id === conn.from) || humanOperators.find(h => h.id === conn.from);
    const toNode = agents.find(a => a.id === conn.to) || humanOperators.find(h => h.id === conn.to);
    if (!fromNode || !toNode) continue;
    
    // Get points along the path
    const pathPoints = getPathPoints(fromNode.position, toNode.position, 12);
    
    // Check distance to each point on the path
    for (const pathPoint of pathPoints) {
      const dist = Math.sqrt((point.x - pathPoint.x) ** 2 + (point.y - pathPoint.y) ** 2);
      if (dist < threshold) return true;
    }
    
    // Check distance to line segments between path points
    for (let i = 0; i < pathPoints.length - 1; i++) {
      const dist = pointToSegmentDistance(
        point.x, point.y,
        pathPoints[i].x, pathPoints[i].y,
        pathPoints[i + 1].x, pathPoints[i + 1].y
      );
      if (dist < threshold * 0.8) return true;
    }
  }
  return false;
};

// Check if point is near any existing node
export const isNearExistingNode = (point, existingPositions, minDistance = 100) => {
  for (const pos of existingPositions) {
    const dist = Math.sqrt((point.x - pos.x) ** 2 + (point.y - pos.y) ** 2);
    if (dist < minDistance) return true;
  }
  return false;
};

// ============================================
// ARC HELPERS
// ============================================

export const polarToCartesian = (cx, cy, radius, angleInDegrees) => {
  const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
  return {
    x: cx + radius * Math.cos(angleInRadians),
    y: cy + radius * Math.sin(angleInRadians)
  };
};

export const describeArc = (cx, cy, radius, startAngle, endAngle) => {
  const start = polarToCartesian(cx, cy, radius, endAngle);
  const end = polarToCartesian(cx, cy, radius, startAngle);
  return `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${endAngle - startAngle <= 180 ? "0" : "1"} 0 ${end.x} ${end.y}`;
};
