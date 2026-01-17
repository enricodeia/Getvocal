import React, { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import { AGENT_TYPES, FLOW_LEVELS, CONNECTION_TYPES, GRID } from '../constants';
import { snapToGrid } from '../utils';
import { useCanvasTransform } from '../hooks/useCanvasTransform';
import { AgentNode } from './AgentNode';
import { HumanOperatorNode } from './HumanOperatorNode';
import { SmoothConnection } from './SmoothConnection';
import { GradientConnection } from './GradientConnection';
import { GridBackground } from './GridBackground';
import { Toolbar } from './Toolbar';
import { ZoomControls } from './ZoomControls';
import { SuggestionPopup } from './SuggestionPopup';
import { TrainingModal } from './TrainingModal';

export default function AgentCanvas() {
  const containerRef = useRef(null);
  const svgRef = useRef(null);
  
  const { zoom, offset, zoomAtPoint, animateToView, setOffset } = useCanvasTransform(1, { x: 0, y: 0 });
  const [canvasSize, setCanvasSize] = useState({ width: 1200, height: 800 });
  
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const [draggedNode, setDraggedNode] = useState(null);
  const [dragPosition, setDragPosition] = useState(null);
  const [selectedNode, setSelectedNode] = useState(null);
  
  const [agentHoverId, setAgentHoverId] = useState(null);
  const [outerRingHoverId, setOuterRingHoverId] = useState(null);
  const [suggestionHoverAgentId, setSuggestionHoverAgentId] = useState(null);
  
  const [suggestionPopup, setSuggestionPopup] = useState(null);
  const [trainingModal, setTrainingModal] = useState(null);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });

  const [agents, setAgents] = useState([
    { id: 'a1', type: AGENT_TYPES.OUTBOUND, position: { x: -320, y: -180 }, percentage: 67 },
    { id: 'a2', type: AGENT_TYPES.WHATSAPP, position: { x: 150, y: -250 }, percentage: 34 },
    { id: 'a3', type: AGENT_TYPES.WHATSAPP, position: { x: -450, y: 120 }, percentage: 13 },
    { id: 'a4', type: AGENT_TYPES.INBOUND, position: { x: 50, y: 80 }, percentage: 8 },
    { id: 'a5', type: AGENT_TYPES.CHAT, position: { x: 380, y: -60 }, percentage: 78 },
    { id: 'a6', type: AGENT_TYPES.OUTBOUND, position: { x: -180, y: 350 }, percentage: 52 },
    { id: 'a7', type: AGENT_TYPES.CHAT, position: { x: 280, y: 280 }, percentage: 91 },
    { id: 'a8', type: AGENT_TYPES.INBOUND, position: { x: 520, y: 180 }, percentage: 4 },
  ]);

  const [humanOperators, setHumanOperators] = useState([
    { id: 'h1', position: { x: 100, y: 500 }, name: 'Support Team' }
  ]);

  const [connections, setConnections] = useState([
    { id: 'c1', from: 'a1', to: 'a4', flowLevel: FLOW_LEVELS.LOW, type: CONNECTION_TYPES.AGENT },
    { id: 'c2', from: 'a2', to: 'a5', flowLevel: FLOW_LEVELS.LOW, type: CONNECTION_TYPES.AGENT },
    { id: 'c3', from: 'a3', to: 'a1', flowLevel: FLOW_LEVELS.MEDIUM, type: CONNECTION_TYPES.AGENT },
    { id: 'c4', from: 'a4', to: 'a7', flowLevel: FLOW_LEVELS.MEDIUM, type: CONNECTION_TYPES.AGENT },
    { id: 'c5', from: 'a3', to: 'a6', flowLevel: FLOW_LEVELS.HIGH, type: CONNECTION_TYPES.AGENT },
    { id: 'c6', from: 'a6', to: 'a7', flowLevel: FLOW_LEVELS.HIGH, type: CONNECTION_TYPES.AGENT },
    { id: 'c7', from: 'a7', to: 'a8', flowLevel: FLOW_LEVELS.LOW, type: CONNECTION_TYPES.AGENT },
    { id: 'c8', from: 'a8', to: 'a5', flowLevel: FLOW_LEVELS.MEDIUM, type: CONNECTION_TYPES.AGENT },
    { id: 'ch1', from: 'a7', to: 'h1', type: CONNECTION_TYPES.HUMAN },
  ]);

  const showPercentage = zoom > 0.9;
  const canShowActionButtons = zoom > 0.9;
  
  const allNodePositions = useMemo(
    () => [...agents.map(a => a.position), ...humanOperators.map(h => h.position)],
    [agents, humanOperators]
  );

  const screenToCanvas = useCallback((clientX, clientY) => {
    const rect = svgRef.current?.getBoundingClientRect();
    if (!rect) return { x: 0, y: 0 };
    return {
      x: (clientX - rect.left - offset.x) / zoom,
      y: (clientY - rect.top - offset.y) / zoom
    };
  }, [zoom, offset]);

  useEffect(() => {
    if (containerRef.current && agents.length) {
      const { clientWidth, clientHeight } = containerRef.current;
      setCanvasSize({ width: clientWidth, height: clientHeight });
      const allNodes = [...agents, ...humanOperators];
      const xs = allNodes.map(a => a.position.x);
      const ys = allNodes.map(a => a.position.y);
      setOffset({
        x: clientWidth / 2 - (Math.min(...xs) + Math.max(...xs)) / 2,
        y: clientHeight / 2 - (Math.min(...ys) + Math.max(...ys)) / 2
      });
    }
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        setCanvasSize({
          width: containerRef.current.clientWidth,
          height: containerRef.current.clientHeight
        });
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleFitView = useCallback(() => {
    const allNodes = [...agents, ...humanOperators];
    if (!allNodes.length) return;
    const xs = allNodes.map(a => a.position.x);
    const ys = allNodes.map(a => a.position.y);
    const pad = 200;
    const minX = Math.min(...xs) - pad;
    const maxX = Math.max(...xs) + pad;
    const minY = Math.min(...ys) - pad;
    const maxY = Math.max(...ys) + pad;
    const newZoom = Math.min(
      canvasSize.width / (maxX - minX),
      canvasSize.height / (maxY - minY),
      2
    ) * 0.85;
    animateToView(
      newZoom,
      {
        x: canvasSize.width / 2 - ((minX + maxX) / 2) * newZoom,
        y: canvasSize.height / 2 - ((minY + maxY) / 2) * newZoom
      },
      300
    );
  }, [agents, humanOperators, canvasSize, animateToView]);

  const handleDeleteNode = useCallback((id) => {
    setAgents(p => p.filter(a => a.id !== id));
    setHumanOperators(p => p.filter(h => h.id !== id));
    setConnections(p => p.filter(c => c.from !== id && c.to !== id));
    setSelectedNode(null);
  }, []);

  const handleAddNode = useCallback((type) => {
    const cx = (canvasSize.width / 2 - offset.x) / zoom;
    const cy = (canvasSize.height / 2 - offset.y) / zoom;
    const pos = {
      x: snapToGrid(cx + (Math.random() - 0.5) * 100),
      y: snapToGrid(cy + (Math.random() - 0.5) * 100)
    };
    if (type === 'human') {
      setHumanOperators(p => [...p, { id: `h${Date.now()}`, position: pos, name: 'New Operator' }]);
    } else {
      setAgents(p => [
        ...p,
        {
          id: `a${Date.now()}`,
          type,
          position: pos,
          percentage: [4, 8, 13, 22, 34, 47, 52, 67, 78, 91][Math.floor(Math.random() * 10)]
        }
      ]);
    }
  }, [canvasSize, offset, zoom]);

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key >= '1' && e.key <= '5' && !e.metaKey && !e.ctrlKey) {
        handleAddNode([AGENT_TYPES.WHATSAPP, AGENT_TYPES.OUTBOUND, AGENT_TYPES.INBOUND, AGENT_TYPES.CHAT, 'human'][parseInt(e.key) - 1]);
      }
      if ((e.key === 'Delete' || e.key === 'Backspace') && selectedNode && !trainingModal) {
        handleDeleteNode(selectedNode);
      }
      if (e.key === 'Escape') {
        setSelectedNode(null);
        setAgentHoverId(null);
        setOuterRingHoverId(null);
        setSuggestionHoverAgentId(null);
        setSuggestionPopup(null);
        setTrainingModal(null);
      }
      if (e.key === ' ' && !e.target.matches('input, textarea')) {
        e.preventDefault();
        handleFitView();
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [selectedNode, handleFitView, trainingModal, handleAddNode, handleDeleteNode]);

  const handleMouseDown = useCallback((e) => {
    if (suggestionPopup) {
      setSuggestionPopup(null);
      return;
    }
    if (e.button === 0 && (e.target === svgRef.current || e.target.tagName === 'rect')) {
      setIsPanning(true);
      setPanStart({ x: e.clientX - offset.x, y: e.clientY - offset.y });
      setSelectedNode(null);
    }
  }, [offset, suggestionPopup]);

  const handleMouseMove = useCallback((e) => {
    // Track cursor position for zoom
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setCursorPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    }
    
    if (isPanning) {
      setOffset({ x: e.clientX - panStart.x, y: e.clientY - panStart.y });
      return;
    }
    if (draggedNode) {
      const canvasPos = screenToCanvas(e.clientX, e.clientY);
      setDragPosition(canvasPos);
      if (agents.find(a => a.id === draggedNode)) {
        setAgents(p => p.map(a => a.id === draggedNode ? { ...a, position: canvasPos } : a));
      } else {
        setHumanOperators(p => p.map(h => h.id === draggedNode ? { ...h, position: canvasPos } : h));
      }
    }
  }, [isPanning, panStart, draggedNode, screenToCanvas, agents, setOffset]);

  const handleMouseUp = useCallback(() => {
    setIsPanning(false);
    if (draggedNode && dragPosition) {
      const snapped = { x: snapToGrid(dragPosition.x), y: snapToGrid(dragPosition.y) };
      if (agents.find(a => a.id === draggedNode)) {
        setAgents(p => p.map(a => a.id === draggedNode ? { ...a, position: snapped } : a));
      } else {
        setHumanOperators(p => p.map(h => h.id === draggedNode ? { ...h, position: snapped } : h));
      }
      setDraggedNode(null);
      setDragPosition(null);
    }
  }, [draggedNode, dragPosition, agents]);

  const handleWheel = useCallback((e) => {
    e.preventDefault();
    const rect = svgRef.current?.getBoundingClientRect();
    if (!rect) return;
    let delta = -e.deltaY;
    if (e.deltaMode === 1) delta *= 40; else if (e.deltaMode === 2) delta *= 800;
    zoomAtPoint(zoom * Math.exp(delta * 0.002), e.clientX - rect.left, e.clientY - rect.top);
  }, [zoom, zoomAtPoint]);

  const handleAgentMouseDown = useCallback((e, id) => {
    e.stopPropagation();
    const agent = agents.find(a => a.id === id);
    if (agent) {
      setDraggedNode(id);
      setDragPosition(agent.position);
      setSelectedNode(id);
    }
  }, [agents]);
  
  const handleHumanMouseDown = useCallback((e, id) => {
    e.stopPropagation();
    const human = humanOperators.find(h => h.id === id);
    if (human) {
      setDraggedNode(id);
      setDragPosition(human.position);
      setSelectedNode(id);
    }
  }, [humanOperators]);

  const handleAgentEnter = useCallback((agentId) => {
    if (!draggedNode && !suggestionPopup) {
      setAgentHoverId(agentId);
    }
  }, [draggedNode, suggestionPopup]);

  const handleAgentLeave = useCallback((agentId) => {
    setAgentHoverId(prev => prev === agentId ? null : prev);
  }, []);

  const handleOuterRingEnter = useCallback((agentId) => {
    if (!draggedNode && !suggestionPopup) {
      setOuterRingHoverId(agentId);
    }
  }, [draggedNode, suggestionPopup]);

  const handleOuterRingLeave = useCallback((agentId) => {
    setOuterRingHoverId(prev => {
      if (prev === agentId && suggestionHoverAgentId !== agentId) {
        return null;
      }
      return prev;
    });
  }, [suggestionHoverAgentId]);

  const handleSuggestionHoverChange = useCallback((agentId, isHovered) => {
    if (isHovered) {
      setSuggestionHoverAgentId(agentId);
    } else {
      setSuggestionHoverAgentId(prev => prev === agentId ? null : prev);
    }
  }, []);

  const makeConnectorHandler = useCallback((agentId) => () => {
    const agent = agents.find(a => a.id === agentId);
    if (agent) setTrainingModal(agent);
  }, [agents]);

  const makeABTestHandler = useCallback((agentId) => () => {
    const agent = agents.find(a => a.id === agentId);
    if (agent) {
      const newAgents = [
        {
          id: `a${Date.now()}-a`,
          type: agent.type,
          position: { x: snapToGrid(agent.position.x - 120), y: snapToGrid(agent.position.y + 220) },
          percentage: Math.floor(Math.random() * 50)
        },
        {
          id: `a${Date.now()}-b`,
          type: agent.type,
          position: { x: snapToGrid(agent.position.x + 120), y: snapToGrid(agent.position.y + 220) },
          percentage: Math.floor(Math.random() * 50)
        }
      ];
      setAgents(p => [...p, ...newAgents]);
      setConnections(p => [
        ...p,
        {
          id: `c${Date.now()}-a`,
          from: agentId,
          to: newAgents[0].id,
          flowLevel: FLOW_LEVELS.MEDIUM,
          type: CONNECTION_TYPES.AGENT
        },
        {
          id: `c${Date.now()}-b`,
          from: agentId,
          to: newAgents[1].id,
          flowLevel: FLOW_LEVELS.MEDIUM,
          type: CONNECTION_TYPES.AGENT
        }
      ]);
    }
    setAgentHoverId(null);
  }, [agents]);

  const makeHumanHandler = useCallback((agentId) => () => {
    const agent = agents.find(a => a.id === agentId);
    if (agent) {
      const newId = `h${Date.now()}`;
      setHumanOperators(p => [
        ...p,
        {
          id: newId,
          position: { x: snapToGrid(agent.position.x + 50), y: snapToGrid(agent.position.y + 220) },
          name: 'New Operator'
        }
      ]);
      setConnections(p => [
        ...p,
        { id: `ch${Date.now()}`, from: agentId, to: newId, type: CONNECTION_TYPES.HUMAN }
      ]);
    }
    setAgentHoverId(null);
  }, [agents]);

  const makeSuggestionHandler = useCallback((agentId) => (position) => {
    const agent = agents.find(a => a.id === agentId);
    if (agent) {
      const absPos = { x: agent.position.x + position.x, y: agent.position.y + position.y };
      setSuggestionPopup({ position: absPos, sourceAgentId: agentId });
    }
  }, [agents]);

  const handlePopupSelect = useCallback((type) => {
    if (!suggestionPopup) return;
    const snappedPos = {
      x: snapToGrid(suggestionPopup.position.x),
      y: snapToGrid(suggestionPopup.position.y)
    };
    if (type === 'human') {
      const newId = `h${Date.now()}`;
      setHumanOperators(p => [...p, { id: newId, position: snappedPos, name: 'New Operator' }]);
      if (suggestionPopup.sourceAgentId) {
        setConnections(p => [
          ...p,
          { id: `ch${Date.now()}`, from: suggestionPopup.sourceAgentId, to: newId, type: CONNECTION_TYPES.HUMAN }
        ]);
      }
    } else {
      const newId = `a${Date.now()}`;
      setAgents(p => [
        ...p,
        {
          id: newId,
          type,
          position: snappedPos,
          percentage: [4, 8, 13, 22, 34, 47, 52, 67, 78, 91][Math.floor(Math.random() * 10)]
        }
      ]);
      if (suggestionPopup.sourceAgentId) {
        setConnections(p => [
          ...p,
          {
            id: `c${Date.now()}`,
            from: suggestionPopup.sourceAgentId,
            to: newId,
            flowLevel: FLOW_LEVELS.MEDIUM,
            type: CONNECTION_TYPES.AGENT
          }
        ]);
      }
    }
    setSuggestionPopup(null);
  }, [suggestionPopup]);

  const handleZoomIn = useCallback(() => {
    const newZoom = Math.min(GRID.MAX_ZOOM, zoom * 1.5);
    // Zoom at cursor position if available, otherwise center
    const pivotX = cursorPosition.x || canvasSize.width / 2;
    const pivotY = cursorPosition.y || canvasSize.height / 2;
    zoomAtPoint(newZoom, pivotX, pivotY);
  }, [zoom, cursorPosition, canvasSize, zoomAtPoint]);

  const handleZoomOut = useCallback(() => {
    const newZoom = Math.max(GRID.MIN_ZOOM, zoom / 1.5);
    // Zoom at cursor position if available, otherwise center
    const pivotX = cursorPosition.x || canvasSize.width / 2;
    const pivotY = cursorPosition.y || canvasSize.height / 2;
    zoomAtPoint(newZoom, pivotX, pivotY);
  }, [zoom, cursorPosition, canvasSize, zoomAtPoint]);

  const handleZoomReset = useCallback(() => {
    const cx = canvasSize.width / 2;
    const cy = canvasSize.height / 2;
    animateToView(
      1,
      {
        x: cx - ((cx - offset.x) / zoom),
        y: cy - ((cy - offset.y) / zoom)
      },
      200
    );
  }, [zoom, offset, canvasSize, animateToView]);

  return (
    <div
      ref={containerRef}
      style={{
        width: '100%',
        height: '100vh',
        position: 'relative',
        overflow: 'hidden',
        userSelect: 'none',
        fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
      }}
    >
      <style>{`
        @keyframes flowAnim {
          0% { stroke-dashoffset: 24; }
          100% { stroke-dashoffset: 0; }
        }
        @keyframes popIn {
          0% { transform: translate(-50%, -100%) translateY(-12px) scale(0.9); opacity: 0; }
          100% { transform: translate(-50%, -100%) translateY(-12px) scale(1); opacity: 1; }
        }
        button:hover { filter: brightness(0.97); }
      `}</style>
      
      <div
        style={{
          position: 'absolute',
          top: '16px',
          left: '16px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          zIndex: 10,
          background: 'rgba(255,255,255,0.97)',
          backdropFilter: 'blur(16px)',
          padding: '12px 18px',
          borderRadius: '14px',
          boxShadow: '0 4px 24px rgba(0,0,0,0.1)',
          border: '1px solid rgba(0,0,0,0.06)'
        }}
      >
        <svg width="28" height="28" viewBox="0 0 32 32">
          <defs>
            <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#6366F1" />
              <stop offset="100%" stopColor="#8B5CF6" />
            </linearGradient>
          </defs>
          {[0, 1, 2, 3, 4].map(i => (
            <rect
              key={i}
              x={4 + i * 5.5}
              y={10 + Math.sin(i * 0.9) * 4}
              width="3.5"
              height={12 - Math.abs(Math.sin(i * 0.9) * 6)}
              rx="1.75"
              fill="url(#logoGrad)"
            />
          ))}
        </svg>
        <span style={{ fontWeight: 700, fontSize: '15px', color: '#1F2937', letterSpacing: '-0.02em' }}>
          GetVocal
        </span>
      </div>

      <Toolbar onAdd={handleAddNode} />

      <svg
        ref={svgRef}
        width="100%"
        height="100%"
        style={{ cursor: isPanning ? 'grabbing' : 'grab' }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
      >
        <GridBackground offset={offset} zoom={zoom} />
        
        <g transform={`translate(${offset.x}, ${offset.y}) scale(${zoom})`}>
          {connections.filter(c => c.type === CONNECTION_TYPES.AGENT).map(conn => {
            const fromAgent = agents.find(a => a.id === conn.from);
            const toAgent = agents.find(a => a.id === conn.to);
            if (!fromAgent || !toAgent) return null;
            return (
              <SmoothConnection
                key={conn.id}
                fromAgent={fromAgent}
                toAgent={toAgent}
                flowLevel={conn.flowLevel}
                agentRadius={70}
              />
            );
          })}
          
          {connections.filter(c => c.type === CONNECTION_TYPES.HUMAN).map(conn => {
            const fromAgent = agents.find(a => a.id === conn.from);
            const toHuman = humanOperators.find(h => h.id === conn.to);
            if (!fromAgent || !toHuman) return null;
            return (
              <GradientConnection
                key={conn.id}
                fromPos={fromAgent.position}
                toPos={toHuman.position}
                id={conn.id}
              />
            );
          })}
          
          {agents.map(agent => (
            <AgentNode
              key={agent.id}
              {...agent}
              targetPosition={agent.position}
              isSelected={selectedNode === agent.id}
              isDragging={draggedNode === agent.id}
              showPercentage={showPercentage}
              showActionButtons={agentHoverId === agent.id && canShowActionButtons}
              showSuggestions={outerRingHoverId === agent.id || agentHoverId === agent.id || suggestionHoverAgentId === agent.id}
              onMouseDown={handleAgentMouseDown}
              onAgentEnter={handleAgentEnter}
              onAgentLeave={handleAgentLeave}
              onOuterRingEnter={handleOuterRingEnter}
              onOuterRingLeave={handleOuterRingLeave}
              onSuggestionHoverChange={handleSuggestionHoverChange}
              onDelete={handleDeleteNode}
              onConnectorClick={makeConnectorHandler(agent.id)}
              onABTestClick={makeABTestHandler(agent.id)}
              onHumanClick={makeHumanHandler(agent.id)}
              onSuggestionClick={makeSuggestionHandler(agent.id)}
              existingPositions={allNodePositions}
              connections={connections}
              agents={agents}
              humanOperators={humanOperators}
              suggestionPopupOpen={!!suggestionPopup}
            />
          ))}
          
          {humanOperators.map(human => (
            <HumanOperatorNode
              key={human.id}
              {...human}
              targetPosition={human.position}
              isSelected={selectedNode === human.id}
              isDragging={draggedNode === human.id}
              onMouseDown={handleHumanMouseDown}
              onDelete={handleDeleteNode}
            />
          ))}
        </g>
      </svg>
      
      {suggestionPopup && (
        <SuggestionPopup
          position={suggestionPopup.position}
          zoom={zoom}
          offset={offset}
          onSelect={handlePopupSelect}
          onClose={() => setSuggestionPopup(null)}
        />
      )}
      {trainingModal && (
        <TrainingModal
          agent={trainingModal}
          onClose={() => setTrainingModal(null)}
          onSave={(text) => console.log('Training:', text)}
        />
      )}
      
      <div
        style={{
          position: 'absolute',
          bottom: '16px',
          left: '16px',
          display: 'flex',
          gap: '12px',
          alignItems: 'flex-end',
          zIndex: 10
        }}
      >
        <ZoomControls
          zoom={zoom}
          onZoomIn={handleZoomIn}
          onZoomOut={handleZoomOut}
          onReset={handleZoomReset}
          onFit={handleFitView}
        />
      </div>
      
      <div
        style={{
          position: 'absolute',
          bottom: '16px',
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'rgba(255,255,255,0.97)',
          backdropFilter: 'blur(16px)',
          padding: '10px 20px',
          borderRadius: '12px',
          boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
          zIndex: 10,
          display: 'flex',
          alignItems: 'center',
          gap: '20px',
          fontSize: '12px',
          color: '#6B7280',
          border: '1px solid rgba(0,0,0,0.06)'
        }}
      >
        <span>
          <kbd
            style={{
              background: '#F3F4F6',
              padding: '2px 6px',
              borderRadius: '4px',
              fontSize: '10px',
              fontFamily: 'monospace',
              marginRight: '4px'
            }}
          >
            Scroll
          </kbd>
          Zoom
        </span>
        <span style={{ color: '#D1D5DB' }}>|</span>
        <span style={{ fontWeight: 600, color: '#374151' }}>{agents.length} agents</span>
        <span style={{ fontWeight: 600, color: '#8B5CF6' }}>{humanOperators.length} operators</span>
      </div>
    </div>
  );
}
