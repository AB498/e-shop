import React from 'react';
import RegisterForm from '@/components/auth/RegisterForm';

import Navigation from '@/components/layout/Navigation';
import Footer from '@/components/layout/Footer';
import Copyright from '@/components/layout/Copyright';
import Link from 'next/link';
import Image from 'next/image';
import BottomBanner from '@/components/products/BottomBanner';

export const metadata = {
  title: 'Register - Thai Bangla Store',
  description: 'Create a new account at Thai Bangla Store to enjoy personalized shopping, order tracking, and exclusive offers.',
  keywords: 'register, sign up, create account, Thai Bangla Store, customer registration',
  openGraph: {
    title: 'Register - Thai Bangla Store',
    description: 'Create a new account at Thai Bangla Store to enjoy personalized shopping, order tracking, and exclusive offers.',
    type: 'website',
    url: 'https://thaibanglastore.com/auth/register',
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
    title: 'Register - Thai Bangla Store',
    description: 'Create a new account at Thai Bangla Store to enjoy personalized shopping, order tracking, and exclusive offers.',
    images: ['/images/logo.png'],
  },
};

export default function RegisterPage() {
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
          <span className="text-[#7E7E7E] font-semibold text-sm uppercase">Register</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 flex-grow">
        <div className="max-w-3xl mx-auto">
          <RegisterForm />
        </div>
      </div>

      <BottomBanner />


    </div>
  );
}
