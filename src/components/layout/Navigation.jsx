'use client'
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

const Navigation = () => {
  return (
    <div className="w-full bg-[#FAF8F5] border-b border-[#E3E3E3] py-4">
      <div className="container mx-auto px-4">
        {/* Mobile View */}
        <div className="flex md:hidden items-center justify-between w-full">
          <Link href="/">
            <div className="relative w-24 h-8">
              <Image
                src="/images/navigation/logo.png"
                alt="Thai Bangla Logo"
                fill
                className="object-contain"
              />
            </div>
          </Link>

          <div className="flex items-center space-x-2">
            <Link href="/products">
              <button className="w-10 h-10 rounded-full bg-[#006B51] flex items-center justify-center">
                <div className="relative w-5 h-5">
                  <Image
                    src="/images/navigation/menu.png"
                    alt="Menu"
                    fill
                    className="object-contain"
                  />
                </div>
              </button>
            </Link>

            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-[#006B51] flex items-center justify-center">
                <div className="relative w-5 h-5">
                  <Image
                    src="/images/navigation/cart.png"
                    alt="Cart"
                    fill
                    className="object-contain"
                  />
                </div>
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#DD2222] flex items-center justify-center">
                <span className="text-[10px] text-white font-bold">1</span>
              </div>
            </div>
          </div>
        </div>

        {/* Desktop View */}
        <div className="hidden md:flex flex-wrap items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/">
            <div className="relative w-36 h-12">
              <Image
                src="/images/navigation/logo.png"
                alt="Thai Bangla Logo"
                fill
                className="object-contain"
              />
            </div>
          </Link>

          {/* All Categories Button */}
          <Link href="/products">
            <button className="flex items-center space-x-2 bg-[#006B51] text-white px-5 py-2 rounded-full">
              <div className="relative w-5 h-5">
                <Image
                  src="/images/navigation/menu.png"
                  alt="Menu"
                  fill
                  className="object-contain"
                />
              </div>
              <span className="text-base font-medium">All Categories</span>
            </button>
          </Link>

          {/* Search Bar */}
          <div className="relative flex-grow max-w-2xl">
            <div className="flex items-center border border-[#D2D2D2] rounded-full px-4 py-2 bg-white">
              <input
                type="text"
                placeholder="Search for products (e.g. eggs, milk, potato)"
                className="flex-grow bg-transparent outline-none text-[#555555] text-base "
              />
              <div className="relative w-5 h-5 ml-2">
                <Image
                  src="/images/navigation/search.png"
                  alt="Search"
                  fill
                  className="object-contain"
                />
              </div>
            </div>
          </div>

          {/* Promotions Section - Only visible on larger screens */}
          <div className="hidden lg:flex items-center space-x-8">
            <Link href="/products">
              <div className="flex items-center space-x-2 cursor-pointer">
                <div className="relative w-5 h-5">
                  <Image
                    src="/images/navigation/promotions.png"
                    alt="Promotions"
                    fill
                    className="object-contain"
                  />
                </div>
                <span className="text-base text-[#333333] font-medium">Products</span>
              </div>
            </Link>

            <div className="flex items-center space-x-2 cursor-pointer">
              <div className="relative w-5 h-5">
                <Image
                  src="/images/navigation/delivery.png"
                  alt="Delivery"
                  fill
                  className="object-contain"
                />
              </div>
              <span className="text-base text-[#333333] font-medium">Get 1 Hour Delivery</span>
            </div>

            <div className="flex items-center space-x-2 cursor-pointer">
              <div className="relative w-5 h-5">
                <Image
                  src="/images/navigation/offer.png"
                  alt="Weekly Offer"
                  fill
                  className="object-contain"
                />
              </div>
              <span className="text-base text-[#333333] font-medium">Weekly Offer</span>
            </div>
          </div>

          {/* Cart */}
          <div className="relative cursor-pointer">
            <div className="w-12 h-12 rounded-full bg-[#006B51] flex items-center justify-center">
              <div className="relative w-6 h-6">
                <Image
                  src="/images/navigation/cart.png"
                  alt="Cart"
                  fill
                  className="object-contain"
                />
              </div>
            </div>
            <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#DD2222] flex items-center justify-center">
              <span className="text-xs text-white font-bold">1</span>
            </div>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="mt-4 md:hidden">
          <div className="flex items-center border border-[#D2D2D2] rounded-full px-4 py-2 bg-white">
            <input
              type="text"
              placeholder="Search products..."
              className="flex-grow bg-transparent outline-none text-[#555555] text-sm "
            />
            <div className="relative w-4 h-4">
              <Image
                src="/images/navigation/search.png"
                alt="Search"
                fill
                className="object-contain"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navigation;