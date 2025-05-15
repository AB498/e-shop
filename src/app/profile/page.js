import React from 'react';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';

import Navigation from '@/components/layout/Navigation';
import Footer from '@/components/layout/Footer';
import Copyright from '@/components/layout/Copyright';
import Link from 'next/link';
import Image from 'next/image';
import ProfileContent from '@/components/profile/ProfileContent';
import { refreshSession } from '@/lib/actions/session';

export const metadata = {
  title: 'My Profile - Thai Bangla Store',
  description: 'Manage your Thai Bangla Store account, update personal information, view order history, and track your wishlist.',
  keywords: 'profile, account, user profile, order history, wishlist, Thai Bangla Store, account management',
  openGraph: {
    title: 'My Profile - Thai Bangla Store',
    description: 'Manage your Thai Bangla Store account, update personal information, view order history, and track your wishlist.',
    type: 'website',
    url: 'https://thaibanglastore.com/profile',
    siteName: 'Thai Bangla Store',
    images: [
      {
        url: '/images/logo.png',
        width: 800,
        height: 600,
        alt: 'Thai Bangla Store Logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'My Profile - Thai Bangla Store',
    description: 'Manage your Thai Bangla Store account, update personal information, view order history, and track your wishlist.',
    images: ['/images/logo.png'],
  },
};

export default async function ProfilePage() {
  // Get the session with refreshed data
  let session = await getServerSession(authOptions);

  // Refresh the session to get the latest user data
  session = await refreshSession() || session;

  // Redirect to login if not authenticated
  if (!session) {
    redirect('/auth/login');
  }

  return (
    <div className="flex flex-col">


      {/* Breadcrumb */}
      <div className="container mx-auto px-4 py-4 border-b border-[#ECECEC]">
        <div className="flex items-center space-x-2">
          <Link href="/" className="text-[#3BB77E] font-semibold text-sm uppercase flex items-center">
            <Image src="/images/breadcrumb/home-icon.svg" alt="Home" width={14} height={14} className="mr-1" />
            Home
          </Link>
          <Image src="/images/breadcrumb/arrow-icon.svg" alt=">" width={3} height={6} className="mx-2" />
          <span className="text-[#7E7E7E] font-semibold text-sm uppercase">My Profile</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 flex-grow">
        <ProfileContent user={session.user} />
      </div>


    </div>
  );
}
