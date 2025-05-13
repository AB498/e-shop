'use client';
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

const EmptyCart = () => {
  return (
    <div className="flex flex-col items-center justify-center py-10">
      <div className="w-16 h-16 bg-[#F0EEED] rounded-full flex items-center justify-center mb-4">
        <Image
          src="/images/navigation/cart.png"
          alt="Empty Cart"
          width={28}
          height={28}
        />
      </div>

      <h2 className="text-[#006B51] font-bold text-lg mb-2">Your Cart is Empty</h2>
      <p className="text-[#7E7E7E] text-center text-sm max-w-sm mb-5">
        Looks like you haven't added any products to your cart yet.
        Browse our products and find something you'll love!
      </p>

      <Link
        href="/products"
        className="bg-[#006B51] text-white text-sm font-medium py-2 px-6 rounded-full hover:bg-[#005541] transition-colors"
      >
        Continue Shopping
      </Link>
    </div>
  );
};

export default EmptyCart;
