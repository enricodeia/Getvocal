import { useState, useRef, useEffect } from 'react';

export const useSpringPosition = (targetX, targetY, stiffness = 0.12, damping = 0.7) => {
  const posRef = useRef({ x: targetX, y: targetY });
  const velRef = useRef({ x: 0, y: 0 });
  const targetRef = useRef({ x: targetX, y: targetY });
  const [pos, setPos] = useState({ x: targetX, y: targetY });
  
  useEffect(() => {
    targetRef.current = { x: targetX, y: targetY };
  }, [targetX, targetY]);
  
  useEffect(() => {
    let animFrame;
    const animate = () => {
      const dx = targetRef.current.x - posRef.current.x;
      const dy = targetRef.current.y - posRef.current.y;
      velRef.current.x += dx * stiffness;
      velRef.current.y += dy * stiffness;
      velRef.current.x *= damping;
      velRef.current.y *= damping;
      posRef.current.x += velRef.current.x;
      posRef.current.y += velRef.current.y;
      if (Math.abs(dx) < 0.5 && Math.abs(dy) < 0.5 && Math.abs(velRef.current.x) < 0.5 && Math.abs(velRef.current.y) < 0.5) {
        posRef.current = { ...targetRef.current };
      }
      setPos({ x: posRef.current.x, y: posRef.current.y });
      animFrame = requestAnimationFrame(animate);
    };
    animFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animFrame);
  }, [stiffness, damping]);
  
  return pos;
};
