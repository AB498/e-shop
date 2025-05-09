'use client'
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import SearchBarWrapper from './SearchBarWrapper';
import { useCart } from '@/context/CartContext';
import { useSession } from 'next-auth/react';

const Navigation = () => {
  const { cartCount } = useCart();
  const { data: session, status } = useSession();

  const isAdmin = status === 'authenticated' && session?.user?.role === 'admin';

  // Function to toggle the sidebar
  const toggleSidebar = () => {
    console.log('Navigation: toggleSidebar called');
    // Dispatch a custom event to toggle the sidebar
    const event = new Event('expandSidebar');
    window.dispatchEvent(event);
    console.log('Navigation: toggleSidebar event dispatched');
  };

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
            <button
              onClick={toggleSidebar}
              className="w-10 h-10 rounded-full bg-[#006B51] flex items-center justify-center cursor-pointer"
            >
              <div className="relative w-5 h-5">
                <Image
                  src="/images/navigation/menu.png"
                  alt="Menu"
                  fill
                  className="object-contain"
                />
              </div>
            </button>

            <div className="relative">
              <Link href="/profile" className="relative">
                <div className="w-10 h-10 rounded-full bg-[#006B51] flex items-center justify-center">
                  <div className="relative w-5 h-5">
                    <Image
                      src="/images/topbar/user.png"
                      alt="User"
                      fill
                      className="object-contain"
                    />
                  </div>
                  {isAdmin && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 flex items-center justify-center">
                      <span className="text-[8px] text-white font-bold">A</span>
                    </div>
                  )}
                </div>
              </Link>

              {isAdmin && (
                <div className="absolute top-12 right-0 flex space-x-1">
                  <Link href="/admin">
                    <div className="w-6 h-6 rounded-full bg-emerald-600 flex items-center justify-center">
                      <span className="text-[8px] text-white font-bold">A</span>
                    </div>
                  </Link>
                </div>
              )}
            </div>

            <Link href="/cart" className="relative">
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
              {cartCount > 0 && (
                <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#DD2222] flex items-center justify-center">
                  <span className="text-[10px] text-white font-bold">{cartCount}</span>
                </div>
              )}
            </Link>
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
          <button
            onClick={toggleSidebar}
            className="flex items-center space-x-2 bg-[#006B51] text-white px-5 py-2 rounded-full cursor-pointer"
          >
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

          {/* Search Bar */}
          <SearchBarWrapper />

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
          <Link href="/cart" className="relative cursor-pointer">
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
            {cartCount > 0 && (
              <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#DD2222] flex items-center justify-center">
                <span className="text-xs text-white font-bold">{cartCount}</span>
              </div>
            )}
          </Link>
        </div>

        {/* Mobile Search Bar */}
        <div className="mt-4 md:hidden">
          <SearchBarWrapper placeholder="Search products..." />
        </div>
      </div>
    </div>
  );
};

export default Navigation;