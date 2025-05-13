'use client';

import React from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import Image from 'next/image';
import { redirect } from 'next/navigation';

import Navigation from '@/components/layout/Navigation';
import Footer from '@/components/layout/Footer';
import Copyright from '@/components/layout/Copyright';
import ProfileContent from '@/components/profile/ProfileContent';

export default function ProfileWishlistPage() {
  const { data: session, status } = useSession();

  // If the user is not authenticated, redirect to login
  if (status === 'unauthenticated') {
    redirect('/auth/login');
  }

  return (
    <div className="min-h-screen flex flex-col">
      

      {/* Breadcrumb */}
      <div className="container mx-auto px-4 py-4 border-b border-[#ECECEC]">
        <div className="flex items-center space-x-2">
          <Link href="/" className="text-[#3BB77E] font-semibold text-sm uppercase flex items-center">
            <Image src="/images/breadcrumb/home-icon.svg" alt="Home" width={14} height={14} className="mr-1" />
            Home
          </Link>
          <Image src="/images/breadcrumb/arrow-icon.svg" alt=">" width={3} height={6} className="mx-2" />
          <Link href="/profile" className="text-[#3BB77E] font-semibold text-sm uppercase">
            My Profile
          </Link>
          <Image src="/images/breadcrumb/arrow-icon.svg" alt=">" width={3} height={6} className="mx-2" />
          <span className="text-[#7E7E7E] font-semibold text-sm uppercase">My Wishlist</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 flex-grow">
        {status === 'loading' ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="w-16 h-16 border-4 border-[#006B51] border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-[#7E7E7E]">Loading your profile...</p>
          </div>
        ) : (
          <ProfileContent user={session.user} defaultTab="wishlist" />
        )}
      </div>

      
    </div>
  );
}
