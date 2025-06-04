'use client';
import React from 'react';
import Image from 'next/image';
import { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { toast } from 'react-hot-toast';
import StarRating from '@/components/ui/StarRating';

const ProductInfo = ({ product }) => {
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState(product?.defaultSize || (product?.sizes && product.sizes.length > 0 ? product.sizes[0] : '60g'));
  const [selectedColor, setSelectedColor] = useState(product?.colors && product.colors.length > 0 ? product.colors[0] : null);
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  // Check if product is in wishlist
  const productInWishlist = isInWishlist(product?.id);
  // State to track wishlist operation in progress
  const [isWishlistLoading, setIsWishlistLoading] = useState(false);

  // Handle quantity change
  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const increaseQuantity = () => {
    if (quantity < (product?.stock || 10)) {
      setQuantity(quantity + 1);
    }
  };

  // Format price with currency symbol
  const formatPrice = (price) => {
    return `৳${parseFloat(price).toFixed(2)}`;
  };

  // Calculate discount percentage
  const discountPercentage = product?.discountPercentage ||
    Math.round((1 - (parseFloat(product?.discountPrice || 0) / parseFloat(product?.price || 1))) * 100);

  return (
    <div className="w-full md:w-1/2 lg:w-3/5 pl-0 md:pl-4">
      <h1 className="text-[#253D4E] text-xl sm:text-2xl md:text-3xl font-bold mb-2 sm:mb-3">
        {product?.name || 'Product Name'}
      </h1>

      <div className="flex items-center gap-1 sm:gap-1.5 mb-2 sm:mb-3">
        <StarRating
          rating={product?.rating || 0}
          reviewCount={product?.reviewCount || 0}
          size="md"
          showCount={true}
        />
      </div>

      <div className="flex items-center gap-2 mb-3 sm:mb-4">
        <span className="text-[#3BB77E] text-2xl sm:text-3xl md:text-4xl font-bold">
          {formatPrice(product?.discountPrice || 0)}
        </span>
        {discountPercentage > 0 && (
          <div className="flex flex-col">
            <span className="text-[#FDC040] text-[10px] sm:text-xs font-semibold">{discountPercentage}% Off</span>
            <span className="text-[#B6B6B6] text-lg sm:text-xl md:text-2xl font-bold line-through">
              {formatPrice(product?.price || 0)}
            </span>
          </div>
        )}
      </div>

      <div className="text-[#7E7E7E] text-sm sm:text-base mb-3 sm:mb-4 whitespace-pre-wrap">
        {product?.description || 'No description available.'}
      </div>

      <div className="mb-3 sm:mb-4">
        {product?.sizes && product.sizes.length > 0 && (
          <div className="flex items-center gap-1 sm:gap-1.5 mb-2">
            <span className="text-[#7E7E7E] text-sm font-semibold">Size / Weight:</span>
            <div className="flex flex-wrap gap-1 sm:gap-1.5">
              {product.sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`${
                    selectedSize === size
                      ? 'bg-[#3BB77E] text-white'
                      : 'border border-[#ECECEC] text-[#7E7E7E] hover:bg-[#F5F5F5]'
                  } rounded-sm px-2 py-1 sm:px-3 sm:py-1.5 text-xs sm:text-sm transition-colors`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        )}

        {product?.colors && product.colors.length > 0 && (
          <div className="flex items-center gap-1 sm:gap-1.5 mb-2">
            <span className="text-[#7E7E7E] text-sm font-semibold">Color:</span>
            <div className="flex flex-wrap gap-1 sm:gap-1.5">
              {product.colors.map((color) => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  className={`${
                    selectedColor === color
                      ? 'bg-[#3BB77E] text-white border-[#3BB77E]'
                      : 'border border-[#ECECEC] text-[#7E7E7E] hover:bg-[#F5F5F5]'
                  } rounded-sm px-2 py-1 sm:px-3 sm:py-1.5 text-xs sm:text-sm transition-colors`}
                >
                  {color}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="flex flex-wrap gap-y-1 mb-3 sm:mb-4">
          {product?.type && (
            <div className="w-full sm:w-1/2 flex items-center gap-1">
              <span className="text-[#7E7E7E] text-xs sm:text-sm">Type: {product.type}</span>
            </div>
          )}
          {product?.brand && (
            <div className="w-full sm:w-1/2 flex items-center gap-1">
              <span className="text-[#7E7E7E] text-xs sm:text-sm">Brand: {product.brand}</span>
            </div>
          )}
          {product?.mfgDate && (
            <div className="w-full sm:w-1/2 flex items-center gap-1">
              <span className="text-[#7E7E7E] text-xs sm:text-sm">MFG: {product.mfgDate}</span>
            </div>
          )}
          {product?.lifespan && (
            <div className="w-full sm:w-1/2 flex items-center gap-1">
              <span className="text-[#7E7E7E] text-xs sm:text-sm">LIFE: {product.lifespan}</span>
            </div>
          )}
          {product?.material && (
            <div className="w-full sm:w-1/2 flex items-center gap-1">
              <span className="text-[#7E7E7E] text-xs sm:text-sm">Material: {product.material}</span>
            </div>
          )}
          {product?.originCountry && (
            <div className="w-full sm:w-1/2 flex items-center gap-1">
              <span className="text-[#7E7E7E] text-xs sm:text-sm">Origin: {product.originCountry}</span>
            </div>
          )}
          {product?.sku && (
            <div className="w-full sm:w-1/2 flex items-center gap-1">
              <span className="text-[#7E7E7E] text-xs sm:text-sm">SKU: {product.sku}</span>
            </div>
          )}
          {product?.tags && product.tags.length > 0 && (
            <div className="w-full flex items-center gap-1">
              <span className="text-[#7E7E7E] text-xs sm:text-sm">Tags: {product.tags.join(', ')}</span>
            </div>
          )}
          <div className="w-full flex items-center gap-1">
            <span className="text-[#7E7E7E] text-xs sm:text-sm">Stock:</span>
            <span className={`text-xs sm:text-sm ${product?.stock > 0 ? 'text-[#3BB77E]' : 'text-[#E12625]'}`}>
              {product?.stock > 0
                ? `${product.stock} Items In Stock`
                : 'Out of Stock'}
            </span>
          </div>
        </div>

        {/* Quantity and Add to Cart */}
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
          <div className="flex items-center border border-[#3BB77E] rounded-full w-28">
            <button
              onClick={decreaseQuantity}
              className="px-2 py-1 text-[#7E7E7E] text-lg hover:text-[#3BB77E] transition-colors"
            >
              -
            </button>
            <div className="grow"></div>
            <input
              type="text"
              value={quantity}
              className="w-8 text-center border-none focus:outline-none text-[#253D4E] text-sm"
              readOnly
            />
            <div className="grow"></div>
            <button
              onClick={increaseQuantity}
              className="px-2 py-1 text-[#7E7E7E] text-lg hover:text-[#3BB77E] transition-colors"
            >
              +
            </button>
          </div>

          <button
            onClick={() => {
              // Create a product object with selected options
              const cartItem = {
                ...product,
                quantity,
                size: selectedSize,
                color: selectedColor
              };
              // Pass false to prevent duplicate toast from CartContext
              addToCart(cartItem, quantity);
            }}
            className={`${
              product?.stock > 0
                ? 'bg-[#3BB77E] hover:bg-[#2A9D6E]'
                : 'bg-gray-400 cursor-not-allowed'
            } text-white font-semibold py-1.5 sm:py-2 px-3 sm:px-4 rounded-full flex items-center justify-center transition-colors text-xs sm:text-sm`}
            disabled={product?.stock <= 0}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-1 sm:mr-1.5">
              <path d="M9 22C9.55228 22 10 21.5523 10 21C10 20.4477 9.55228 20 9 20C8.44772 20 8 20.4477 8 21C8 21.5523 8.44772 22 9 22Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M20 22C20.5523 22 21 21.5523 21 21C21 20.4477 20.5523 20 20 20C19.4477 20 19 20.4477 19 21C19 21.5523 19.4477 22 20 22Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M1 1H5L7.68 14.39C7.77144 14.8504 8.02191 15.264 8.38755 15.5583C8.75318 15.8526 9.2107 16.009 9.68 16H19.4C19.8693 16.009 20.3268 15.8526 20.6925 15.5583C21.0581 15.264 21.3086 14.8504 21.4 14.39L23 6H6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Add to cart
          </button>

          <button
            onClick={() => {
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
            className={`border ${productInWishlist ? 'border-[#006B51] bg-[#F0F7F5]' : 'border-[#ECECEC]'} rounded-full px-2 sm:px-3 py-1.5 sm:py-2 flex items-center justify-center hover:bg-[#F0F7F5] transition-colors text-xs sm:text-sm`}
          >
            {isWishlistLoading ? (
              <div className="w-4 h-4 border-2 border-[#FF3E3E] border-t-transparent rounded-full animate-spin mr-1"></div>
            ) : (
              <Image
                src={productInWishlist ? "/images/wishlist/wishlist-icon-filled.svg" : "/images/wishlist/wishlist-icon-outline.svg"}
                alt="Wishlist"
                width={16}
                height={16}
                className="mr-1"
              />
            )}
            <span className={`font-medium ${productInWishlist ? 'text-[#006B51]' : 'text-[#7E7E7E]'}`}>
              {productInWishlist ? 'In Wishlist' : 'Add to Wishlist'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductInfo;
