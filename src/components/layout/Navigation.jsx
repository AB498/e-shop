'use client'
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
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
    <div className="z-20 sticky top-0 w-full bg-[#FAF8F5] border-b border-[#E3E3E3] py-2 sm:py-3">
      <div className="container mx-auto px-2 sm:px-3">
        {/* Mobile View */}
        <div className="md:hidden w-full">
          <div className="flex items-center justify-between mb-2">
            {/* Logo */}
            <Link href="/" className="flex-shrink-0">
              <div className="relative w-18 h-7 sm:w-20 sm:h-7">
                <Image
                  src="/images/logo.png"
                  alt="Thai Bangla Logo"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </Link>

            {/* Action Icons */}
            <div className="flex gap-1.5 sm:gap-2">
              {/* All Categories Button */}
              <button
                onClick={toggleSidebar}
                className="flex items-center gap-1 bg-[#006B51] text-white px-2 py-1 rounded-full"
                aria-label="All Categories"
              >
                <div className="relative w-3.5 h-3.5 flex items-center justify-center">
                  {sidebarExpanded ? (
                    <XMarkIcon className="h-3.5 w-3.5 text-white" />
                  ) : (
                    <Bars3Icon className="h-3.5 w-3.5 text-white" />
                  )}
                </div>
                <span className="text-[10px] sm:text-xs font-medium">All Categories</span>
              </button>

              {/* User Profile */}
              <div className="relative">
                <Link href="/profile" className="relative">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#006B51] flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                      <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                    {isAdmin && (
                      <div className="absolute -top-1 -right-1 w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-emerald-500 flex items-center justify-center">
                        <span className="text-[5px] sm:text-[6px] text-white font-bold">A</span>
                      </div>
                    )}
                  </div>
                </Link>
              </div>

              {/* Wishlist */}
              <Link href="/wishlist" className="relative">
                <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full ${isWishlistPage ? 'bg-[#3BB77E]' : 'bg-[#006B51]'} flex items-center justify-center`}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                  </svg>
                </div>
                {wishlistCount > 0 && (
                  <div className="absolute -top-1 -right-1 w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#DD2222] flex items-center justify-center">
                    <span className="text-[5px] sm:text-[6px] text-white font-bold">{wishlistCount}</span>
                  </div>
                )}
              </Link>

              {/* Cart */}
              <Link href="/cart" className="relative">
                <div className="w-7 h-7 sm:w-7 sm:h-7 rounded-full bg-[#006B51] flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
                    <circle cx="9" cy="21" r="1"></circle>
                    <circle cx="20" cy="21" r="1"></circle>
                    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                  </svg>
                </div>
                {cartCount > 0 && (
                  <div className="absolute -top-1 -right-1 w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#DD2222] flex items-center justify-center">
                    <span className="text-[5px] sm:text-[6px] text-white font-bold">{cartCount}</span>
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
        <div className="hidden md:flex flex-wrap items-center justify-between gap-2 lg:gap-3 h-10">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0 h-full">
            <div className="relative h-full aspect-video">
              <img
                src="/images/logo.png"
                alt="Thai Bangla Logo"
                className="w-full h-full object-contain"
                priority
              />
            </div>
          </Link>

          {/* All Categories Button */}
          <button
            onClick={toggleSidebar}
            className="flex-shrink-0 flex items-center space-x-1.5 bg-[#006B51] text-white px-2.5 lg:px-4 py-1.5 rounded-full cursor-pointer"
            aria-label="All Categories"
          >
            <div className="relative w-3.5 h-3.5 lg:w-4 lg:h-4 flex items-center justify-center">
              {sidebarExpanded ? (
                <XMarkIcon className="h-3.5 w-3.5 lg:h-4 lg:w-4 text-white" />
              ) : (
                <Bars3Icon className="h-3.5 w-3.5 lg:h-4 lg:w-4 text-white" />
              )}
            </div>
            <span className={getResponsiveTextClass('xs', { additionalClasses: 'font-medium' })}>All Categories</span>
          </button>

          {/* Search Bar */}
          <div className="flex-grow max-w-xl">
            <SearchBarWrapper />
          </div>

          {/* Promotions Section - Responsive on different screen sizes */}
          <div className="hidden md:flex md:flex-wrap items-center md:space-x-2 lg:space-x-6">
            <Link href="/products">
              <div className="flex items-center space-x-1 cursor-pointer">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#333333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5 lg:w-4 lg:h-4">
                  <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path>
                  <line x1="7" y1="7" x2="7.01" y2="7"></line>
                </svg>
                <span className={getResponsiveTextClass('xs', { additionalClasses: 'text-[#333333] font-medium' })}>Products</span>
              </div>
            </Link>

            <div className="hidden lg:flex items-center space-x-1 cursor-pointer">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#333333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5 lg:w-4 lg:h-4">
                <rect x="1" y="3" width="15" height="13"></rect>
                <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
                <circle cx="5.5" cy="18.5" r="2.5"></circle>
                <circle cx="18.5" cy="18.5" r="2.5"></circle>
              </svg>
              <span className={getResponsiveTextClass('xs', { additionalClasses: 'text-[#333333] font-medium' })}>Get 1 Hour Delivery</span>
            </div>

            <div className="hidden xl:flex items-center space-x-1 cursor-pointer">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#333333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5 lg:w-4 lg:h-4">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
              </svg>
              <span className={getResponsiveTextClass('xs', { additionalClasses: 'text-[#333333] font-medium' })}>Weekly Offer</span>
            </div>
          </div>

          {/* Cart */}
          <Link href="/cart" className="relative cursor-pointer flex-shrink-0">
            <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-full bg-[#006B51] flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 lg:w-5 lg:h-5">
                <circle cx="9" cy="21" r="1"></circle>
                <circle cx="20" cy="21" r="1"></circle>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
              </svg>
            </div>
            {cartCount > 0 && (
              <div className="absolute -top-1 -right-1 w-3.5 h-3.5 lg:w-4 lg:h-4 rounded-full bg-[#DD2222] flex items-center justify-center">
                <span className="text-[7px] lg:text-[8px] text-white font-bold">{cartCount}</span>
              </div>
            )}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Navigation;