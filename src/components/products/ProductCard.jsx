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
    <div className="responsive-card bg-white rounded-[10px] shadow-sm">
      <div className="relative mb-4">
        <Link href={`/products/${id}`}>
          <div className="relative w-full aspect-square overflow-hidden rounded-[10px]">
            <Image
              src={image || "/images/products/product-image.png"}
              alt={name}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 240px"
              className="object-cover rounded-[10px] transition-transform duration-300 hover:scale-105"
            />
          </div>
        </Link>

        {discountPercentage > 0 && (
          <div className="absolute top-2 left-2">
            <div className="bg-[#006B51] text-white text-responsive-xs font-semibold py-1 px-2 rounded-[10px]">
              -{discountPercentage}%
            </div>
          </div>
        )}

        <div className="absolute top-2 right-2">
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
            className="bg-white rounded-full p-1 shadow-sm hover:shadow-md transition-all"
            aria-label={productInWishlist ? "Remove from wishlist" : "Add to wishlist"}
          >
            <Image
              src={productInWishlist
                ? "/images/popup/wishlist-icon.svg"
                : "/images/products/wishlist-icon.png"}
              alt="Wishlist"
              width={24}
              height={24}
              className={`cursor-pointer transition-opacity ${productInWishlist ? 'filter-none' : 'opacity-70 hover:opacity-100'}`}
            />
          </button>
        </div>
      </div>

      <div className="text-center">
        <div className="text-[#A9A9A9] text-responsive-xs font-semibold uppercase mb-1">
          {category}
        </div>

        <Link href={`/products/${id}`}>
          <h3 className="text-[#3F3F3F] text-responsive font-semibold mb-2 hover:text-[#006B51] transition-colors line-clamp-2 h-[3em]">
            {name}
          </h3>
        </Link>

        <div className="flex items-center justify-center space-x-2 mb-3">
          {discountPrice !== price && (
            <span className="text-[#E12625] text-responsive-xs line-through">৳{parseFloat(price).toFixed(2)}</span>
          )}
          <span className="text-[#006B51] text-responsive font-medium">৳{parseFloat(discountPrice).toFixed(2)}</span>
        </div>

        {showAddToCart && (
          <button
            onClick={() => addToCart(product)}
            className="responsive-button bg-[#006B51] text-white font-semibold rounded-2xl flex items-center justify-center w-full hover:bg-[#005541] transition-colors"
          >
            <Image
              src="/images/products/cart-icon.png"
              alt="Cart"
              width={16}
              height={16}
              className="mr-2"
            />
            <span className="text-responsive-xs">Add To Cart</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
