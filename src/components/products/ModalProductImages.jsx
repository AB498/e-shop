'use client';
import React from 'react';
import Image from 'next/image';

const ModalProductImages = ({ product }) => {
  return (
    <div className="w-full md:w-2/5 p-2 sm:p-3 md:p-5">
      <div className="flex gap-2 sm:gap-3 md:gap-4">
        {/* Thumbnail list */}
        <div className="hidden md:flex flex-col gap-2 md:gap-3 w-16 md:w-20">
          {[1, 2, 3, 4].map((index) => (
            <div
              key={index}
              className={`border ${index === 1 ? 'border-[#006B51]' : 'border-[#E7ECF0]'} rounded-md bg-white p-0.5 md:p-1 cursor-pointer hover:border-[#006B51] transition-colors`}
            >
              <div className="relative aspect-square rounded-md overflow-hidden">
                <Image
                  src={product.image || "/images/product-image.png"}
                  alt={`Product thumbnail ${index}`}
                  fill
                  sizes="(max-width: 768px) 100vw, 80px"
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
              sizes="(max-width: 640px) 90vw, (max-width: 768px) 80vw, (max-width: 1200px) 40vw, 500px"
              className="object-cover"
            />
            {/* Next/Prev buttons for image gallery - from Figma */}
            <div className="absolute bottom-2 right-2 sm:bottom-3 sm:right-3 md:bottom-4 md:right-4">
              <div className="bg-white rounded-full p-1.5 sm:p-2 md:p-2.5 shadow-md cursor-pointer hover:bg-gray-100 transition-colors">
                <svg width="16" height="16" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5">
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
