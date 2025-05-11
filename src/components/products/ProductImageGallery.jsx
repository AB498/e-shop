'use client';
import React, { useState } from 'react';
import Image from 'next/image';

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
    <div className="w-full md:w-1/2 lg:w-2/5 fluid-p">
      {/* Main Product Image */}
      <div className="relative aspect-square mb-4 border border-[#ECECEC] rounded-[15px] overflow-hidden bg-white">
        <Image
          src={activeImage}
          alt={productImages[activeImageIndex]?.altText || name || "Product"}
          fill
          className="object-contain"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          priority
        />
        {discountPercentage > 0 && (
          <div className="absolute top-4 left-4">
            <div className="bg-[#E12625] text-white text-responsive-xs font-bold py-1 px-3 rounded-[5px]">
              {discountPercentage}% Off
            </div>
          </div>
        )}
      </div>

      {/* Thumbnail Images */}
      <div className="flex fluid-gap overflow-x-auto pb-2 justify-center md:justify-start">
        {productImages.map((image, index) => (
          <div
            key={image.id || index}
            className={`relative border rounded-[10px] overflow-hidden flex-shrink-0 cursor-pointer ${
              index === activeImageIndex
                ? 'border-[#3BB77E] shadow-[5px_5px_15px_0px_rgba(0,0,0,0.05)]'
                : 'border-[#ECECEC]'
            }`}
            style={{
              width: 'clamp(60px, 15vw, 96px)',
              height: 'clamp(60px, 15vw, 96px)'
            }}
            onClick={() => handleThumbnailClick(index)}
          >
            <Image
              src={image.url}
              alt={image.altText || `${name || "Product"} Thumbnail ${index + 1}`}
              fill
              className="object-contain"
              sizes="(max-width: 768px) 15vw, 96px"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductImageGallery;
