import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useCanvas } from './useCanvas';

// Mock the canvas transform utils
vi.mock('../utils/canvasTransform', () => ({
  applyZoom: vi.fn()
}));

const mockCanvasTransform = vi.mocked(await import('../utils/canvasTransform'));

describe('useCanvas', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should initialize with default canvas state', () => {
    const { result } = renderHook(() => useCanvas());
    
    expect(result.current.canvasState).toEqual({
      zoom: 1,
      panX: 0,
      panY: 0,
      isPanning: false
    });
  });

  it('should zoom in/out using applyZoom utility', () => {
    const mockNewState = {
      zoom: 1.1,
      panX: -40,
      panY: -30,
      isPanning: false
    };

    mockCanvasTransform.applyZoom.mockReturnValue(mockNewState);

    const { result } = renderHook(() => useCanvas());
    
    act(() => {
      result.current.zoom(0.1, 400, 300);
    });

    expect(mockCanvasTransform.applyZoom).toHaveBeenCalledWith(1, 0.1, 400, 300);
    expect(result.current.canvasState).toEqual(mockNewState);
  });

  it('should handle zoom out with negative delta', () => {
    const mockNewState = {
      zoom: 0.9,
      panX: 40,
      panY: 30,
      isPanning: false
    };

    mockCanvasTransform.applyZoom.mockReturnValue(mockNewState);

    const { result } = renderHook(() => useCanvas());
    
    act(() => {
      result.current.zoom(-0.1, 400, 300);
    });

    expect(mockCanvasTransform.applyZoom).toHaveBeenCalledWith(1, -0.1, 400, 300);
    expect(result.current.canvasState).toEqual(mockNewState);
  });

  it('should update pan position', () => {
    const { result } = renderHook(() => useCanvas());
    
    act(() => {
      result.current.pan(50, 75);
    });

    expect(result.current.canvasState.panX).toBe(50);
    expect(result.current.canvasState.panY).toBe(75);
  });

  it('should accumulate pan deltas', () => {
    const { result } = renderHook(() => useCanvas());
    
    act(() => {
      result.current.pan(50, 75);
    });

    act(() => {
      result.current.pan(25, 10);
    });

    expect(result.current.canvasState.panX).toBe(75);
    expect(result.current.canvasState.panY).toBe(85);
  });

  it('should handle negative pan deltas', () => {
    const { result } = renderHook(() => useCanvas());
    
    // First pan to a positive position
    act(() => {
      result.current.pan(100, 100);
    });

    // Then pan back with negative deltas
    act(() => {
      result.current.pan(-50, -75);
    });

    expect(result.current.canvasState.panX).toBe(50);
    expect(result.current.canvasState.panY).toBe(25);
  });

  it('should set panning state', () => {
    const { result } = renderHook(() => useCanvas());
    
    act(() => {
      result.current.setPanning(true);
    });

    expect(result.current.canvasState.isPanning).toBe(true);

    act(() => {
      result.current.setPanning(false);
    });

    expect(result.current.canvasState.isPanning).toBe(false);
  });

  it('should reset zoom and pan to default values', () => {
    const { result } = renderHook(() => useCanvas());
    
    // First, modify the state
    act(() => {
      result.current.zoom(0.5, 400, 300);
      result.current.pan(100, 200);
      result.current.setPanning(true);
    });

    // Then reset
    act(() => {
      result.current.resetZoom();
    });

    expect(result.current.canvasState).toEqual({
      zoom: 1,
      panX: 0,
      panY: 0,
      isPanning: false
    });
  });

  it('should maintain zoom level when panning', () => {
    const mockZoomState = {
      zoom: 1.5,
      panX: -100,
      panY: -50,
      isPanning: false
    };

    mockCanvasTransform.applyZoom.mockReturnValue(mockZoomState);

    const { result } = renderHook(() => useCanvas());
    
    // First zoom
    act(() => {
      result.current.zoom(0.5, 400, 300);
    });

    // Then pan
    act(() => {
      result.current.pan(25, 30);
    });

    expect(result.current.canvasState.zoom).toBe(1.5);
    expect(result.current.canvasState.panX).toBe(-75); // -100 + 25
    expect(result.current.canvasState.panY).toBe(-20); // -50 + 30
  });

  it('should handle zero zoom delta', () => {
    mockCanvasTransform.applyZoom.mockReturnValue({
      zoom: 1,
      panX: 0,
      panY: 0,
      isPanning: false
    });

    const { result } = renderHook(() => useCanvas());
    
    act(() => {
      result.current.zoom(0, 400, 300);
    });

    expect(mockCanvasTransform.applyZoom).toHaveBeenCalledWith(1, 0, 400, 300);
  });

  it('should handle zero pan deltas', () => {
    const { result } = renderHook(() => useCanvas());
    
    act(() => {
      result.current.pan(0, 0);
    });

    expect(result.current.canvasState.panX).toBe(0);
    expect(result.current.canvasState.panY).toBe(0);
  });

  it('should preserve isPanning state during zoom', () => {
    const mockZoomState = {
      zoom: 1.2,
      panX: -50,
      panY: -25,
      isPanning: false
    };

    mockCanvasTransform.applyZoom.mockReturnValue(mockZoomState);

    const { result } = renderHook(() => useCanvas());
    
    // Set panning to true
    act(() => {
      result.current.setPanning(true);
    });

    // Zoom should preserve the current isPanning state
    act(() => {
      result.current.zoom(0.2, 400, 300);
    });

    expect(result.current.canvasState.isPanning).toBe(true);
  });

  it('should handle concurrent state updates', () => {
    const mockZoomState = {
      zoom: 1.5,
      panX: -60,
      panY: -45,
      isPanning: false
    };

    mockCanvasTransform.applyZoom.mockReturnValue(mockZoomState);

    const { result } = renderHook(() => useCanvas());
    
    act(() => {
      result.current.zoom(0.5, 400, 300);
      result.current.pan(10, 15);
      result.current.setPanning(true);
    });

    expect(result.current.canvasState.zoom).toBe(1.5);
    expect(result.current.canvasState.panX).toBe(-50); // -60 + 10
    expect(result.current.canvasState.panY).toBe(-30); // -45 + 15
    expect(result.current.canvasState.isPanning).toBe(true);
  });
});