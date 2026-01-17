import React, { useState } from 'react';
import { AGENT_COLORS, AGENT_TYPES } from '../constants';
import { BotIcon } from './BotIcon';

export const TrainingModal = React.memo(({ agent, onClose, onSave }) => {
  const [text, setText] = useState('');
  const colors = agent ? AGENT_COLORS[agent.type] : AGENT_COLORS[AGENT_TYPES.CHAT];
  
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.4)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 2000
      }}
    >
      <div
        style={{
          background: 'white',
          borderRadius: '20px',
          padding: '24px',
          width: '380px',
          boxShadow: '0 24px 48px rgba(0,0,0,0.2)',
          animation: 'popIn 0.25s ease-out'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: '12px',
              background: colors.background,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <BotIcon color={colors.primary} secondaryColor={colors.secondary} size={28} />
          </div>
          <div>
            <div style={{ fontSize: '16px', fontWeight: 600, color: '#1F2937' }}>Train Agent</div>
            <div style={{ fontSize: '12px', color: '#6B7280', textTransform: 'capitalize' }}>
              {agent?.type} Agent
            </div>
          </div>
        </div>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter training data..."
          style={{
            width: '100%',
            height: '120px',
            padding: '14px',
            border: '1px solid #E5E7EB',
            borderRadius: '12px',
            fontSize: '14px',
            resize: 'none',
            boxSizing: 'border-box',
            fontFamily: 'inherit',
            marginBottom: '16px'
          }}
          autoFocus
        />
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={onClose}
            style={{
              flex: 1,
              padding: '12px',
              border: '1px solid #E5E7EB',
              background: 'white',
              borderRadius: '10px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: 500
            }}
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onSave(text);
              onClose();
            }}
            disabled={!text}
            style={{
              flex: 1,
              padding: '12px',
              border: 'none',
              background: text ? colors.primary : '#E5E7EB',
              color: text ? 'white' : '#9CA3AF',
              borderRadius: '10px',
              cursor: text ? 'pointer' : 'not-allowed',
              fontSize: '14px',
              fontWeight: 500
            }}
          >
            Train
          </button>
        </div>
      </div>
    </div>
  );
});

TrainingModal.displayName = 'TrainingModal';
