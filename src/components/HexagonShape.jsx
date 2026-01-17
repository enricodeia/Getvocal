import React from 'react';

export const HexagonShape = React.memo(({ size = 160, strokeColor = '#A78BFA', strokeWidth = 2.5, fill = 'white' }) => {
  const w = size;
  const h = size * 0.9;
  const notchW = 16;
  const notchH = 12;
  const hw = w / 2;
  const hh = h / 2;
  
  return (
    <path
      d={`M ${-notchW} ${-hh} L ${-notchW} ${-hh - notchH} Q ${-notchW + 4} ${-hh - notchH - 6} ${0} ${-hh - notchH - 6} Q ${notchW - 4} ${-hh - notchH - 6} ${notchW} ${-hh - notchH} L ${notchW} ${-hh} L ${hw - 20} ${-hh} Q ${hw} ${-hh} ${hw} ${-hh + 20} L ${hw} ${hh - 20} Q ${hw} ${hh} ${hw - 20} ${hh} L ${-hw + 20} ${hh} Q ${-hw} ${hh} ${-hw} ${hh - 20} L ${-hw} ${-hh + 20} Q ${-hw} ${-hh} ${-hw + 20} ${-hh} L ${-notchW} ${-hh} Z`}
      fill={fill}
      stroke={strokeColor}
      strokeWidth={strokeWidth}
    />
  );
});

HexagonShape.displayName = 'HexagonShape';
