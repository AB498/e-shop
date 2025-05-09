'use client';
import React from 'react';
import Image from 'next/image';

const ModalProductImages = ({ product }) => {
  return (
    <div className="w-full md:w-2/5 p-4 md:p-5">
      <div className="flex gap-4">
        {/* Thumbnail list */}
        <div className="hidden md:flex flex-col gap-3 w-20">
          {[1, 2, 3, 4].map((index) => (
            <div
              key={index}
              className={`border ${index === 1 ? 'border-[#006B51]' : 'border-[#E7ECF0]'} rounded-md bg-white p-1 cursor-pointer hover:border-[#006B51] transition-colors`}
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
        <div className="flex-1 border border-[#E7ECF0] rounded-md bg-white p-1">
          <div className="relative aspect-square rounded-md overflow-hidden">
            <Image
              src={product.image || "/images/product-image.png"}
              alt={product.name || "Product Image"}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 40vw, 500px"
              className="object-cover"
            />
            {/* Next/Prev buttons for image gallery - from Figma */}
            <div className="absolute bottom-4 right-4">
              <div className="bg-white rounded-full p-2.5 shadow-md cursor-pointer hover:bg-gray-100 transition-colors">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
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
