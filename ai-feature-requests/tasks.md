# MVP Implementation Tasks

## TDD Implementation Plan

### Phase 1: Core Utilities (TDD First)

- [ ] **1. Set up feature module structure**
  - Create directory structure following CLAUDE.md patterns
  - Set up TypeScript types for MoodBoardImage, GridConfig, CanvasState
  - Create index.ts for public API exports

- [ ] **2. TDD: Grid System Utilities**
  - Write tests for `snapToGrid()` function
  - Write tests for `checkCollision()` function  
  - Write tests for `getImageDimensions()` function
  - Implement grid system utilities to pass tests

- [ ] **3. TDD: Canvas Transform Utilities**
  - Write tests for `screenToCanvas()` coordinate conversion
  - Write tests for `canvasToScreen()` coordinate conversion
  - Write tests for `applyZoom()` transformation
  - Implement canvas transform utilities to pass tests

- [ ] **4. TDD: File Validation Utilities**
  - Write tests for `validateFile()` function
  - Write tests for `getImageDimensions()` function
  - Write tests for `createImageFromFile()` function
  - Implement file validation utilities to pass tests

### Phase 2: Business Logic (TDD)

- [ ] **5. TDD: Image Service**
  - Write tests for `addImages()` method
  - Write tests for `updateImagePosition()` method
  - Write tests for `removeImage()` method
  - Write tests for `findNextAvailablePosition()` method
  - Implement ImageService class to pass tests

### Phase 3: React Hooks (TDD)

- [ ] **6. TDD: useImages Hook**
  - Write tests for image state management
  - Write tests for add/update/remove operations
  - Write tests for error handling and loading states
  - Implement useImages hook to pass tests

- [ ] **7. TDD: useCanvas Hook**
  - Write tests for canvas state management
  - Write tests for zoom/pan operations
  - Write tests for state transitions
  - Implement useCanvas hook to pass tests

### Phase 4: Components (Iterative Development)

- [ ] **8. Canvas Component**
  - Implement basic zoom/pan functionality
  - Add mouse wheel zoom handling
  - Add spacebar + drag panning
  - Write component tests for interactions

- [ ] **9. DropZone Component**
  - Implement file drop event handling
  - Add visual feedback for drag-over states
  - Integrate with file validation utilities
  - Write component tests for file drop workflows

- [ ] **10. ImageGrid Component**
  - Implement image rendering with grid positioning
  - Add drag and drop for image repositioning
  - Integrate with grid snapping utilities
  - Write component tests for image interactions

- [ ] **11. MoodBoardPage Component**
  - Integrate all components together
  - Manage global state coordination
  - Add basic error handling and user feedback
  - Write integration tests for complete workflows

### Phase 5: Testing and Polish

- [ ] **12. Integration Testing**
  - Test complete user workflows
  - Test error handling across components
  - Test performance with multiple images
  - Ensure session-only storage behavior

- [ ] **13. Final Validation**
  - Run all tests and ensure passing
  - Test in different browsers
  - Verify requirements are met
  - Add any missing error handling

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
- Cross-browser compatibility

## Key Principles

1. **TDD First**: Write tests before implementation for all utilities, services, and hooks
2. **Feature Module Pattern**: Follow CLAUDE.md architecture strictly
3. **Simplicity**: Focus on core functionality without complex features
4. **Clean Code**: Maintain separation of concerns and clear interfaces
5. **Session Storage**: No persistence complexity, memory-only storage

## Success Criteria

- All requirements from requirements.md are met
- Test coverage for all business logic
- Smooth user experience with basic functionality
- Clean, maintainable code following project patterns
- No complex performance optimizations needed for MVP