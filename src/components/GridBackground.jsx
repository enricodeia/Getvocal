import React from 'react';
import { GRID } from '../constants';

export const GridBackground = React.memo(({ offset, zoom }) => {
  const scaledCellSize = GRID.CELL_SIZE * zoom;
  const cellOffsetX = offset.x % scaledCellSize;
  const cellOffsetY = offset.y % scaledCellSize;
  const gridOpacity = Math.min(0.15, 0.08 + zoom * 0.05);
  
  return (
    <>
      <defs>
        <pattern
          id="mainGrid"
          width={scaledCellSize}
          height={scaledCellSize}
          patternUnits="userSpaceOnUse"
          x={cellOffsetX}
          y={cellOffsetY}
        >
          <circle
            cx={scaledCellSize / 2}
            cy={scaledCellSize / 2}
            r={Math.max(2, 3 * zoom)}
            fill={`rgba(148, 163, 184, ${gridOpacity * 1.5})`}
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="#FAFBFC" />
      <rect width="100%" height="100%" fill="url(#mainGrid)" />
    </>
  );
});

GridBackground.displayName = 'GridBackground';
