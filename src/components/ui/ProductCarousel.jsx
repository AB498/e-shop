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
import { useWishlist } from "@/context/WishlistContext";
import { toast } from "react-hot-toast";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

// Wishlist Button Component
const WishlistButton = ({ product }) => {
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const [isWishlistLoading, setIsWishlistLoading] = useState(false);
  const productInWishlist = isInWishlist(product.id);

  const handleWishlistClick = (e) => {
    e.preventDefault();
    e.stopPropagation();

    // Prevent multiple clicks
    if (isWishlistLoading) return;

    setIsWishlistLoading(true);

    if (productInWishlist) {
      removeFromWishlist(product.id).then(result => {
        if (result.success) {
          toast.success('Removed from wishlist');
        } else {
          toast.error(result.message || 'Failed to remove from wishlist');
        }
      }).finally(() => {
        setIsWishlistLoading(false);
      });
    } else {
      addToWishlist(product).then(result => {
        if (result.success) {
          toast.success('Added to wishlist');
        } else {
          toast.error(result.message || 'Failed to add to wishlist');
        }
      }).finally(() => {
        setIsWishlistLoading(false);
      });
    }
  };

  return (
    <button
      onClick={handleWishlistClick}
      className="p-0 transition-all"
      aria-label={productInWishlist ? "Remove from wishlist" : "Add to wishlist"}
    >
      {isWishlistLoading ? (
        <div className="w-3 h-3 sm:w-4 sm:h-4 border-[1.5px] border-[#FF3E3E] border-t-transparent rounded-full animate-spin"></div>
      ) : (
        <Image
          src={productInWishlist
            ? "/images/wishlist/wishlist-icon-filled.svg"
            : "/images/wishlist/wishlist-icon-outline.svg"}
          alt="Wishlist"
          width={16}
          height={16}
          className="w-3 h-3 sm:w-4 sm:h-4 cursor-pointer transition-all"
        />
      )}
    </button>
  );
};

/**
 * A reusable product carousel component
 *
 * @param {Object} props
 * @param {Array} props.products - Array of product objects to display
 * @param {string} props.title - Title of the carousel
 * @param {string} props.icon - Path to the icon image
 * @param {string} props.className - Additional CSS classes
 * @param {Object} props.breakpoints - Custom breakpoints for responsive design
 * @returns {JSX.Element}
 */
