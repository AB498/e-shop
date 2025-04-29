import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Topbar from '@/components/layout/Topbar';
import Navigation from '@/components/layout/Navigation';
import Footer from '@/components/layout/Footer';
import Copyright from '@/components/layout/Copyright';

export const metadata = {
  title: 'Authentication Error - Thai Bangla Store',
  description: 'An error occurred during authentication',
};

export default function AuthErrorPage({ searchParams }) {
  const error = searchParams?.error || 'An unknown error occurred';

  const getErrorMessage = (errorCode) => {
    switch (errorCode) {
      case 'CredentialsSignin':
        return 'Invalid email or password. Please try again.';
      case 'SessionRequired':
        return 'You need to be signed in to access this page.';
      case 'AccessDenied':
        return 'You do not have permission to access this page.';
      default:
        return 'An error occurred during authentication. Please try again.';
    }
  };

  const errorMessage = getErrorMessage(error);

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
          <span className="text-[#7E7E7E] font-semibold text-sm uppercase">Authentication Error</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-16 flex-grow">
        <div className="max-w-md mx-auto text-center">
          <div className="bg-red-50 text-red-500 p-8 rounded-lg mb-8">
            <h2 className="text-2xl font-bold mb-4">Authentication Error</h2>
            <p className="mb-6">{errorMessage}</p>
            <div className="flex justify-center space-x-4">
              <Link 
                href="/auth/login" 
                className="bg-[#006B51] text-white font-bold py-3 px-6 rounded-md hover:bg-[#005541] transition-colors"
              >
                Back to Login
              </Link>
              <Link 
                href="/" 
                className="bg-gray-200 text-gray-800 font-bold py-3 px-6 rounded-md hover:bg-gray-300 transition-colors"
              >
                Go to Homepage
              </Link>
            </div>
          </div>
        </div>
      </div>

      <Footer />
      <Copyright />
    </div>
  );
}
