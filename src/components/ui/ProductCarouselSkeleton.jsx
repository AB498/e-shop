"use client";

import React from 'react';

/**
 * A skeleton loading state for the ProductCarousel component
 *
 * @param {Object} props
 * @param {string} props.title - Title of the carousel
 * @param {boolean} props.hasIcon - Whether the carousel has an icon
 * @param {string} props.className - Additional CSS classes
 * @param {number} props.itemCount - Number of skeleton items to display
 * @param {Object} props.breakpoints - Custom breakpoints for responsive design
 * @returns {JSX.Element}
 */
export default function ProductCarouselSkeleton({
  title = "",
  hasIcon = false,
  className = "",
  itemCount = 6,
  breakpoints = {
    320: { slidesPerView: 1.5 },
    480: { slidesPerView: 2 },
    640: { slidesPerView: 2.5 },
    768: { slidesPerView: 3 },
    1024: { slidesPerView: 5 },
    1280: { slidesPerView: 6 }
  }
}) {
  return (
    <section className={`py-4 sm:py-6 md:py-8 relative ${className}`}>
      {/* Section title skeleton */}
      {(title || hasIcon) && (
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex items-center mb-4 sm:mb-6 relative">
            <div className="flex items-center gap-2 sm:gap-4">
              {hasIcon && (
                <div className="h-7 w-7 sm:h-10 sm:w-10 rounded-full bg-gray-200 animate-pulse"></div>
              )}
              {title && (
                <div className="h-6 sm:h-8 w-32 sm:w-48 bg-gray-200 rounded animate-pulse"></div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Products carousel skeleton */}
      <div className="relative carousel-container overflow-visible">
        {/* Navigation Arrows - Positioned on the edges with 50% offset */}
        <div className="absolute top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 hidden sm:block">
          <div className="bg-gray-200 rounded-lg p-2 sm:p-3 w-8 h-8 sm:w-10 sm:h-10 animate-pulse"></div>
        </div>

        <div className="absolute right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2 z-10 hidden sm:block">
          <div className="bg-gray-200 rounded-lg p-2 sm:p-3 w-8 h-8 sm:w-10 sm:h-10 animate-pulse"></div>
        </div>

        <div className="overflow-hidden">
          {/* Skeleton slides */}
          <div className="px-4 sm:container sm:mx-auto">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
              {Array.from({ length: itemCount }).map((_, index) => (
                <div
                  key={index}
                  className="bg-white rounded-lg shadow-md overflow-hidden relative h-full max-h-[320px] sm:max-h-[360px]"
                >
                  {/* Product Image skeleton */}
                  <div className="aspect-square relative bg-gray-200 animate-pulse rounded-[8px] sm:rounded-[10px]">
                    {/* Discount tag skeleton */}
                    <div className="absolute top-1 sm:top-2 left-1 sm:left-2">
                      <div className="bg-gray-300 w-8 h-4 sm:w-10 sm:h-5 rounded-lg animate-pulse"></div>
                    </div>

                    {/* Wishlist icon skeleton */}
                    <div className="absolute top-1 sm:top-2 right-1 sm:right-2">
                      <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-gray-300 animate-pulse"></div>
                    </div>
                  </div>

                  {/* Product Info skeleton */}
                  <div className="p-2 sm:p-3 text-center">
                    <div className="h-3 sm:h-4 w-16 sm:w-20 mx-auto bg-gray-200 rounded animate-pulse mb-1 sm:mb-2"></div>
                    <div className="h-4 sm:h-5 w-24 sm:w-32 mx-auto bg-gray-200 rounded animate-pulse mb-2 sm:mb-3"></div>

                    {/* Price skeleton */}
                    <div className="mt-1 sm:mt-2 flex items-center justify-center gap-1 sm:gap-2">
                      <div className="h-3 sm:h-4 w-12 sm:w-16 bg-gray-200 rounded animate-pulse"></div>
                      <div className="h-3 sm:h-4 w-12 sm:w-16 bg-gray-200 rounded animate-pulse"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pagination skeleton */}
          <div className="flex justify-center mt-4 sm:mt-6 gap-1.5 sm:gap-2">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-gray-200 animate-pulse"></div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
