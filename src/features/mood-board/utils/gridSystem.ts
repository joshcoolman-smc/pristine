import type { MoodBoardImage } from '../types/MoodBoardImage';

const GRID_SIZE = 100; // Base grid size for snapping
const MAX_WIDTH = 700; // Maximum width for images

export function snapToGrid(x: number, y: number): { gridX: number; gridY: number } {
  const gridX = Math.max(0, Math.floor(x / GRID_SIZE));
  const gridY = Math.max(0, Math.floor(y / GRID_SIZE));
  
  return { gridX, gridY };
}

export function checkCollision(
  gridX: number,
  gridY: number,
  images: MoodBoardImage[],
  excludeId?: string
): boolean {
  return images.some(image => {
    if (excludeId && image.id === excludeId) {
      return false;
    }
    return image.gridX === gridX && image.gridY === gridY;
  });
}

export function getImageDimensions(image: MoodBoardImage): { width: number; height: number } {
  const { originalWidth, originalHeight } = image;
  
  if (originalWidth <= MAX_WIDTH) {
    return { width: originalWidth, height: originalHeight };
  }
  
  const scale = MAX_WIDTH / originalWidth;
  return {
    width: MAX_WIDTH,
    height: Math.round(originalHeight * scale)
  };
}