'use client';
import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useProductQuickView } from '@/context/ProductQuickViewContext';
import ProductSkeleton from './ProductSkeleton';
import StarRating from '@/components/ui/StarRating';
import { toast } from 'react-hot-toast';
import ImageWithFallback from '../ui/ImageWithFallback';

const ProductListSection = ({
  // Data props
  products = [],
  category = 'Products',

  // Display props
  title = 'Related Products',
  viewType = 'grid', // 'grid' or 'scroll'
  showWishlist = true,
  showOverlays = false,

  // Customization props
  titleIcon = '/images/deals/discount-coupon-icon.png',
  allItemsLink = '/products',
  allItemsText = 'All Products',
  emptyStateText = 'No products found.',

  // Fetch props
  fetchUrl = null,
  fetchLimit = 4,

  // Grid props
  gridCols = {
    default: 2,
    xs: 2,
    sm: 3,
    lg: 4,
    xl: 5
  }
}) => {
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { closeQuickView } = useProductQuickView();
  const scrollContainerRef = useRef(null);

  const [displayProducts, setDisplayProducts] = useState(products);
  const [loading, setLoading] = useState(!!fetchUrl);
  // State to track wishlist operations for all products - MOVED HERE to avoid conditional hook calls
  const [wishlistLoadingStates, setWishlistLoadingStates] = useState({});

  // Function to scroll the container left or right (for scroll view)
  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = 200; // Adjust this value based on your card width + gap
      const scrollLeft = scrollContainerRef.current.scrollLeft;

      scrollContainerRef.current.scrollTo({
        left: direction === 'left' ? scrollLeft - scrollAmount : scrollLeft + scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  // Fetch products if fetchUrl is provided
  useEffect(() => {
    let isMounted = true;

    if (fetchUrl) {
      const fetchProducts = async () => {
        try {
          setLoading(true);
          // Use clean URL without cache-busting parameters for better SEO
          // Add sorting parameters to ensure latest products are shown first
          const url = `${fetchUrl}${fetchUrl.includes('?') ? '&' : '?'}limit=${fetchLimit}&sortBy=created_at&sortOrder=desc`;
          const response = await fetch(url, {
            cache: 'no-store',
            // Use headers for cache control instead of URL parameters
            headers: {
              'Cache-Control': 'no-cache, no-store, must-revalidate',
              'Pragma': 'no-cache'
            }
          });
          const data = await response.json();

          if (isMounted && data.products) {
            setDisplayProducts(data.products);
          }
        } catch (error) {
          console.error(`Error fetching products from ${fetchUrl}:`, error);
        } finally {
          if (isMounted) {
            setLoading(false);
          }
        }
      };

      fetchProducts();
    } else {
      setDisplayProducts(products);
    }

    return () => {
      isMounted = false;
    };
  }, [fetchUrl, fetchLimit]);

  // Number of skeleton items to show while loading
  const skeletonCount = fetchLimit || 4;

  // Use actual products when not loading
  const itemsToDisplay = displayProducts;

  // Only log when actually fetching from a URL
  if (fetchUrl) {
    console.log(`Fetched products from URL: ${fetchUrl}`, displayProducts.length, 'products');
  } else {
    console.log('Using products provided via props:', displayProducts.length, 'products');
  }
  // If no products and not loading, show empty state
  if (!loading && (!displayProducts || displayProducts.length === 0)) {
    return (
      <div className="py-2 xs:py-3 md:py-4">
        <div className="flex justify-between items-center mb-4 sm:mb-6 md:mb-8">
          <div className="flex items-center gap-3 sm:gap-4">
            {titleIcon && (
              <div className="flex-shrink-0">
                <ImageWithFallback
                  src={titleIcon}
                  alt="Icon"
                  width={32}
                  height={32}
                  className="h-7 w-7 sm:h-9 sm:w-9 md:h-10 md:w-10 aspect-square object-contain"
                />
              </div>
            )}
            <div className="text-lg sm:!text-xl md:!text-2xl font-bold text-[#3F3F3F] leading-tight">{title}</div>
          </div>
          <div className="flex items-center text-[#7E7E7E]">
            <Link href={allItemsLink} onClick={closeQuickView} className="flex items-center hover:text-[#006B51] transition-colors">
              <span className="text-[10px] xs:text-xs font-normal whitespace-nowrap">{allItemsText}</span>
              <svg
                width="10"
                height="10"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="ml-0.5 xs:ml-1"
              >
                <path
                  d="M9 6L15 12L9 18"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-md p-2 xs:p-3 md:p-4 text-center shadow-md">
          <p className="text-[#7E7E7E] text-[10px] xs:text-xs md:text-sm">{emptyStateText}</p>
        </div>
      </div>
    );
  }



  // Function to handle wishlist operations
  const handleWishlistAction = (productId, isInWishlist) => {
    // Prevent multiple clicks
    if (wishlistLoadingStates[productId]) return;

    // Set loading state for this product
    setWishlistLoadingStates(prev => ({
      ...prev,
      [productId]: true
    }));

    if (isInWishlist) {
      removeFromWishlist(productId).then(result => {
        if (result.success) {
          toast.success('Removed from wishlist');
        } else {
          toast.error(result.message || 'Failed to remove from wishlist');
        }
      }).finally(() => {
        setWishlistLoadingStates(prev => ({
          ...prev,
          [productId]: false
        }));
      });
    } else {
      const productToAdd = itemsToDisplay.find(p => p.id === productId);
      if (productToAdd) {
        addToWishlist(productToAdd).then(result => {
          if (result.success) {
            toast.success('Added to wishlist');
          } else {
            toast.error(result.message || 'Failed to add to wishlist');
          }
        }).finally(() => {
          setWishlistLoadingStates(prev => ({
            ...prev,
            [productId]: false
          }));
        });
      }
    }
  };

  // Render product item
  const renderProductItem = (product, index) => {
    // Check if product is in wishlist
    const productInWishlist = showWishlist ? isInWishlist(product.id) : false;
    // Get loading state for this product
    const isWishlistLoading = wishlistLoadingStates[product.id] || false;

    // Calculate discount percentage
    const discountPercentage = Math.round((1 - (parseFloat(product.discountPrice || 0) / parseFloat(product.price || 1))) * 100);

    return (
      <div
        key={product.id || index}
        className={`bg-white rounded-md overflow-hidden shadow-md hover:shadow-md transition-shadow flex flex-col ${viewType === 'scroll' ? 'basis-1/2 sm:basis-1/4 max-w-[240px] flex-shrink-0' : 'w-full'
          }`}
      >
        {/* Product Image */}
        <Link href={`/products/${product.id}`} onClick={closeQuickView}>
          <div className={`relative ${viewType === 'scroll' ? 'h-32 xs:h-36 sm:h-40' : 'h-28 xs:h-32 sm:h-36'}`}>
            <ImageWithFallback
              src={product.image || "/images/product-image.png"}
              alt={product.name}
              fill
              className="object-cover"
              sizes={viewType === 'scroll'
                ? "(max-width: 640px) 50vw, 240px"
                : "(max-width: 640px) 50vw, (max-width: 768px) 33vw, 180px"
              }
            />

            {/* Discount Badge */}
            {discountPercentage > 0 && (
              <div className="absolute top-1 sm:top-1.5 left-1 sm:left-1.5">
                <div className="bg-[#006B51] text-white px-1 py-0.5 sm:px-1.5 sm:py-0.5 rounded-md text-[9px] sm:text-[10px] font-semibold">
                  -{discountPercentage}%
                </div>
              </div>
            )}

            {/* Wishlist Button */}
            {showWishlist && (
              <div className="absolute top-0.5 sm:top-1 right-0.5 sm:right-1 z-10">
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleWishlistAction(product.id, productInWishlist);
                  }}
                  className="p-1 bg-white bg-opacity-70 rounded-full transition-all"
                  aria-label={productInWishlist ? "Remove from wishlist" : "Add to wishlist"}
                >
                  {isWishlistLoading ? (
                    <div className="w-3.5 h-3.5 xs:w-4 xs:h-4 border-[1.5px] border-[#FF3E3E] border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <ImageWithFallback
                      src={productInWishlist
                        ? "/images/wishlist/wishlist-icon-filled.svg"
                        : "/images/wishlist/wishlist-icon-outline.svg"}
                      alt="Wishlist"
                      width={16}
                      height={16}
                      className="w-3.5 h-3.5 xs:w-4 xs:h-4 cursor-pointer transition-all"
                    />
                  )}
                </button>
              </div>
            )}
          </div>
        </Link>

        {/* Product Details */}
        <div className="p-2.5 sm:p-3 grow shadow-md rounded-md -mt-2 sm:-mt-3 mb-2 mx-1.5 sm:mx-2 bg-white relative">
          <Link href={`/products/${product.id}`} onClick={closeQuickView}>
            <h3 className="text-[#3F3F3F] text-sm sm:text-base font-semibold leading-tight mb-2 line-clamp-1 hover:text-[#006B51] transition-colors">
              {product.name}
            </h3>
          </Link>

          {/* Rating */}
          <div className="mb-2">
            <StarRating
              rating={product.rating || 0}
              reviewCount={product.reviewCount || 0}
              size="xs"
              showCount={true}
            />
          </div>

          <div className="flex flex-wrap justify-between items-center mt-1 gap-1">
            {discountPercentage > 0 ? (
              <div className="min-w-0 flex-shrink">
                <span className="text-[#A9A9A9] text-xs sm:text-sm block truncate">{product.category}</span>
                <div className="mt-1.5 flex flex-wrap items-center gap-2">
                  <span className="text-[#006B51] font-semibold text-sm sm:text-base">
                    ৳{parseFloat(product.discountPrice || 0).toFixed(0)}
                  </span>
                  <span className="text-[#A9A9A9] font-normal text-xs sm:text-sm line-through">
                    ৳{parseFloat(product.price || 0).toFixed(0)}
                  </span>
                </div>
              </div>
            ) : (
              <div className="min-w-0 flex-shrink">
                <span className="text-[#A9A9A9] text-xs sm:text-sm block truncate">{product.category}</span>
                <span className="text-[#006B51] font-semibold text-sm sm:text-base block mt-1.5">
                  ৳{parseFloat(product.price || 0).toFixed(0)}
                </span>
              </div>
            )}

            <button
              className="bg-[#006B51] text-white text-[10px] sm:text-xs font-medium py-1 px-2 rounded-sm flex items-center hover:bg-[#005541] transition-colors flex-shrink-0"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                // Pass false to prevent duplicate toast from CartContext
                addToCart({
                  id: product.id,
                  name: product.name,
                  price: product.discountPrice || product.price,
                  image: product.image,
                  quantity: 1
                }, 1);
              }}
              disabled={loading}
            >
              <svg
                width="10"
                height="10"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="mr-1"
              >
                <path
                  d="M12 5V19M5 12H19"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Add
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="py-2 xs:py-3 md:py-4">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-4 sm:mb-6 md:mb-8">
        {loading ? (
          // Skeleton header while loading
          <>
            <div className="flex items-center gap-1 xs:gap-1.5 sm:gap-2">
              <div className="h-5 xs:h-6 md:h-7 w-24 xs:w-32 md:w-40 bg-gray-200 rounded animate-pulse"></div>
              <div className="w-4 h-4 xs:w-5 xs:h-5 md:w-6 md:h-6 rounded-full bg-gray-200 animate-pulse"></div>
            </div>
            <div className="flex items-center gap-1 sm:gap-2">
              {viewType === 'scroll' && (
                <div className="flex items-center gap-1">
                  <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-gray-200 animate-pulse"></div>
                  <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-gray-200 animate-pulse"></div>
                </div>
              )}
              <div className="h-4 xs:h-5 w-16 xs:w-20 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </>
        ) : (
          // Actual header when loaded
          <>
            <div className="flex items-center gap-3 sm:gap-4">
              {titleIcon && (
                <div className="flex-shrink-0">
                  <ImageWithFallback
                    src={titleIcon}
                    alt="Icon"
                    width={32}
                    height={32}
                    className="h-7 w-7 sm:h-9 sm:w-9 md:h-10 md:w-10 aspect-square object-contain"
                  />
                </div>
              )}
              <div className="text-lg sm:!text-xl md:!text-2xl font-bold text-[#3F3F3F] leading-tight">{title}</div>
            </div>
            <div className="flex items-center gap-1 sm:gap-2">
              {/* Navigation Buttons for scroll view */}
              {viewType === 'scroll' && (
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => scroll('left')}
                    className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-white border border-[#ECECEC] flex items-center justify-center hover:bg-[#F9F9F9] transition-colors"
                    aria-label="Scroll left"
                  >
                    <svg
                      width="10"
                      height="10"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M15 18L9 12L15 6"
                        stroke="#7E7E7E"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                  <button
                    onClick={() => scroll('right')}
                    className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-white border border-[#ECECEC] flex items-center justify-center hover:bg-[#F9F9F9] transition-colors"
                    aria-label="Scroll right"
                  >
                    <svg
                      width="10"
                      height="10"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M9 6L15 12L9 18"
                        stroke="#7E7E7E"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                </div>
              )}
              <div className="flex items-center text-[#7E7E7E]">
                <Link
                  href={category !== 'Products' ? `${allItemsLink}?category=${category}` : allItemsLink}
                  onClick={closeQuickView}
                  className="flex items-center hover:text-[#006B51] transition-colors"
                >
                  <span className="text-[10px] xs:text-xs font-normal whitespace-nowrap">
                    {allItemsText.includes('{category}')
                      ? allItemsText.replace('{category}', category)
                      : allItemsText}
                  </span>
                  <svg
                    width="10"
                    height="10"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="ml-0.5 xs:ml-1"
                  >
                    <path
                      d="M9 6L15 12L9 18"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </Link>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Products Container */}
      {viewType === 'grid' ? (
        <div className={`grid grid-cols-${gridCols.default} xs:grid-cols-${gridCols.xs} sm:grid-cols-${gridCols.sm} lg:grid-cols-${gridCols.lg} xl:grid-cols-${gridCols.xl} gap-1.5 xs:gap-2 md:gap-3`}>
          {loading ? (
            // Show skeleton loaders while loading
            Array.from({ length: skeletonCount }).map((_, index) => (
              <ProductSkeleton key={`skeleton-${index}`} viewType="grid" />
            ))
          ) : (
            // Show actual products when loaded
            itemsToDisplay.map((product, index) => renderProductItem(product, index))
          )}
        </div>
      ) : (
        <div ref={scrollContainerRef} className="flex flex-nowrap overflow-x-auto gap-2 sm:gap-3 md:gap-4 pb-2 scrollbar-hide">
          {loading ? (
            // Show skeleton loaders while loading
            Array.from({ length: skeletonCount }).map((_, index) => (
              <ProductSkeleton key={`skeleton-${index}`} viewType="scroll" />
            ))
          ) : (
            // Show actual products when loaded
            itemsToDisplay.map((product, index) => renderProductItem(product, index))
          )}
        </div>
      )}
    </div>
  );
};

export default ProductListSection;
