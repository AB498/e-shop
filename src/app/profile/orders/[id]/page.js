'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { getOrderDetails, getOrderTracking } from '@/lib/actions/orders';

// Order components
import OrderItems from '@/components/orders/OrderItems';
import OrderSummary from '@/components/orders/OrderSummary';
import ShippingInfo from '@/components/orders/ShippingInfo';
import OrderActions from '@/components/orders/OrderActions';
import TrackingInfo from '@/components/orders/TrackingInfo';
import OrderStatusBadge from '@/components/orders/OrderStatusBadge';

export default function OrderDetailsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const orderId = params?.id;

  const [order, setOrder] = useState(null);
  const [tracking, setTracking] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [trackingError, setTrackingError] = useState(null);

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

            // Fetch tracking information if available or if it's a COD order
            if (orderData.courier_tracking_id || orderData.payment_method === 'cod') {
              try {
                const trackingData = await getOrderTracking(orderId, session.user.id);
                if (trackingData) {
                  setTracking(trackingData);
                }
              } catch (trackingErr) {
                console.error('Error fetching tracking information:', trackingErr);
                setTrackingError('Failed to load tracking information');
              }
            }
          } else {
            // Order not found or doesn't belong to user
            router.push('/profile');
          }
        } catch (error) {
          console.error('Error fetching order details:', error);
          router.push('/profile');
        } finally {
          setIsLoading(false);
        }
      }
    }

    if (session?.user && orderId) {
      fetchOrderDetails();
    }
  }, [session, orderId, router]);

  // Function to refresh tracking information without altering tracking history
  const refreshTracking = async () => {
    if (!session?.user?.id || !orderId) return;

    setIsRefreshing(true);
    setTrackingError(null);
    try {
      // Call API to refresh tracking without altering history
      const response = await fetch('/api/orders/refresh-tracking', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ orderId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to refresh tracking information');
      }

      // Get the tracking data directly from the response
      const trackingData = await response.json();
      if (trackingData) {
        // If the response includes payment_method, it's a COD order without tracking
        if (trackingData.payment_method === 'cod' && !trackingData.has_tracking) {
          // Just update the tracking state with the response
          setTracking(trackingData);
        } else if (trackingData.has_tracking) {
          // Normal tracking data with tracking information
          setTracking(trackingData);
        } else {
          setTrackingError('Tracking information not found');
        }
      } else {
        setTrackingError('Tracking information not found');
      }
    } catch (error) {
      console.error('Error refreshing tracking information:', error);
      setTrackingError(error.message || 'Failed to refresh tracking information');
    } finally {
      setIsRefreshing(false);
    }
  };

  // If loading session, show loading state
  if (status === 'loading' || isLoading) {
    return (
      <div className="min-h-screen flex flex-col">

        <div className="container mx-auto px-4 py-8 flex-grow flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#006B51]"></div>
        </div>

      </div>
    );
  }

  // If not authenticated, return null (will redirect in useEffect)
  if (status === 'unauthenticated') {
    return null;
  }

  // If order not found, return null (will redirect in useEffect)
  if (!order && !isLoading) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col">

      <div className="container mx-auto px-3 py-4 md:py-6">
        <div className="flex items-center mb-3 md:mb-4">
          <Link href="/profile" className="text-[#006B51] hover:underline flex items-center text-sm">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            Back to My Account
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-3 md:p-4 border border-[rgba(0,0,0,0.1)]">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-3 md:mb-4 pb-3 md:pb-4 border-b border-[#ECECEC]">
            <div>
              <h1 className="text-xl font-bold text-[#253D4E]">Order #{order.id}</h1>
              <p className="text-xs text-[#7E7E7E]">Placed on {order.created_at}</p>
            </div>
            <div className="mt-2 md:mt-0">
              <OrderStatusBadge status={order.status} />
            </div>
          </div>

          <div className="mb-4 md:mb-6">
            <h2 className="text-base font-semibold text-[#253D4E] mb-2 md:mb-3">Order Items</h2>
            <OrderItems items={order.items} />
          </div>

          <div className="flex flex-col md:flex-row justify-between gap-4 md:gap-6">
            <div className="md:w-1/2">
              <h2 className="text-base font-semibold text-[#253D4E] mb-2 md:mb-3">Order Summary</h2>
              <OrderSummary total={order.total} payment_method={order.payment_method} />

              {/* Shipping Information */}
              <ShippingInfo order={order} />
            </div>

            <div className="md:w-1/2">
              <h2 className="text-base font-semibold text-[#253D4E] mb-2 md:mb-3">Order Actions</h2>
              <OrderActions order={order} />

              {/* Tracking Information */}
              {(order.courier_tracking_id || order.payment_method === 'cod') && (
                <TrackingInfo
                  tracking={tracking}
                  trackingError={trackingError}
                  isRefreshing={isRefreshing}
                  refreshTracking={refreshTracking}
                  payment_method={order.payment_method}
                  hasTrackingId={!!order.courier_tracking_id}
                />
              )}
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
