import { describe, it, expect } from 'vitest';
import { screenToCanvas, canvasToScreen, applyZoom } from './canvasTransform';
import type { CanvasState } from '../types/CanvasState';

describe('screenToCanvas', () => {
  const mockCanvasElement = {
    getBoundingClientRect: () => ({
      left: 0,
      top: 0,
      width: 800,
      height: 600
    })
  } as HTMLElement;

  it('should convert screen coordinates to canvas coordinates with no zoom or pan', () => {
    const canvasState: CanvasState = {
      zoom: 1,
      panX: 0,
      panY: 0,
      isPanning: false
    };

    const result = screenToCanvas(100, 150, mockCanvasElement, canvasState);
    expect(result).toEqual({ x: 100, y: 150 });
  });

  it('should convert screen coordinates with zoom applied', () => {
    const canvasState: CanvasState = {
      zoom: 2,
      panX: 0,
      panY: 0,
      isPanning: false
    };

    const result = screenToCanvas(100, 150, mockCanvasElement, canvasState);
    expect(result).toEqual({ x: 50, y: 75 });
  });

  it('should convert screen coordinates with pan applied', () => {
    const canvasState: CanvasState = {
      zoom: 1,
      panX: 50,
      panY: 75,
      isPanning: false
    };

    const result = screenToCanvas(100, 150, mockCanvasElement, canvasState);
    expect(result).toEqual({ x: 50, y: 75 });
  });

  it('should convert screen coordinates with both zoom and pan applied', () => {
    const canvasState: CanvasState = {
      zoom: 2,
      panX: 50,
      panY: 75,
      isPanning: false
    };

    const result = screenToCanvas(100, 150, mockCanvasElement, canvasState);
    expect(result).toEqual({ x: 25, y: 37.5 });
  });

  it('should handle zoom less than 1', () => {
    const canvasState: CanvasState = {
      zoom: 0.5,
      panX: 0,
      panY: 0,
      isPanning: false
    };

    const result = screenToCanvas(100, 150, mockCanvasElement, canvasState);
    expect(result).toEqual({ x: 200, y: 300 });
  });
});

describe('canvasToScreen', () => {
  it('should convert canvas coordinates to screen coordinates with no zoom or pan', () => {
    const canvasState: CanvasState = {
      zoom: 1,
      panX: 0,
      panY: 0,
      isPanning: false
    };

    const result = canvasToScreen(100, 150, canvasState);
    expect(result).toEqual({ x: 100, y: 150 });
  });

  it('should convert canvas coordinates with zoom applied', () => {
    const canvasState: CanvasState = {
      zoom: 2,
      panX: 0,
      panY: 0,
      isPanning: false
    };

    const result = canvasToScreen(100, 150, canvasState);
    expect(result).toEqual({ x: 200, y: 300 });
  });

  it('should convert canvas coordinates with pan applied', () => {
    const canvasState: CanvasState = {
      zoom: 1,
      panX: 50,
      panY: 75,
      isPanning: false
    };

    const result = canvasToScreen(100, 150, canvasState);
    expect(result).toEqual({ x: 150, y: 225 });
  });

  it('should convert canvas coordinates with both zoom and pan applied', () => {
    const canvasState: CanvasState = {
      zoom: 2,
      panX: 50,
      panY: 75,
      isPanning: false
    };

    const result = canvasToScreen(100, 150, canvasState);
    expect(result).toEqual({ x: 250, y: 375 });
  });
});

describe('applyZoom', () => {
  it('should zoom in from center point', () => {
    const result = applyZoom(1, 0.1, 400, 300);
    
    expect(result.zoom).toBeCloseTo(1.1);
    expect(result.panX).toBeCloseTo(-40);
    expect(result.panY).toBeCloseTo(-30);
  });

  it('should zoom out from center point', () => {
    const result = applyZoom(1, -0.1, 400, 300);
    
    expect(result.zoom).toBeCloseTo(0.9);
    expect(result.panX).toBeCloseTo(40);
    expect(result.panY).toBeCloseTo(30);
  });

  it('should maintain existing pan offset during zoom', () => {
    const result = applyZoom(1, 0.1, 400, 300);
    
    expect(result.panX).toBeCloseTo(-40);
    expect(result.panY).toBeCloseTo(-30);
  });

  it('should clamp zoom to minimum value', () => {
    const result = applyZoom(0.1, -0.2, 400, 300);
    
    expect(result.zoom).toBe(0.1);
  });

  it('should clamp zoom to maximum value', () => {
    const result = applyZoom(5, 1, 400, 300);
    
    expect(result.zoom).toBe(5);
  });

  it('should handle zero delta', () => {
    const result = applyZoom(1, 0, 400, 300);
    
    expect(result.zoom).toBe(1);
    expect(result.panX).toBe(0);
    expect(result.panY).toBe(0);
  });

  it('should preserve isPanning state', () => {
    const result = applyZoom(1, 0.1, 400, 300);
    
    expect(result.isPanning).toBe(false);
  });
});