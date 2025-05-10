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

  // Calculate discount percentage
  const discountPercentage = Math.round((1 - (parseFloat(discountPrice) / parseFloat(price))) * 100);

  return (
    <div className="responsive-card bg-white rounded-[10px] shadow-sm w-full max-w-[360px] ">
      <div className="relative mb-2 md:mb-4">
        <Link href={`/products/${id}`}>
          <div className="relative w-full aspect-square overflow-hidden rounded-[10px]">
            <Image
              src={image || "/images/products/product-image.png"}
              alt={name}
              fill
              sizes="(max-width: 480px) 45vw, (max-width: 640px) 40vw, (max-width: 768px) 33vw, 240px"
              className="object-cover rounded-[10px] transition-transform duration-300 hover:scale-105"
              priority={true}
            />
          </div>
        </Link>

        {discountPercentage > 0 && (
          <div className="absolute top-1 left-1 md:top-2 md:left-2">
            <div className="bg-[#006B51] text-white text-responsive-xs font-semibold py-0.5 px-1.5 md:py-1 md:px-2 rounded-[10px] text-[10px] xs:text-xs">
              -{discountPercentage}%
            </div>
          </div>
        )}

        <div className="absolute top-1 right-1 md:top-2 md:right-2">
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if (productInWishlist) {
                removeFromWishlist(id).then(result => {
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
            className="bg-white rounded-full p-0.5 md:p-1 shadow-sm hover:shadow-md transition-all"
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

      <div className="text-center px-1 md:px-2">
        <div className="text-[#A9A9A9] text-[10px] xs:text-xs font-semibold uppercase mb-0.5 md:mb-1">
          {category}
        </div>

        <Link href={`/products/${id}`}>
          <h3 className="text-[#3F3F3F] text-xs sm:text-sm md:text-responsive font-semibold mb-1 md:mb-2 hover:text-[#006B51] transition-colors line-clamp-2 h-[2.5em] md:h-[3em]">
            {name}
          </h3>
        </Link>

        <div className="flex items-center justify-center space-x-1 md:space-x-2 mb-2 md:mb-3">
          {discountPrice !== price && (
            <span className="text-[#E12625] text-[10px] xs:text-xs md:text-responsive-xs line-through">৳{parseFloat(price).toFixed(2)}</span>
          )}
          <span className="text-[#006B51] text-xs sm:text-sm md:text-responsive font-medium">৳{parseFloat(discountPrice).toFixed(2)}</span>
        </div>

        {showAddToCart && (
          <button
            onClick={() => addToCart(product)}
            className="bg-[#006B51] text-white font-semibold rounded-xl md:rounded-2xl flex items-center justify-center w-full hover:bg-[#005541] transition-colors py-1 md:py-2 px-2 md:px-3 text-[10px] xs:text-xs md:text-responsive-xs"
          >
            <Image
              src="/images/products/cart-icon.png"
              alt="Cart"
              width={14}
              height={14}
              className="mr-1 md:mr-2 w-3 h-3 md:w-4 md:h-4"
            />
            <span>Add To Cart</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
