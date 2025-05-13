'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

import Navigation from '@/components/layout/Navigation';
import Footer from '@/components/layout/Footer';
import Copyright from '@/components/layout/Copyright';
import Link from 'next/link';

// Create a client component that uses useSearchParams
function ErrorContent() {
  const searchParams = useSearchParams();
  const message = searchParams.get('message') || 'An unexpected error occurred during payment processing.';

  return (
    <div className="min-h-screen flex flex-col">
      

      <div className="container mx-auto px-4 py-16 flex-grow">
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-8 text-center">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>

          <h1 className="text-3xl font-bold text-[#253D4E] mb-4">Payment Error</h1>

          <p className="text-[#7E7E7E] mb-6">
            {message}
          </p>

          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <p className="text-[#253D4E] font-medium">
              If you believe this is a mistake, please contact our customer support.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/cart"
              className="bg-white text-[#006B51] border border-[#006B51] font-semibold py-3 px-6 rounded-full hover:bg-[#f9f9f9] transition-colors"
            >
              Return to Cart
            </Link>

            <Link
              href="/contact"
              className="bg-[#006B51] text-white font-semibold py-3 px-6 rounded-full hover:bg-[#005541] transition-colors"
            >
              Contact Support
            </Link>
          </div>
        </div>
      </div>

      
    </div>
  );
}

// Loading fallback component
function ErrorPageSkeleton() {
  return (
    <div className="min-h-screen flex flex-col">
      
      <div className="container mx-auto px-4 py-16 flex-grow">
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-8 text-center">
          <div className="w-20 h-20 bg-gray-200 rounded-full mx-auto mb-6 animate-pulse"></div>
          <div className="h-8 bg-gray-200 rounded w-3/4 mx-auto mb-4 animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3 mx-auto mb-6 animate-pulse"></div>
          <div className="h-16 bg-gray-200 rounded w-full mx-auto mb-8 animate-pulse"></div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <div className="h-12 bg-gray-200 rounded-full w-32 animate-pulse"></div>
            <div className="h-12 bg-gray-200 rounded-full w-32 animate-pulse"></div>
          </div>
        </div>
      </div>
      
    </div>
  );
}

// Main page component with Suspense boundary
export default function PaymentErrorPage() {
  return (
    <Suspense fallback={<ErrorPageSkeleton />}>
      <ErrorContent />
    </Suspense>
  );
}
