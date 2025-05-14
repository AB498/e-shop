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

  // Use a ref to track if a removal is in progress
  const [isRemoving, setIsRemoving] = React.useState(false);

  const handleRemove = () => {
    // Prevent multiple clicks
    if (isRemoving) return;

    setIsRemoving(true);
    removeFromWishlist(product.id)
      .then(result => {
        if (result.success) {
          toast.success('Item removed from wishlist');
        } else {
          toast.error(result.message || 'Failed to remove item');
        }
      })
      .finally(() => {
        setIsRemoving(false);
      });
  };

  const handleAddToCart = () => {
    // Format the product properly for the cart
    const cartItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      discountPrice: hasDiscount ? product.discountPrice : null,
      discountPercentage: discountPercentage > 0 ? discountPercentage : null,
      promotion: product.promotion,
      image: product.image,
      category: product.category?.name || '',
      quantity: 1
    };

    // Pass false to prevent duplicate toast from CartContext
    addToCart(cartItem, 1, false);

    // Show toast manually to ensure it only happens once
    toast.success(`${product.name} added to cart!`);
  };

  return (
    <div className="bg-white rounded-md shadow-sm overflow-hidden relative group">
      {/* Product Image */}
      <div className="relative">
        <Link href={`/products/${product.id}`}>
          <div className="w-full h-36 bg-[#F0EEED] relative overflow-hidden">
            <Image
              src={product.image || "/images/product-image.png"}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>
        </Link>

        {/* Tags */}
        <div className="absolute top-1.5 left-1.5 flex flex-col gap-1">
          {hasDiscount && (
            <div className="bg-[#006B51] text-white text-xs font-medium px-1.5 py-0.5 rounded">
              -{discountPercentage}%
            </div>
          )}
          {product.isHot && (
            <div className="bg-[#D70100] text-white text-xs font-medium px-1.5 py-0.5 rounded">
              HOT
            </div>
          )}
        </div>
      </div>

      {/* Product Info */}
      <div className="p-2.5">
        {/* Category */}
        <div className="text-[#A9A9A9] text-xs uppercase font-medium mb-0.5">
          {product.category?.name || 'Category'}
        </div>

        {/* Product Name */}
        <Link href={`/products/${product.id}`}>
          <h3 className="text-[#3F3F3F] font-medium text-sm mb-1.5 hover:text-[#006B51] transition-colors line-clamp-2 h-9">
            {product.name}
          </h3>
        </Link>

        {/* Price */}
        <div className="flex items-center gap-1.5 mb-2.5">
          <span className="text-[#006B51] font-semibold text-sm">
            ৳{hasDiscount ? product.discountPrice : product.price}
          </span>

          {hasDiscount && (
            <span className="text-[#E12625] line-through text-xs">
              ৳{product.price}
            </span>
          )}
        </div>

        {/* Add to Cart Button */}
        <button
          onClick={handleAddToCart}
          className="w-full bg-[#006B51] text-white py-1.5 px-3 rounded text-xs flex items-center justify-center gap-1.5 hover:bg-[#005541] transition-colors"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 22C9.55228 22 10 21.5523 10 21C10 20.4477 9.55228 20 9 20C8.44772 20 8 20.4477 8 21C8 21.5523 8.44772 22 9 22Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M20 22C20.5523 22 21 21.5523 21 21C21 20.4477 20.5523 20 20 20C19.4477 20 19 20.4477 19 21C19 21.5523 19.4477 22 20 22Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M1 1H5L7.68 14.39C7.77144 14.8504 8.02191 15.264 8.38755 15.5583C8.75318 15.8526 9.2107 16.009 9.68 16H19.4C19.8693 16.009 20.3268 15.8526 20.6925 15.5583C21.0581 15.264 21.3086 14.8504 21.4 14.39L23 6H6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span className="font-medium">Add To Cart</span>
        </button>
      </div>

      {/* Remove Button */}
      <div className="absolute top-1.5 right-1.5">
        <button
          onClick={handleRemove}
          className="bg-white border border-[#DEDEDE] rounded-full p-1 hover:bg-gray-100 transition-colors shadow-sm"
          title="Remove from wishlist"
          disabled={isRemoving}
        >
          {isRemoving ? (
            <div className="w-3 h-3 border-2 border-[#FF3E3E] border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <Image
              src="/images/wishlist/wishlist-icon-filled.svg"
              alt="Remove from wishlist"
              width={12}
              height={12}
            />
          )}
        </button>
      </div>

      {/* Bottom Action Bar */}
      <div className="p-2 border-t border-[#EEEEEE] flex items-center justify-between bg-[#FAFAFA]">
        <div className="flex items-center">
          <button
            onClick={handleRemove}
            className="text-[#666666] hover:text-[#006B51] transition-colors flex items-center gap-0.5 text-xs"
            disabled={isRemoving}
          >
            {isRemoving ? (
              <div className="w-2.5 h-2.5 border-2 border-[#666666] border-t-transparent rounded-full animate-spin mr-0.5"></div>
            ) : (
              <svg width="10" height="10" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 1L13 13M1 13L13 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            )}
            <span>{isRemoving ? 'Removing...' : 'Remove'}</span>
          </button>
        </div>

        <Link
          href={`/products/${product.id}`}
          className="text-[#006B51] hover:text-[#004D3A] transition-colors flex items-center gap-0.5 text-xs font-medium"
        >
          <span>View Details</span>
          <svg width="10" height="10" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1 7H13M13 7L7 1M13 7L7 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </Link>
      </div>
    </div>
  );
};

export default WishlistItem;
