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
    <div className="w-full md:w-2/5 p-1 sm:p-1.5 md:p-2">
      <div className="flex gap-1 sm:gap-1.5 md:gap-2">
        {/* Thumbnail list */}
        <div className="hidden md:flex flex-col gap-0.5 md:gap-1 w-10 md:w-12">
          {productImages.map((image, index) => (
            <div
              key={image.id || index}
              className={`border ${index === activeImageIndex ? 'border-[#006B51]' : 'border-[#E7ECF0]'} rounded-sm bg-white p-0.5 cursor-pointer hover:border-[#006B51] transition-colors`}
              onClick={() => handleThumbnailClick(index)}
            >
              <div className="relative aspect-square rounded-sm overflow-hidden">
                <Image
                  src={image.url}
                  alt={image.altText || `Product thumbnail ${index + 1}`}
                  fill
                  sizes="(max-width: 768px) 100vw, 40px"
                  className="object-cover"
                />
              </div>
            </div>
          ))}
        </div>

        {/* Main image */}
        <div className="flex-1 border border-[#E7ECF0] rounded-sm bg-white p-0.5">
          <div className="relative aspect-square rounded-sm overflow-hidden">
            <Image
              src={activeImage}
              alt={productImages[activeImageIndex]?.altText || product.name || "Product Image"}
              fill
              sizes="(max-width: 640px) 90vw, (max-width: 768px) 80vw, (max-width: 1200px) 35vw, 300px"
              className="object-cover"
            />
            {/* Next/Prev buttons for image gallery */}
            <div className="absolute bottom-1 right-1 sm:bottom-1.5 sm:right-1.5 md:bottom-2 md:right-2 flex gap-1">
              {/* Previous button */}
              <div
                className="bg-white rounded-full p-0.5 sm:p-0.5 md:p-1 shadow-sm cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={handlePrev}
              >
                <svg width="12" height="12" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-2 h-2 sm:w-2.5 sm:h-2.5 md:w-3 md:h-3 transform rotate-180">
                  <path d="M7.5 15L12.5 10L7.5 5" stroke="#595959" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>

              {/* Next button */}
              <div
                className="bg-white rounded-full p-0.5 sm:p-0.5 md:p-1 shadow-sm cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={handleNext}
              >
                <svg width="12" height="12" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-2 h-2 sm:w-2.5 sm:h-2.5 md:w-3 md:h-3">
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
