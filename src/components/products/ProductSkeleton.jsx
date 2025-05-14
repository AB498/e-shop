'use client';
import React from 'react';

/**
 * A skeleton loading state for product cards
 * 
 * @param {Object} props
 * @param {string} props.viewType - 'grid' or 'scroll' view type
 * @returns {JSX.Element}
 */
const ProductSkeleton = ({ viewType = 'grid' }) => {
  return (
    <div 
      className={`bg-white rounded-md overflow-hidden shadow-md hover:shadow-md transition-shadow flex flex-col ${
        viewType === 'scroll' ? 'basis-1/2 sm:basis-1/4 max-w-[240px] flex-shrink-0' : 'w-full'
      }`}
    >
      {/* Product Image Skeleton */}
      <div className={`relative ${viewType === 'scroll' ? 'h-32 xs:h-36 sm:h-40' : 'h-28 xs:h-32 sm:h-36'} bg-gray-200 animate-pulse`}>
        {/* Discount Badge Skeleton */}
        <div className="absolute top-1 left-1">
          <div className="bg-gray-300 w-8 h-4 rounded-sm animate-pulse"></div>
        </div>

        {/* Wishlist Button Skeleton */}
        <div className="absolute top-1 right-1 z-10">
          <div className="w-6 h-6 rounded-full bg-gray-300 animate-pulse"></div>
        </div>
      </div>

      {/* Product Details Skeleton */}
      <div className="p-1.5 sm:p-2 grow shadow-md rounded-md -mt-2 sm:-mt-3 mb-2 mx-1.5 sm:mx-2 bg-white relative">
        {/* Product Name Skeleton */}
        <div className="h-3 xs:h-4 bg-gray-200 rounded animate-pulse mb-1.5"></div>
        
        {/* Rating Skeleton */}
        <div className="flex items-center mb-1.5">
          <div className="flex space-x-0.5">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="w-2 h-2 xs:w-3 xs:h-3 bg-gray-200 rounded-full animate-pulse"></div>
            ))}
          </div>
          <div className="ml-1 h-2 w-6 bg-gray-200 rounded animate-pulse"></div>
        </div>

        {/* Price and Category Skeleton */}
        <div className="flex flex-wrap justify-between items-center mt-1 gap-1">
          <div className="min-w-0 flex-shrink">
            <div className="h-2 w-12 bg-gray-200 rounded animate-pulse mb-1"></div>
            <div className="flex items-center">
              <div className="h-2.5 w-10 bg-gray-200 rounded animate-pulse"></div>
              <div className="ml-1 h-2 w-8 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>

          {/* Add Button Skeleton */}
          <div className="h-4 w-10 bg-gray-300 rounded-sm animate-pulse"></div>
        </div>
      </div>
    </div>
  );
};

export default ProductSkeleton;
