'use client';

import React, { useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';

import Navigation from '@/components/layout/Navigation';
import Footer from '@/components/layout/Footer';
import Copyright from '@/components/layout/Copyright';
import Link from 'next/link';

// Create a client component that uses useSearchParams
function CancelledContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { addToCart } = useCart();
  const orderId = searchParams.get('order_id');
  const [isRestoring, setIsRestoring] = useState(false);
  const [restoreError, setRestoreError] = useState('');

  // Function to restore cart items from the cancelled order
  const handleRestoreCart = async () => {
    if (!orderId) return;

    setIsRestoring(true);
    setRestoreError('');

    try {
      const response = await fetch('/api/orders/restore-cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ orderId }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to restore cart');
      }

      // Add items to cart
      if (data.items && data.items.length > 0) {
        // Add each item to cart
        data.items.forEach(item => {
          addToCart(item);
        });

        // Redirect to cart page
        router.push('/cart');
      } else {
        setRestoreError('No items found in this order');
      }
    } catch (error) {
      console.error('Error restoring cart:', error);
      setRestoreError(error.message || 'Failed to restore cart');
    } finally {
      setIsRestoring(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

      <div className="container mx-auto px-4 py-16 flex-grow">
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-8 text-center">
          <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>

          <h1 className="text-3xl font-bold text-[#253D4E] mb-4">Payment Cancelled</h1>

          <p className="text-[#7E7E7E] mb-6">
            Your payment has been cancelled. Your order has not been placed.
          </p>

          {orderId && (
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <p className="text-[#253D4E] font-medium">Order Reference: <span className="font-bold">{orderId}</span></p>
            </div>
          )}

          <p className="text-[#7E7E7E] mb-8">
            You can try again whenever you're ready.
          </p>

          {restoreError && (
            <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6">
              {restoreError}
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/cart"
              className="bg-white text-[#006B51] border border-[#006B51] font-semibold py-3 px-6 rounded-full hover:bg-[#f9f9f9] transition-colors"
            >
              Return to Cart
            </Link>

            {orderId && (
              <button
                onClick={handleRestoreCart}
                disabled={isRestoring}
                className={`bg-[#006B51] text-white font-semibold py-3 px-6 rounded-full hover:bg-[#005541] transition-colors ${isRestoring ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {isRestoring ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Restoring...
                  </>
                ) : (
                  'Restore Cart Items'
                )}
              </button>
            )}

            <Link
              href="/checkout"
              className="bg-amber-600 text-white font-semibold py-3 px-6 rounded-full hover:bg-amber-700 transition-colors"
            >
              Try Again
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
function CancelledPageSkeleton() {
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
export default function PaymentCancelledPage() {
  return (
    <Suspense fallback={<CancelledPageSkeleton />}>
      <CancelledContent />
    </Suspense>
  );
}
