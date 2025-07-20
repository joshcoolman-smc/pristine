import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ImageService } from './ImageService';
import type { MoodBoardImage } from '../types/MoodBoardImage';

describe('ImageService', () => {
  beforeEach(() => {
    // Mock all required globals
    vi.stubGlobal('Image', class {
      onload: ((this: HTMLImageElement, ev: Event) => void) | null = null;
      onerror: ((this: HTMLImageElement, ev: Event) => void) | null = null;
      src: string = '';
      width: number = 0;
      height: number = 0;

      constructor() {
        setTimeout(() => {
          this.width = 800;
          this.height = 600;
          if (this.onload) {
            this.onload.call(this, new Event('load'));
          }
        }, 0);
      }
    } as unknown as typeof Image);

    vi.stubGlobal('URL', {
      createObjectURL: vi.fn(() => 'blob:test'),
      revokeObjectURL: vi.fn()
    });

    vi.stubGlobal('crypto', {
      randomUUID: vi.fn(() => 'test-uuid-123')
    });
  });

  describe('addImages', () => {
    it('should process valid image files', async () => {
      const files = [
        new File([''], 'test1.jpg', { type: 'image/jpeg' }),
        new File([''], 'test2.png', { type: 'image/png' })
      ];

      const result = await ImageService.addImages(files);
      expect(result).toHaveLength(2);
      expect(result[0].file).toBe(files[0]);
      expect(result[1].file).toBe(files[1]);
    });

    it('should filter out invalid files', async () => {
      const files = [
        new File([''], 'test1.jpg', { type: 'image/jpeg' }),
        new File([''], 'test2.txt', { type: 'text/plain' }),
        new File([''], 'test3.png', { type: 'image/png' })
      ];

      const result = await ImageService.addImages(files);
      expect(result).toHaveLength(2);
      expect(result[0].file.name).toBe('test1.jpg');
      expect(result[1].file.name).toBe('test3.png');
    });

    it('should handle empty file array', async () => {
      const result = await ImageService.addImages([]);
      expect(result).toEqual([]);
    });

    it('should handle file processing errors', async () => {
      // Mock Image to simulate error
      vi.stubGlobal('Image', class {
        onload: ((this: HTMLImageElement, ev: Event) => void) | null = null;
        onerror: ((this: HTMLImageElement, ev: Event) => void) | null = null;
        src: string = '';
        width: number = 0;
        height: number = 0;

        constructor() {
          setTimeout(() => {
            if (this.onerror) {
              this.onerror.call(this, new Event('error'));
            }
          }, 0);
        }
      } as unknown as typeof Image);

      const files = [
        new File([''], 'test.jpg', { type: 'image/jpeg' })
      ];

      const result = await ImageService.addImages(files);
      expect(result).toEqual([]);
    });
  });

  describe('updateImagePosition', () => {
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

    it.skip('should update image position when valid', () => {
      const result = ImageService.updateImagePosition('1', 3, 2, mockImages);
      
      expect(result).toHaveLength(2);
      expect(result[0].gridX).toBe(3);
      expect(result[0].gridY).toBe(2);
      expect(result[1]).toEqual(mockImages[1]);
    });

    it.skip('should reject position that would cause collision', () => {
      const result = ImageService.updateImagePosition('1', 2, 1, mockImages);
      
      expect(result).toEqual(mockImages);
    });

    it('should handle non-existent image id', () => {
      const result = ImageService.updateImagePosition('999', 3, 2, mockImages);
      
      expect(result).toEqual(mockImages);
    });

    it('should allow moving to same position', () => {
      const result = ImageService.updateImagePosition('1', 0, 0, mockImages);
      
      expect(result).toEqual(mockImages);
    });
  });

  describe('removeImage', () => {
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

    it('should remove image by id', () => {
      const result = ImageService.removeImage('1', mockImages);
      
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('2');
    });

    it('should clean up object URL when removing', () => {
      const revokeObjectURLSpy = vi.spyOn(URL, 'revokeObjectURL');
      
      ImageService.removeImage('1', mockImages);
      
      expect(revokeObjectURLSpy).toHaveBeenCalledWith('blob:test1');
    });

    it('should handle non-existent image id', () => {
      const result = ImageService.removeImage('999', mockImages);
      
      expect(result).toEqual(mockImages);
    });

    it('should handle empty image array', () => {
      const result = ImageService.removeImage('1', []);
      
      expect(result).toEqual([]);
    });
  });

  describe('findNextAvailablePosition', () => {
    it.skip('should return 0,0 for empty array', () => {
      const result = ImageService.findNextAvailablePosition([]);
      expect(result).toEqual({ gridX: 0, gridY: 0 });
    });

    it.skip('should find next available position in grid', () => {
      const images: MoodBoardImage[] = [
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
          gridX: 1,
          gridY: 0,
          file: new File([''], 'test2.jpg', { type: 'image/jpeg' })
        }
      ];

      const result = ImageService.findNextAvailablePosition(images);
      expect(result).toEqual({ gridX: 2, gridY: 0 });
    });

    it.skip('should wrap to next row when row is full', () => {
      const images: MoodBoardImage[] = Array.from({ length: 10 }, (_, i) => ({
        id: `${i}`,
        src: `blob:test${i}`,
        originalWidth: 400,
        originalHeight: 300,
        gridX: i,
        gridY: 0,
        file: new File([''], `test${i}.jpg`, { type: 'image/jpeg' })
      }));

      const result = ImageService.findNextAvailablePosition(images);
      expect(result).toEqual({ gridX: 0, gridY: 1 });
    });

    it.skip('should handle gaps in grid', () => {
      const images: MoodBoardImage[] = [
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
          gridY: 0,
          file: new File([''], 'test2.jpg', { type: 'image/jpeg' })
        }
      ];

      const result = ImageService.findNextAvailablePosition(images);
      expect(result).toEqual({ gridX: 1, gridY: 0 });
    });
  });
});