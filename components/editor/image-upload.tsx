"use client";

import type React from "react";

import { useState, useCallback } from "react";
import Image from "next/image";
import { Upload, X, Camera } from "lucide-react";

interface ImageUploadProps {
  onImageChange: (imageUrl: string | null) => void;
  initialImage?: string | null;
}

export function ImageUpload({
  onImageChange,
  initialImage = null,
}: ImageUploadProps) {
  const [image, setImage] = useState<string | null>(initialImage);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      handleFile(file);
    }
  }, []);

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
        const file = e.target.files[0];
        handleFile(file);
      }
    },
    []
  );

  const handleFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      alert("Please select an image file");
      return;
    }

    // Simulate upload progress
    setIsUploading(true);
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setUploadProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target?.result) {
            const imageUrl = event.target.result as string;
            setImage(imageUrl);
            onImageChange(imageUrl);
            setIsUploading(false);
          }
        };
        reader.readAsDataURL(file);
      }
    }, 200);
  };

  const removeImage = () => {
    setImage(null);
    onImageChange(null);
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        Featured Image
      </label>

      {image ? (
        <div className="relative">
          <Image
            src={image || "/placeholder.svg"}
            alt="Featured image"
            width={800}
            height={400}
            className="w-full h-auto rounded-md object-cover"
          />
          <button
            type="button"
            onClick={removeImage}
            className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full hover:bg-red-700 transition-colors duration-200"
            aria-label="Remove image"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      ) : (
        <div
          className={`border-2 border-dashed rounded-md p-8 text-center ${
            isDragging
              ? "border-theme-purple-500 bg-theme-purple-50 dark:bg-theme-purple-900/20"
              : "border-gray-300 dark:border-gray-700"
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {isUploading ? (
            <div className="space-y-4">
              <div className="flex justify-center">
                <Upload className="h-12 w-12 text-theme-purple-500 animate-pulse" />
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Uploading image...
              </p>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                <div
                  className="bg-theme-purple-600 h-2.5 rounded-full"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
            </div>
          ) : (
            <>
              <Camera className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" />
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                Drag and drop an image, or{" "}
                <label className="text-theme-purple-600 dark:text-theme-purple-400 hover:underline cursor-pointer">
                  browse
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                </label>
              </p>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-500">
                PNG, JPG, GIF up to 10MB
              </p>
            </>
          )}
        </div>
      )}
    </div>
  );
}