export default function ProductCarousel({
  products = [],
  title = "",
  icon = "",
  className = "",
  breakpoints = {
    320: {
      slidesPerView: 2,
      spaceBetween: 4,
    },
    480: {
      slidesPerView: 2.5,
      spaceBetween: 6,
    },
    640: {
      slidesPerView: 3,
      spaceBetween: 8,
    },
    768: {
      slidesPerView: 4,
      spaceBetween: 8,
    },
    1024: {
      slidesPerView: 6,
      spaceBetween: 8,
    },
    1280: {
      slidesPerView: 7,
      spaceBetween: 8,
    },
  }
}) {
  const prevRef = useRef(null);
  const nextRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
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

  return (
    <section className={`py-2 sm:py-3 md:py-4 relative ${className}`}>
      {/* Section title */}
      {(title || icon) && (
        <div className="container mx-auto px-2 sm:px-3">
          <div className="flex items-center mb-2 sm:mb-3 relative">
            <div className="flex items-center gap-1 sm:gap-2">
              {icon && (
                <img
                  src={icon}
                  className="h-5 w-5 sm:h-6 sm:w-6 aspect-square object-contain"
                  alt={title}
                />
              )}
              {title && <h2 className="text-sm sm:text-base md:text-lg font-semibold">{title}</h2>}
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
              <div className="absolute top-1/2 transform -translate-x-1/3 -translate-y-full z-10 hidden sm:block">
                <button
                  ref={prevRef}
                  className="bg-white left-0 rounded-sm p-1 sm:p-1.5 shadow-sm hover:bg-gray-50 transition-colors"
                  aria-label="Previous slide"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-2 h-2 sm:w-2.5 sm:h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
              </div>

              <div className="absolute right-0 top-1/2 transform translate-x-1/3 -translate-y-full z-10 hidden sm:block">
                <button
                  ref={nextRef}
                  className="bg-white rounded-sm p-1 sm:p-1.5 shadow-md hover:bg-gray-50 transition-colors"
                  aria-label="Next slide"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-2 h-2 sm:w-2.5 sm:h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </>
          )}

          <div className={`overflow-hidden ${!enableSwiping ? 'w-full' : ''}`}>
            <Swiper
              modules={[Navigation, Pagination, A11y]}
              spaceBetween={18}
              slidesPerView={2}
              navigation={{
                prevEl: prevRef.current,
                nextEl: nextRef.current,
              }}
              pagination={enableSwiping ? {
                clickable: true,
                dynamicBullets: true,
                dynamicMainBullets: 1
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
              className={`px-2 overflow-visible py-6`}
              loop={false}
              loopFillGroupWithBlank={false}
              rewind={false}
              allowTouchMove={enableSwiping}
              breakpoints={breakpoints}
            >
              {products.map((product) => (
                <SwiperSlide key={product.id} className={'w-full sm:max-w-[220px] mx-auto'}>
                  <div className="bg-white rounded-md shadow-md overflow-hidden relative h-full sm:max-h-[280px]">
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
                            width={140}
                            height={140}
                            className="w-full h-full object-cover rounded-[4px] sm:rounded-[6px] transition-transform duration-300 hover:scale-105"
                          />

                          {/* Quick view overlay */}
                          <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center opacity-0 hover:opacity-100">
                            <span className="bg-white text-black px-1.5 py-0.5 sm:px-2 sm:py-0.5 rounded-full font-medium text-[8px] sm:text-[10px]">View</span>
                          </div>

                          {/* Discount tag */}
                          <div className="absolute top-0.5 sm:top-1 left-0.5 sm:left-1">
                            <div className="bg-[#006B51] text-white px-0.5 py-0 sm:px-1 sm:py-0.5 rounded-sm text-[8px] sm:text-[9px] font-semibold">
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
                            width={220}
                            height={220}
                            className="w-full h-full object-cover rounded-[6px] sm:rounded-[8px] transition-transform duration-300 hover:scale-105"
                          />

                          {/* Discount tag */}
                          <div className="absolute top-1 sm:top-1.5 left-1 sm:left-1.5">
                            <div className="bg-[#006B51] text-white px-1 py-0.5 sm:px-1.5 sm:py-0.5 rounded-md text-[9px] sm:text-[10px] font-semibold">
                              -10%
                            </div>
                          </div>
                        </div>
                      </Link>
                    )}

                    {/* Wishlist icon */}
                    <div className="absolute top-0.5 sm:top-1 right-0.5 sm:right-1">
                      <WishlistButton product={product} />
                    </div>

                    {/* Product Info */}
                    <div className="p-1 sm:p-1.5 text-center">
                      <p className="text-[#A9A9A9] text-[8px] sm:text-[9px] font-semibold uppercase">{product.category}</p>
                      <Link href={`/products/${product.id}`}>
                        <h3 className="text-[#3F3F3F] text-[10px] sm:text-xs font-semibold mt-0.5 line-clamp-1 hover:text-[#006B51] transition-colors">
                          {product.name}
                        </h3>
                      </Link>

                      {/* Price */}
                      <div className="mt-0.5 flex items-center justify-center gap-0.5 sm:gap-1">
                        <span className="text-[#006B51] text-[9px] sm:text-[10px] font-semibold">৳{product.discountPrice}</span>
                        <span className="text-[#E12625] text-[9px] sm:text-[10px] font-normal line-through">৳{product.price}</span>
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
