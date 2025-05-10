'use client';

import React from 'react';
import { useWishlist } from '@/context/WishlistContext';
import { useCart } from '@/context/CartContext';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import Image from 'next/image';

import Navigation from '@/components/layout/Navigation';
import Footer from '@/components/layout/Footer';
import Copyright from '@/components/layout/Copyright';
import WishlistItem from '@/components/wishlist/WishlistItem';
import EmptyWishlist from '@/components/wishlist/EmptyWishlist';
import BottomBanner from '@/components/products/BottomBanner';

export default function WishlistPage() {
  const { wishlist, isLoading } = useWishlist();
  const { status } = useSession();

  return (
    <div className="min-h-screen flex flex-col">
      

      {/* Header - Breadcrumb - Title */}
      <div className="bg-[#FAF8F5] py-8 md:py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col">
            <h1 className="text-3xl md:text-5xl font-bold text-[#253D4E] mb-4">Wishlist</h1>
            <div className="flex items-center space-x-2">
              <Link href="/" className="text-[#3BB77E] font-semibold text-sm hover:underline flex items-center">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-1">
                  <path d="M10 12H2C0.9 12 0 11.1 0 10V2C0 0.9 0.9 0 2 0H10C11.1 0 12 0.9 12 2V10C12 11.1 11.1 12 10 12ZM10.5 2C10.5 1.725 10.275 1.5 10 1.5H2C1.725 1.5 1.5 1.725 1.5 2V10C1.5 10.275 1.725 10.5 2 10.5H10C10.275 10.5 10.5 10.275 10.5 10V2ZM7.5 3H9V4.5H7.5V3ZM4.5 3H6V4.5H4.5V3ZM7.5 6H9V7.5H7.5V6ZM4.5 6H6V7.5H4.5V6ZM7.5 9H9V10.5H7.5V9ZM4.5 9H6V10.5H4.5V9ZM3 3H1.5V4.5H3V3ZM3 6H1.5V7.5H3V6ZM3 9H1.5V10.5H3V9Z" fill="#3BB77E"/>
                </svg>
                Home
              </Link>
              <svg width="6" height="9" viewBox="0 0 6 9" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1.06836 0.684082L5.06836 4.68408L1.06836 8.68408" stroke="#7E7E7E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span className="text-[#7E7E7E] font-semibold text-sm">Wishlist</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 md:py-12 flex-grow">
        {status === 'loading' || isLoading ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="w-16 h-16 border-4 border-[#006B51] border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-6 text-[#7E7E7E] font-medium">Loading your wishlist...</p>
          </div>
        ) : status === 'unauthenticated' ? (
          <div className="bg-white p-8 md:p-12 rounded-lg shadow-sm text-center max-w-2xl mx-auto">
            <div className="w-24 h-24 mx-auto mb-6">
              <Image
                src="/images/topbar/user.png"
                alt="Login Required"
                width={96}
                height={96}
                className="opacity-40"
              />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold mb-4 text-[#253D4E]">Please Sign In</h2>
            <p className="text-[#7E7E7E] mb-8 max-w-md mx-auto">
              You need to be logged in to view and manage your wishlist. Sign in to continue.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/auth/login"
                className="bg-[#006B51] text-white px-6 py-3 rounded-md hover:bg-[#005541] transition-colors inline-flex items-center justify-center gap-2"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M15 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H15M10 17L15 12M15 12L10 7M15 12H3" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span>Sign In</span>
              </Link>
              <Link
                href="/auth/register"
                className="border border-[#006B51] text-[#006B51] px-6 py-3 rounded-md hover:bg-[#F0F7F5] transition-colors inline-flex items-center justify-center gap-2"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 14C8.13401 14 5 17.134 5 21H19C19 17.134 15.866 14 12 14Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span>Register</span>
              </Link>
            </div>
          </div>
        ) : wishlist.length === 0 ? (
          <EmptyWishlist />
        ) : (
          <div className="flex flex-col">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
              <h2 className="text-2xl md:text-3xl font-bold text-[#253D4E] mb-4 md:mb-0">Your Wishlist ({wishlist.length})</h2>
              <div className="flex items-center gap-4">
                <Link
                  href="/products"
                  className="text-[#006B51] hover:text-[#005541] transition-colors inline-flex items-center gap-2 text-sm font-medium"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span>Continue Shopping</span>
                </Link>
              </div>
            </div>

            <div className="w-full h-px bg-[#EEEEEE] mb-8"></div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {wishlist.map((item) => (
                <WishlistItem key={item.id} item={item} />
              ))}
            </div>
          </div>
        )}
      </div>

      <BottomBanner />

      <Footer />
      <Copyright />
    </div>
  );
}
