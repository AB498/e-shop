'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import StarRating from '@/components/ui/StarRating';
import { useCart } from '@/context/CartContext';

const DealsOfTheDay = () => {
  const [dealProducts, setDealProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const scrollContainerRef = useRef(null);

  // Function to scroll the container left or right
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

  useEffect(() => {
    const fetchDealProducts = async () => {
      try {
        // Fetch products with a limit of 3 for the deals section
        const response = await fetch('/api/products?limit=3');
        const data = await response.json();

        if (data.products) {
          // Add random ratings to the products
          const productsWithRatings = data.products.map(product => ({
            ...product,
            rating: (Math.random() * 2 + 3).toFixed(1), // Random rating between 3.0 and 5.0
            reviewCount: Math.floor(Math.random() * 50) + 5, // Random review count between 5 and 55
          }));

          setDealProducts(productsWithRatings);
        }
      } catch (error) {
        console.error('Error fetching deal products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDealProducts();
  }, []);

  const handleAddToCart = (product) => {
    // Pass false to prevent duplicate toast from CartContext
    addToCart({
      id: product.id,
      name: product.name,
      price: product.discountPrice || product.price,
      image: product.image,
      quantity: 1
    }, 1);
  };

  // Placeholder products for loading state
  const placeholderProducts = Array(3).fill({
    id: 0,
    name: 'Loading...',
    category: 'Loading...',
    price: '0.00',
    discountPrice: '0.00',
    image: '/images/product-image.png',
    rating: 0,
    reviewCount: 0
  });

  // Use placeholder products when loading, otherwise use fetched products
  const displayProducts = loading ? placeholderProducts : dealProducts;

  return (
    <div className="py-3 sm:py-4 md:py-5">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-2 sm:mb-3 md:mb-4">
        <div className="flex items-center gap-1 sm:gap-2">
          <h2 className="text-base sm:text-lg md:text-xl font-semibold text-black">Deals Of The Day</h2>
          <Image
            src="/images/deals/discount-coupon-icon.png"
            alt="Discount"
            width={20}
            height={20}
            className="object-contain w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6"
          />
        </div>
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Navigation Buttons */}
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
          <div className="flex items-center text-[#7E7E7E]">
            <Link href="/products" className="flex items-center hover:text-[#006B51] transition-colors">
              <span className="text-xs sm:text-sm font-normal">All Deals</span>
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="ml-0.5"
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
      </div>

      {/* Deals Row */}
      <div ref={scrollContainerRef} className="flex flex-nowrap overflow-x-auto gap-2 sm:gap-3 md:gap-4 pb-2 scrollbar-hide">
        {displayProducts.map((product, index) => (
          <div key={product.id || index} className="bg-white rounded-md overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col min-w-[140px] sm:min-w-[160px] md:min-w-[180px] flex-shrink-0">
            {/* Product Image */}
            <Link href={`/products/${product.id}`}>
              <div className="relative h-32 xs:h-36 sm:h-40">
                <Image
                  src={product.image || '/images/product-image.png'}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
                {index === 1 && (
                  <div className="absolute inset-0">
                    <Image
                      src="/images/deals/product-deal-2-overlay.png"
                      alt="Product Overlay"
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                {index === 2 && (
                  <div className="absolute inset-0">
                    <Image
                      src="/images/deals/product-deal-3-overlay.png"
                      alt="Product Overlay"
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
              </div>
            </Link>

            {/* Product Details */}
            <div className="p-1.5 sm:p-2 grow shadow-sm rounded-md -mt-2 sm:-mt-3 mb-2 mx-1.5 sm:mx-2 bg-white relative">
              <Link href={`/products/${product.id}`}>
                <h3 className="text-[#253D4E] text-xs sm:text-sm font-semibold leading-tight mb-0.5 sm:mb-1 line-clamp-1 w-full truncate">
                  {product.name}
                </h3>
              </Link>

              <div className="mb-0.5">
                <StarRating
                  rating={parseFloat(product.rating)}
                  reviewCount={product.reviewCount}
                  size="xs"
                />
              </div>

              <div className="flex justify-between items-center mt-0.5 sm:mt-1">
                {index === 2 ? (
                  <div>
                    <span className="text-[#006B51] text-[9px] sm:text-[10px] mr-1">{product.category}</span>
                    <div className="mt-0.5">
                      <span className="text-[#006B51] font-semibold text-[10px] sm:text-xs">
                        ৳{parseFloat(product.discountPrice).toFixed(2)}
                      </span>
                      <span className="text-[#ADADAD] font-medium text-[8px] sm:text-[9px] ml-0.5 sm:ml-1 line-through">
                        ৳{parseFloat(product.price).toFixed(2)}
                      </span>
                    </div>
                  </div>
                ) : (
                  <span className="text-[#006B51] text-[9px] sm:text-[10px]">{product.category}</span>
                )}
                <button
                  className="bg-[#006B51] text-white text-[8px] sm:text-[9px] font-medium py-0.5 px-1 sm:px-1.5 rounded-sm flex items-center"
                  onClick={() => handleAddToCart(product)}
                  disabled={loading}
                >
                  <svg
                    width="10"
                    height="10"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="mr-0.5"
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
        ))}
      </div>
    </div>
  );
};

export default DealsOfTheDay;
