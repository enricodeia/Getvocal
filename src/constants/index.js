// ============================================
// CONSTANTS
// ============================================

export const AGENT_TYPES = {
  WHATSAPP: 'whatsapp',
  OUTBOUND: 'outbound',
  INBOUND: 'inbound',
  CHAT: 'chat'
};

export const AGENT_COLORS = {
  [AGENT_TYPES.WHATSAPP]: {
    primary: '#22C55E',
    secondary: '#16A34A',
    background: '#F0FDF4',
    glow: 'rgba(34, 197, 94, 0.25)',
    gradient: ['#22C55E', '#16A34A']
  },
  [AGENT_TYPES.OUTBOUND]: {
    primary: '#A855F7',
    secondary: '#9333EA',
    background: '#FAF5FF',
    glow: 'rgba(168, 85, 247, 0.25)',
    gradient: ['#A855F7', '#9333EA']
  },
  [AGENT_TYPES.INBOUND]: {
    primary: '#3B82F6',
    secondary: '#2563EB',
    background: '#EFF6FF',
    glow: 'rgba(59, 130, 246, 0.25)',
    gradient: ['#3B82F6', '#2563EB']
  },
  [AGENT_TYPES.CHAT]: {
    primary: '#06B6D4',
    secondary: '#0891B2',
    background: '#ECFEFF',
    glow: 'rgba(6, 182, 212, 0.25)',
    gradient: ['#06B6D4', '#0891B2']
  }
};

export const HUMAN_COLORS = {
  primary: '#8B5CF6',
  secondary: '#7C3AED',
  background: '#FFFFFF',
  stroke: '#A78BFA',
  glow: 'rgba(139, 92, 246, 0.2)'
};

export const FLOW_LEVELS = {
  LOW: 1,
  MEDIUM: 2,
  HIGH: 4
};

export const CONNECTION_TYPES = {
  AGENT: 'agent',
  HUMAN: 'human'
};

export const PORT_POSITIONS = {
  top: { x: 0, y: -1 },
  bottom: { x: 0, y: 1 },
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 }
};

export const GRID = {
  CELL_SIZE: 100,
  MIN_ZOOM: 0.1,
  MAX_ZOOM: 4,
};

export const SUGGESTION_ANGLES = [0, 45, 90, 135, 180, 225, 270, 315];
