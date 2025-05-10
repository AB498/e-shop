'use client';
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

const ModalRelatedProducts = ({ products = [], isLoading = false, formatPrice }) => {
  return (
    <div className="mt-4 sm:mt-6 md:mt-8 px-2 sm:px-4 md:px-10 pb-3 sm:pb-4 md:pb-6">
      <div className="bg-[#A4A4A4] text-black py-1 sm:py-1.5 md:py-2 px-2 sm:px-3 md:px-4 rounded-md mb-2 sm:mb-3 md:mb-4 flex justify-between items-center">
        <h3 className="font-semibold text-base sm:text-lg md:text-xl lg:text-2xl">Related Products</h3>
        <div className="flex gap-1 sm:gap-2">
          <button className="bg-[#006B51] p-1 sm:p-1.5 rounded-md">
            <svg width="16" height="16" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5">
              <path d="M12.5 15L7.5 10L12.5 5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <button className="bg-white p-1 sm:p-1.5 rounded-md">
            <svg width="16" height="16" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5">
              <path d="M7.5 15L12.5 10L7.5 5" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Related Products Grid - 4 products per row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
        {isLoading ? (
          // Loading state - show skeleton loaders
          Array(4).fill(0).map((_, index) => (
            <div key={index} className="bg-white rounded-lg overflow-hidden shadow-sm animate-pulse">
              <div className="relative">
                <div className="aspect-square bg-gray-200"></div>
              </div>
              <div className="p-2 sm:p-3">
                <div className="h-2 sm:h-3 bg-gray-200 rounded w-1/3 mb-1 sm:mb-2"></div>
                <div className="h-3 sm:h-4 bg-gray-200 rounded w-3/4 mb-1 sm:mb-2"></div>
                <div className="h-2 sm:h-3 bg-gray-200 rounded w-1/4"></div>
              </div>
            </div>
          ))
        ) : products.length > 0 ? (
          // Show actual products
          products.map((product) => (
            <Link href={`/products/${product.id}`} key={product.id} className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <div className="relative">
                {/* Product image */}
                <div className="relative aspect-square">
                  <Image
                    src={product.image || "/images/product-image.png"}
                    alt={product.name}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 250px"
                    className="object-cover"
                  />
                </div>

                {/* Discount tag - show if there's a discount */}
                {product.price !== product.discountPrice && (
                  <div className="absolute top-1 left-1 sm:top-2 sm:left-2 bg-[#006B51] text-white text-[10px] xs:text-xs font-semibold px-1 py-0.5 sm:px-2 sm:py-1 rounded-md">
                    {Math.round((1 - (parseFloat(product.discountPrice) / parseFloat(product.price))) * 100)}%
                  </div>
                )}

                {/* Wishlist icon */}
                <button
                  className="absolute top-1 right-1 sm:top-2 sm:right-2 bg-white p-1 sm:p-1.5 rounded-full shadow-sm"
                  onClick={(e) => {
                    e.preventDefault(); // Prevent navigation
                    // Add wishlist functionality here if needed
                  }}
                >
                  <svg width="12" height="12" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-3 h-3 sm:w-4 sm:h-4">
                    <path d="M13 22.75C13 22.75 2.4375 16.25 2.4375 8.9375C2.4375 7.5625 2.92188 6.23438 3.80078 5.19531C4.67969 4.15625 5.89844 3.5 7.3125 3.5C9.5 3.5 11.375 4.8125 13 7C14.625 4.8125 16.5 3.5 18.6875 3.5C20.1016 3.5 21.3203 4.15625 22.1992 5.19531C23.0781 6.23438 23.5625 7.5625 23.5625 8.9375C23.5625 16.25 13 22.75 13 22.75Z" stroke="#000000" strokeWidth="0.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>

              {/* Product info */}
              <div className="p-2 sm:p-3">
                <p className="text-[#A9A9A9] text-[10px] xs:text-xs uppercase font-semibold mb-0.5 sm:mb-1">{product.category}</p>
                <h4 className="text-[#3F3F3F] font-semibold mb-1 sm:mb-2 text-xs sm:text-sm truncate">{product.name}</h4>
                <div className="flex items-center">
                  {product.price !== product.discountPrice ? (
                    <>
                      <span className="text-[#E12625] text-[10px] xs:text-xs line-through mr-1 sm:mr-2">{formatPrice(product.price)}</span>
                      <span className="text-[#006B51] font-semibold text-xs sm:text-sm">{formatPrice(product.discountPrice)}</span>
                    </>
                  ) : (
                    <span className="text-[#006B51] font-semibold text-xs sm:text-sm">{formatPrice(product.price)}</span>
                  )}
                </div>
              </div>
            </Link>
          ))
        ) : (
          // No products found
          <div className="col-span-2 sm:col-span-3 md:col-span-4 py-4 sm:py-6 md:py-8 text-center text-gray-500 text-xs sm:text-sm">
            <p>No related products found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ModalRelatedProducts;
