import React from 'react';
import Image from 'next/image';

const ProductImageGallery = () => {
  return (
    <div className="w-full md:w-1/2 lg:w-2/5">
      {/* Main Product Image */}
      <div className="relative h-[400px] mb-4 border border-[#ECECEC] rounded-[15px] overflow-hidden">
        <Image 
          src="/images/product-image.png" 
          alt="Product" 
          fill
          className="object-contain"
        />
        <div className="absolute top-4 left-4">
          <div className="bg-[#E12625] text-white text-sm font-bold py-1 px-3 rounded-[5px]">
            Sale Off
          </div>
        </div>
      </div>
      
      {/* Thumbnail Images */}
      <div className="flex gap-3">
        <div className="relative w-24 h-24 border border-[#3BB77E] rounded-[10px] overflow-hidden shadow-[5px_5px_15px_0px_rgba(0,0,0,0.05)]">
          <Image 
            src="/images/product-image.png" 
            alt="Product Thumbnail" 
            fill
            className="object-contain"
          />
        </div>
        <div className="relative w-24 h-24 border border-[#ECECEC] rounded-[10px] overflow-hidden">
          <Image 
            src="/images/product-image.png" 
            alt="Product Thumbnail" 
            fill
            className="object-contain"
          />
        </div>
        <div className="relative w-24 h-24 border border-[#ECECEC] rounded-[10px] overflow-hidden">
          <Image 
            src="/images/product-image.png" 
            alt="Product Thumbnail" 
            fill
            className="object-contain"
          />
        </div>
        <div className="relative w-24 h-24 border border-[#ECECEC] rounded-[10px] overflow-hidden">
          <Image 
            src="/images/product-image.png" 
            alt="Product Thumbnail" 
            fill
            className="object-contain"
          />
        </div>
      </div>
    </div>
  );
};

export default ProductImageGallery;
