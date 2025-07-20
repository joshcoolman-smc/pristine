import { describe, it, expect, vi } from 'vitest';
import { validateFile, getImageDimensions, createImageFromFile } from './fileValidation';

describe('validateFile', () => {
  it('should accept valid image types', () => {
    const jpgFile = new File([''], 'test.jpg', { type: 'image/jpeg' });
    const pngFile = new File([''], 'test.png', { type: 'image/png' });
    const gifFile = new File([''], 'test.gif', { type: 'image/gif' });
    const webpFile = new File([''], 'test.webp', { type: 'image/webp' });

    expect(validateFile(jpgFile)).toBe(true);
    expect(validateFile(pngFile)).toBe(true);
    expect(validateFile(gifFile)).toBe(true);
    expect(validateFile(webpFile)).toBe(true);
  });

  it('should reject invalid file types', () => {
    const textFile = new File([''], 'test.txt', { type: 'text/plain' });
    const pdfFile = new File([''], 'test.pdf', { type: 'application/pdf' });
    const videoFile = new File([''], 'test.mp4', { type: 'video/mp4' });

    expect(validateFile(textFile)).toBe(false);
    expect(validateFile(pdfFile)).toBe(false);
    expect(validateFile(videoFile)).toBe(false);
  });

  it('should reject empty file type', () => {
    const emptyFile = new File([''], 'test', { type: '' });
    expect(validateFile(emptyFile)).toBe(false);
  });

  it('should reject files that are too large', () => {
    const largeFile = new File(['x'.repeat(11 * 1024 * 1024)], 'test.jpg', { type: 'image/jpeg' });
    expect(validateFile(largeFile)).toBe(false);
  });

  it('should accept files under size limit', () => {
    const smallFile = new File(['x'.repeat(1024)], 'test.jpg', { type: 'image/jpeg' });
    expect(validateFile(smallFile)).toBe(true);
  });
});

describe('getImageDimensions', () => {
  beforeEach(() => {
    // Mock Image constructor
    global.Image = class {
      onload: ((this: HTMLImageElement, ev: Event) => void) | null = null;
      onerror: ((this: HTMLImageElement, ev: Event) => void) | null = null;
      src: string = '';
      width: number = 0;
      height: number = 0;

      constructor() {
        // Simulate async loading
        setTimeout(() => {
          this.width = 800;
          this.height = 600;
          if (this.onload) {
            this.onload.call(this, new Event('load'));
          }
        }, 0);
      }
    } as unknown as typeof Image;

    // Mock URL.createObjectURL
    global.URL = {
      createObjectURL: vi.fn(() => 'blob:test'),
      revokeObjectURL: vi.fn()
    } as unknown as typeof URL;
  });

  it('should return image dimensions for valid image file', async () => {
    const file = new File([''], 'test.jpg', { type: 'image/jpeg' });
    const result = await getImageDimensions(file);
    
    expect(result).toEqual({ width: 800, height: 600 });
  });

  it('should handle image loading error', async () => {
    // Override Image to simulate error
    global.Image = class {
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
    } as unknown as typeof Image;

    const file = new File([''], 'test.jpg', { type: 'image/jpeg' });
    await expect(getImageDimensions(file)).rejects.toThrow('Failed to load image');
  });
});

describe('createImageFromFile', () => {
  beforeEach(() => {
    // Mock Image constructor
    global.Image = class {
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
    } as unknown as typeof Image;

    // Mock URL.createObjectURL
    global.URL = {
      createObjectURL: vi.fn(() => 'blob:test'),
      revokeObjectURL: vi.fn()
    } as unknown as typeof URL;

    // Mock crypto.randomUUID
    vi.stubGlobal('crypto', {
      randomUUID: vi.fn(() => 'test-uuid-123')
    });
  });

  it('should create MoodBoardImage from valid file', async () => {
    const file = new File([''], 'test.jpg', { type: 'image/jpeg' });
    const result = await createImageFromFile(file);
    
    expect(result).toEqual({
      id: 'test-uuid-123',
      src: 'blob:test',
      originalWidth: 800,
      originalHeight: 600,
      gridX: 0,
      gridY: 0,
      file: file,
      zIndex: 1
    });
  });

  it('should reject invalid file', async () => {
    const invalidFile = new File([''], 'test.txt', { type: 'text/plain' });
    await expect(createImageFromFile(invalidFile)).rejects.toThrow('Invalid file type');
  });

  it('should handle image loading error', async () => {
    // Override Image to simulate error
    global.Image = class {
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
    } as unknown as typeof Image;

    const file = new File([''], 'test.jpg', { type: 'image/jpeg' });
    await expect(createImageFromFile(file)).rejects.toThrow('Failed to load image');
  });
});