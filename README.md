# GetVocal - Agent Canvas Platform

A scalable React application for visualizing and managing agent networks with interactive canvas functionality.

## Project Structure

```
Getvocal/
├── src/
│   ├── components/          # React components
│   │   ├── AgentCanvas.jsx  # Main canvas component
│   │   ├── AgentNode.jsx
│   │   ├── HumanOperatorNode.jsx
│   │   ├── SmoothConnection.jsx
│   │   ├── GradientConnection.jsx
│   │   ├── GridBackground.jsx
│   │   ├── Toolbar.jsx
│   │   ├── ZoomControls.jsx
│   │   ├── SuggestionPopup.jsx
│   │   ├── SuggestionRing.jsx
│   │   ├── SuggestionNode.jsx
│   │   ├── ActionButtonsSVG.jsx
│   │   ├── TrainingModal.jsx
│   │   ├── BotIcon.jsx
│   │   ├── HexagonShape.jsx
│   │   └── InwardPulseWaves.jsx
│   ├── hooks/               # Custom React hooks
│   │   ├── useSpringPosition.js
│   │   ├── useSpringValue.js
│   │   └── useCanvasTransform.js
│   ├── utils/               # Utility functions
│   │   └── index.js
│   ├── constants/           # Constants and configuration
│   │   └── index.js
│   ├── App.jsx              # Root component
│   ├── main.jsx             # Entry point
│   └── index.css            # Global styles
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

## Features

- Interactive canvas with pan and zoom
- Agent nodes with different types (WhatsApp, Outbound, Inbound, Chat)
- Human operator nodes
- Connection visualization between nodes
- Suggestion system for adding new nodes
- A/B testing functionality
- Training modal for agents
- Spring-based animations
- Grid snapping

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

### Build

```bash
npm run build
```

### Preview

```bash
npm run preview
```

## Keyboard Shortcuts

- `1-5`: Add different node types
- `Delete/Backspace`: Delete selected node
- `Escape`: Clear selection and close modals
- `Space`: Fit view to all nodes
- `Scroll`: Zoom in/out

## Architecture

The application follows a scalable architecture with:

- **Component-based structure**: Each UI element is a separate, reusable component
- **Custom hooks**: Reusable logic for spring animations and canvas transforms
- **Constants**: Centralized configuration and constants
- **Utilities**: Pure functions for calculations and helpers
- **Separation of concerns**: Clear boundaries between UI, logic, and data

## Technologies

- React 18
- Vite
- SVG for graphics
- CSS-in-JS for styling
