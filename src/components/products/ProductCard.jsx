'use client';
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { toast } from 'react-hot-toast';

const ProductCard = ({ product, showAddToCart = true }) => {
  const { id, name, price, image, category, discountPrice, discountPercentage, promotion } = product;
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  // Check if product is in wishlist
  const productInWishlist = isInWishlist(id);
  // State to track wishlist operation in progress
  const [isWishlistLoading, setIsWishlistLoading] = React.useState(false);

  // Use provided discount percentage or calculate it
  const displayDiscountPercentage = discountPercentage ||
    (price && discountPrice && price !== discountPrice) ?
      Math.round((1 - (parseFloat(discountPrice) / parseFloat(price))) * 100) : 0;

  return (
    <div className="responsive-card bg-white rounded-[6px] shadow-sm w-full">
      <div className="relative mb-2 md:mb-2.5">
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

        {displayDiscountPercentage > 0 && (
          <div className="absolute top-1 left-1 md:top-1.5 md:left-1.5">
            <div className="bg-[#006B51] text-white text-responsive-xs font-semibold py-0.5 px-1 md:py-0.5 md:px-1.5 rounded-[4px] text-[10px] xs:text-[11px] md:text-xs">
              -{displayDiscountPercentage}%
            </div>
          </div>
        )}

        {promotion && (
          <div className="absolute bottom-1 left-1 md:bottom-1.5 md:left-1.5">
            <div className="bg-[#FF3E3E] text-white text-responsive-xs font-semibold py-0.5 px-1 md:py-0.5 md:px-1.5 rounded-[4px] text-[10px] xs:text-[11px] md:text-xs">
              {promotion.title}
            </div>
          </div>
        )}

        <div className="absolute top-1 right-1 md:top-1.5 md:right-1.5">
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
              <div className="w-4 h-4 border-[1.5px] border-[#FF3E3E] border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <div className="w-4 h-4 relative">
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

      <div className="text-center px-1 md:px-2">
        <div className="text-[#A9A9A9] text-[10px] xs:text-[11px] md:text-xs font-semibold uppercase mb-1 md:mb-1.5">
          {category}
        </div>

        <Link href={`/products/${id}`}>
          <h3 className="text-[#3F3F3F] text-[12px] sm:text-[13px] md:text-sm font-semibold mb-1 md:mb-1.5 hover:text-[#006B51] transition-colors line-clamp-2 h-[2.4em] md:h-[2.6em]">
            {name}
          </h3>
        </Link>

        <div className="flex items-center justify-center space-x-1 md:space-x-1.5 mb-2 md:mb-2.5">
          {discountPrice !== price && (
            <span className="text-[#E12625] text-[10px] xs:text-[11px] md:text-xs line-through">৳{parseFloat(price).toFixed(2)}</span>
          )}
          <span className="text-[#006B51] text-[11px] sm:text-[12px] md:text-sm font-medium">৳{parseFloat(discountPrice).toFixed(2)}</span>
        </div>

        {showAddToCart && (
          <button
            onClick={() => addToCart(product, 1)}
            className="bg-[#006B51] text-white font-semibold rounded-md md:rounded-lg flex items-center justify-center w-full hover:bg-[#005541] transition-colors py-1 md:py-1.5 px-2 md:px-2.5 text-[10px] xs:text-[11px] md:text-xs"
          >
            <Image
              src="/images/products/cart-icon.png"
              alt="Cart"
              width={12}
              height={12}
              className="mr-1 md:mr-1.5 w-3 h-3 md:w-3.5 md:h-3.5"
            />
            <span>Add To Cart</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
