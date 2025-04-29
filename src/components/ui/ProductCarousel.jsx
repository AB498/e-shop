"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
// Import Swiper and required modules
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, A11y } from "swiper/modules";
import ProductCarouselSkeleton from "./ProductCarouselSkeleton";

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
    640: {
      slidesPerView: 2,
      spaceBetween: 16,
    },
    768: {
      slidesPerView: 3,
      spaceBetween: 16,
    },
    1024: {
      slidesPerView: 6,
      spaceBetween: 16,
    },
  },
  carouselClassName = "product-carousel"
}) {
  const prevRef = useRef(null);
  const nextRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);

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
  if (isLoading) {
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

  return (
    <section className={`py-8 relative ${className}`}>
      {/* Section title */}
      {(title || icon) && (
        <div className="container mx-auto ">
          <div className="flex items-center mb-6 relative">
            <div className="flex items-center gap-4">
              {icon && (
                <img
                  src={icon}
                  className="h-10 aspect-square object-contain"
                  alt={title}
                />
              )}
              {title && <h2 className="text-2xl font-semibold">{title}</h2>}
            </div>
          </div>
        </div>
      )}

      {/* Products carousel */}
      {products.length === 0 ? (
        // No products found
        <div className="container mx-auto px-4 py-8 text-center">
          <p className="text-gray-500">No products found.</p>
        </div>
      ) : (
        <div className="relative carousel-container overflow-visible">
          {/* Navigation Arrows - Positioned on the edges with 50% offset */}


          <div className="absolute top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
            <button
              ref={prevRef}
              className="bg-white left-0 rounded-lg p-3 shadow-lg hover:bg-gray-50 transition-colors"
              aria-label="Previous slide"
            >
              <Image
                src="/images/categories/arrow-right.png"
                alt="Previous"
                width={16}
                height={16}
              />
            </button>
          </div>

          <div className="absolute right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2 z-10">
            <button
              ref={nextRef}
              className="bg-white rounded-lg p-3 shadow-lg hover:bg-gray-50 transition-colors"
              aria-label="Next slide"
            >
              <Image
                src="/images/categories/arrow-left.png"
                alt="Next"
                width={16}
                height={16}
              />
            </button>
          </div>

          <div className="overflow-hidden">
            <Swiper
              modules={[Navigation, Pagination, A11y]}
              spaceBetween={16}
              slidesPerView={1}
              navigation={{
                prevEl: prevRef.current,
                nextEl: nextRef.current,
              }}
              pagination={{ clickable: true }}
              breakpoints={breakpoints}
              onInit={(swiper) => {
                // Override navigation after swiper initialization
                swiper.params.navigation.prevEl = prevRef.current;
                swiper.params.navigation.nextEl = nextRef.current;
                swiper.navigation.init();
                swiper.navigation.update();

                // Ensure loading state is set to false when Swiper is fully initialized
                setIsLoading(false);
              }}
              className={carouselClassName}
            >
              {products.map((product) => (
                <SwiperSlide key={product.id}>
                  <div className="bg-white rounded-lg shadow-md overflow-hidden relative h-full max-h-[360px]">
                    {/* Product Image with Link */}
                    <Link href={`/products/${product.id}`} className="block">
                      <div className="aspect-square relative">
                        <Image
                          src={product.image || "/images/product-image.png"}
                          alt={product.name}
                          width={240}
                          height={240}
                          className="w-full h-full object-cover rounded-[10px] transition-transform duration-300 hover:scale-105"
                          />

                        {/* Discount tag */}
                        <div className="absolute top-2 left-2">
                          <div className="bg-[#006B51] text-white px-2 py-1 rounded-lg text-xs font-semibold">
                            -10%
                          </div>
                        </div>

                        {/* Wishlist icon */}
                        <div className="absolute top-2 right-2">
                          <Image
                            src="/images/beauty-makeup/wishlist-icon.png"
                            alt="Add to wishlist"
                            width={24}
                            height={24}
                            className="cursor-pointer"
                          />
                        </div>
                      </div>
                    </Link>

                    {/* Product Info */}
                    <div className="p-3 text-center">
                      <p className="text-[#A9A9A9] text-xs font-semibold uppercase">{product.category}</p>
                      <Link href={`/products/${product.id}`}>
                        <h3 className="text-[#3F3F3F] text-base font-semibold mt-1 line-clamp-1 hover:text-[#006B51] transition-colors">
                          {product.name}
                        </h3>
                      </Link>

                      {/* Price */}
                      <div className="mt-2 flex items-center justify-center gap-2">
                        <span className="text-[#006B51] text-sm font-semibold">৳{product.discountPrice}</span>
                        <span className="text-[#E12625] text-sm font-normal line-through">৳{product.price}</span>
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
