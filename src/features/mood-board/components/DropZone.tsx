'use client'

import { useState, useCallback, useRef, type ReactNode, type DragEvent, type ChangeEvent } from 'react';
import { Upload, AlertCircle, FolderOpen } from 'lucide-react';

interface DropZoneProps {
  onFileDrop: (files: File[]) => void;
  isLoading?: boolean;
  error?: string | null;
  children: ReactNode;
  className?: string;
}

export function DropZone({ 
  onFileDrop, 
  isLoading = false, 
  error, 
  children, 
  className 
}: DropZoneProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      onFileDrop(files);
    }
    // Reset the input so the same file can be selected again
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [onFileDrop]);

  const handleButtonClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleDragEnter = useCallback((e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setIsDragOver(true);
    }
  }, []);

  const handleDragLeave = useCallback((e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  }, []);

  const handleDragOver = useCallback((e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      onFileDrop(files);
    }
  }, [onFileDrop]);

  return (
    <div
      className={`relative w-full h-full ${className || ''}`}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      {children}
      
      {/* Drag overlay */}
      {isDragOver && (
        <div className="absolute inset-0 bg-blue-500 bg-opacity-10 border-2 border-blue-500 border-dashed rounded-lg flex items-center justify-center z-50">
          <div className="text-center">
            <Upload className="w-12 h-12 mx-auto mb-4 text-blue-500" />
            <p className="text-lg font-semibold text-blue-700">
              Drop images here to add them to your mood board
            </p>
            <p className="text-sm text-blue-600 mt-2">
              Supports JPG, PNG, GIF, and WebP files
            </p>
          </div>
        </div>
      )}
      
      {/* Loading overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-40">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-lg font-semibold text-gray-700">
              Processing images...
            </p>
          </div>
        </div>
      )}
      
      {/* Error message */}
      {error && (
        <div className="absolute top-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded flex items-center space-x-2 z-30">
          <AlertCircle className="w-5 h-5" />
          <span>{error}</span>
        </div>
      )}
      
      {/* Initial empty state */}
      {!isDragOver && !isLoading && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-center text-gray-500">
            <Upload className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <p className="text-xl font-semibold">
              Drag and drop images here
            </p>
            <p className="text-sm mt-2">
              Or use spacebar + drag to pan around the canvas
            </p>
            <p className="text-xs mt-1 text-gray-400">
              Mouse wheel to zoom in/out
            </p>
            
            {/* File selection button */}
            <button
              onClick={handleButtonClick}
              className="mt-6 bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg flex items-center space-x-2 mx-auto pointer-events-auto transition-colors"
            >
              <FolderOpen className="w-5 h-5" />
              <span>Select Images from Computer</span>
            </button>
          </div>
        </div>
      )}
      
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  );
}