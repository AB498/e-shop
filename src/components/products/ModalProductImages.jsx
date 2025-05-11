'use client';
import React, { useState } from 'react';
import Image from 'next/image';

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
    <div className="w-full md:w-2/5 p-2 sm:p-3 md:p-4">
      <div className="flex gap-2 sm:gap-2.5 md:gap-3">
        {/* Thumbnail list */}
        <div className="hidden md:flex flex-col gap-1.5 md:gap-2 w-14 md:w-16">
          {productImages.map((image, index) => (
            <div
              key={image.id || index}
              className={`border ${index === activeImageIndex ? 'border-[#006B51]' : 'border-[#E7ECF0]'} rounded-md bg-white p-0.5 cursor-pointer hover:border-[#006B51] transition-colors`}
              onClick={() => handleThumbnailClick(index)}
            >
              <div className="relative aspect-square rounded-md overflow-hidden">
                <Image
                  src={image.url}
                  alt={image.altText || `Product thumbnail ${index + 1}`}
                  fill
                  sizes="(max-width: 768px) 100vw, 60px"
                  className="object-cover"
                />
              </div>
            </div>
          ))}
        </div>

        {/* Main image */}
        <div className="flex-1 border border-[#E7ECF0] rounded-md bg-white p-0.5 sm:p-1">
          <div className="relative aspect-square rounded-md overflow-hidden">
            <Image
              src={activeImage}
              alt={productImages[activeImageIndex]?.altText || product.name || "Product Image"}
              fill
              sizes="(max-width: 640px) 90vw, (max-width: 768px) 80vw, (max-width: 1200px) 35vw, 400px"
              className="object-cover"
            />
            {/* Next/Prev buttons for image gallery */}
            <div className="absolute bottom-2 right-2 sm:bottom-2.5 sm:right-2.5 md:bottom-3 md:right-3 flex gap-2">
              {/* Previous button */}
              <div
                className="bg-white rounded-full p-1.5 sm:p-1.5 md:p-2 shadow-md cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={handlePrev}
              >
                <svg width="16" height="16" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 transform rotate-180">
                  <path d="M7.5 15L12.5 10L7.5 5" stroke="#595959" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>

              {/* Next button */}
              <div
                className="bg-white rounded-full p-1.5 sm:p-1.5 md:p-2 shadow-md cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={handleNext}
              >
                <svg width="16" height="16" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4">
                  <path d="M7.5 15L12.5 10L7.5 5" stroke="#595959" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
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
