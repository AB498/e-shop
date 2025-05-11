'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useWishlist } from '@/context/WishlistContext';
import { useCart } from '@/context/CartContext';
import { toast } from 'react-hot-toast';

const WishlistItem = ({ item }) => {
  const { removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  const { product } = item;

  // Calculate discount percentage if applicable
  const hasDiscount = product.discountPrice && product.discountPrice < product.price;
  const discountPercentage = hasDiscount
    ? Math.round((1 - (parseFloat(product.discountPrice) / parseFloat(product.price))) * 100)
    : 0;

  const handleRemove = async () => {
    const result = await removeFromWishlist(product.id);
    if (result.success) {
      toast.success('Item removed from wishlist');
    } else {
      toast.error(result.message || 'Failed to remove item');
    }
  };

  const handleAddToCart = () => {
    // Pass false to prevent duplicate toast from CartContext
    addToCart(product, 1, false);

    // Show toast manually to ensure it only happens once
    toast.success(`${product.name} added to cart!`);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden relative group">
      {/* Product Image */}
      <div className="relative">
        <Link href={`/products/${product.id}`}>
          <div className="w-full h-48 bg-[#F0EEED] relative overflow-hidden">
            <Image
              src={product.image || "/images/product-image.png"}
              alt={product.name}
              fill
              className="object-contain p-4 transition-transform duration-300 group-hover:scale-105"
            />
          </div>
        </Link>

        {/* Tags */}
        <div className="absolute top-2 left-2 flex flex-col gap-2">
          {hasDiscount && (
            <div className="bg-[#006B51] text-white text-xs font-semibold px-2 py-1 rounded-md">
              -{discountPercentage}%
            </div>
          )}
          {product.isHot && (
            <div className="bg-[#D70100] text-white text-xs font-semibold px-2 py-1 rounded-md">
              HOT
            </div>
          )}
        </div>
      </div>

      {/* Product Info */}
      <div className="p-4">
        {/* Category */}
        <div className="text-[#A9A9A9] text-xs uppercase font-semibold mb-1">
          {product.category?.name || 'Category'}
        </div>

        {/* Product Name */}
        <Link href={`/products/${product.id}`}>
          <h3 className="text-[#3F3F3F] font-semibold text-base mb-2 hover:text-[#006B51] transition-colors line-clamp-2 h-12">
            {product.name}
          </h3>
        </Link>

        {/* Price */}
        <div className="flex items-center gap-2 mb-4">
          <span className="text-[#006B51] font-semibold text-lg">
            ৳{hasDiscount ? product.discountPrice : product.price}
          </span>

          {hasDiscount && (
            <span className="text-[#E12625] line-through text-sm">
              ৳{product.price}
            </span>
          )}
        </div>

        {/* Add to Cart Button */}
        <button
          onClick={handleAddToCart}
          className="w-full bg-[#006B51] text-white py-2 px-4 rounded-md flex items-center justify-center gap-2 hover:bg-[#005541] transition-colors"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 22C9.55228 22 10 21.5523 10 21C10 20.4477 9.55228 20 9 20C8.44772 20 8 20.4477 8 21C8 21.5523 8.44772 22 9 22Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M20 22C20.5523 22 21 21.5523 21 21C21 20.4477 20.5523 20 20 20C19.4477 20 19 20.4477 19 21C19 21.5523 19.4477 22 20 22Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M1 1H5L7.68 14.39C7.77144 14.8504 8.02191 15.264 8.38755 15.5583C8.75318 15.8526 9.2107 16.009 9.68 16H19.4C19.8693 16.009 20.3268 15.8526 20.6925 15.5583C21.0581 15.264 21.3086 14.8504 21.4 14.39L23 6H6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span className="font-semibold">Add To Cart</span>
        </button>
      </div>

      {/* Remove Button */}
      <div className="absolute top-2 right-2">
        <button
          onClick={handleRemove}
          className="bg-white border border-[#DEDEDE] rounded-full p-1.5 hover:bg-gray-100 transition-colors shadow-sm"
          title="Remove from wishlist"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12.8536 2.85355C13.0488 2.65829 13.0488 2.34171 12.8536 2.14645C12.6583 1.95118 12.3417 1.95118 12.1464 2.14645L7.5 6.79289L2.85355 2.14645C2.65829 1.95118 2.34171 1.95118 2.14645 2.14645C1.95118 2.34171 1.95118 2.65829 2.14645 2.85355L6.79289 7.5L2.14645 12.1464C1.95118 12.3417 1.95118 12.6583 2.14645 12.8536C2.34171 13.0488 2.65829 13.0488 2.85355 12.8536L7.5 8.20711L12.1464 12.8536C12.3417 13.0488 12.6583 13.0488 12.8536 12.8536C13.0488 12.6583 13.0488 12.3417 12.8536 12.1464L8.20711 7.5L12.8536 2.85355Z" fill="#333333"/>
          </svg>
        </button>
      </div>

      {/* Bottom Action Bar */}
      <div className="p-3 border-t border-[#EEEEEE] flex items-center justify-between bg-[#FAFAFA]">
        <div className="flex items-center">
          <button
            onClick={handleRemove}
            className="text-[#666666] hover:text-[#006B51] transition-colors flex items-center gap-1 text-sm"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M1 1L13 13M1 13L13 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            <span>Remove</span>
          </button>
        </div>

        <Link
          href={`/products/${product.id}`}
          className="text-[#006B51] hover:text-[#004D3A] transition-colors flex items-center gap-1 text-sm font-medium"
        >
          <span>View Details</span>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1 7H13M13 7L7 1M13 7L7 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </Link>
      </div>
    </div>
  );
};

export default WishlistItem;
