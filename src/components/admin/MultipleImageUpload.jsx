'use client';

import { useState, useRef } from 'react';
import { PhotoIcon, XMarkIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';

export default function MultipleImageUpload({ onImagesChange, initialImages = [] }) {
  const [images, setImages] = useState(initialImages);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  // Handle image upload
  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setUploadingImage(true);
    setError(null);

    try {
      const uploadedImages = [];

      // Process each file
      for (const file of files) {
        // Validate file type
        const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        if (!validTypes.includes(file.type)) {
          setError(`File "${file.name}" is not a valid image type (JPEG, PNG, GIF, WEBP)`);
          continue;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
          setError(`File "${file.name}" exceeds the 5MB size limit`);
          continue;
        }

        // Create form data for upload
        const uploadFormData = new FormData();
        uploadFormData.append('file', file);
        uploadFormData.append('folder', 'products');

        // Upload the image
        const response = await fetch('/api/s3-upload', {
          method: 'POST',
          body: uploadFormData,
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || `Failed to upload ${file.name}`);
        }

        const data = await response.json();

        // Add to uploaded images
        uploadedImages.push({
          id: Date.now() + Math.random(), // Temporary ID for UI purposes
          url: data.url,
          key: data.key,
          altText: file.name.split('.')[0], // Use filename as alt text
          position: images.length + uploadedImages.length,
          isPrimary: images.length === 0 && uploadedImages.length === 0, // First image is primary
        });
      }

      // Update state with new images
      const updatedImages = [...images, ...uploadedImages];
      setImages(updatedImages);

      // Notify parent component
      onImagesChange(updatedImages);
    } catch (err) {
      console.error('Error uploading images:', err);
      setError(err.message || 'Failed to upload images');
    } finally {
      setUploadingImage(false);
      // Clear the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  // Remove an image
  const handleRemoveImage = (index) => {
    const updatedImages = [...images];

    // If removing the primary image, make the next one primary
    if (updatedImages[index].isPrimary && updatedImages.length > 1) {
      const nextIndex = index === updatedImages.length - 1 ? 0 : index + 1;
      updatedImages[nextIndex].isPrimary = true;
    }

    updatedImages.splice(index, 1);

    // Update positions
    updatedImages.forEach((img, idx) => {
      img.position = idx;
    });

    setImages(updatedImages);
    onImagesChange(updatedImages);
  };

  // Set an image as primary
  const handleSetPrimary = (index) => {
    const updatedImages = images.map((img, idx) => ({
      ...img,
      isPrimary: idx === index
    }));

    setImages(updatedImages);
    onImagesChange(updatedImages);
  };

  return (
    <div className="space-y-4">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-md">
          {error}
        </div>
      )}

      {/* Image grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {images.map((image, index) => (
          <div
            key={image.id || index}
            className={`relative border rounded-md overflow-hidden group ${
              image.isPrimary ? 'ring-2 ring-emerald-500' : ''
            }`}
          >
            <div className="aspect-square relative">
              <img
                src={image.url}
                alt={image.altText || `Product image ${index + 1}`}
                className="object-cover w-full h-full"
              />

              {/* Overlay with actions - visible on mobile without hover */}
              <div className="absolute inset-0 bg-black bg-opacity-20 md:bg-opacity-0 md:group-hover:bg-opacity-40 transition-all flex items-center justify-center md:opacity-0 md:group-hover:opacity-100">
                <div className="flex space-x-3">
                  {!image.isPrimary && (
                    <button
                      type="button"
                      onClick={() => handleSetPrimary(index)}
                      className="bg-white rounded-full p-2 md:p-1.5 text-gray-700 hover:text-emerald-600"
                      title="Set as primary image"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 md:w-4 md:h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
                      </svg>
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    className="bg-white rounded-full p-2 md:p-1.5 text-gray-700 hover:text-red-600"
                    title="Remove image"
                  >
                    <XMarkIcon className="w-5 h-5 md:w-4 md:h-4" />
                  </button>
                </div>
              </div>

              {/* Primary badge */}
              {image.isPrimary && (
                <div className="absolute top-2 left-2 md:top-1 md:left-1 bg-emerald-500 text-white text-sm md:text-xs px-2 py-1 md:px-1.5 md:py-0.5 rounded">
                  Primary
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Upload button */}
        <div
          className="border-2 border-dashed border-gray-300 rounded-md aspect-square flex flex-col items-center justify-center cursor-pointer hover:border-emerald-500 transition-colors"
          onClick={() => fileInputRef.current.click()}
        >
          <PhotoIcon className="h-12 w-12 md:h-10 md:w-10 text-gray-400" />
          <span className="mt-2 block text-base md:text-sm font-medium text-gray-700">
            {uploadingImage ? 'Uploading...' : 'Add Images'}
          </span>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageUpload}
            accept="image/*"
            multiple
            className="hidden"
            disabled={uploadingImage}
          />
        </div>
      </div>

      <p className="text-sm md:text-xs text-gray-500">
        PNG, JPG, GIF up to 5MB. Tap on an image to set as primary or remove it.
      </p>
    </div>
  );
}
