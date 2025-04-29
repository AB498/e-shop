import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

const ProductCard = ({ product, showAddToCart = true }) => {
  const { id, name, price, image, category, discountPrice } = product;
  
  // Calculate discount percentage
  const discountPercentage = Math.round((1 - (parseFloat(discountPrice) / parseFloat(price))) * 100);
  
  return (
    <div className="bg-white rounded-[10px] p-4 shadow-sm">
      <div className="relative mb-4">
        <Link href={`/products/${id}`}>
          <div className="relative w-full h-48 overflow-hidden rounded-[10px]">
            <Image 
              src={image || "/images/products/product-image.png"} 
              alt={name} 
              width={240} 
              height={240} 
              className="w-full h-full object-cover rounded-[10px] transition-transform duration-300 hover:scale-105"
            />
          </div>
        </Link>
        
        {discountPercentage > 0 && (
          <div className="absolute top-2 left-2">
            <div className="bg-[#006B51] text-white text-xs font-semibold py-1 px-2 rounded-[10px]">
              -{discountPercentage}%
            </div>
          </div>
        )}
        
        <div className="absolute top-2 right-2">
          <Image 
            src="/images/products/wishlist-icon.png" 
            alt="Wishlist" 
            width={24} 
            height={24} 
            className="cursor-pointer hover:opacity-80 transition-opacity"
          />
        </div>
      </div>
      
      <div className="text-center">
        <div className="text-[#A9A9A9] text-xs font-semibold uppercase mb-1">
          {category}
        </div>
        
        <Link href={`/products/${id}`}>
          <h3 className="text-[#3F3F3F] text-base font-semibold mb-2 hover:text-[#006B51] transition-colors">
            {name}
          </h3>
        </Link>
        
        <div className="flex items-center justify-center space-x-2 mb-3">
          {discountPrice !== price && (
            <span className="text-[#E12625] text-sm line-through">৳{parseFloat(price).toFixed(2)}</span>
          )}
          <span className="text-[#006B51] text-sm font-medium">৳{parseFloat(discountPrice).toFixed(2)}</span>
        </div>
        
        {showAddToCart && (
          <button className="bg-[#006B51] text-white text-sm font-semibold py-2 px-4 rounded-2xl flex items-center justify-center w-full hover:bg-[#005541] transition-colors">
            <Image 
              src="/images/products/cart-icon.png" 
              alt="Cart" 
              width={16} 
              height={16} 
              className="mr-2" 
            />
            Add To Cart
          </button>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
