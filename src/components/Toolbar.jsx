import React from 'react';
import { AGENT_TYPES, AGENT_COLORS, HUMAN_COLORS } from '../constants';

export const Toolbar = ({ onAdd }) => {
  const items = [
    { type: AGENT_TYPES.WHATSAPP, label: 'WhatsApp', key: '1' },
    { type: AGENT_TYPES.OUTBOUND, label: 'Outbound', key: '2' },
    { type: AGENT_TYPES.INBOUND, label: 'Inbound', key: '3' },
    { type: AGENT_TYPES.CHAT, label: 'Chat', key: '4' },
    { type: 'human', label: 'Operator', key: '5', isHuman: true }
  ];
  
  return (
    <div
      style={{
        position: 'absolute',
        bottom: '16px',
        right: '16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '6px',
        background: 'rgba(255,255,255,0.97)',
        backdropFilter: 'blur(16px)',
        borderRadius: '16px',
        boxShadow: '0 4px 32px rgba(0,0,0,0.12)',
        padding: '12px',
        zIndex: 10,
        border: '1px solid rgba(0,0,0,0.06)'
      }}
    >
      <span
        style={{
          padding: '4px 8px',
          fontSize: '10px',
          fontWeight: 700,
          color: '#9CA3AF',
          letterSpacing: '0.12em',
          textAlign: 'center'
        }}
      >
        ADD NODE
      </span>
      {items.map(({ type, label, key, isHuman }) => {
        const c = isHuman ? HUMAN_COLORS : AGENT_COLORS[type];
        return (
          <button
            key={type}
            onClick={() => onAdd(type)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '10px 14px',
              borderRadius: '10px',
              border: 'none',
              background: isHuman ? '#FAF5FF' : c.background,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              minWidth: '140px'
            }}
          >
            {isHuman ? (
              <div
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: '4px',
                  background: 'linear-gradient(135deg, #F47450, #5D5FEF)'
                }}
              />
            ) : (
              <div
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: '50%',
                  background: `linear-gradient(135deg, ${c.gradient[0]}, ${c.gradient[1]})`,
                  boxShadow: `0 2px 6px ${c.glow}`
                }}
              />
            )}
            <span
              style={{
                fontSize: '13px',
                fontWeight: 500,
                color: '#374151',
                flex: 1,
                textAlign: 'left'
              }}
            >
              {label}
            </span>
            <kbd
              style={{
                fontSize: '10px',
                color: '#9CA3AF',
                background: 'rgba(255,255,255,0.8)',
                padding: '3px 7px',
                borderRadius: '5px',
                fontFamily: 'monospace',
                fontWeight: 600
              }}
            >
              {key}
            </kbd>
          </button>
        );
      })}
    </div>
  );
};
