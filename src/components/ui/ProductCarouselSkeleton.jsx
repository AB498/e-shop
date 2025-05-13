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
    <section className={`py-2 sm:py-3 md:py-4 relative ${className}`}>
      {/* Section title skeleton */}
      {(title || hasIcon) && (
        <div className="container mx-auto px-2 sm:px-3">
          <div className="flex items-center mb-2 sm:mb-3 relative">
            <div className="flex items-center gap-1 sm:gap-2">
              {hasIcon && (
                <div className="h-5 w-5 sm:h-6 sm:w-6 rounded-full bg-gray-200 animate-pulse"></div>
              )}
              {title && (
                <div className="h-4 sm:h-5 w-24 sm:w-32 bg-gray-200 rounded animate-pulse"></div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Products carousel skeleton */}
      <div className="relative carousel-container overflow-visible">
        {/* Navigation Arrows - Positioned on the edges with 50% offset */}
        <div className="absolute top-1/2 transform -translate-x-1/3 -translate-y-full z-10 hidden sm:block">
          <div className="bg-gray-200 rounded-sm p-1 sm:p-1.5 w-4 h-4 sm:w-5 sm:h-5 animate-pulse"></div>
        </div>

        <div className="absolute right-0 top-1/2 transform translate-x-1/3 -translate-y-full z-10 hidden sm:block">
          <div className="bg-gray-200 rounded-sm p-1 sm:p-1.5 w-4 h-4 sm:w-5 sm:h-5 animate-pulse"></div>
        </div>

        <div className="overflow-hidden">
          {/* Skeleton slides - Single row */}
          <div className="px-4 sm:container sm:mx-auto">
            <div className="flex flex-nowrap overflow-hidden gap-3 sm:gap-4 pb-2">
              {Array.from({ length: itemCount }).map((_, index) => (
                <div
                  key={index}
                  className="flex-shrink-0 bg-white rounded-md shadow-md overflow-hidden relative h-full sm:max-h-[280px] w-[calc(40vw-16px)] sm:w-[calc(25vw-16px)] md:w-[calc(20vw-16px)] lg:w-[calc(12.666vw-16px)] xl:w-[calc(10.285vw-16px)] 2xl:w-[calc(8.5vw-16px)]"
                >
                  {/* Product Image skeleton */}
                  <div className="aspect-square relative bg-gray-200 animate-pulse rounded-[4px] sm:rounded-[6px]">
                    {/* Discount tag skeleton */}
                    <div className="absolute top-0.5 sm:top-1 left-0.5 sm:left-1">
                      <div className="bg-gray-300 w-6 h-3 sm:w-8 sm:h-4 rounded-sm animate-pulse"></div>
                    </div>

                    {/* Wishlist icon skeleton */}
                    <div className="absolute top-0.5 sm:top-1 right-0.5 sm:right-1">
                      <div className="w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-gray-300 animate-pulse"></div>
                    </div>
                  </div>

                  {/* Product Info skeleton */}
                  <div className="p-1 sm:p-1.5 text-center">
                    <div className="h-2 sm:h-2.5 w-12 sm:w-16 mx-auto bg-gray-200 rounded animate-pulse mb-0.5 sm:mb-1"></div>
                    <div className="h-2.5 sm:h-3 w-16 sm:w-20 mx-auto bg-gray-200 rounded animate-pulse mb-0.5 sm:mb-1"></div>

                    {/* Price skeleton */}
                    <div className="mt-0.5 flex items-center justify-center gap-0.5 sm:gap-1">
                      <div className="h-2 sm:h-2.5 w-8 sm:w-10 bg-gray-200 rounded animate-pulse"></div>
                      <div className="h-2 sm:h-2.5 w-8 sm:w-10 bg-gray-200 rounded animate-pulse"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pagination skeleton */}
          <div className="flex justify-center mt-2 sm:mt-3 gap-1 sm:gap-1.5">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-gray-200 animate-pulse"></div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
