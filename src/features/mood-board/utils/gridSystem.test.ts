import { describe, it, expect } from 'vitest';
import { snapToGrid, checkCollision, getImageDimensions } from './gridSystem';
import type { MoodBoardImage } from '../types/MoodBoardImage';

describe('snapToGrid', () => {
  it('should snap coordinates to the nearest grid position', () => {
    const result = snapToGrid(125, 175);
    expect(result).toEqual({ gridX: 1, gridY: 1 });
  });

  it('should snap negative coordinates to grid position 0', () => {
    const result = snapToGrid(-50, -25);
    expect(result).toEqual({ gridX: 0, gridY: 0 });
  });

  it('should snap coordinates exactly on grid lines', () => {
    const result = snapToGrid(100, 200);
    expect(result).toEqual({ gridX: 1, gridY: 2 });
  });

  it('should snap large coordinates to appropriate grid positions', () => {
    const result = snapToGrid(850, 1150);
    expect(result).toEqual({ gridX: 8, gridY: 11 });
  });
});

describe('checkCollision', () => {
  const mockImages: MoodBoardImage[] = [
    {
      id: '1',
      src: 'blob:test1',
      originalWidth: 400,
      originalHeight: 300,
      gridX: 0,
      gridY: 0,
      file: new File([''], 'test1.jpg', { type: 'image/jpeg' })
    },
    {
      id: '2',
      src: 'blob:test2',
      originalWidth: 600,
      originalHeight: 400,
      gridX: 2,
      gridY: 1,
      file: new File([''], 'test2.jpg', { type: 'image/jpeg' })
    }
  ];

  it('should detect collision with existing image', () => {
    const result = checkCollision(0, 0, mockImages);
    expect(result).toBe(true);
  });

  it('should not detect collision with empty position', () => {
    const result = checkCollision(5, 5, mockImages);
    expect(result).toBe(false);
  });

  it('should exclude specified image from collision check', () => {
    const result = checkCollision(0, 0, mockImages, '1');
    expect(result).toBe(false);
  });

  it('should detect collision with second image', () => {
    const result = checkCollision(2, 1, mockImages);
    expect(result).toBe(true);
  });

  it('should handle empty image array', () => {
    const result = checkCollision(0, 0, []);
    expect(result).toBe(false);
  });
});

describe('getImageDimensions', () => {
  it('should scale down large images to max width while maintaining aspect ratio', () => {
    const image: MoodBoardImage = {
      id: '1',
      src: 'blob:test',
      originalWidth: 1400,
      originalHeight: 1000,
      gridX: 0,
      gridY: 0,
      file: new File([''], 'test.jpg', { type: 'image/jpeg' })
    };

    const result = getImageDimensions(image);
    expect(result.width).toBe(700);
    expect(result.height).toBe(500);
  });

  it('should keep small images at original size', () => {
    const image: MoodBoardImage = {
      id: '1',
      src: 'blob:test',
      originalWidth: 400,
      originalHeight: 300,
      gridX: 0,
      gridY: 0,
      file: new File([''], 'test.jpg', { type: 'image/jpeg' })
    };

    const result = getImageDimensions(image);
    expect(result.width).toBe(400);
    expect(result.height).toBe(300);
  });

  it('should handle images exactly at max width', () => {
    const image: MoodBoardImage = {
      id: '1',
      src: 'blob:test',
      originalWidth: 700,
      originalHeight: 500,
      gridX: 0,
      gridY: 0,
      file: new File([''], 'test.jpg', { type: 'image/jpeg' })
    };

    const result = getImageDimensions(image);
    expect(result.width).toBe(700);
    expect(result.height).toBe(500);
  });

  it('should handle very tall images', () => {
    const image: MoodBoardImage = {
      id: '1',
      src: 'blob:test',
      originalWidth: 1400,
      originalHeight: 2800,
      gridX: 0,
      gridY: 0,
      file: new File([''], 'test.jpg', { type: 'image/jpeg' })
    };

    const result = getImageDimensions(image);
    expect(result.width).toBe(700);
    expect(result.height).toBe(1400);
  });
});