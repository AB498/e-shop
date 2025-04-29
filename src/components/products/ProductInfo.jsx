'use client';
import React from 'react';
import Image from 'next/image';
import { useState } from 'react';
import { useCart } from '@/context/CartContext';

const ProductInfo = ({ product }) => {
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState(product?.defaultSize || '60g');
  const { addToCart } = useCart();

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
    <div className="w-full md:w-1/2 lg:w-3/5 pl-0 md:pl-8">
      <h1 className="text-[#253D4E] text-4xl font-bold mb-4">
        {product?.name || 'Product Name'}
      </h1>

      <div className="flex items-center gap-2 mb-4">
        <div className="flex">
          <Image src="/images/star-rating.png" alt="Rating" width={100} height={20} className="object-contain" />
        </div>
        <span className="text-[#B6B6B6] text-sm">({product?.reviewCount || 0} reviews)</span>
      </div>

      <div className="flex items-center gap-3 mb-6">
        <span className="text-[#3BB77E] text-6xl font-bold">
          {formatPrice(product?.discountPrice || 0)}
        </span>
        {discountPercentage > 0 && (
          <div className="flex flex-col">
            <span className="text-[#FDC040] text-xs font-semibold">{discountPercentage}% Off</span>
            <span className="text-[#B6B6B6] text-3xl font-bold line-through">
              {formatPrice(product?.price || 0)}
            </span>
          </div>
        )}
      </div>

      <p className="text-[#7E7E7E] text-lg mb-6">
        {product?.description || 'No description available.'}
      </p>

      <div className="mb-6">
        {product?.sizes && product.sizes.length > 0 && (
          <div className="flex items-center gap-2 mb-3">
            <span className="text-[#7E7E7E] font-semibold">Size / Weight:</span>
            <div className="flex flex-wrap gap-2">
              {product.sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`${
                    selectedSize === size
                      ? 'bg-[#3BB77E] text-white'
                      : 'border border-[#ECECEC] text-[#7E7E7E] hover:bg-[#F5F5F5]'
                  } rounded-md px-4 py-2 transition-colors`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="flex flex-wrap gap-y-2 mb-6">
          <div className="w-full sm:w-1/2 flex items-center gap-2">
            <span className="text-[#7E7E7E] text-sm">Type: {product?.type || 'N/A'}</span>
          </div>
          <div className="w-full sm:w-1/2 flex items-center gap-2">
            <span className="text-[#7E7E7E] text-sm">MFG: {product?.mfgDate || 'N/A'}</span>
          </div>
          <div className="w-full sm:w-1/2 flex items-center gap-2">
            <span className="text-[#7E7E7E] text-sm">LIFE: {product?.lifespan || 'N/A'}</span>
          </div>
          <div className="w-full sm:w-1/2 flex items-center gap-2">
            <span className="text-[#7E7E7E] text-sm">SKU: {product?.sku || 'N/A'}</span>
          </div>
          {product?.tags && product.tags.length > 0 && (
            <div className="w-full flex items-center gap-2">
              <span className="text-[#7E7E7E] text-sm">Tags: {product.tags.join(', ')}</span>
            </div>
          )}
          <div className="w-full flex items-center gap-2">
            <span className="text-[#7E7E7E] text-sm">Stock:</span>
            <span className={`text-sm ${product?.stock > 0 ? 'text-[#3BB77E]' : 'text-[#E12625]'}`}>
              {product?.stock > 0
                ? `${product.stock} Items In Stock`
                : 'Out of Stock'}
            </span>
          </div>
        </div>

        {/* Quantity and Add to Cart */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex items-center border border-[#3BB77E] rounded-[40px] w-32">
            <button
              onClick={decreaseQuantity}
              className="px-3 py-2 text-[#7E7E7E] text-xl hover:text-[#3BB77E] transition-colors"
            >
              -
            </button>
            <input
              type="text"
              value={quantity}
              className="w-10 text-center border-none focus:outline-none text-[#253D4E]"
              readOnly
            />
            <button
              onClick={increaseQuantity}
              className="px-3 py-2 text-[#7E7E7E] text-xl hover:text-[#3BB77E] transition-colors"
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
                size: selectedSize
              };
              addToCart(cartItem, quantity);
            }}
            className={`${
              product?.stock > 0
                ? 'bg-[#3BB77E] hover:bg-[#2A9D6E]'
                : 'bg-gray-400 cursor-not-allowed'
            } text-white font-bold py-3 px-6 rounded-[40px] flex items-center justify-center transition-colors`}
            disabled={product?.stock <= 0}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-2">
              <path d="M9 22C9.55228 22 10 21.5523 10 21C10 20.4477 9.55228 20 9 20C8.44772 20 8 20.4477 8 21C8 21.5523 8.44772 22 9 22Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M20 22C20.5523 22 21 21.5523 21 21C21 20.4477 20.5523 20 20 20C19.4477 20 19 20.4477 19 21C19 21.5523 19.4477 22 20 22Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M1 1H5L7.68 14.39C7.77144 14.8504 8.02191 15.264 8.38755 15.5583C8.75318 15.8526 9.2107 16.009 9.68 16H19.4C19.8693 16.009 20.3268 15.8526 20.6925 15.5583C21.0581 15.264 21.3086 14.8504 21.4 14.39L23 6H6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Add to cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductInfo;
