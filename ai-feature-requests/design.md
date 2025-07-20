# Design Document - MVP

## Overview

The Mood Board Creator MVP is a React-based web application built with Next.js 15 that provides a simple canvas for organizing images through drag-and-drop interactions. The application follows the feature module pattern with natural grid snapping and session-based storage.

### Key Design Principles

- **Feature Module Pattern**: Follow strict feature module architecture from CLAUDE.md
- **Test-Driven Development**: TDD for utilities, services, and hooks
- **Simplicity First**: Focus on core functionality without complex features
- **Session-Based**: No persistence complexity, focus on exploration
- **Clean Architecture**: Separate concerns with clear boundaries

## Architecture

### Feature Module Structure

```
src/features/mood-board/
├── types/
│   ├── MoodBoardImage.ts      # Image data structure
│   ├── GridConfig.ts          # Grid configuration
│   └── CanvasState.ts         # Canvas state
├── utils/
│   ├── gridSystem.ts          # Grid calculations (TDD)
│   ├── canvasTransform.ts     # Coordinate transforms (TDD)
│   └── fileValidation.ts      # File validation (TDD)
├── service/
│   └── ImageService.ts        # Image management (TDD)
├── hooks/
│   ├── useImages.ts           # Image state management
│   └── useCanvas.ts           # Canvas state management
├── components/
│   ├── Canvas.tsx             # Canvas with zoom/pan
│   ├── DropZone.tsx           # File drop handling
│   ├── ImageGrid.tsx          # Image display and positioning
│   └── MoodBoardPage.tsx      # Main page component
└── index.ts                   # Public API exports
```

### Component Hierarchy

```
MoodBoardPage
├── DropZone (handles file drops)
├── Canvas (zoom/pan container)
│   └── ImageGrid
│       └── ImageItem[] (draggable images)
└── [Basic controls - delete, zoom level display]
```

## Core Types

### MoodBoardImage
```typescript
interface MoodBoardImage {
  id: string;
  src: string;              // Object URL
  originalWidth: number;
  originalHeight: number;
  gridX: number;            // Grid position
  gridY: number;
  file: File;               // Original file reference
}
```

### GridConfig
```typescript
interface GridConfig {
  cellSize: number;         // Base grid size for snapping
  maxWidth: number;         // 700px max width for images
}
```

### CanvasState
```typescript
interface CanvasState {
  zoom: number;             // Current zoom level
  panX: number;             // Pan offset X
  panY: number;             // Pan offset Y
  isPanning: boolean;       // Pan mode active
}
```

## TDD Implementation Plan

### Phase 1: Core Utilities (TDD)

#### 1. Grid System (`utils/gridSystem.ts`)
- `snapToGrid(x: number, y: number): { gridX: number; gridY: number }`
- `checkCollision(gridX: number, gridY: number, images: MoodBoardImage[], excludeId?: string): boolean`
- `getImageDimensions(image: MoodBoardImage): { width: number; height: number }`

#### 2. Canvas Transform (`utils/canvasTransform.ts`)
- `screenToCanvas(screenX: number, screenY: number, canvasState: CanvasState): { x: number; y: number }`
- `canvasToScreen(canvasX: number, canvasY: number, canvasState: CanvasState): { x: number; y: number }`
- `applyZoom(currentZoom: number, delta: number, centerX: number, centerY: number): CanvasState`

#### 3. File Validation (`utils/fileValidation.ts`)
- `validateFile(file: File): boolean`
- `getImageDimensions(file: File): Promise<{ width: number; height: number }>`
- `createImageFromFile(file: File): Promise<MoodBoardImage>`

### Phase 2: Business Logic (TDD)

#### Image Service (`service/ImageService.ts`)
- `addImages(files: File[]): Promise<MoodBoardImage[]>`
- `updateImagePosition(id: string, gridX: number, gridY: number, images: MoodBoardImage[]): MoodBoardImage[]`
- `removeImage(id: string, images: MoodBoardImage[]): MoodBoardImage[]`
- `findNextAvailablePosition(images: MoodBoardImage[]): { gridX: number; gridY: number }`

### Phase 3: React Hooks (TDD)

#### useImages Hook
```typescript
interface UseImagesReturn {
  images: MoodBoardImage[];
  addImages: (files: File[]) => Promise<void>;
  updateImagePosition: (id: string, gridX: number, gridY: number) => void;
  removeImage: (id: string) => void;
  error: string | null;
  isLoading: boolean;
}
```

#### useCanvas Hook
```typescript
interface UseCanvasReturn {
  canvasState: CanvasState;
  zoom: (delta: number, centerX: number, centerY: number) => void;
  pan: (deltaX: number, deltaY: number) => void;
  setPanning: (isPanning: boolean) => void;
  resetZoom: () => void;
}
```

### Phase 4: Components (Iterative Development)

#### Canvas Component
- Handles mouse wheel zoom
- Spacebar + drag panning
- Coordinate system for child components

#### DropZone Component
- File drop event handling
- Visual feedback for drag-over
- File validation and processing

#### ImageGrid Component
- Renders images at correct positions
- Handles image drag and drop
- Grid snapping feedback

#### MoodBoardPage Component
- Integrates all components
- Manages global state
- Basic error handling

## Testing Strategy

### Unit Tests (TDD)
- Grid calculations and collision detection
- Coordinate transformations
- File validation logic
- Image management operations

### Hook Tests (TDD)
- State management logic
- Side effects and cleanup
- Error handling

### Component Tests (React Testing Library)
- User interactions
- File drop workflows
- Drag and drop behavior
- Error states

### Integration Tests
- Complete user workflows
- Component interactions
- Error handling across boundaries

## Implementation Notes

### Performance Considerations
- Use CSS transforms for smooth zoom/pan
- Implement basic image loading states
- Clean up object URLs when removing images

### Error Handling
- File validation errors
- Image loading failures
- Drag and drop edge cases

### User Experience
- Visual feedback for drag operations
- Clear error messages
- Smooth interactions without complex optimizations

This MVP design provides a solid foundation with good test coverage while maintaining simplicity and following the established architectural patterns.