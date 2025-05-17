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
    <div className="space-y-3 sm:space-y-4">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-3 py-2 sm:px-4 sm:py-3 rounded-md text-xs sm:text-sm">
          {error}
        </div>
      )}

      {/* Image grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-4">
        {images.map((image, index) => (
          <div
            key={image.id || index}
            className={`relative border rounded-md overflow-hidden group ${image.isPrimary ? 'ring-2 ring-emerald-500' : ''
              }`}
          >
            <div className="aspect-square relative">
              <Image
                src={image.url.trim() || "/images/product-image.png"}
                alt={image.altText || "Product"}
                fill
                className="object-contain w-full h-full"
                onError={(e) => { e.target.src = "/images/product-image.png"; }}
              />

              {/* Overlay with actions - always visible on mobile, hover on desktop */}
              <div className="absolute inset-0 bg-black bg-opacity-20 md:bg-opacity-0 md:group-hover:bg-opacity-40 transition-all flex items-center justify-center">
                <div className="flex space-x-2 sm:space-x-3">
                  {!image.isPrimary && (
                    <button
                      type="button"
                      onClick={() => handleSetPrimary(index)}
                      className="bg-white rounded-full p-1.5 sm:p-2 text-gray-700 hover:text-emerald-600"
                      title="Set as primary image"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 sm:w-5 sm:h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
                      </svg>
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    className="bg-white rounded-full p-1.5 sm:p-2 text-gray-700 hover:text-red-600"
                    title="Remove image"
                  >
                    <XMarkIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                </div>
              </div>

              {/* Primary badge */}
              {image.isPrimary && (
                <div className="absolute top-1 left-1 sm:top-2 sm:left-2 bg-emerald-500 text-white text-xs sm:text-sm px-1.5 py-0.5 sm:px-2 sm:py-1 rounded">
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
          <PhotoIcon className="h-10 w-10 sm:h-12 sm:w-12 text-gray-400" />
          <span className="mt-1 sm:mt-2 block text-sm sm:text-base font-medium text-gray-700 text-center px-2">
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

      <p className="text-xs sm:text-sm text-gray-500">
        PNG, JPG, GIF up to 5MB. Tap on an image to set as primary or remove it.
      </p>
    </div>
  );
}
