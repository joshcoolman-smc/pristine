import type { CanvasState } from '../types/CanvasState';

const MIN_ZOOM = 0.1;
const MAX_ZOOM = 5;

export function screenToCanvas(
  screenX: number,
  screenY: number,
  canvasElement: HTMLElement,
  canvasState: CanvasState
): { x: number; y: number } {
  const { zoom, panX, panY } = canvasState;
  
  // Get canvas element position
  const rect = canvasElement.getBoundingClientRect();
  
  // Convert screen coordinates to canvas element coordinates
  const canvasElementX = screenX - rect.left;
  const canvasElementY = screenY - rect.top;
  
  // Account for zoom and pan to get canvas space coordinates
  const x = (canvasElementX - panX) / zoom;
  const y = (canvasElementY - panY) / zoom;
  
  return { x, y };
}

export function canvasToScreen(
  canvasX: number,
  canvasY: number,
  canvasState: CanvasState
): { x: number; y: number } {
  const { zoom, panX, panY } = canvasState;
  
  const x = canvasX * zoom + panX;
  const y = canvasY * zoom + panY;
  
  return { x, y };
}

export function applyZoom(
  currentZoom: number,
  delta: number,
  centerX: number,
  centerY: number
): CanvasState {
  const newZoom = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, currentZoom + delta));
  
  if (newZoom === currentZoom) {
    return {
      zoom: currentZoom,
      panX: 0,
      panY: 0,
      isPanning: false
    };
  }
  
  // Calculate pan offset to keep zoom centered on the specified point
  const zoomFactor = newZoom / currentZoom;
  const panX = centerX - (centerX * zoomFactor);
  const panY = centerY - (centerY * zoomFactor);
  
  return {
    zoom: newZoom,
    panX,
    panY,
    isPanning: false
  };
}