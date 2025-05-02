'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Topbar from '@/components/layout/Topbar';
import Navigation from '@/components/layout/Navigation';
import Footer from '@/components/layout/Footer';
import Copyright from '@/components/layout/Copyright';
import Link from 'next/link';
import { getOrderDetails } from '@/lib/actions/orders';

export default async function ContinuePaymentPage({ params }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  await params;
  const orderId = params.id;

  // Redirect if not logged in
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  // Fetch order details
  useEffect(() => {
    async function fetchOrderDetails() {
      if (session?.user?.id && orderId) {
        setIsLoading(true);
        try {
          const orderData = await getOrderDetails(orderId, session.user.id);
          if (orderData) {
            setOrder(orderData);

            // If order is not in pending status, show error
            if (orderData.status.toLowerCase() !== 'pending') {
              console.log(`Order status is ${orderData.status}, not pending`);
              setError(`Cannot continue payment for an order with status: ${orderData.status}`);
            } else {
              console.log('Order is in pending status, can continue payment');
            }
          } else {
            // Order not found or doesn't belong to user
            router.push('/profile');
          }
        } catch (error) {
          console.error('Error fetching order details:', error);
          setError('Failed to load order details');
        } finally {
          setIsLoading(false);
        }
      }
    }

    if (session?.user) {
      fetchOrderDetails();
    }
  }, [session, orderId, router]);

  // Function to continue with payment
  const handleContinuePayment = async () => {
    if (!orderId || !session?.user?.id) return;

    setIsProcessing(true);
    setError('');

    try {
      const response = await fetch('/api/payment/reinitialize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ orderId }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to initialize payment');
      }

      // Redirect to payment gateway
      if (data.redirectUrl) {
        console.log('Redirecting to payment gateway:', data.redirectUrl);
        window.location.href = data.redirectUrl;
      } else {
        throw new Error('No redirect URL received from payment gateway');
      }
    } catch (error) {
      console.error('Payment initialization error:', error);
      setError(error.message || 'Failed to initialize payment');
      setIsProcessing(false);
    }
  };

  // If loading session, show loading state
  if (status === 'loading' || isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Topbar />
        <Navigation />
        <div className="container mx-auto px-4 py-8 flex-grow flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#006B51]"></div>
        </div>
        <Footer />
        <Copyright />
      </div>
    );
  }

  // If not authenticated, return null (will redirect in useEffect)
  if (status === 'unauthenticated') {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Topbar />
      <Navigation />

      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center mb-6">
          <Link href={`/profile/orders/${orderId}`} className="text-[#006B51] hover:underline flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            Back to Order Details
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-[rgba(0,0,0,0.1)]">
          {error ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-[#253D4E] mb-2">Payment Error</h2>
              <p className="text-[#7E7E7E] mb-6">{error}</p>
              <Link
                href={`/profile/orders/${orderId}`}
                className="bg-[#006B51] text-white font-semibold py-2 px-4 rounded-full hover:bg-[#005541] transition-colors"
              >
                Return to Order Details
              </Link>
            </div>
          ) : order ? (
            <>
              <h1 className="text-2xl font-bold text-[#253D4E] mb-4">Continue Payment</h1>
              <p className="text-[#7E7E7E] mb-6">
                You're about to complete payment for order #{order.id}
              </p>

              <div className="bg-gray-50 p-4 rounded-md mb-6">
                <h2 className="text-lg font-semibold text-[#253D4E] mb-2">Order Summary</h2>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-[#7E7E7E]">Order ID:</span>
                    <span className="font-medium">#{order.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#7E7E7E]">Date:</span>
                    <span className="font-medium">{order.created_at}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#7E7E7E]">Items:</span>
                    <span className="font-medium">{order.items.length}</span>
                  </div>
                  <div className="flex justify-between border-t border-gray-200 mt-2 pt-2">
                    <span className="font-semibold">Total:</span>
                    <span className="font-bold text-[#006B51]">৳{parseFloat(order.total).toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href={`/profile/orders/${orderId}`}
                  className="bg-white text-[#006B51] border border-[#006B51] font-semibold py-3 px-6 rounded-full hover:bg-[#f9f9f9] transition-colors"
                >
                  Cancel
                </Link>

                <button
                  onClick={handleContinuePayment}
                  disabled={isProcessing}
                  className={`bg-[#006B51] text-white font-semibold py-3 px-6 rounded-full hover:bg-[#005541] transition-colors ${isProcessing ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                  {isProcessing ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </>
                  ) : (
                    'Continue to Payment'
                  )}
                </button>
              </div>
            </>
          ) : (
            <div className="text-center py-8">
              <p className="text-[#7E7E7E]">Order not found</p>
            </div>
          )}
        </div>
      </div>

      <Footer />
      <Copyright />
    </div>
  );
}
