'use client';
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import StarRating from '@/components/ui/StarRating';
import { getResponsiveTextClass } from '@/utils/responsiveUtils';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { toast } from 'react-hot-toast';

const RelatedProducts = ({ products = [], category = 'Products' }) => {
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  // If no products provided, show empty state
  if (!products || products.length === 0) {
    return (
      <div className="py-6 sm:py-8 md:py-10">
        <div className="flex justify-between items-center mb-4 sm:mb-6 md:mb-8">
          <div className="flex items-center gap-2 sm:gap-3">
            <h2 className={`${getResponsiveTextClass('xl')} font-semibold text-black`}>Related Products</h2>
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
              <span className={`${getResponsiveTextClass('sm')} font-normal`}>All Products</span>
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

        <div className="bg-white rounded-[15px] p-8 text-center shadow-[5px_5px_15px_0px_rgba(0,0,0,0.05)]">
          <p className="text-[#7E7E7E] text-lg">No related products found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-6 sm:py-8 md:py-10">
      <div className="flex justify-between items-center mb-4 sm:mb-6 md:mb-8">
        <div className="flex items-center gap-2 sm:gap-3">
          <h2 className={`${getResponsiveTextClass('xl')} font-semibold text-black`}>Related Products</h2>
          <Image
            src="/images/deals/discount-coupon-icon.png"
            alt="Discount"
            width={24}
            height={24}
            className="object-contain w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7"
          />
        </div>
        <div className="flex items-center text-[#7E7E7E]">
          <Link href={`/products?category=${category}`} className="flex items-center hover:text-[#006B51] transition-colors">
            <span className={`${getResponsiveTextClass('sm')} font-normal`}>All {category}</span>
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

      {/* Related Products Grid */}
      <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
        {products.map((product) => {
          // Check if product is in wishlist
          const productInWishlist = isInWishlist(product.id);

          // Calculate discount percentage
          const discountPercentage = Math.round((1 - (parseFloat(product.discountPrice || 0) / parseFloat(product.price || 1))) * 100);

          return (
            <div key={product.id} className="bg-white rounded-[15px] overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col">
              {/* Product Image */}
              <Link href={`/products/${product.id}`}>
                <div className="relative h-48 xs:h-52 sm:h-56 md:h-64">
                  <Image
                    src={product.image || "/images/product-image.png"}
                    alt={product.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                  />

                  {/* Discount Badge */}
                  {discountPercentage > 0 && (
                    <div className="absolute top-2 left-2">
                      <div className="bg-[#006B51] text-white text-xs font-semibold py-0.5 px-1.5 md:py-1 md:px-2 rounded-[10px]">
                        -{discountPercentage}%
                      </div>
                    </div>
                  )}

                  {/* Wishlist Button */}
                  <div className="absolute top-2 right-2">
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        if (productInWishlist) {
                          removeFromWishlist(product.id).then(result => {
                            if (result.success) {
                              toast.success('Removed from wishlist');
                            } else {
                              toast.error(result.message || 'Failed to remove from wishlist');
                            }
                          });
                        } else {
                          addToWishlist(product).then(result => {
                            if (result.success) {
                              toast.success('Added to wishlist');
                            } else {
                              toast.error(result.message || 'Failed to add to wishlist');
                            }
                          });
                        }
                      }}
                      className="bg-white rounded-full p-1 shadow-sm hover:shadow-md transition-all"
                      aria-label={productInWishlist ? "Remove from wishlist" : "Add to wishlist"}
                    >
                      <Image
                        src={productInWishlist
                          ? "/images/popup/wishlist-icon.svg"
                          : "/images/products/wishlist-icon.png"}
                        alt="Wishlist"
                        width={20}
                        height={20}
                        className={`cursor-pointer transition-opacity ${productInWishlist ? 'filter-none' : 'opacity-70 hover:opacity-100'}`}
                      />
                    </button>
                  </div>
                </div>
              </Link>

              {/* Product Details */}
              <div className="p-3 sm:p-4 md:p-5 grow shadow-[5px_5px_15px_0px_rgba(0,0,0,0.05)] rounded-[10px] -mt-4 sm:-mt-5 mb-4 mx-3 sm:mx-4 bg-white relative">
                <Link href={`/products/${product.id}`}>
                  <h3 className={`text-[#253D4E] ${getResponsiveTextClass('sm')} font-bold leading-tight mb-1 sm:mb-2 line-clamp-2 hover:text-[#006B51] transition-colors`}>
                    {product.name}
                  </h3>
                </Link>

                <div className="mb-1">
                  <StarRating
                    rating={product.rating || 4.0}
                    reviewCount={product.reviewCount || 0}
                    size="sm"
                  />
                </div>

                <div className="flex justify-between items-center mt-1 sm:mt-2">
                  {discountPercentage > 0 ? (
                    <div>
                      <span className={`text-[#006B51] ${getResponsiveTextClass('xs')} mr-2`}>{product.category}</span>
                      <div className="mt-1">
                        <span className={`text-[#006B51] font-bold ${getResponsiveTextClass('base')}`}>
                          ৳{parseFloat(product.discountPrice || 0).toFixed(2)}
                        </span>
                        <span className={`text-[#ADADAD] font-bold ${getResponsiveTextClass('xs')} ml-1 sm:ml-2 line-through`}>
                          ৳{parseFloat(product.price || 0).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <span className={`text-[#006B51] ${getResponsiveTextClass('xs')}`}>{product.category}</span>
                  )}

                  <button
                    className="bg-[#006B51] text-white text-xs sm:text-sm font-bold py-1 px-2 sm:px-3 rounded-md flex items-center hover:bg-[#005541] transition-colors"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      addToCart({
                        id: product.id,
                        name: product.name,
                        price: product.discountPrice || product.price,
                        image: product.image,
                        quantity: 1
                      });
                      toast.success(`${product.name} added to cart!`);
                    }}
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
          );
        })}
      </div>
    </div>
  );
};

export default RelatedProducts;
