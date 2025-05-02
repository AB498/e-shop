import React from 'react';
import LoginForm from '@/components/auth/LoginForm';
import Topbar from '@/components/layout/Topbar';
import Navigation from '@/components/layout/Navigation';
import Footer from '@/components/layout/Footer';
import Copyright from '@/components/layout/Copyright';
import Link from 'next/link';
import Image from 'next/image';

export const metadata = {
  title: 'Login - Thai Bangla Store',
  description: 'Login to your Thai Bangla Store account',
};

export default async function LoginPage({ searchParams }) {
  await searchParams;
  const registered = searchParams?.registered === 'true';

  return (
    <div className="min-h-screen flex flex-col">
      <Topbar />
      <Navigation />

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

      {/* Bottom Banner */}
      <div className="container mx-auto px-4 py-6 mb-10">
        <div className="bg-[url('/images/banner-background.png')] bg-cover bg-center rounded-[20px] p-10 relative overflow-hidden">
          <div className="max-w-lg relative z-10">
            <h2 className="text-[#253D4E] text-4xl font-bold leading-tight mb-4">
              Stay home & get your daily<br />
              needs from our shop
            </h2>
            <p className="text-[#7E7E7E] text-lg mb-8">Start Your Daily Shopping with Thai Bangla Store</p>

            <div className="flex flex-col sm:flex-row">
              <input
                type="email"
                placeholder="Your email address"
                className="bg-white rounded-l-full py-4 px-6 w-full text-[#838383]"
              />
              <button className="bg-[#3BB77E] text-white font-bold py-4 px-8 rounded-full sm:-ml-6 mt-2 sm:mt-0 tracking-wider hover:bg-[#2A9D6E] transition-colors">
                Subscribe
              </button>
            </div>
          </div>

          {/* Banner Image */}
          <div className="absolute right-0 bottom-0 h-full w-1/2 flex items-end justify-end">
            <img
              src="/images/banner-image.png"
              alt="Banner"
              className="object-contain h-full"
            />
          </div>
        </div>
      </div>

      <Footer />
      <Copyright />
    </div>
  );
}
