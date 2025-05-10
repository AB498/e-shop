import React from 'react';
import Image from 'next/image';

const ProductImageGallery = ({ image, name, discountPercentage = 0 }) => {
  // Default image if none provided
  const productImage = image || "/images/product-image.png";

  // Generate thumbnail variations (in a real app, you'd have multiple images)
  const thumbnails = [
    { id: 1, src: productImage, active: true },
    { id: 2, src: productImage, active: false },
    { id: 3, src: productImage, active: false },
    { id: 4, src: productImage, active: false },
  ];

  return (
    <div className="w-full md:w-1/2 lg:w-2/5 fluid-p">
      {/* Main Product Image */}
      <div className="relative aspect-square mb-4 border border-[#ECECEC] rounded-[15px] overflow-hidden bg-white">
        <Image
          src={productImage}
          alt={name || "Product"}
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
        {thumbnails.map((thumbnail) => (
          <div
            key={thumbnail.id}
            className={`relative border rounded-[10px] overflow-hidden flex-shrink-0 ${
              thumbnail.active
                ? 'border-[#3BB77E] shadow-[5px_5px_15px_0px_rgba(0,0,0,0.05)]'
                : 'border-[#ECECEC]'
            }`}
            style={{
              width: 'clamp(60px, 15vw, 96px)',
              height: 'clamp(60px, 15vw, 96px)'
            }}
          >
            <Image
              src={thumbnail.src}
              alt={`${name || "Product"} Thumbnail ${thumbnail.id}`}
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
