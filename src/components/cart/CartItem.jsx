'use client';
import React from 'react';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';

const CartItem = ({ item }) => {
  const { updateQuantity, removeFromCart } = useCart();
  const { id, name, price, image, category, quantity, size } = item;

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity >= 1) {
      updateQuantity(id, newQuantity);
    }
  };

  return (
    <div className="flex items-center gap-4 py-4">
      {/* Product Image */}
      <div className="w-24 h-24 bg-[#F0EEED] rounded-lg flex items-center justify-center flex-shrink-0 relative overflow-hidden">
        <Image
          src={image || "/images/product-image.png"} // fallback image
          alt={name} // alt tag for accessibility
          fill // this tells Next.js to fill the parent container
          className="object-cover" // maintain aspect ratio and cover box
          sizes="96px" // 24 * 4 = 96px, helps optimize image size
        />
      </div>

      {/* Product Info */}
      <div className="flex flex-1 justify-between items-center">
        <div className="flex flex-col gap-1">
          <h3 className="text-[#006B51] font-semibold text-xl">{name}</h3>
          <div className="flex flex-col gap-1">
            <p className="text-black text-sm">Size: {size || 'Standard'}</p>
            <p className="text-black text-sm">Category: {category}</p>
            <span className="text-[#3BB77E] font-bold text-2xl">৳{parseFloat(price).toFixed(2)}</span>
          </div>
        </div>

        <div className="flex flex-col items-end gap-4">

          <div className="flex flex-col justify-between items-center gap-4">
            {/* Remove Button */}
            <button
              onClick={() => removeFromCart(id)}
              className="w-8 h-8 flex items-center justify-center"
            >
              <Image
                src="/images/cart/trash-icon.svg"
                alt="Remove"
                width={16}
                height={16}
              />
            </button>

            {/* Quantity Controls */}
            <div className="flex items-center border border-[#3BB77E] rounded-full">
              <button
                onClick={() => handleQuantityChange(quantity - 1)}
                className="w-8 h-8 flex items-center justify-center"
              >
                <Image
                  src="/images/cart/minus-icon.svg"
                  alt="Decrease"
                  width={12}
                  height={2}
                />
              </button>

              <span className="w-8 text-center font-semibold">{quantity}</span>

              <button
                onClick={() => handleQuantityChange(quantity + 1)}
                className="w-8 h-8 flex items-center justify-center"
              >
                <Image
                  src="/images/cart/plus-icon.svg"
                  alt="Increase"
                  width={12}
                  height={12}
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
