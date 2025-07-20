'use client'

import { useState, useCallback } from 'react';
import type { MoodBoardImage } from '../types/MoodBoardImage';
import { ImageService } from '../service/ImageService';

interface UseImagesReturn {
  images: MoodBoardImage[];
  addImages: (files: File[]) => Promise<void>;
  updateImagePosition: (id: string, gridX: number, gridY: number) => void;
  removeImage: (id: string) => void;
  selectImage: (id: string) => void;
  error: string | null;
  isLoading: boolean;
}

export function useImages(): UseImagesReturn {
  const [images, setImages] = useState<MoodBoardImage[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const addImages = useCallback(async (files: File[]) => {
    setIsLoading(true);
    setError(null);

    try {
      const newImages = await ImageService.addImages(files);
      
      // Position new images at next available positions
      const positionedImages = newImages.map((image, index) => {
        const currentImages = [...images, ...newImages.slice(0, index)];
        const position = ImageService.findNextAvailablePosition(currentImages);
        return {
          ...image,
          gridX: position.gridX,
          gridY: position.gridY
        };
      });

      setImages(prevImages => [...prevImages, ...positionedImages]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add images');
    } finally {
      setIsLoading(false);
    }
  }, [images]);

  const updateImagePosition = useCallback((id: string, gridX: number, gridY: number) => {
    setImages(prevImages => ImageService.updateImagePosition(id, gridX, gridY, prevImages));
  }, []);

  const removeImage = useCallback((id: string) => {
    setImages(prevImages => ImageService.removeImage(id, prevImages));
  }, []);

  const selectImage = useCallback((id: string) => {
    setImages(prevImages => ImageService.selectImage(id, prevImages));
  }, []);

  return {
    images,
    addImages,
    updateImagePosition,
    removeImage,
    selectImage,
    error,
    isLoading
  };
}