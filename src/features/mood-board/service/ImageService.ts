import type { MoodBoardImage } from '../types/MoodBoardImage';
import { createImageFromFile } from '../utils/fileValidation';

export class ImageService {
  static async addImages(files: File[]): Promise<MoodBoardImage[]> {
    const results: MoodBoardImage[] = [];
    
    for (const file of files) {
      try {
        const image = await createImageFromFile(file);
        results.push(image);
      } catch {
        // Skip invalid files
        continue;
      }
    }
    
    return results;
  }

  static updateImagePosition(
    id: string,
    x: number,
    y: number,
    images: MoodBoardImage[]
  ): MoodBoardImage[] {
    const imageIndex = images.findIndex(img => img.id === id);
    
    if (imageIndex === -1) {
      return images;
    }
    
    const currentImage = images[imageIndex];
    
    // Update position - no constraints, just move it
    const updatedImages = [...images];
    updatedImages[imageIndex] = {
      ...currentImage,
      gridX: x,
      gridY: y
    };
    
    return updatedImages;
  }

  static removeImage(id: string, images: MoodBoardImage[]): MoodBoardImage[] {
    const imageToRemove = images.find(img => img.id === id);
    
    if (imageToRemove) {
      // Clean up object URL
      URL.revokeObjectURL(imageToRemove.src);
    }
    
    return images.filter(img => img.id !== id);
  }

  static findNextAvailablePosition(images: MoodBoardImage[]): { gridX: number; gridY: number } {
    if (images.length === 0) {
      return { gridX: 50, gridY: 50 }; // Start with some padding from edges
    }
    
    // Simple flow layout - place images in rows like photos on a table
    const imagesPerRow = 3; // Fewer per row for better spacing
    const currentRow = Math.floor(images.length / imagesPerRow);
    const currentCol = images.length % imagesPerRow;
    
    // Simple spacing - don't overthink it
    const xSpacing = 400; // Reasonable spacing for most images
    const ySpacing = 300; // Reasonable spacing for most images
    
    return {
      gridX: 50 + (currentCol * xSpacing),
      gridY: 50 + (currentRow * ySpacing)
    };
  }

  static selectImage(id: string, images: MoodBoardImage[]): MoodBoardImage[] {
    const imageIndex = images.findIndex(img => img.id === id);
    
    if (imageIndex === -1) {
      return images;
    }
    
    // Find the highest z-index
    const maxZIndex = Math.max(...images.map(img => img.zIndex));
    
    // Bring selected image to front
    const updatedImages = [...images];
    updatedImages[imageIndex] = {
      ...updatedImages[imageIndex],
      zIndex: maxZIndex + 1
    };
    
    return updatedImages;
  }

}