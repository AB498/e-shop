'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { getResponsiveTextClass } from '@/utils/responsiveUtils';
import StarRating from '@/components/ui/StarRating';
import { useCart } from '@/context/CartContext';
import { toast } from 'react-hot-toast';

const DealsOfTheDay = () => {
  const [dealProducts, setDealProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

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
    addToCart({
      id: product.id,
      name: product.name,
      price: product.discountPrice || product.price,
      image: product.image,
      quantity: 1
    });
    toast.success(`${product.name} added to cart!`);
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
    <div className="py-6 sm:py-8 md:py-10">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-4 sm:mb-6 md:mb-8">
        <div className="flex items-center gap-2 sm:gap-3">
          <h2 className={`${getResponsiveTextClass('xl')} font-semibold text-black`}>Deals Of The Day</h2>
          <Image
            src="/images/deals/discount-coupon-icon.png"
            alt="Discount"
            width={24}
            height={24}
            className="object-contain w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7"
          />
        </div>
        <div className="flex items-center text-[#7E7E7E]">
          <Link href="/products" className="flex items-center hover:text-[#006B51] transition-colors">
            <span className={`${getResponsiveTextClass('sm')} font-normal`}>All Deals</span>
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="ml-1"
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

      {/* Deals Grid */}
      <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
        {displayProducts.map((product, index) => (
          <div key={product.id || index} className="bg-white rounded-[15px] overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col">
            {/* Product Image */}
            <Link href={`/products/${product.id}`}>
              <div className="relative h-48 xs:h-52 sm:h-56 md:h-64">
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
            <div className="p-3 sm:p-4 md:p-5 grow shadow-[5px_5px_15px_0px_rgba(0,0,0,0.05)] rounded-[10px] -mt-4 sm:-mt-5 mb-4 mx-3 sm:mx-4 bg-white relative">
              <Link href={`/products/${product.id}`}>
                <h3 className={`text-[#253D4E] ${getResponsiveTextClass('sm')} font-bold leading-tight mb-1 sm:mb-2`}>
                  {product.name}
                </h3>
              </Link>

              <div className="mb-1">
                <StarRating
                  rating={parseFloat(product.rating)}
                  reviewCount={product.reviewCount}
                  size="sm"
                />
              </div>

              <div className="flex justify-between items-center mt-1 sm:mt-2">
                {index === 2 ? (
                  <div>
                    <span className={`text-[#006B51] ${getResponsiveTextClass('xs')} mr-2`}>{product.category}</span>
                    <div className="mt-1">
                      <span className={`text-[#006B51] font-bold ${getResponsiveTextClass('base')}`}>
                        ৳{parseFloat(product.discountPrice).toFixed(2)}
                      </span>
                      <span className={`text-[#ADADAD] font-bold ${getResponsiveTextClass('xs')} ml-1 sm:ml-2 line-through`}>
                        ৳{parseFloat(product.price).toFixed(2)}
                      </span>
                    </div>
                  </div>
                ) : (
                  <span className={`text-[#006B51] ${getResponsiveTextClass('xs')}`}>{product.category}</span>
                )}
                <button
                  className="bg-[#006B51] text-white text-xs sm:text-sm font-bold py-1 px-2 sm:px-3 rounded-md flex items-center"
                  onClick={() => handleAddToCart(product)}
                  disabled={loading}
                >
                  <svg
                    width="14"
                    height="14"
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
        ))}
      </div>
    </div>
  );
};

export default DealsOfTheDay;
