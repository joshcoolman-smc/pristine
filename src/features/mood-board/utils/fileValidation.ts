import type { MoodBoardImage } from '../types/MoodBoardImage';

const SUPPORTED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export function validateFile(file: File): boolean {
  if (!SUPPORTED_TYPES.includes(file.type)) {
    return false;
  }
  
  if (file.size > MAX_FILE_SIZE) {
    return false;
  }
  
  return true;
}

export function getImageDimensions(file: File): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);
    
    img.onload = () => {
      URL.revokeObjectURL(objectUrl);
      resolve({ width: img.width, height: img.height });
    };
    
    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error('Failed to load image'));
    };
    
    img.src = objectUrl;
  });
}

export async function createImageFromFile(file: File): Promise<MoodBoardImage> {
  if (!validateFile(file)) {
    throw new Error('Invalid file type');
  }
  
  const dimensions = await getImageDimensions(file);
  const src = URL.createObjectURL(file);
  
  return {
    id: crypto.randomUUID(),
    src,
    originalWidth: dimensions.width,
    originalHeight: dimensions.height,
    gridX: 0,
    gridY: 0,
    file,
    zIndex: 1
  };
}