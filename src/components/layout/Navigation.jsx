'use client'
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import SearchBarWrapper from './SearchBarWrapper';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useSession } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import { getResponsiveTextClass } from '@/utils/responsiveUtils';

const Navigation = () => {
  const { cartCount } = useCart();
  const { wishlistCount } = useWishlist();
  const { data: session, status } = useSession();
  const pathname = usePathname();

  const isAdmin = status === 'authenticated' && session?.user?.role === 'admin';
  const isWishlistPage = pathname === '/wishlist';

  // Function to toggle the sidebar
  const toggleSidebar = () => {
    console.log('Navigation: toggleSidebar called');
    // Dispatch a custom event to toggle the sidebar
    const event = new Event('expandSidebar');
    window.dispatchEvent(event);
    console.log('Navigation: toggleSidebar event dispatched');
  };

  return (
    <div className="z-20 sticky top-0 w-full bg-[#FAF8F5] border-b border-[#E3E3E3] py-3 sm:py-4">
      <div className="container mx-auto px-3 sm:px-4">
        {/* Mobile View */}
        <div className="flex md:hidden items-center justify-between w-full">
          <Link href="/">
            <div className="relative w-20 h-8 sm:w-24 sm:h-8">
              <Image
                src="/images/navigation/logo.png"
                alt="Thai Bangla Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
          </Link>

          <div className="flex items-center space-x-1 sm:space-x-2">
            <button
              onClick={toggleSidebar}
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#006B51] flex items-center justify-center cursor-pointer"
              aria-label="Toggle Categories Menu"
            >
              <div className="relative w-4 h-4 sm:w-5 sm:h-5">
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
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#006B51] flex items-center justify-center">
                  <div className="relative w-4 h-4 sm:w-5 sm:h-5">
                    <Image
                      src="/images/topbar/user.png"
                      alt="User"
                      fill
                      className="object-contain invert"
                    />
                  </div>
                  {isAdmin && (
                    <div className="absolute -top-1 -right-1 w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-emerald-500 flex items-center justify-center">
                      <span className="text-[7px] sm:text-[8px] text-white font-bold">A</span>
                    </div>
                  )}
                </div>
              </Link>
            </div>

            <Link href="/wishlist" className="relative">
              <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full ${isWishlistPage ? 'bg-[#3BB77E]' : 'bg-[#006B51]'} flex items-center justify-center`}>
                <div className="relative w-4 h-4 sm:w-5 sm:h-5">
                  <Image
                    src="/images/topbar/wishlist.png"
                    alt="Wishlist"
                    fill
                    className="object-contain invert"
                  />
                </div>
              </div>
              {wishlistCount > 0 && (
                <div className="absolute -top-1 -right-1 w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-[#DD2222] flex items-center justify-center">
                  <span className="text-[7px] sm:text-[8px] text-white font-bold">{wishlistCount}</span>
                </div>
              )}
            </Link>

            <Link href="/cart" className="relative">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#006B51] flex items-center justify-center">
                <div className="relative w-4 h-4 sm:w-5 sm:h-5">
                  <Image
                    src="/images/navigation/cart.png"
                    alt="Cart"
                    fill
                    className="object-contain"
                  />
                </div>
              </div>
              {cartCount > 0 && (
                <div className="absolute -top-1 -right-1 w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-[#DD2222] flex items-center justify-center">
                  <span className="text-[7px] sm:text-[8px] text-white font-bold">{cartCount}</span>
                </div>
              )}
            </Link>
          </div>
        </div>

        {/* Tablet and Desktop View */}
        <div className="hidden md:flex flex-wrap items-center justify-between gap-3 lg:gap-4">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <div className="relative w-28 h-10 lg:w-36 lg:h-12">
              <Image
                src="/images/navigation/logo.png"
                alt="Thai Bangla Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
          </Link>

          {/* All Categories Button */}
          <button
            onClick={toggleSidebar}
            className="flex-shrink-0 flex items-center space-x-2 bg-[#006B51] text-white px-3 lg:px-5 py-2 rounded-full cursor-pointer"
            aria-label="All Categories"
          >
            <div className="relative w-4 h-4 lg:w-5 lg:h-5">
              <Image
                src="/images/navigation/menu.png"
                alt="Menu"
                fill
                className="object-contain"
              />
            </div>
            <span className={getResponsiveTextClass('sm', { additionalClasses: 'font-medium' })}>All Categories</span>
          </button>

          {/* Search Bar */}
          <div className="flex-grow max-w-xl">
            <SearchBarWrapper />
          </div>

          {/* Promotions Section - Responsive on different screen sizes */}
          <div className="hidden md:flex md:flex-wrap items-center md:space-x-3 lg:space-x-8">
            <Link href="/products">
              <div className="flex items-center space-x-1 lg:space-x-2 cursor-pointer">
                <div className="relative w-4 h-4 lg:w-5 lg:h-5">
                  <Image
                    src="/images/navigation/promotions.png"
                    alt="Promotions"
                    fill
                    className="object-contain"
                  />
                </div>
                <span className={getResponsiveTextClass('sm', { additionalClasses: 'text-[#333333] font-medium' })}>Products</span>
              </div>
            </Link>

            <div className="hidden lg:flex items-center space-x-2 cursor-pointer">
              <div className="relative w-4 h-4 lg:w-5 lg:h-5">
                <Image
                  src="/images/navigation/delivery.png"
                  alt="Delivery"
                  fill
                  className="object-contain"
                />
              </div>
              <span className={getResponsiveTextClass('sm', { additionalClasses: 'text-[#333333] font-medium' })}>Get 1 Hour Delivery</span>
            </div>

            <div className="hidden xl:flex items-center space-x-2 cursor-pointer">
              <div className="relative w-4 h-4 lg:w-5 lg:h-5">
                <Image
                  src="/images/navigation/offer.png"
                  alt="Weekly Offer"
                  fill
                  className="object-contain"
                />
              </div>
              <span className={getResponsiveTextClass('sm', { additionalClasses: 'text-[#333333] font-medium' })}>Weekly Offer</span>
            </div>
          </div>

          {/* Cart */}
          <Link href="/cart" className="relative cursor-pointer flex-shrink-0">
            <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-[#006B51] flex items-center justify-center">
              <div className="relative w-5 h-5 lg:w-6 lg:h-6">
                <Image
                  src="/images/navigation/cart.png"
                  alt="Cart"
                  fill
                  className="object-contain"
                />
              </div>
            </div>
            {cartCount > 0 && (
              <div className="absolute -top-1 -right-1 w-4 h-4 lg:w-5 lg:h-5 rounded-full bg-[#DD2222] flex items-center justify-center">
                <span className="text-[8px] lg:text-[10px] text-white font-bold">{cartCount}</span>
              </div>
            )}
          </Link>
        </div>

        {/* Mobile Search Bar */}
        <div className="mt-3 md:hidden">
          <SearchBarWrapper placeholder="Search products..." />
        </div>
      </div>
    </div>
  );
};

export default Navigation;