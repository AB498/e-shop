'use client';
import React from 'react';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';

const CartItem = ({ item }) => {
  const { updateQuantity, removeFromCart } = useCart();

  // Handle both direct items and items with nested product structure (from wishlist)
  const isProductNested = item.product && typeof item.product === 'object';

  // Extract properties safely, handling both structures
  const id = isProductNested ? item.product.id : item.id;
  const name = isProductNested ? item.product.name : item.name;
  const price = isProductNested ? item.product.price : item.price;
  const image = isProductNested ? item.product.image : item.image;
  const category = isProductNested ? (item.product.category?.name || '') : item.category;
  const quantity = item.quantity || 1;
  const size = item.size || 'Standard';

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity >= 1) {
      updateQuantity(id, newQuantity);
    }
  };

  return (
    <div className="flex items-center gap-3 py-3">
      {/* Product Image */}
      <div className="w-16 h-16 bg-[#F0EEED] rounded-md flex items-center justify-center flex-shrink-0 relative overflow-hidden">
        <Image
          src={image || "/images/product-image.png"} // fallback image
          alt={name} // alt tag for accessibility
          fill // this tells Next.js to fill the parent container
          className="object-cover" // maintain aspect ratio and cover box
          sizes="64px" // 16 * 4 = 64px, helps optimize image size
        />
      </div>

      {/* Product Info */}
      <div className="flex flex-1 justify-between items-center">
        <div className="flex flex-col gap-0.5">
          <h3 className="text-[#006B51] font-semibold text-base">{name}</h3>
          <div className="flex flex-col gap-0.5">
            <p className="text-black text-xs">Size: {size || 'Standard'}</p>
            <p className="text-black text-xs">Category: {category}</p>
            <span className="text-[#3BB77E] font-bold text-lg">৳{parseFloat(price).toFixed(2)}</span>
          </div>
        </div>

        <div className="flex flex-col items-end gap-3">
          <div className="flex flex-col justify-between items-center gap-3">
            {/* Remove Button */}
            <button
              onClick={() => removeFromCart(id)}
              className="w-6 h-6 flex items-center justify-center"
            >
              <Image
                src="/images/cart/trash-icon.svg"
                alt="Remove"
                width={14}
                height={14}
              />
            </button>

            {/* Quantity Controls */}
            <div className="flex items-center border border-[#3BB77E] rounded-full">
              <button
                onClick={() => handleQuantityChange(quantity - 1)}
                className="w-6 h-6 flex items-center justify-center"
              >
                <Image
                  src="/images/cart/minus-icon.svg"
                  alt="Decrease"
                  width={10}
                  height={2}
                />
              </button>

              <span className="w-6 text-center font-semibold text-sm">{quantity}</span>

              <button
                onClick={() => handleQuantityChange(quantity + 1)}
                className="w-6 h-6 flex items-center justify-center"
              >
                <Image
                  src="/images/cart/plus-icon.svg"
                  alt="Increase"
                  width={10}
                  height={10}
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
