'use client';

import React, { useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

import Navigation from '@/components/layout/Navigation';
import Footer from '@/components/layout/Footer';
import Copyright from '@/components/layout/Copyright';
import Link from 'next/link';

// Create a client component that uses useSearchParams
function SuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('order_id');

  // We no longer need to clear the cart here as it's cleared at checkout time
  // This useEffect is kept as a placeholder in case we need to perform any actions
  // when the payment success page loads
  useEffect(() => {
    console.log('Payment success page loaded for order:', orderId || 'No order ID provided');

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

      <div className="container mx-auto px-4 py-16 flex-grow">
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-8 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <h1 className="text-3xl font-bold text-[#253D4E] mb-4">Payment Successful!</h1>

          <p className="text-[#7E7E7E] mb-6">
            Thank you for your purchase. Your order has been successfully placed and is now being processed.
          </p>

          {orderId && (
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <p className="text-[#253D4E] font-medium">Order Reference: <span className="font-bold">{orderId}</span></p>
            </div>
          )}

          <p className="text-[#7E7E7E] mb-8">
            You will receive an email confirmation shortly with details of your order.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/"
              className="bg-white text-[#006B51] border border-[#006B51] font-semibold py-3 px-6 rounded-full hover:bg-[#f9f9f9] transition-colors"
            >
              Continue Shopping
            </Link>

            <Link
              href={orderId ? `/profile/orders/${orderId}` : "/profile"}
              className="bg-[#006B51] text-white font-semibold py-3 px-6 rounded-full hover:bg-[#005541] transition-colors"
            >
              {orderId ? "View Order Details" : "View My Orders"}
            </Link>
          </div>
        </div>
      </div>

      <Footer />
      <Copyright />
    </div>
  );
}

// Loading fallback component
function SuccessPageSkeleton() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
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
      <Footer />
      <Copyright />
    </div>
  );
}

// Main page component with Suspense boundary
export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<SuccessPageSkeleton />}>
      <SuccessContent />
    </Suspense>
  );
}
