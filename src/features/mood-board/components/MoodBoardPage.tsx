"use client";

import { useRef, useCallback, type ChangeEvent } from "react";
import { FolderOpen, AlertCircle, Plus } from "lucide-react";
import { useImages } from "../hooks/useImages";
import { useCanvas } from "../hooks/useCanvas";
import { Canvas } from "./Canvas";
import { ImageGrid } from "./ImageGrid";

export function MoodBoardPage() {
  const {
    images,
    addImages,
    updateImagePosition,
    removeImage,
    selectImage,
    error,
    isLoading,
  } = useImages();
  const { isSpacePressed } = useCanvas();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || []);
      if (files.length > 0) {
        addImages(files);
      }
      // Reset the input so the same file can be selected again
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    },
    [addImages]
  );

  const handleButtonClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  return (
    <div className="w-full h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-neutral-900  p-4 absolute z-[999]">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            {/* Add Images Button */}
            <button
              onClick={handleButtonClick}
              disabled={isLoading}
              className="bg-neutral-500 hover:bg-neutral-600 disabled:bg-neutral-300 text-white  rounded flex items-center justify-center  w-10 h-10 transition-colors"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Error message */}
        {error && (
          <div className="mt-3 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded flex items-center space-x-2">
            <AlertCircle className="w-5 h-5" />
            <span>{error}</span>
          </div>
        )}
      </header>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Main content */}
      <main className="flex-1 h-screen">
        <Canvas isEmpty={images.length === 0}>
          <ImageGrid
            images={images}
            onImageMove={updateImagePosition}
            onImageRemove={removeImage}
            onImageSelect={selectImage}
            isSpacePressed={isSpacePressed}
          />
        </Canvas>
      </main>
    </div>
  );
}
