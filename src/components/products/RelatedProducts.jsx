'use client';
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import StarRating from '@/components/ui/StarRating';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { toast } from 'react-hot-toast';

const RelatedProducts = ({ products = [], category = 'Products' }) => {
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  // If no products provided, show empty state
  if (!products || products.length === 0) {
    return (
      <div className="py-2 sm:py-3 md:py-4">
        <div className="flex justify-between items-center mb-1.5 sm:mb-2 md:mb-3">
          <div className="flex items-center gap-1 sm:gap-1.5">
            <h2 className="text-sm sm:text-base md:text-lg font-semibold text-black">Related Products</h2>
            <Image
              src="/images/deals/discount-coupon-icon.png"
              alt="Discount"
              width={20}
              height={20}
              className="object-contain w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5"
            />
          </div>
          <div className="flex items-center text-[#7E7E7E]">
            <Link href="/products" className="flex items-center hover:text-[#006B51] transition-colors">
              <span className="text-[10px] sm:text-xs font-normal">All Products</span>
              <svg
                width="10"
                height="10"
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

        <div className="bg-white rounded-md p-3 sm:p-4 text-center shadow-sm">
          <p className="text-[#7E7E7E] text-xs sm:text-sm">No related products found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-2 sm:py-3 md:py-4">
      <div className="flex justify-between items-center mb-1.5 sm:mb-2 md:mb-3">
        <div className="flex items-center gap-1 sm:gap-1.5">
          <h2 className="text-sm sm:text-base md:text-lg font-semibold text-black">Related Products</h2>
          <Image
            src="/images/deals/discount-coupon-icon.png"
            alt="Discount"
            width={20}
            height={20}
            className="object-contain w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5"
          />
        </div>
        <div className="flex items-center text-[#7E7E7E]">
          <Link href={`/products?category=${category}`} className="flex items-center hover:text-[#006B51] transition-colors">
            <span className="text-[10px] sm:text-xs font-normal">All {category}</span>
            <svg
              width="10"
              height="10"
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

      {/* Related Products Grid */}
      <div className="grid grid-cols-2 xs:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-2 sm:gap-2 md:gap-3">
        {products.map((product) => {
          // Check if product is in wishlist
          const productInWishlist = isInWishlist(product.id);
          // State to track wishlist operation in progress
          const [isWishlistLoading, setIsWishlistLoading] = React.useState(false);

          // Calculate discount percentage
          const discountPercentage = Math.round((1 - (parseFloat(product.discountPrice || 0) / parseFloat(product.price || 1))) * 100);

          return (
            <div key={product.id} className="bg-white rounded-md overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col max-w-[180px]">
              {/* Product Image */}
              <Link href={`/products/${product.id}`}>
                <div className="relative h-32 xs:h-32 sm:h-36">
                  <Image
                    src={product.image || "/images/product-image.png"}
                    alt={product.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 180px"
                  />

                  {/* Discount Badge */}
                  {discountPercentage > 0 && (
                    <div className="absolute top-1 left-1 sm:top-1 sm:left-1">
                      <div className="bg-[#006B51] text-white text-xs sm:text-[8px] font-medium py-0.5 px-1 sm:px-1 rounded-sm">
                        -{discountPercentage}%
                      </div>
                    </div>
                  )}

                  {/* Wishlist Button */}
                  <div className="absolute top-1 right-1 sm:top-1 sm:right-1">
                    <button
                      onClick={(e) => {
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
                      }}
                      className="p-0 transition-all"
                      aria-label={productInWishlist ? "Remove from wishlist" : "Add to wishlist"}
                    >
                      {isWishlistLoading ? (
                        <div className="w-4 h-4 sm:w-4 sm:h-4 border-[1.5px] border-[#FF3E3E] border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <Image
                          src={productInWishlist
                            ? "/images/wishlist/wishlist-icon-filled.svg"
                            : "/images/wishlist/wishlist-icon-outline.svg"}
                          alt="Wishlist"
                          width={16}
                          height={16}
                          className="w-4 h-4 sm:w-4 sm:h-4 cursor-pointer transition-all"
                        />
                      )}
                    </button>
                  </div>
                </div>
              </Link>

              {/* Product Details */}
              <div className="p-2 sm:p-1.5 md:p-2 grow shadow-sm rounded-md -mt-2 sm:-mt-2 mb-1 mx-1 sm:mx-1.5 bg-white relative">
                <Link href={`/products/${product.id}`}>
                  <h3 className="text-[#253D4E] text-xs sm:text-xs font-semibold leading-tight mb-1 line-clamp-1 hover:text-[#006B51] transition-colors">
                    {product.name}
                  </h3>
                </Link>

                <div className="mb-1">
                  <StarRating
                    rating={product.rating || 4.0}
                    reviewCount={product.reviewCount || 0}
                    size="xs"
                  />
                </div>

                <div className="flex justify-between items-center mt-1">
                  {discountPercentage > 0 ? (
                    <div>
                      <span className="text-[#006B51] text-xs sm:text-[9px] mr-1">{product.category}</span>
                      <div className="mt-0.5">
                        <span className="text-[#006B51] font-semibold text-xs sm:text-[10px]">
                          ৳{parseFloat(product.discountPrice || 0).toFixed(2)}
                        </span>
                        <span className="text-[#ADADAD] font-medium text-[10px] sm:text-[9px] ml-1 line-through">
                          ৳{parseFloat(product.price || 0).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <span className="text-[#006B51] text-xs sm:text-[9px]">{product.category}</span>
                  )}

                  <button
                    className="bg-[#006B51] text-white text-xs sm:text-[8px] font-medium py-1 px-2 sm:px-1.5 rounded-sm flex items-center hover:bg-[#005541] transition-colors"
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
        })}
      </div>
    </div>
  );
};

export default RelatedProducts;
