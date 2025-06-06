import React from 'react';
import LoginForm from '@/components/auth/LoginForm';

import Navigation from '@/components/layout/Navigation';
import Footer from '@/components/layout/Footer';
import Copyright from '@/components/layout/Copyright';
import Link from 'next/link';
import Image from 'next/image';
import BannerSection from '@/components/landing/BannerSection';
import BottomBanner from '@/components/products/BottomBanner';

export const metadata = {
  title: 'Login - Thai Bangla Store',
  description: 'Login to your Thai Bangla Store account to access your orders, wishlist, and personalized shopping experience.',
  keywords: 'login, sign in, account access, Thai Bangla Store, customer login',
  openGraph: {
    title: 'Login - Thai Bangla Store',
    description: 'Login to your Thai Bangla Store account to access your orders, wishlist, and personalized shopping experience.',
    type: 'website',
    url: 'https://thaibanglastore.com/auth/login',
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
    title: 'Login - Thai Bangla Store',
    description: 'Login to your Thai Bangla Store account to access your orders, wishlist, and personalized shopping experience.',
    images: ['/images/logo.png'],
  },
};

export default async function LoginPage(props) {
  const searchParams = await props.searchParams;
  await searchParams;
  const registered = searchParams?.registered === 'true';

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
          <span className="text-[#7E7E7E] font-semibold text-sm uppercase">Login</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 flex-grow">
        <div className="max-w-md mx-auto">
          {registered && (
            <div className="bg-green-50 text-green-700 p-4 rounded-md mb-6">
              Registration successful! Please login with your credentials.
            </div>
          )}
          <LoginForm />
        </div>
      </div>

      <BottomBanner />


    </div>
  );
}
