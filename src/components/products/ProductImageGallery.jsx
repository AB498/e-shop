'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import ImageWithFallback from '../ui/ImageWithFallback';

const ProductImageGallery = ({ images, image, name, discountPercentage = 0 }) => {
  // Default image if none provided
  const defaultImage = "/images/product-image.png";

  // State to track the active image
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Use provided images array or create a fallback from the single image
  const productImages = images || [
    { id: 1, url: image || defaultImage, altText: name, position: 0, isPrimary: true }
  ];

  // Get the currently active image
  const activeImage = productImages[activeImageIndex]?.url || defaultImage;

  // Handle thumbnail click
  const handleThumbnailClick = (index) => {
    setActiveImageIndex(index);
  };

  return (
    <div className="w-full md:w-1/2 lg:w-2/5">
      {/* Main Product Image */}
      <div className="relative aspect-square mb-2 sm:mb-3 border border-[#ECECEC] rounded-md overflow-hidden bg-white">
        <ImageWithFallback
          src={activeImage.trim() || "/images/product-image.png"}
          alt={productImages[activeImageIndex]?.altText || name || "Product"}
          fill
          className="object-contain w-full h-full"
          onError={(e) => { e.target.src = "/images/product-image.png"; }}
        />

        {discountPercentage > 0 && (
          <div className="absolute top-2 left-2 sm:top-3 sm:left-3">
            <div className="bg-[#E12625] text-white text-[10px] sm:text-xs font-semibold py-0.5 px-1.5 sm:px-2 rounded-sm">
              {discountPercentage}% Off
            </div>
          </div>
        )}
      </div>

      {/* Thumbnail Images */}
      <div className="flex gap-1.5 sm:gap-2 overflow-x-auto pb-1 justify-center md:justify-start">
        {productImages.map((image, index) => (
          <div
            key={image.id || index}
            className={`relative w-14 h-14 border rounded-md overflow-hidden flex-shrink-0 cursor-pointer ${index === activeImageIndex
              ? 'border-[#3BB77E] shadow-sm'
              : 'border-[#ECECEC]'
              }`}
            onClick={() => handleThumbnailClick(index)}
          >
            <ImageWithFallback
              src={image.url.trim() || "/images/product-image.png"}
              alt={image.altText || `${name || "Product"} Thumbnail ${index + 1}`}
              fill
              className="w-full h-full object-cover rounded-[4px] sm:rounded-[6px] transition-transform duration-300 hover:scale-105"
              onError={(e) => {
                e.target.src = "/images/product-image.png"; // Set fallback image
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductImageGallery;
