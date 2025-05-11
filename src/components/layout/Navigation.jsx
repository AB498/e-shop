'use client'
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import SearchBarWrapper from './SearchBarWrapper';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useSession } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import { getResponsiveTextClass } from '@/utils/responsiveUtils';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';

const Navigation = () => {
  const { cartCount } = useCart();
  const { wishlistCount } = useWishlist();
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const [sidebarExpanded, setSidebarExpanded] = useState(false);

  const isAdmin = status === 'authenticated' && session?.user?.role === 'admin';
  const isWishlistPage = pathname === '/wishlist';

  // Function to toggle the sidebar
  const toggleSidebar = () => {
    console.log('Navigation: toggleSidebar called');
    // Dispatch a custom event to toggle the sidebar
    const event = new Event('expandSidebar');
    window.dispatchEvent(event);
    setSidebarExpanded(!sidebarExpanded);
    console.log('Navigation: toggleSidebar event dispatched');
  };

  // Listen for sidebar state changes from SidebarClient
  useEffect(() => {
    const handleSidebarStateChange = (event) => {
      // Update our local state based on the sidebar's actual state
      setSidebarExpanded(!event.detail.collapsed);
    };

    // Create a custom event listener
    window.addEventListener('sidebarStateChanged', handleSidebarStateChange);

    // Clean up the event listener when component unmounts
    return () => {
      window.removeEventListener('sidebarStateChanged', handleSidebarStateChange);
    };
  }, []);

  if (pathname.startsWith('/admin')) {
    return null;
  }

  return (
    <div className="z-20 sticky top-0 w-full bg-[#FAF8F5] border-b border-[#E3E3E3] py-3 sm:py-4">
      <div className="container mx-auto px-3 sm:px-4">
        {/* Mobile View */}
        <div className="md:hidden w-full">
          <div className="flex items-center justify-between mb-3">
            {/* Logo */}
            <Link href="/" className="flex-shrink-0">
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

            {/* Action Icons */}
            <div className="flex gap-2 sm:gap-3">
              {/* All Categories Button */}
              <button
                onClick={toggleSidebar}
                className="flex items-center gap-1.5 bg-[#006B51] text-white px-2.5 py-1.5 rounded-full"
                aria-label="All Categories"
              >
                <div className="relative w-4 h-4 flex items-center justify-center">
                  {sidebarExpanded ? (
                    <XMarkIcon className="h-4 w-4 text-white" />
                  ) : (
                    <Bars3Icon className="h-4 w-4 text-white" />
                  )}
                </div>
                <span className="text-xs sm:text-sm font-medium">All Categories</span>
              </button>

              {/* User Profile */}
              <div className="relative">
                <Link href="/profile" className="relative">
                  <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#006B51] flex items-center justify-center">
                    <div className="relative w-4 h-4">
                      <Image
                        src="/images/topbar/user.png"
                        alt="User"
                        fill
                        className="object-contain invert"
                      />
                    </div>
                    {isAdmin && (
                      <div className="absolute -top-1 -right-1 w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full bg-emerald-500 flex items-center justify-center">
                        <span className="text-[6px] sm:text-[7px] text-white font-bold">A</span>
                      </div>
                    )}
                  </div>
                </Link>
              </div>

              {/* Wishlist */}
              <Link href="/wishlist" className="relative">
                <div className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full ${isWishlistPage ? 'bg-[#3BB77E]' : 'bg-[#006B51]'} flex items-center justify-center`}>
                  <div className="relative w-4 h-4">
                    <Image
                      src="/images/wishlist/wishlist-icon-nav.svg"
                      alt="Wishlist"
                      fill
                      className="object-contain"
                    />
                  </div>
                </div>
                {wishlistCount > 0 && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full bg-[#DD2222] flex items-center justify-center">
                    <span className="text-[6px] sm:text-[7px] text-white font-bold">{wishlistCount}</span>
                  </div>
                )}
              </Link>

              {/* Cart */}
              <Link href="/cart" className="relative">
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#006B51] flex items-center justify-center">
                  <div className="relative w-4 h-4">
                    <Image
                      src="/images/navigation/cart.png"
                      alt="Cart"
                      fill
                      className="object-contain"
                    />
                  </div>
                </div>
                {cartCount > 0 && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full bg-[#DD2222] flex items-center justify-center">
                    <span className="text-[6px] sm:text-[7px] text-white font-bold">{cartCount}</span>
                  </div>
                )}
              </Link>
            </div>
          </div>

          {/* Mobile Search Bar - Moved up for better visibility */}
          <div className="w-full">
            <SearchBarWrapper placeholder="Search products..." />
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
            <div className="relative w-4 h-4 lg:w-5 lg:h-5 flex items-center justify-center">
              {sidebarExpanded ? (
                <XMarkIcon className="h-4 w-4 lg:h-5 lg:w-5 text-white" />
              ) : (
                <Bars3Icon className="h-4 w-4 lg:h-5 lg:w-5 text-white" />
              )}
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
      </div>
    </div>
  );
};

export default Navigation;