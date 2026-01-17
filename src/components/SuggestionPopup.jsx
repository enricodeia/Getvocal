import React from 'react';
import { AGENT_TYPES, AGENT_COLORS } from '../constants';

export const SuggestionPopup = React.memo(({ position, onSelect, onClose, zoom, offset }) => {
  const agentTypes = [
    { type: AGENT_TYPES.WHATSAPP, label: 'WhatsApp', icon: '💬' },
    { type: AGENT_TYPES.OUTBOUND, label: 'Outbound', icon: '📤' },
    { type: AGENT_TYPES.INBOUND, label: 'Inbound', icon: '📥' },
    { type: AGENT_TYPES.CHAT, label: 'Chat', icon: '🤖' },
  ];
  const screenX = position.x * zoom + offset.x;
  const screenY = position.y * zoom + offset.y;
  
  return (
    <>
      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 999
        }}
        onClick={onClose}
      />
      <div
        style={{
          position: 'absolute',
          left: screenX,
          top: screenY,
          transform: 'translate(-50%, -100%) translateY(-12px)',
          background: 'white',
          borderRadius: '14px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.16)',
          padding: '8px',
          minWidth: '160px',
          zIndex: 1000,
          border: '1px solid rgba(0,0,0,0.06)',
          animation: 'popIn 0.2s ease-out'
        }}
      >
        <div
          style={{
            fontSize: '10px',
            fontWeight: 700,
            color: '#9CA3AF',
            padding: '6px 10px',
            letterSpacing: '0.08em'
          }}
        >
          SELECT TYPE
        </div>
        {agentTypes.map(({ type, label, icon }) => {
          const colors = AGENT_COLORS[type];
          return (
            <button
              key={type}
              onClick={() => onSelect(type)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                width: '100%',
                padding: '10px 12px',
                border: 'none',
                background: 'transparent',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '13px',
                color: '#374151',
                transition: 'all 0.15s',
                textAlign: 'left'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = colors.background}
              onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
            >
              <span style={{ fontSize: '16px' }}>{icon}</span>
              <span style={{ fontWeight: 500 }}>{label}</span>
            </button>
          );
        })}
        <div style={{ height: 1, background: '#E5E7EB', margin: '4px 0' }} />
        <button
          onClick={() => onSelect('human')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            width: '100%',
            padding: '10px 12px',
            border: 'none',
            background: 'transparent',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '13px',
            color: '#374151',
            transition: 'all 0.15s',
            textAlign: 'left'
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = '#FAF5FF'}
          onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
        >
          <span style={{ fontSize: '16px' }}>👤</span>
          <span style={{ fontWeight: 500 }}>Human Operator</span>
        </button>
        <div
          style={{
            position: 'absolute',
            left: '50%',
            bottom: -6,
            marginLeft: -6,
            width: 12,
            height: 12,
            background: 'white',
            transform: 'rotate(45deg)',
            borderRight: '1px solid rgba(0,0,0,0.06)',
            borderBottom: '1px solid rgba(0,0,0,0.06)'
          }}
        />
      </div>
    </>
  );
});

SuggestionPopup.displayName = 'SuggestionPopup';
