import { useState, useRef, useCallback } from 'react';
import { GRID } from '../constants';

export const useCanvasTransform = (initialZoom = 1, initialOffset = { x: 0, y: 0 }) => {
  const [zoom, setZoom] = useState(initialZoom);
  const [offset, setOffset] = useState(initialOffset);
  const animationRef = useRef(null);
  
  const zoomAtPoint = useCallback((newZoom, pivotX, pivotY) => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
    const clampedZoom = Math.max(GRID.MIN_ZOOM, Math.min(GRID.MAX_ZOOM, newZoom));
    setZoom(prevZoom => {
      setOffset(prevOffset => {
        const canvasX = (pivotX - prevOffset.x) / prevZoom;
        const canvasY = (pivotY - prevOffset.y) / prevZoom;
        return {
          x: pivotX - canvasX * clampedZoom,
          y: pivotY - canvasY * clampedZoom
        };
      });
      return clampedZoom;
    });
  }, []);
  
  const animateToView = useCallback((targetZoom, targetOffset, duration = 300) => {
    if (animationRef.current) cancelAnimationFrame(animationRef.current);
    const startTime = performance.now();
    let startZoom, startOffset;
    setZoom(z => {
      startZoom = z;
      return z;
    });
    setOffset(o => {
      startOffset = { ...o };
      return o;
    });
    const animate = (currentTime) => {
      const progress = Math.min((currentTime - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setZoom(startZoom + (targetZoom - startZoom) * eased);
      setOffset({
        x: startOffset.x + (targetOffset.x - startOffset.x) * eased,
        y: startOffset.y + (targetOffset.y - startOffset.y) * eased
      });
      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        animationRef.current = null;
      }
    };
    requestAnimationFrame(() => {
      animationRef.current = requestAnimationFrame(animate);
    });
  }, []);
  
  const setOffsetDirect = useCallback((newOffset) => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
    setOffset(newOffset);
  }, []);
  
  return { zoom, offset, zoomAtPoint, animateToView, setOffset: setOffsetDirect };
};
