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
        setTimeout(() => setAnimState([true, false, false]), 0),
        setTimeout(() => setAnimState([true, true, false]), 50),
        setTimeout(() => setAnimState([true, true, true]), 100),
      ];
      return () => timers.forEach(clearTimeout);
    } else {
      setAnimState([false, false, false]);
    }
  }, [isVisible]);
  
  if (!isVisible) return null;
  
  const buttonSize = 38;
  const arcRadius = 85;
  const angles = [-145, -90, -35];
  
  const buttons = [
    {
      id: 'connector',
      angle: angles[0],
      onClick: onConnectorClick,
      title: 'Connect',
      borderColor: '#C4B5FD',
      hoverBorder: '#A855F7',
      bgHover: '#FAF5FF',
      icon: (
        <g transform="translate(-9, -9) scale(0.75)">
          <circle cx="5" cy="5" r="3.5" fill="#8B5CF6" />
          <circle cx="19" cy="19" r="3.5" fill="#8B5CF6" />
          <circle cx="19" cy="5" r="2.5" fill="#8B5CF6" opacity="0.5" />
          <circle cx="5" cy="19" r="2.5" fill="#8B5CF6" opacity="0.5" />
          <path d="M8 8L11 11M11 11L16 16M11 11L16 8M11 11L8 16" stroke="#8B5CF6" strokeWidth="2" strokeLinecap="round" />
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
        <g transform="translate(-10, -7) scale(0.75)">
          <defs>
            <linearGradient id="abGradBtn" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#E879F9" />
              <stop offset="100%" stopColor="#38BDF8" />
            </linearGradient>
          </defs>
          <text x="0" y="16" fontSize="18" fontWeight="700" fill="url(#abGradBtn)" fontFamily="system-ui">A</text>
          <line x1="14" y1="2" x2="14" y2="18" stroke="url(#abGradBtn)" strokeWidth="2" />
          <text x="18" y="16" fontSize="18" fontWeight="700" fill="url(#abGradBtn)" fontFamily="system-ui">B</text>
        </g>
      )
    },
    {
      id: 'training',
      angle: angles[2],
      onClick: onHumanClick,
      title: 'Training',
      borderColor: '#FED7AA',
      hoverBorder: '#F97316',
      bgHover: '#FFF7ED',
      icon: (
        <g transform="translate(-10, -10) scale(0.85)">
          {/* Book icon */}
          <path d="M4 4C4 4 5 3 12 3C19 3 20 4 20 4V20C20 20 19 19 12 19C5 19 4 20 4 20V4Z" stroke="#F97316" strokeWidth="1.8" fill="none" strokeLinejoin="round" />
          <path d="M12 3V19" stroke="#F97316" strokeWidth="1.8" strokeLinecap="round" />
          <path d="M6.5 7H10M6.5 10H10M6.5 13H9" stroke="#F97316" strokeWidth="1.2" strokeLinecap="round" opacity="0.6" />
          <path d="M14 7H17.5M14 10H17.5M15 13H17.5" stroke="#F97316" strokeWidth="1.2" strokeLinecap="round" opacity="0.6" />
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
              transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
              pointerEvents: isAnimated ? 'all' : 'none'
            }}
            onMouseEnter={() => setHoveredBtn(btn.id)}
            onMouseLeave={() => setHoveredBtn(null)}
            onMouseDown={(e) => e.stopPropagation()}
            onClick={(e) => {
              e.stopPropagation();
              btn.onClick();
            }}
          >
            {/* Hit area */}
            <circle cx={0} cy={0} r={buttonSize / 2 + 6} fill="transparent" />
            <rect
              x={-buttonSize / 2}
              y={-buttonSize / 2}
              width={buttonSize}
              height={buttonSize}
              rx={10}
              fill={isHovered ? btn.bgHover : 'white'}
              stroke={isHovered ? btn.hoverBorder : btn.borderColor}
              strokeWidth={2}
              filter="url(#btnShadow)"
              style={{ transition: 'all 0.15s ease' }}
            />
            {btn.icon}
            {isHovered && (
              <g transform="translate(0, 32)">
                <rect x={-32} y={-9} width={64} height={18} rx={5} fill="rgba(0,0,0,0.85)" />
                <text x={0} y={3} fontSize={9} fill="white" textAnchor="middle" fontWeight="500" fontFamily="system-ui">{btn.title}</text>
              </g>
            )}
          </g>
        );
      })}
    </g>
  );
});

ActionButtonsSVG.displayName = 'ActionButtonsSVG';
