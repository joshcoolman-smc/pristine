'use client'

import { useState, useCallback } from 'react';
import type { CanvasState } from '../types/CanvasState';
import { applyZoom } from '../utils/canvasTransform';

interface UseCanvasReturn {
  canvasState: CanvasState;
  isSpacePressed: boolean;
  zoom: (delta: number, centerX: number, centerY: number) => void;
  pan: (deltaX: number, deltaY: number) => void;
  setPanning: (isPanning: boolean) => void;
  setSpacePressed: (isPressed: boolean) => void;
  resetZoom: () => void;
}

const defaultCanvasState: CanvasState = {
  zoom: 1,
  panX: 0,
  panY: 0,
  isPanning: false
};

export function useCanvas(): UseCanvasReturn {
  const [canvasState, setCanvasState] = useState<CanvasState>(defaultCanvasState);
  const [isSpacePressed, setIsSpacePressed] = useState(false);

  const zoom = useCallback((delta: number, centerX: number, centerY: number) => {
    setCanvasState(prevState => {
      const newState = applyZoom(prevState.zoom, delta, centerX, centerY);
      return {
        ...newState,
        panX: newState.panX + prevState.panX,
        panY: newState.panY + prevState.panY,
        isPanning: prevState.isPanning
      };
    });
  }, []);

  const pan = useCallback((deltaX: number, deltaY: number) => {
    setCanvasState(prevState => ({
      ...prevState,
      panX: prevState.panX + deltaX,
      panY: prevState.panY + deltaY
    }));
  }, []);

  const setPanning = useCallback((isPanning: boolean) => {
    setCanvasState(prevState => ({
      ...prevState,
      isPanning
    }));
  }, []);

  const setSpacePressed = useCallback((isPressed: boolean) => {
    setIsSpacePressed(isPressed);
  }, []);

  const resetZoom = useCallback(() => {
    setCanvasState(defaultCanvasState);
  }, []);

  return {
    canvasState,
    isSpacePressed,
    zoom,
    pan,
    setPanning,
    setSpacePressed,
    resetZoom
  };
}