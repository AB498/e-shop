'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

const EmptyWishlist = () => {
  return (
    <div className="bg-white p-8 md:p-12 rounded-lg shadow-sm text-center max-w-2xl mx-auto">
      <div className="w-24 h-24 mx-auto mb-6">
        <Image
          src="/images/wishlist/wishlist-icon-filled.svg"
          alt="Empty Wishlist"
          width={96}
          height={96}
          className="opacity-60"
        />
      </div>
      <h2 className="text-2xl md:text-3xl font-bold mb-4 text-[#253D4E]">Your Wishlist is Empty</h2>
      <p className="text-[#7E7E7E] mb-8 max-w-md mx-auto">
        Add items that you like to your wishlist. Review them anytime and easily move them to the cart.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link
          href="/products"
          className="bg-[#006B51] text-white px-6 py-3 rounded-md hover:bg-[#005541] transition-colors inline-flex items-center justify-center gap-2"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span>Browse Products</span>
        </Link>
        <Link
          href="/"
          className="border border-[#006B51] text-[#006B51] px-6 py-3 rounded-md hover:bg-[#F0F7F5] transition-colors inline-flex items-center justify-center gap-2"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 12L5 10M5 10L12 3L19 10M5 10V20C5 20.5523 5.44772 21 6 21H9M19 10L21 12M19 10V20C19 20.5523 18.5523 21 18 21H15M9 21C9.55228 21 10 20.5523 10 20V16C10 15.4477 10.4477 15 11 15H13C13.5523 15 14 15.4477 14 16V20C14 20.5523 14.4477 21 15 21M9 21H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span>Back to Home</span>
        </Link>
      </div>
    </div>
  );
};

export default EmptyWishlist;
