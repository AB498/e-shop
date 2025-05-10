'use client';
import React from 'react';
import Image from 'next/image';

const ModalProductImages = ({ product }) => {
  return (
    <div className="w-full md:w-2/5 p-2 sm:p-3 md:p-4">
      <div className="flex gap-2 sm:gap-2.5 md:gap-3">
        {/* Thumbnail list */}
        <div className="hidden md:flex flex-col gap-1.5 md:gap-2 w-14 md:w-16">
          {[1, 2, 3, 4].map((index) => (
            <div
              key={index}
              className={`border ${index === 1 ? 'border-[#006B51]' : 'border-[#E7ECF0]'} rounded-md bg-white p-0.5 cursor-pointer hover:border-[#006B51] transition-colors`}
            >
              <div className="relative aspect-square rounded-md overflow-hidden">
                <Image
                  src={product.image || "/images/product-image.png"}
                  alt={`Product thumbnail ${index}`}
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
              src={product.image || "/images/product-image.png"}
              alt={product.name || "Product Image"}
              fill
              sizes="(max-width: 640px) 90vw, (max-width: 768px) 80vw, (max-width: 1200px) 35vw, 400px"
              className="object-cover"
            />
            {/* Next/Prev buttons for image gallery - from Figma */}
            <div className="absolute bottom-2 right-2 sm:bottom-2.5 sm:right-2.5 md:bottom-3 md:right-3">
              <div className="bg-white rounded-full p-1.5 sm:p-1.5 md:p-2 shadow-md cursor-pointer hover:bg-gray-100 transition-colors">
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
