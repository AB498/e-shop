"use client";

import { useRef, useState, useEffect, useCallback } from "react";
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

// Image component with fallback
const IconWithFallback = ({ src, fallbackSrc, alt, ...props }) => {
  const [imgSrc, setImgSrc] = useState(src);

  return (
    <Image
      {...props}
      src={imgSrc}
      alt={alt}
      onError={() => {
        setImgSrc(fallbackSrc);
      }}
    />
  );
};

// Custom styles for hiding pagination on mobile
const customStyles = `
  @media (max-width: 640px) {
    .swiper-pagination {
      display: none !important;
    }
  }
`;

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
        <IconWithFallback
          src={productInWishlist
            ? "/images/wishlist/wishlist-icon-filled.svg"
            : "/images/wishlist/wishlist-icon-outline.svg"}
          fallbackSrc="/images/wishlist/wishlist-icon-outline.svg"
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
  const prevRefRow1 = useRef(null);
  const nextRefRow1 = useRef(null);
  const prevRefRow2 = useRef(null);
  const nextRefRow2 = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const { openQuickView } = useProductQuickView();
  const pathname = usePathname();

  // Check if we're on mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };

    // Initial check
    checkMobile();

    // Add event listener for window resize
    window.addEventListener('resize', checkMobile);

    // Cleanup
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Calculate max items per row based on screen size and breakpoints
  const getMaxItemsPerRow = useCallback(() => {
    // Default to largest breakpoint
    let maxItems = breakpoints[1280]?.slidesPerView || 7; // Default for 1280+ screens

    // Check window width and determine max items based on breakpoints
    if (typeof window !== 'undefined') {
      const width = window.innerWidth;

      // Find the appropriate breakpoint for the current width
      const breakpointKeys = Object.keys(breakpoints)
        .map(Number)
        .sort((a, b) => a - b);

      // Find the largest breakpoint that is smaller than or equal to the current width
      for (let i = breakpointKeys.length - 1; i >= 0; i--) {
        if (width >= breakpointKeys[i]) {
          return breakpoints[breakpointKeys[i]].slidesPerView;
        }
      }

      // If no matching breakpoint, use the smallest one
      if (breakpointKeys.length > 0) {
        return breakpoints[breakpointKeys[0]].slidesPerView;
      }
    }

    return maxItems;
  }, [breakpoints]);

  // State to track max items per row
  const [maxItemsPerRow, setMaxItemsPerRow] = useState(7);

  // Update max items on resize
  useEffect(() => {
    const updateMaxItems = () => {
      setMaxItemsPerRow(getMaxItemsPerRow());
    };

    // Initial calculation
    updateMaxItems();

    // Add event listener
    window.addEventListener('resize', updateMaxItems);

    // Cleanup
    return () => window.removeEventListener('resize', updateMaxItems);
  }, [getMaxItemsPerRow]);

  // Split products into two rows, distributing them evenly when there are enough products
  const splitProducts = useCallback(() => {
    if (!products.length) return [[], []];

    // Round down to ensure we don't exceed the max items
    const firstRowCount = Math.floor(maxItemsPerRow);

    // Minimum number of products needed to activate the first row scrolling
    // We need at least 80% of maxItemsPerRow + 1 to make it scrollable
    const minForScrolling = Math.ceil(firstRowCount * 0.8) + 1;

    // If we don't have enough products to make the first row scrollable,
    // put all products in the first row
    if (products.length <= minForScrolling) {
      return [products, []];
    }

    // If we have enough for first row scrolling but not enough for two full rows,
    // ensure first row is filled to capacity before adding to second row
    if (products.length <= firstRowCount + minForScrolling) {
      // First fill the first row to capacity
      const firstRow = products.slice(0, firstRowCount);
      // Any remaining products go to the second row
      const secondRow = products.slice(firstRowCount);

      return [firstRow, secondRow];
    }

    // If we have enough products for both rows to be scrollable,
    // distribute them evenly
    if (products.length < 2 * firstRowCount + 2) {
      // Calculate how many items should go in each row to make them both scrollable
      const itemsPerRow = Math.ceil(products.length / 2);

      // Ensure first row has enough items to be scrollable
      const firstRow = products.slice(0, itemsPerRow);
      const secondRow = products.slice(itemsPerRow);

      return [firstRow, secondRow];
    }

    // If we have enough products to fill both rows completely
    // Distribute them evenly between the two rows

    // For products that exceed 2*firstRowCount, we'll still distribute them evenly
    // between the two rows to ensure both rows remain scrollable
    const totalProducts = products.length;
    const halfProducts = Math.ceil(totalProducts / 2);

    // Ensure we don't exceed max items per row if specified
    // But allow more items if needed to ensure even distribution
    const firstRowItems = Math.min(halfProducts, Math.max(firstRowCount, Math.floor(totalProducts / 2)));

    const firstRow = products.slice(0, firstRowItems);
    const secondRow = products.slice(firstRowItems);

    return [firstRow, secondRow];
  }, [products, maxItemsPerRow]);

  // State for the split products
  const [firstRowProducts, setFirstRowProducts] = useState([]);
  const [secondRowProducts, setSecondRowProducts] = useState([]);

  // Update product rows when products or maxItemsPerRow changes
  useEffect(() => {
    const [firstRow, secondRow] = splitProducts();

    // Debug log to understand product distribution
    console.log(`Products split: ${firstRow.length} in first row, ${secondRow.length} in second row (max per row: ${maxItemsPerRow}, total products: ${products.length})`);

    setFirstRowProducts(firstRow);
    setSecondRowProducts(secondRow);
  }, [products, maxItemsPerRow, splitProducts]);

  // Check if we're on the landing page
  const isLandingPage = pathname === "/";

  // Check if we have enough products to enable swiping for each row
  // We need more products than can fit in the viewport to enable swiping
  const minForScrolling = Math.ceil(maxItemsPerRow * 0.8) + 1;
  const enableSwipingRow1 = firstRowProducts.length >= minForScrolling;
  const enableSwipingRow2 = secondRowProducts.length >= minForScrolling;

  // References to swiper instances
  const swiperRef1 = useRef(null);
  const swiperRef2 = useRef(null);

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

  // Update pagination when mobile state changes
  useEffect(() => {
    if (swiperRef1.current) {
      swiperRef1.current.pagination.enabled = !isMobile && enableSwipingRow1;
      swiperRef1.current.pagination.update();
    }

    if (swiperRef2.current) {
      swiperRef2.current.pagination.enabled = !isMobile && enableSwipingRow2;
      swiperRef2.current.pagination.update();
    }
  }, [isMobile, enableSwipingRow1, enableSwipingRow2]);

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
      {/* Apply custom styles */}
      <style dangerouslySetInnerHTML={{ __html: customStyles }} />
      {/* Section title */}
      {(title || icon) && (
        <div className="container mx-auto px-2 sm:px-3">
          <div className="flex items-center mb-2 sm:mb-3 relative">
            <div className="flex items-center gap-1 sm:gap-2">
              {icon && (
                <IconWithFallback
                  src={icon}
                  fallbackSrc="/images/placeholder-icon.svg"
                  width={24}
                  height={24}
                  className="h-5 w-5 sm:h-6 sm:w-6 aspect-square object-contain"
                  alt={title || "Category icon"}
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
        <div className="space-y-4">
          {/* First Row */}
          {firstRowProducts.length > 0 && (
            <div className={`relative carousel-container overflow-visible ${!enableSwipingRow1 ? 'px-4 sm:container sm:mx-auto' : ''}`}>
              {/* Navigation Arrows - First Row */}
              {enableSwipingRow1 && (
                <>
                  <div className="absolute top-1/2 transform -translate-x-1/3 -translate-y-full z-10 hidden sm:block">
                    <button
                      ref={prevRefRow1}
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
                      ref={nextRefRow1}
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

              <div className={`overflow-hidden ${!enableSwipingRow1 ? 'w-full' : ''}`}>
                {/* Custom pagination container - hidden on mobile */}
                <div className="swiper-pagination-row1 hidden sm:block"></div>
                <Swiper
                  modules={[Navigation, Pagination, A11y]}
                  spaceBetween={18}
                  slidesPerView="auto"
                  navigation={{
                    prevEl: prevRefRow1.current,
                    nextEl: nextRefRow1.current,
                  }}
                  pagination={enableSwipingRow1 && !isMobile ? {
                    clickable: true,
                    dynamicBullets: true,
                    dynamicMainBullets: 1,
                    el: '.swiper-pagination-row1',
                    enabled: true
                  } : false}
                  onInit={(swiper) => {
                    // Override navigation after swiper initialization
                    swiper.params.navigation.prevEl = prevRefRow1.current;
                    swiper.params.navigation.nextEl = nextRefRow1.current;
                    swiper.navigation.init();
                    swiper.navigation.update();

                    // Store swiper instance
                    swiperRef1.current = swiper;

                    // Update pagination based on mobile state
                    swiper.pagination.enabled = !isMobile && enableSwipingRow1;
                    swiper.pagination.update();
                  }}
                  className={`px-2 sm:px-0 overflow-visible pb-2`}
                  loop={false}
                  loopFillGroupWithBlank={false}
                  slidesPerGroupAuto={true}
                  rewind={false}
                  allowTouchMove={enableSwipingRow1}
                >
                  {firstRowProducts.map((product) => (
                    <SwiperSlide key={product.id} className={`${enableSwipingRow1 ? '!w-[calc(40vw-16px)] sm:!w-[calc(25vw-16px)] md:!w-[calc(20vw-16px)] lg:!w-[calc(12.666vw-16px)] xl:!w-[calc(10.285vw-16px)] 2xl:!w-[calc(8.5vw-16px)]' : 'w-full sm:max-w-[220px] mx-auto'}`}>
                      <div className="bg-white rounded-md shadow-md overflow-hidden relative h-full sm:max-h-[280px]">
                        {/* Product Image with Link or Quick View */}
                        {isLandingPage ? (
                          <div
                            className="block cursor-pointer"
                            onClick={() => openQuickView(product)}
                          >
                            <div className="aspect-square relative">
                              <IconWithFallback
                                src={product.image || "/images/product-image.png"}
                                fallbackSrc="/images/product-image.png"
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
                              <IconWithFallback
                                src={product.image || "/images/product-image.png"}
                                fallbackSrc="/images/product-image.png"
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

          {/* Second Row */}
          {secondRowProducts.length > 0 && (
            <div className={`relative carousel-container overflow-visible ${!enableSwipingRow2 ? 'px-4 sm:container sm:mx-auto' : ''}`}>
              {/* Navigation Arrows - Second Row */}
              {enableSwipingRow2 && (
                <>
                  <div className="absolute top-1/2 transform -translate-x-1/3 -translate-y-full z-10 hidden sm:block">
                    <button
                      ref={prevRefRow2}
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
                      ref={nextRefRow2}
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

              <div className={`overflow-hidden ${!enableSwipingRow2 ? 'w-full' : ''}`}>
                {/* Custom pagination container - hidden on mobile */}
                <div className="swiper-pagination-row2 hidden sm:block"></div>
                <Swiper
                  modules={[Navigation, Pagination, A11y]}
                  spaceBetween={18}
                  slidesPerView="auto"
                  navigation={{
                    prevEl: prevRefRow2.current,
                    nextEl: nextRefRow2.current,
                  }}
                  pagination={enableSwipingRow2 && !isMobile ? {
                    clickable: true,
                    dynamicBullets: true,
                    dynamicMainBullets: 1,
                    el: '.swiper-pagination-row2',
                    enabled: true
                  } : false}
                  onInit={(swiper) => {
                    // Override navigation after swiper initialization
                    swiper.params.navigation.prevEl = prevRefRow2.current;
                    swiper.params.navigation.nextEl = nextRefRow2.current;
                    swiper.navigation.init();
                    swiper.navigation.update();

                    // Store swiper instance
                    swiperRef2.current = swiper;

                    // Update pagination based on mobile state
                    swiper.pagination.enabled = !isMobile && enableSwipingRow2;
                    swiper.pagination.update();

                    // Ensure loading state is set to false when Swiper is fully initialized
                    setIsLoading(false);
                  }}
                  className={`px-2 sm:px-0 overflow-visible pb-2`}
                  loop={false}
                  loopFillGroupWithBlank={false}
                  slidesPerGroupAuto={true}
                  rewind={false}
                  allowTouchMove={enableSwipingRow2}
                >
                  {secondRowProducts.map((product) => (
                    <SwiperSlide key={product.id} className={`${enableSwipingRow2 ? '!w-[calc(40vw-16px)] sm:!w-[calc(25vw-16px)] md:!w-[calc(20vw-16px)] lg:!w-[calc(12.666vw-16px)] xl:!w-[calc(10.285vw-16px)] 2xl:!w-[calc(8.5vw-16px)]' : 'w-full sm:max-w-[220px] mx-auto'}`}>
                      <div className="bg-white rounded-md shadow-md overflow-hidden relative h-full sm:max-h-[280px]">
                        {/* Product Image with Link or Quick View */}
                        {isLandingPage ? (
                          <div
                            className="block cursor-pointer"
                            onClick={() => openQuickView(product)}
                          >
                            <div className="aspect-square relative">
                              <IconWithFallback
                                src={product.image || "/images/product-image.png"}
                                fallbackSrc="/images/product-image.png"
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
                              <IconWithFallback
                                src={product.image || "/images/product-image.png"}
                                fallbackSrc="/images/product-image.png"
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
        </div>
      )}
    </section>
  );
}
