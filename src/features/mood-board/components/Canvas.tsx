"use client";

import {
  useRef,
  useEffect,
  useCallback,
  type ReactNode,
  cloneElement,
  isValidElement,
} from "react";
import { useCanvas } from "../hooks/useCanvas";

interface CanvasProps {
  children: ReactNode;
  className?: string;
  isEmpty?: boolean;
}

export function Canvas({ children, className, isEmpty = false }: CanvasProps) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const {
    canvasState,
    isSpacePressed,
    zoom,
    pan,
    setPanning,
    setSpacePressed,
  } = useCanvas();

  const handleWheel = useCallback(
    (e: WheelEvent) => {
      e.preventDefault();

      if (!canvasRef.current) return;

      const rect = canvasRef.current.getBoundingClientRect();
      const centerX = e.clientX - rect.left;
      const centerY = e.clientY - rect.top;

      const delta = -e.deltaY * 0.001;
      zoom(delta, centerX, centerY);
    },
    [zoom]
  );

  const handleMouseDown = useCallback(
    (e: MouseEvent) => {
      if (e.button === 0 && isSpacePressed) {
        // Always start panning if space is pressed, regardless of what's underneath
        e.preventDefault();
        e.stopPropagation();
        setPanning(true);
      }
    },
    [isSpacePressed, setPanning]
  );

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!canvasState.isPanning) return;

      e.preventDefault();
      pan(e.movementX, e.movementY);
    },
    [canvasState.isPanning, pan]
  );

  const handleMouseUp = useCallback(
    (e: MouseEvent) => {
      if (e.button === 0 && canvasState.isPanning) {
        e.preventDefault();
        setPanning(false);
      }
    },
    [canvasState.isPanning, setPanning]
  );

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.code === "Space") {
        e.preventDefault();
        setSpacePressed(true);
        if (canvasRef.current) {
          canvasRef.current.style.cursor = "grab";
        }
      }
    },
    [setSpacePressed]
  );

  const handleKeyUp = useCallback(
    (e: KeyboardEvent) => {
      if (e.code === "Space") {
        e.preventDefault();
        setSpacePressed(false);
        if (canvasRef.current) {
          canvasRef.current.style.cursor = "default";
        }
        setPanning(false);
      }
    },
    [setSpacePressed, setPanning]
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Add event listeners
    canvas.addEventListener("wheel", handleWheel, { passive: false });
    canvas.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keyup", handleKeyUp);

    // Focus the canvas to receive keyboard events
    canvas.tabIndex = 0;
    canvas.focus();

    return () => {
      canvas.removeEventListener("wheel", handleWheel);
      canvas.removeEventListener("mousedown", handleMouseDown);
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("keyup", handleKeyUp);
    };
  }, [
    handleWheel,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleKeyDown,
    handleKeyUp,
  ]);

  const transform = `scale(${canvasState.zoom}) translate(${canvasState.panX}px, ${canvasState.panY}px)`;

  // Clone children and inject canvas props
  const enhancedChildren = isValidElement(children)
    ? cloneElement(children, {
        canvasElement: canvasRef.current,
        canvasState: canvasState,
      } as Partial<{ canvasElement: HTMLElement | null; canvasState: typeof canvasState }>)
    : children;

  return (
    <div
      ref={canvasRef}
      className={`relative w-full h-full overflow-hidden bg-neutral-900 ${
        className || ""
      }`}
      style={{
        cursor: canvasState.isPanning ? "grabbing" : "default",
      }}
    >
      <div
        className="absolute inset-0 origin-top-left"
        style={{
          transform,
          transformOrigin: "0 0",
        }}
      >
        {enhancedChildren}
      </div>
    </div>
  );
}
