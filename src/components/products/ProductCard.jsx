'use client';
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { toast } from 'react-hot-toast';

const ProductCard = ({ product, showAddToCart = true }) => {
  const { id, name, price, image, category, discountPrice } = product;
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  // Check if product is in wishlist
  const productInWishlist = isInWishlist(id);
  // State to track wishlist operation in progress
  const [isWishlistLoading, setIsWishlistLoading] = React.useState(false);

  // Calculate discount percentage
  const discountPercentage = Math.round((1 - (parseFloat(discountPrice) / parseFloat(price))) * 100);

  return (
    <div className="responsive-card bg-white rounded-[6px] shadow-sm w-full">
      <div className="relative mb-1 md:mb-1.5">
        <Link href={`/products/${id}`}>
          <div className="relative w-full aspect-square overflow-hidden rounded-[6px]">
            <Image
              src={image || "/images/products/product-image.png"}
              alt={name}
              fill
              sizes="(max-width: 480px) 45vw, (max-width: 640px) 40vw, (max-width: 768px) 33vw, 180px"
              className="object-cover rounded-[6px] transition-transform duration-300 hover:scale-105"
              priority={true}
            />
          </div>
        </Link>

        {discountPercentage > 0 && (
          <div className="absolute top-0.5 left-0.5 md:top-1 md:left-1">
            <div className="bg-[#006B51] text-white text-responsive-xs font-semibold py-0 px-0.5 md:py-0 md:px-1 rounded-[4px] text-[8px] xs:text-[9px]">
              -{discountPercentage}%
            </div>
          </div>
        )}

        <div className="absolute top-0.5 right-0.5 md:top-1 md:right-1">
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();

              // Prevent multiple clicks
              if (isWishlistLoading) return;

              setIsWishlistLoading(true);

              if (productInWishlist) {
                removeFromWishlist(id).then(result => {
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
            className="transition-all"
            aria-label={productInWishlist ? "Remove from wishlist" : "Add to wishlist"}
          >
            {isWishlistLoading ? (
              <div className="w-3 h-3 border-[1.5px] border-[#FF3E3E] border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <div className="w-3 h-3 relative">
                <Image
                  src={productInWishlist
                    ? "/images/wishlist/wishlist-icon-filled.svg"
                    : "/images/wishlist/wishlist-icon-outline.svg"}
                  alt="Wishlist"
                  fill
                  className="object-fit cursor-pointer transition-all"
                />
              </div>
            )}
          </button>
        </div>
      </div>

      <div className="text-center px-0.5 md:px-1">
        <div className="text-[#A9A9A9] text-[8px] xs:text-[9px] font-semibold uppercase mb-0.5">
          {category}
        </div>

        <Link href={`/products/${id}`}>
          <h3 className="text-[#3F3F3F] text-[10px] sm:text-[11px] md:text-xs font-semibold mb-0.5 hover:text-[#006B51] transition-colors line-clamp-2 h-[2.4em] md:h-[2.6em]">
            {name}
          </h3>
        </Link>

        <div className="flex items-center justify-center space-x-0.5 mb-1 md:mb-1.5">
          {discountPrice !== price && (
            <span className="text-[#E12625] text-[8px] xs:text-[9px] md:text-[10px] line-through">৳{parseFloat(price).toFixed(2)}</span>
          )}
          <span className="text-[#006B51] text-[9px] sm:text-[10px] md:text-xs font-medium">৳{parseFloat(discountPrice).toFixed(2)}</span>
        </div>

        {showAddToCart && (
          <button
            onClick={() => addToCart(product, 1)}
            className="bg-[#006B51] text-white font-semibold rounded-md md:rounded-lg flex items-center justify-center w-full hover:bg-[#005541] transition-colors py-0.5 px-1 md:px-1.5 text-[8px] xs:text-[9px] md:text-[10px]"
          >
            <Image
              src="/images/products/cart-icon.png"
              alt="Cart"
              width={10}
              height={10}
              className="mr-0.5 w-2 h-2 md:w-2.5 md:h-2.5"
            />
            <span>Add To Cart</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
