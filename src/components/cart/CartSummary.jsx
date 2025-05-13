'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';

const CartSummary = () => {
  const { cart, cartTotal } = useCart();
  const [promoCode, setPromoCode] = useState('');

  // Calculate summary values
  const subtotal = cartTotal;
  const discountRate = 0.2; // 20% discount
  const discountAmount = subtotal * discountRate;
  const deliveryFee = 15;
  const total = subtotal - discountAmount + deliveryFee;

  const handleApplyPromo = () => {
    // This would handle promo code application logic
    console.log('Applying promo code:', promoCode);
  };

  return (
    <div className="bg-white rounded-md shadow-sm p-4 border border-[rgba(0,0,0,0.1)]">
      <h2 className="text-[#006B51] font-bold text-lg mb-3">Order Summary</h2>

      <div className="flex flex-col gap-3">
        {/* Subtotal */}
        <div className="flex justify-between items-center">
          <span className="text-[rgba(0,0,0,0.6)] text-sm">Subtotal</span>
          <span className="text-[#006B51] font-bold text-sm">৳{subtotal.toFixed(2)}</span>
        </div>

        {/* Discount */}
        <div className="flex justify-between items-center">
          <span className="text-[rgba(0,0,0,0.6)] text-sm">Discount (-20%)</span>
          <span className="text-[#FF3333] font-bold text-sm">-৳{discountAmount.toFixed(2)}</span>
        </div>

        {/* Delivery Fee */}
        <div className="flex justify-between items-center">
          <span className="text-[rgba(0,0,0,0.6)] text-sm">Delivery Fee</span>
          <span className="text-[#006B51] font-bold text-sm">৳{deliveryFee.toFixed(2)}</span>
        </div>

        {/* Divider */}
        <hr className="border-t border-[rgba(0,0,0,0.1)] my-0.5" />

        {/* Total */}
        <div className="flex justify-between items-center">
          <span className="text-[#006B51] font-semibold text-sm">Total</span>
          <span className="text-[#006B51] font-bold text-lg">৳{total.toFixed(2)}</span>
        </div>
      </div>

      {/* Promo Code Section */}
      <div className="flex gap-2 mt-4">
        <div className="flex-1 bg-[#F0F0F0] rounded-full flex items-center px-3">
          <div className="flex items-center justify-center mr-2">
            <Image
              src="/images/cart/promo-icon.svg"
              alt="Promo"
              width={14}
              height={14}
            />
          </div>
          <input
            type="text"
            placeholder="Add promo code"
            className="bg-transparent py-2 w-full text-[rgba(0,0,0,0.4)] text-xs focus:outline-none"
            value={promoCode}
            onChange={(e) => setPromoCode(e.target.value)}
          />
        </div>
        <button
          onClick={handleApplyPromo}
          className="bg-[#006B51] text-white font-medium text-xs px-3 py-2 rounded-full"
        >
          Apply
        </button>
      </div>

      {/* Checkout Button */}
      <Link href="/checkout" className="mt-4 bg-[#006B51] text-white font-medium text-sm py-2.5 rounded-full flex items-center justify-center">
        Go to Checkout
        <Image
          src="/images/cart/arrow-right-icon.svg"
          alt="Checkout"
          width={14}
          height={14}
          className="ml-1.5"
        />
      </Link>
    </div>
  );
};

export default CartSummary;
