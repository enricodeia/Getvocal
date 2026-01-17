import { useState, useRef, useEffect } from 'react';

export const useSpringValue = (target, stiffness = 0.15, damping = 0.75) => {
  const valRef = useRef(target);
  const velRef = useRef(0);
  const targetRef = useRef(target);
  const [val, setVal] = useState(target);
  
  useEffect(() => {
    targetRef.current = target;
  }, [target]);
  
  useEffect(() => {
    let frame;
    const animate = () => {
      const diff = targetRef.current - valRef.current;
      velRef.current += diff * stiffness;
      velRef.current *= damping;
      valRef.current += velRef.current;
      if (Math.abs(diff) < 0.001 && Math.abs(velRef.current) < 0.001) {
        valRef.current = targetRef.current;
      }
      setVal(valRef.current);
      frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [stiffness, damping]);
  
  return val;
};
