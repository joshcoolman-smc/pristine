export interface MoodBoardImage {
  id: string;
  src: string;              // Object URL
  originalWidth: number;
  originalHeight: number;
  gridX: number;            // Grid position
  gridY: number;
  file: File;               // Original file reference
  zIndex: number;           // Z-index for layering
}