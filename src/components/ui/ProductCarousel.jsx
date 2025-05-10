"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
// Import Swiper and required modules
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, A11y } from "swiper/modules";
import ProductCarouselSkeleton from "./ProductCarouselSkeleton";
import { useProductQuickView } from "@/context/ProductQuickViewContext";
import { usePathname } from "next/navigation";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

/**
 * A reusable product carousel component
 *
 * @param {Object} props
 * @param {Array} props.products - Array of product objects to display
 * @param {string} props.title - Title of the carousel
 * @param {string} props.icon - Path to the icon image
 * @param {string} props.className - Additional CSS classes
 * @param {Object} props.breakpoints - Custom breakpoints for responsive design
 * @param {string} props.carouselClassName - Additional CSS classes for the carousel
 * @returns {JSX.Element}
 */
export default function ProductCarousel({
  products = [],
  title = "",
  icon = "",
  className = "",
  breakpoints = {
    320: {
      slidesPerView: 1.5,
      spaceBetween: 8,
    },
    480: {
      slidesPerView: 2,
      spaceBetween: 12,
    },
    640: {
      slidesPerView: 2.5,
      spaceBetween: 16,
    },
    768: {
      slidesPerView: 3,
      spaceBetween: 16,
    },
    1024: {
      slidesPerView: 5,
      spaceBetween: 16,
    },
    1280: {
      slidesPerView: 6,
      spaceBetween: 16,
    },
  },
  carouselClassName = "product-carousel"
}) {
  const prevRef = useRef(null);
  const nextRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const { openQuickView } = useProductQuickView();
  const pathname = usePathname();

  // Check if we're on the landing page
  const isLandingPage = pathname === "/";

  // Check if we have enough products to enable swiping
  const enableSwiping = products.length > 1;

  // Set loading to false after Swiper is initialized
  useEffect(() => {
    // Check if products are loaded
    if (products.length > 0) {
      // Simulate loading time or wait for resources to load
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 800); // Adjust timing as needed - shorter time for better UX

      return () => clearTimeout(timer);
    } else {
      // If no products, no need to show loading state
      setIsLoading(false);
    }
  }, [products]);

  // Show skeleton while loading
  if (isLoading || !products.length) {
    return (
      <ProductCarouselSkeleton
        title={title}
        hasIcon={!!icon}
        className={className}
        itemCount={Math.min(products.length, 6) || 6}
        breakpoints={breakpoints}
      />
    );
  }

  console.log('products',products);
  return (
    <section className={`py-4 sm:py-6 md:py-8 relative ${className}`}>
      {/* Section title */}
      {(title || icon) && (
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex items-center mb-4 sm:mb-6 relative">
            <div className="flex items-center gap-2 sm:gap-4">
              {icon && (
                <img
                  src={icon}
                  className="h-7 w-7 sm:h-10 sm:w-10 aspect-square object-contain"
                  alt={title}
                />
              )}
              {title && <h2 className="text-lg sm:text-xl md:text-2xl font-semibold">{title}</h2>}
            </div>
          </div>
        </div>
      )}

      {/* Products carousel */}
      {products.length === 0 ? (
        // No products found
        <div className="container mx-auto px-4 py-4 sm:py-6 md:py-8 text-center">
          <p className="text-gray-500 text-sm sm:text-base">No products found.</p>
        </div>
      ) : (
        <div className={`relative carousel-container overflow-visible ${!enableSwiping ? 'px-4 sm:container sm:mx-auto' : ''}`}>
          {/* Navigation Arrows - Positioned on the edges with 50% offset */}


          {enableSwiping && (
            <>
              <div className="absolute top-1/2 transform -translate-x-1/2 -translate-y-full z-10 hidden sm:block">
                <button
                  ref={prevRef}
                  className="bg-white left-0 rounded-lg p-2 sm:p-3 shadow-lg hover:bg-gray-50 transition-colors"
                  aria-label="Previous slide"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3 sm:w-4 sm:h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
              </div>

              <div className="absolute right-0 top-1/2 transform translate-x-1/2 -translate-y-full z-10 hidden sm:block">
                <button
                  ref={nextRef}
                  className="bg-white rounded-lg p-2 sm:p-3 shadow-lg hover:bg-gray-50 transition-colors"
                  aria-label="Next slide"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3 sm:w-4 sm:h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </>
          )}

          <div className={`overflow-hidden ${!enableSwiping ? 'w-full' : ''}`}>
            <Swiper
              modules={[Navigation, Pagination, A11y]}
              spaceBetween={8}
              slidesPerView="auto"
              navigation={{
                prevEl: prevRef.current,
                nextEl: nextRef.current,
              }}
              pagination={enableSwiping ? {
                clickable: true,
                dynamicBullets: true,
                dynamicMainBullets: 3
              } : false}
              onInit={(swiper) => {
                // Override navigation after swiper initialization
                swiper.params.navigation.prevEl = prevRef.current;
                swiper.params.navigation.nextEl = nextRef.current;
                swiper.navigation.init();
                swiper.navigation.update();

                // Ensure loading state is set to false when Swiper is fully initialized
                setIsLoading(false);
              }}
              className={`px-4 sm:px-0 ${carouselClassName}`}
              loop={false}
              loopFillGroupWithBlank={false}
              slidesPerGroupAuto={true}
              rewind={false}
              allowTouchMove={enableSwiping}
            >
              {products.map((product) => (
                <SwiperSlide key={product.id} className={`${enableSwiping ? '!w-[calc(100vw-32px)] sm:!w-[calc(50vw-32px)] md:!w-[calc(33.333vw-32px)] lg:!w-[calc(25vw-32px)] xl:!w-[calc(20vw-32px)] 2xl:!w-[calc(16.666vw-32px)]' : 'w-full sm:max-w-[320px] mx-auto'}`}>
                  <div className="bg-white rounded-lg shadow-md overflow-hidden relative h-full max-h-[320px] sm:max-h-[360px]">
                    {/* Product Image with Link or Quick View */}
                    {isLandingPage ? (
                      <div
                        className="block cursor-pointer"
                        onClick={() => openQuickView(product)}
                      >
                        <div className="aspect-square relative">
                          <Image
                            src={product.image || "/images/product-image.png"}
                            alt={product.name}
                            width={240}
                            height={240}
                            className="w-full h-full object-cover rounded-[8px] sm:rounded-[10px] transition-transform duration-300 hover:scale-105"
                          />

                          {/* Quick view overlay */}
                          <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center opacity-0 hover:opacity-100">
                            <span className="bg-white text-black px-3 py-1 sm:px-4 sm:py-2 rounded-full font-medium text-xs sm:text-sm">View</span>
                          </div>

                          {/* Discount tag */}
                          <div className="absolute top-1 sm:top-2 left-1 sm:left-2">
                            <div className="bg-[#006B51] text-white px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-lg text-[10px] sm:text-xs font-semibold">
                              -10%
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <Link href={`/products/${product.id}`} className="block">
                        <div className="aspect-square relative">
                          <Image
                            src={product.image || "/images/product-image.png"}
                            alt={product.name}
                            width={240}
                            height={240}
                            className="w-full h-full object-cover rounded-[8px] sm:rounded-[10px] transition-transform duration-300 hover:scale-105"
                          />

                          {/* Discount tag */}
                          <div className="absolute top-1 sm:top-2 left-1 sm:left-2">
                            <div className="bg-[#006B51] text-white px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-lg text-[10px] sm:text-xs font-semibold">
                              -10%
                            </div>
                          </div>
                        </div>
                      </Link>
                    )}

                    {/* Wishlist icon */}
                    <div className="absolute top-1 sm:top-2 right-1 sm:right-2">
                      <Image
                        src="/images/beauty-makeup/wishlist-icon.png"
                        alt="Add to wishlist"
                        width={20}
                        height={20}
                        className="w-5 h-5 sm:w-6 sm:h-6 cursor-pointer"
                      />
                    </div>

                    {/* Product Info */}
                    <div className="p-2 sm:p-3 text-center">
                      <p className="text-[#A9A9A9] text-[10px] sm:text-xs font-semibold uppercase">{product.category}</p>
                      <Link href={`/products/${product.id}`}>
                        <h3 className="text-[#3F3F3F] text-sm sm:text-base font-semibold mt-0.5 sm:mt-1 line-clamp-1 hover:text-[#006B51] transition-colors">
                          {product.name}
                        </h3>
                      </Link>

                      {/* Price */}
                      <div className="mt-1 sm:mt-2 flex items-center justify-center gap-1 sm:gap-2">
                        <span className="text-[#006B51] text-xs sm:text-sm font-semibold">৳{product.discountPrice}</span>
                        <span className="text-[#E12625] text-xs sm:text-sm font-normal line-through">৳{product.price}</span>
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      )}
    </section>
  );
}
