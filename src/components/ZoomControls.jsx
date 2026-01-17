import React from 'react';

export const ZoomControls = ({ zoom, onZoomIn, onZoomOut, onReset, onFit }) => (
  <div
    style={{
      display: 'flex',
      flexDirection: 'column',
      background: 'rgba(255,255,255,0.97)',
      backdropFilter: 'blur(16px)',
      borderRadius: '14px',
      boxShadow: '0 4px 24px rgba(0,0,0,0.1)',
      padding: '6px',
      border: '1px solid rgba(0,0,0,0.06)'
    }}
  >
    <button
      onClick={onZoomIn}
      style={{
        width: 40,
        height: 40,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '10px',
        border: 'none',
        background: 'transparent',
        cursor: 'pointer',
        fontSize: '18px',
        color: '#4B5563',
        fontWeight: 500
      }}
    >
      +
    </button>
    <div
      style={{
        textAlign: 'center',
        fontSize: '11px',
        color: '#6B7280',
        padding: '6px 0',
        fontFamily: 'monospace',
        fontWeight: 600
      }}
    >
      {Math.round(zoom * 100)}%
    </div>
    <button
      onClick={onZoomOut}
      style={{
        width: 40,
        height: 40,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '10px',
        border: 'none',
        background: 'transparent',
        cursor: 'pointer',
        fontSize: '18px',
        color: '#4B5563',
        fontWeight: 500
      }}
    >
      −
    </button>
    <div style={{ height: 1, background: '#E5E7EB', margin: '4px 0' }} />
    <button
      onClick={onFit}
      style={{
        width: 40,
        height: 40,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '10px',
        border: 'none',
        background: 'transparent',
        cursor: 'pointer',
        fontSize: '14px',
        color: '#9CA3AF'
      }}
      title="Fit"
    >
      ⊞
    </button>
    <button
      onClick={onReset}
      style={{
        width: 40,
        height: 40,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '10px',
        border: 'none',
        background: 'transparent',
        cursor: 'pointer',
        fontSize: '14px',
        color: '#9CA3AF'
      }}
      title="Reset"
    >
      ↺
    </button>
  </div>
);
