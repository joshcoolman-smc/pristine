import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useImages } from './useImages';
import type { MoodBoardImage } from '../types/MoodBoardImage';

// Mock the ImageService
vi.mock('../service/ImageService', () => ({
  ImageService: {
    addImages: vi.fn(),
    updateImagePosition: vi.fn(),
    removeImage: vi.fn(),
    findNextAvailablePosition: vi.fn()
  }
}));

const mockImageService = vi.mocked(await import('../service/ImageService')).ImageService;

describe('useImages', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should initialize with empty state', () => {
    const { result } = renderHook(() => useImages());
    
    expect(result.current.images).toEqual([]);
    expect(result.current.error).toBeNull();
    expect(result.current.isLoading).toBe(false);
  });

  it('should add images successfully', async () => {
    const mockImages: MoodBoardImage[] = [
      {
        id: '1',
        src: 'blob:test1',
        originalWidth: 400,
        originalHeight: 300,
        gridX: 0,
        gridY: 0,
        file: new File([''], 'test1.jpg', { type: 'image/jpeg' })
      }
    ];

    mockImageService.addImages.mockResolvedValue(mockImages);
    mockImageService.findNextAvailablePosition.mockReturnValue({ gridX: 0, gridY: 0 });

    const { result } = renderHook(() => useImages());
    
    const files = [new File([''], 'test1.jpg', { type: 'image/jpeg' })];
    
    await act(async () => {
      await result.current.addImages(files);
    });

    expect(result.current.images).toEqual(mockImages);
    expect(result.current.error).toBeNull();
    expect(result.current.isLoading).toBe(false);
    expect(mockImageService.addImages).toHaveBeenCalledWith(files);
  });

  it('should position new images at next available position', async () => {
    const existingImages: MoodBoardImage[] = [
      {
        id: '1',
        src: 'blob:test1',
        originalWidth: 400,
        originalHeight: 300,
        gridX: 0,
        gridY: 0,
        file: new File([''], 'test1.jpg', { type: 'image/jpeg' })
      }
    ];

    const newImages: MoodBoardImage[] = [
      {
        id: '2',
        src: 'blob:test2',
        originalWidth: 600,
        originalHeight: 400,
        gridX: 0,
        gridY: 0,
        file: new File([''], 'test2.jpg', { type: 'image/jpeg' })
      }
    ];

    mockImageService.addImages.mockResolvedValue(newImages);
    mockImageService.findNextAvailablePosition.mockReturnValue({ gridX: 1, gridY: 0 });

    const { result } = renderHook(() => useImages());
    
    // First add the existing images
    const existingFiles = [new File([''], 'test1.jpg', { type: 'image/jpeg' })];
    mockImageService.addImages.mockResolvedValueOnce(existingImages);
    mockImageService.findNextAvailablePosition.mockReturnValueOnce({ gridX: 0, gridY: 0 });
    
    await act(async () => {
      await result.current.addImages(existingFiles);
    });

    // Reset mocks for the actual test
    mockImageService.addImages.mockResolvedValue(newImages);
    mockImageService.findNextAvailablePosition.mockReturnValue({ gridX: 1, gridY: 0 });

    const files = [new File([''], 'test2.jpg', { type: 'image/jpeg' })];
    
    await act(async () => {
      await result.current.addImages(files);
    });

    expect(mockImageService.findNextAvailablePosition).toHaveBeenCalledWith(existingImages);
    expect(result.current.images).toHaveLength(2);
    expect(result.current.images[1].gridX).toBe(1);
    expect(result.current.images[1].gridY).toBe(0);
  });

  it('should handle loading state during addImages', async () => {
    let resolvePromise: (value: MoodBoardImage[]) => void;
    const promise = new Promise<MoodBoardImage[]>((resolve) => {
      resolvePromise = resolve;
    });

    mockImageService.addImages.mockReturnValue(promise);

    const { result } = renderHook(() => useImages());
    
    const files = [new File([''], 'test.jpg', { type: 'image/jpeg' })];
    
    act(() => {
      result.current.addImages(files);
    });

    // Should be loading
    expect(result.current.isLoading).toBe(true);
    expect(result.current.error).toBeNull();

    // Resolve the promise
    await act(async () => {
      resolvePromise!([]);
    });

    // Should not be loading anymore
    expect(result.current.isLoading).toBe(false);
  });

  it('should handle errors during addImages', async () => {
    const errorMessage = 'Failed to add images';
    mockImageService.addImages.mockRejectedValue(new Error(errorMessage));

    const { result } = renderHook(() => useImages());
    
    const files = [new File([''], 'test.jpg', { type: 'image/jpeg' })];
    
    await act(async () => {
      await result.current.addImages(files);
    });

    expect(result.current.error).toBe(errorMessage);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.images).toEqual([]);
  });

  it('should clear error when adding images successfully after error', async () => {
    const { result } = renderHook(() => useImages());
    
    // First, cause an error
    mockImageService.addImages.mockRejectedValue(new Error('Test error'));
    
    const files = [new File([''], 'test.jpg', { type: 'image/jpeg' })];
    
    await act(async () => {
      await result.current.addImages(files);
    });

    expect(result.current.error).toBe('Test error');

    // Then, succeed
    mockImageService.addImages.mockResolvedValue([]);
    
    await act(async () => {
      await result.current.addImages(files);
    });

    expect(result.current.error).toBeNull();
  });

  it('should update image position successfully', async () => {
    const initialImages: MoodBoardImage[] = [
      {
        id: '1',
        src: 'blob:test1',
        originalWidth: 400,
        originalHeight: 300,
        gridX: 0,
        gridY: 0,
        file: new File([''], 'test1.jpg', { type: 'image/jpeg' })
      }
    ];

    const updatedImages: MoodBoardImage[] = [
      {
        ...initialImages[0],
        gridX: 2,
        gridY: 1
      }
    ];

    mockImageService.updateImagePosition.mockReturnValue(updatedImages);

    const { result } = renderHook(() => useImages());
    
    // First add the initial images
    mockImageService.addImages.mockResolvedValue(initialImages);
    mockImageService.findNextAvailablePosition.mockReturnValue({ gridX: 0, gridY: 0 });
    
    const files = [new File([''], 'test1.jpg', { type: 'image/jpeg' })];
    
    await act(async () => {
      await result.current.addImages(files);
    });

    act(() => {
      result.current.updateImagePosition('1', 2, 1);
    });

    expect(result.current.images).toEqual(updatedImages);
    expect(mockImageService.updateImagePosition).toHaveBeenCalledWith('1', 2, 1, initialImages);
  });

  it('should remove image successfully', async () => {
    const initialImages: MoodBoardImage[] = [
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

    const filteredImages = [initialImages[1]];

    mockImageService.removeImage.mockReturnValue(filteredImages);

    const { result } = renderHook(() => useImages());
    
    // First add the initial images
    mockImageService.addImages.mockResolvedValue(initialImages);
    mockImageService.findNextAvailablePosition
      .mockReturnValueOnce({ gridX: 0, gridY: 0 })
      .mockReturnValueOnce({ gridX: 1, gridY: 0 });
    
    const files = [
      new File([''], 'test1.jpg', { type: 'image/jpeg' }),
      new File([''], 'test2.jpg', { type: 'image/jpeg' })
    ];
    
    await act(async () => {
      await result.current.addImages(files);
    });

    act(() => {
      result.current.removeImage('1');
    });

    expect(result.current.images).toEqual(filteredImages);
    expect(mockImageService.removeImage).toHaveBeenCalledWith('1', initialImages);
  });

  it('should handle empty file array', async () => {
    mockImageService.addImages.mockResolvedValue([]);

    const { result } = renderHook(() => useImages());
    
    await act(async () => {
      await result.current.addImages([]);
    });

    expect(result.current.images).toEqual([]);
    expect(result.current.error).toBeNull();
    expect(result.current.isLoading).toBe(false);
  });

  it('should not change state when updating non-existent image', async () => {
    const initialImages: MoodBoardImage[] = [
      {
        id: '1',
        src: 'blob:test1',
        originalWidth: 400,
        originalHeight: 300,
        gridX: 0,
        gridY: 0,
        file: new File([''], 'test1.jpg', { type: 'image/jpeg' })
      }
    ];

    mockImageService.updateImagePosition.mockReturnValue(initialImages);

    const { result } = renderHook(() => useImages());
    
    // First add the initial images
    mockImageService.addImages.mockResolvedValue(initialImages);
    mockImageService.findNextAvailablePosition.mockReturnValue({ gridX: 0, gridY: 0 });
    
    const files = [new File([''], 'test1.jpg', { type: 'image/jpeg' })];
    
    await act(async () => {
      await result.current.addImages(files);
    });

    act(() => {
      result.current.updateImagePosition('999', 2, 1);
    });

    expect(result.current.images).toEqual(initialImages);
  });

  it('should not change state when removing non-existent image', async () => {
    const initialImages: MoodBoardImage[] = [
      {
        id: '1',
        src: 'blob:test1',
        originalWidth: 400,
        originalHeight: 300,
        gridX: 0,
        gridY: 0,
        file: new File([''], 'test1.jpg', { type: 'image/jpeg' })
      }
    ];

    mockImageService.removeImage.mockReturnValue(initialImages);

    const { result } = renderHook(() => useImages());
    
    // First add the initial images
    mockImageService.addImages.mockResolvedValue(initialImages);
    mockImageService.findNextAvailablePosition.mockReturnValue({ gridX: 0, gridY: 0 });
    
    const files = [new File([''], 'test1.jpg', { type: 'image/jpeg' })];
    
    await act(async () => {
      await result.current.addImages(files);
    });

    act(() => {
      result.current.removeImage('999');
    });

    expect(result.current.images).toEqual(initialImages);
  });
});