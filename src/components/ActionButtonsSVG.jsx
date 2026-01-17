import React, { useState, useEffect } from 'react';

export const ActionButtonsSVG = React.memo(({
  isVisible,
  onConnectorClick,
  onABTestClick,
  onHumanClick
}) => {
  const [hoveredBtn, setHoveredBtn] = useState(null);
  const [animState, setAnimState] = useState([false, false, false]);
  
  useEffect(() => {
    if (isVisible) {
      const timers = [
        setTimeout(() => setAnimState(prev => [true, prev[1], prev[2]]), 0),
        setTimeout(() => setAnimState(prev => [prev[0], true, prev[2]]), 60),
        setTimeout(() => setAnimState(prev => [prev[0], prev[1], true]), 120),
      ];
      return () => timers.forEach(clearTimeout);
    } else {
      setAnimState([false, false, false]);
    }
  }, [isVisible]);
  
  if (!isVisible) return null;
  
  const buttonSize = 52;
  const arcRadius = 95;
  const angles = [-145, -90, -35];
  
  const buttons = [
    {
      id: 'connector',
      angle: angles[0],
      onClick: onConnectorClick,
      title: 'Add Connection',
      borderColor: '#C4B5FD',
      hoverBorder: '#A855F7',
      bgHover: '#FAF5FF',
      icon: (
        <g transform="translate(-12, -12)">
          <circle cx="5" cy="5" r="3.5" fill="#8B5CF6" />
          <circle cx="19" cy="19" r="3.5" fill="#8B5CF6" />
          <circle cx="19" cy="5" r="2.5" fill="#8B5CF6" opacity="0.5" />
          <circle cx="5" cy="19" r="2.5" fill="#8B5CF6" opacity="0.5" />
          <path
            d="M8 8L11 11M11 11L16 16M11 11L16 8M11 11L8 16"
            stroke="#8B5CF6"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </g>
      )
    },
    {
      id: 'abtest',
      angle: angles[1],
      onClick: onABTestClick,
      title: 'A/B Test',
      borderColor: '#E8D5F5',
      hoverBorder: '#C084FC',
      bgHover: '#FDF4FF',
      icon: (
        <g transform="translate(-14, -9)">
          <defs>
            <linearGradient id="abGradBtn" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#E879F9" />
              <stop offset="100%" stopColor="#38BDF8" />
            </linearGradient>
          </defs>
          <text x="0" y="16" fontSize="18" fontWeight="700" fill="url(#abGradBtn)" fontFamily="system-ui">
            A
          </text>
          <line x1="14" y1="2" x2="14" y2="18" stroke="url(#abGradBtn)" strokeWidth="2" />
          <text x="18" y="16" fontSize="18" fontWeight="700" fill="url(#abGradBtn)" fontFamily="system-ui">
            B
          </text>
        </g>
      )
    },
    {
      id: 'human',
      angle: angles[2],
      onClick: onHumanClick,
      title: 'Add Operator',
      borderColor: '#D1D5DB',
      hoverBorder: '#6B7280',
      bgHover: '#F9FAFB',
      icon: (
        <g transform="translate(-12, -12)">
          <path
            d="M4 10L12 4L20 10V18L12 24L4 18V10Z"
            stroke="#6B7280"
            strokeWidth="1.8"
            fill="none"
          />
          <circle cx="12" cy="10" r="3.5" stroke="#6B7280" strokeWidth="1.8" fill="none" />
          <path
            d="M7 20C7 17 9 14.5 12 14.5C15 14.5 17 17 17 20"
            stroke="#6B7280"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        </g>
      )
    }
  ];
  
  return (
    <g style={{ pointerEvents: 'all' }}>
      {buttons.map((btn, index) => {
        const angleRad = (btn.angle * Math.PI) / 180;
        const x = Math.cos(angleRad) * arcRadius;
        const y = Math.sin(angleRad) * arcRadius;
        const isHovered = hoveredBtn === btn.id;
        const isAnimated = animState[index];
        
        return (
          <g
            key={btn.id}
            transform={`translate(${x}, ${y})`}
            style={{
              cursor: 'pointer',
              opacity: isAnimated ? 1 : 0,
              transition: `all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)`,
              pointerEvents: 'all'
            }}
            onMouseEnter={(e) => {
              e.stopPropagation();
              setHoveredBtn(btn.id);
            }}
            onMouseLeave={(e) => {
              e.stopPropagation();
              setHoveredBtn(null);
            }}
            onMouseDown={(e) => {
              e.stopPropagation();
            }}
            onClick={(e) => {
              e.stopPropagation();
              btn.onClick();
            }}
          >
            <rect
              x={-buttonSize / 2}
              y={-buttonSize / 2}
              width={buttonSize}
              height={buttonSize}
              rx={14}
              fill={isHovered ? btn.bgHover : 'white'}
              stroke={isHovered ? btn.hoverBorder : btn.borderColor}
              strokeWidth={2.5}
              filter="url(#btnShadow)"
              style={{
                transition: 'all 0.15s ease',
                transform: isAnimated ? 'scale(1)' : 'scale(0.5)',
                pointerEvents: 'all'
              }}
              onMouseDown={(e) => e.stopPropagation()}
            />
            {btn.icon}
            {isHovered && (
              <g transform="translate(0, 40)">
                <rect x={-45} y={-11} width={90} height={22} rx={7} fill="rgba(0,0,0,0.8)" />
                <text
                  x={0}
                  y={3}
                  fontSize={10}
                  fill="white"
                  textAnchor="middle"
                  fontWeight="500"
                  fontFamily="system-ui"
                >
                  {btn.title}
                </text>
              </g>
            )}
          </g>
        );
      })}
    </g>
  );
});

ActionButtonsSVG.displayName = 'ActionButtonsSVG';
