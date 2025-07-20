'use client'

import { useState, useCallback, useEffect, type MouseEvent } from 'react';
import { X } from 'lucide-react';
import type { MoodBoardImage } from '../types/MoodBoardImage';
import type { CanvasState } from '../types/CanvasState';
import { getImageDimensions } from '../utils/gridSystem';
import { screenToCanvas } from '../utils/canvasTransform';

interface ImageGridProps {
  images: MoodBoardImage[];
  onImageMove: (id: string, x: number, y: number) => void;
  onImageRemove: (id: string) => void;
  onImageSelect: (id: string) => void;
  isSpacePressed: boolean;
  canvasElement?: HTMLElement | null;
  canvasState?: CanvasState;
}

interface DragState {
  isDragging: boolean;
  imageId: string | null;
  offsetX: number;
  offsetY: number;
}

export function ImageGrid({ 
  images, 
  onImageMove, 
  onImageRemove,
  onImageSelect,
  isSpacePressed,
  canvasElement,
  canvasState
}: ImageGridProps) {
  const [dragState, setDragState] = useState<DragState>({
    isDragging: false,
    imageId: null,
    offsetX: 0,
    offsetY: 0
  });

  const handleMouseDown = useCallback((e: MouseEvent, image: MoodBoardImage) => {
    // If space is pressed, let canvas handle panning
    if (isSpacePressed || !canvasElement || !canvasState) {
      return;
    }
    
    e.preventDefault();
    e.stopPropagation();
    
    // Select the image (bring to front)
    onImageSelect(image.id);
    
    // Convert mouse position to canvas coordinates
    const mouseCanvasPos = screenToCanvas(e.clientX, e.clientY, canvasElement, canvasState);
    
    // Calculate offset from mouse to image's top-left corner in canvas coordinates
    const offsetX = mouseCanvasPos.x - image.gridX;
    const offsetY = mouseCanvasPos.y - image.gridY;
    
    setDragState({
      isDragging: true,
      imageId: image.id,
      offsetX,
      offsetY
    });
  }, [isSpacePressed, onImageSelect, canvasElement, canvasState]);

  const handleGlobalMouseMove = useCallback((e: globalThis.MouseEvent) => {
    if (!dragState.isDragging || !dragState.imageId || !canvasElement || !canvasState) return;
    
    // Convert mouse position to canvas coordinates
    const mouseCanvasPos = screenToCanvas(e.clientX, e.clientY, canvasElement, canvasState);
    
    // Calculate new position by subtracting the offset (no restrictions - infinite canvas)
    const newX = mouseCanvasPos.x - dragState.offsetX;
    const newY = mouseCanvasPos.y - dragState.offsetY;
    
    // Update position immediately for smooth dragging
    onImageMove(dragState.imageId, newX, newY);
  }, [dragState.isDragging, dragState.imageId, dragState.offsetX, dragState.offsetY, onImageMove, canvasElement, canvasState]);

  const handleGlobalMouseUp = useCallback(() => {
    if (!dragState.isDragging) return;
    
    // Reset drag state
    setDragState({
      isDragging: false,
      imageId: null,
      offsetX: 0,
      offsetY: 0
    });
  }, [dragState.isDragging]);

  // Add document-level event listeners for dragging
  useEffect(() => {
    if (dragState.isDragging) {
      document.addEventListener('mousemove', handleGlobalMouseMove);
      document.addEventListener('mouseup', handleGlobalMouseUp);
      
      return () => {
        document.removeEventListener('mousemove', handleGlobalMouseMove);
        document.removeEventListener('mouseup', handleGlobalMouseUp);
      };
    }
  }, [dragState.isDragging, handleGlobalMouseMove, handleGlobalMouseUp]);

  const handleRemoveImage = useCallback((e: MouseEvent, imageId: string) => {
    e.preventDefault();
    e.stopPropagation();
    onImageRemove(imageId);
  }, [onImageRemove]);

  return (
    <div className="relative w-full h-full">
      {images.map(image => {
        const dimensions = getImageDimensions(image);
        const pixelX = image.gridX;
        const pixelY = image.gridY;
        
        return (
          <div
            key={image.id}
            className={`absolute group cursor-move transition-transform ${
              dragState.isDragging && dragState.imageId === image.id
                ? 'scale-105 shadow-lg'
                : 'hover:scale-105 hover:shadow-md'
            }`}
            style={{
              left: pixelX,
              top: pixelY,
              width: dimensions.width,
              height: dimensions.height,
              zIndex: image.zIndex
            }}
            onMouseDown={(e) => handleMouseDown(e, image)}
          >
            <img
              src={image.src}
              alt={image.file.name}
              className="w-full h-full object-cover rounded-lg shadow-sm"
              draggable={false}
            />
            
            {/* Remove button */}
            <button
              onClick={(e) => handleRemoveImage(e, image.id)}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 z-20"
              aria-label="Remove image"
            >
              <X className="w-4 h-4" />
            </button>
            
          </div>
        );
      })}
      
    </div>
  );
}