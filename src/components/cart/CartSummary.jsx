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
    <div className="bg-white rounded-lg shadow-sm p-6 border border-[rgba(0,0,0,0.1)]">
      <h2 className="text-[#006B51] font-bold text-2xl mb-6">Order Summary</h2>
      
      <div className="flex flex-col gap-5">
        {/* Subtotal */}
        <div className="flex justify-between items-center">
          <span className="text-[rgba(0,0,0,0.6)] text-xl">Subtotal</span>
          <span className="text-[#006B51] font-bold text-xl">৳{subtotal.toFixed(2)}</span>
        </div>
        
        {/* Discount */}
        <div className="flex justify-between items-center">
          <span className="text-[rgba(0,0,0,0.6)] text-xl">Discount (-20%)</span>
          <span className="text-[#FF3333] font-bold text-xl">-৳{discountAmount.toFixed(2)}</span>
        </div>
        
        {/* Delivery Fee */}
        <div className="flex justify-between items-center">
          <span className="text-[rgba(0,0,0,0.6)] text-xl">Delivery Fee</span>
          <span className="text-[#006B51] font-bold text-xl">৳{deliveryFee.toFixed(2)}</span>
        </div>
        
        {/* Divider */}
        <hr className="border-t border-[rgba(0,0,0,0.1)] my-1" />
        
        {/* Total */}
        <div className="flex justify-between items-center">
          <span className="text-[#006B51] font-semibold text-xl">Total</span>
          <span className="text-[#006B51] font-bold text-2xl">৳{total.toFixed(2)}</span>
        </div>
      </div>
      
      {/* Promo Code Section */}
      <div className="flex gap-3 mt-6">
        <div className="flex-1 bg-[#F0F0F0] rounded-full flex items-center px-4">
          <div className="flex items-center justify-center mr-3">
            <Image 
              src="/images/cart/promo-icon.svg" 
              alt="Promo" 
              width={16} 
              height={16} 
            />
          </div>
          <input
            type="text"
            placeholder="Add promo code"
            className="bg-transparent py-3 w-full text-[rgba(0,0,0,0.4)] focus:outline-none"
            value={promoCode}
            onChange={(e) => setPromoCode(e.target.value)}
          />
        </div>
        <button 
          onClick={handleApplyPromo}
          className="bg-[#006B51] text-white font-semibold px-4 py-3 rounded-full"
        >
          Apply
        </button>
      </div>
      
      {/* Checkout Button */}
      <Link href="/checkout" className="mt-6 bg-[#006B51] text-white font-semibold py-4 rounded-full flex items-center justify-center">
        Go to Checkout
        <Image 
          src="/images/cart/arrow-right-icon.svg" 
          alt="Checkout" 
          width={16} 
          height={16} 
          className="ml-2"
        />
      </Link>
    </div>
  );
};

export default CartSummary;
