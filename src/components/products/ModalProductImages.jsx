'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import ImageWithFallback from '../ui/ImageWithFallback';

const ModalProductImages = ({ product }) => {
  // Default image if none provided
  const defaultImage = "/images/product-image.png";

  // State to track the active image
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Use provided images array or create a fallback from the single image
  const productImages = product.images || [
    { id: 1, url: product.image || defaultImage, altText: product.name, position: 0, isPrimary: true }
  ];

  // Get the currently active image
  const activeImage = productImages[activeImageIndex]?.url || defaultImage;

  // Handle thumbnail click
  const handleThumbnailClick = (index) => {
    setActiveImageIndex(index);
  };

  // Handle next/prev navigation
  const handleNext = () => {
    setActiveImageIndex((prevIndex) =>
      prevIndex === productImages.length - 1 ? 0 : prevIndex + 1
    );
  };

  const handlePrev = () => {
    setActiveImageIndex((prevIndex) =>
      prevIndex === 0 ? productImages.length - 1 : prevIndex - 1
    );
  };

  return (
    <div className="w-full md:w-2/5 p-3 sm:p-1.5 md:p-2">
      <div className="flex flex-col md:flex-row gap-3 sm:gap-1.5 md:gap-2">
        {/* Thumbnail list */}
        <div className="order-1 md:order-none flex flex-row md:flex-col gap-0.5 md:gap-1 w-auto h-12 md:h-auto md:w-12">
          {productImages.map((image, index) => (
            <div
              key={image.id || index}
              className={`border ${index === activeImageIndex ? 'border-[#006B51]' : 'border-[#E7ECF0]'} rounded-sm bg-white p-0.5 cursor-pointer hover:border-[#006B51] transition-colors h-full w-auto md:w-full md:h-auto`}
              onClick={() => handleThumbnailClick(index)}
            >
              <div className="relative aspect-square rounded-sm overflow-hidden h-full w-auto md:w-full md:h-auto aspect-square">
                <ImageWithFallback
                  src={image.url.trim() || "/images/product-image.png"}
                  alt={image.altText || `${name || "Product"} Thumbnail ${index + 1}`}
                  fill
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = "/images/product-image.png"; // Set fallback image
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Main image */}
        <div className="flex-1 border border-[#E7ECF0] rounded-sm bg-white p-0.5">
          <div className="relative aspect-square rounded-sm overflow-hidden">
            <ImageWithFallback
              src={activeImage.trim() || "/images/product-image.png"}
              alt={productImages[activeImageIndex]?.altText || name || "Product"}
              fill
              className="object-contain w-full h-full"
              onError={(e) => { e.target.src = "/images/product-image.png"; }}
            />
            {/* Next/Prev buttons for image gallery */}
            <div className="absolute bottom-3 right-3 sm:bottom-1.5 sm:right-1.5 md:bottom-2 md:right-2 flex gap-3">
              {/* Previous button */}
              <div
                className="bg-white rounded-full p-2 sm:p-0.5 md:p-1 shadow-sm cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={handlePrev}
              >
                <svg width="16" height="16" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 sm:w-2.5 sm:h-2.5 md:w-3 md:h-3 transform rotate-180">
                  <path d="M7.5 15L12.5 10L7.5 5" stroke="#595959" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>

              {/* Next button */}
              <div
                className="bg-white rounded-full p-2 sm:p-0.5 md:p-1 shadow-sm cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={handleNext}
              >
                <svg width="16" height="16" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 sm:w-2.5 sm:h-2.5 md:w-3 md:h-3">
                  <path d="M7.5 15L12.5 10L7.5 5" stroke="#595959" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalProductImages;
