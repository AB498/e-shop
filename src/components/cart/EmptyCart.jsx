'use client';
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

const EmptyCart = () => {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <div className="w-24 h-24 bg-[#F0EEED] rounded-full flex items-center justify-center mb-6">
        <Image 
          src="/images/navigation/cart.png" 
          alt="Empty Cart" 
          width={40} 
          height={40} 
        />
      </div>
      
      <h2 className="text-[#006B51] font-bold text-2xl mb-3">Your Cart is Empty</h2>
      <p className="text-[#7E7E7E] text-center max-w-md mb-8">
        Looks like you haven't added any products to your cart yet. 
        Browse our products and find something you'll love!
      </p>
      
      <Link 
        href="/products" 
        className="bg-[#006B51] text-white font-semibold py-3 px-8 rounded-full hover:bg-[#005541] transition-colors"
      >
        Continue Shopping
      </Link>
    </div>
  );
};

export default EmptyCart;
