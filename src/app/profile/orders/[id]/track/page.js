'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Topbar from '@/components/layout/Topbar';
import Navigation from '@/components/layout/Navigation';
import Footer from '@/components/layout/Footer';
import Copyright from '@/components/layout/Copyright';
import Link from 'next/link';
import Image from 'next/image';
import { getOrderTracking } from '@/lib/actions/orders';

export default async function OrderTrackingPage({ params }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [tracking, setTracking] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  await params;
  const orderId = params.id;

  // Redirect if not logged in
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  // Fetch tracking information
  useEffect(() => {
    async function fetchTrackingInfo() {
      if (session?.user?.id && orderId) {
        setIsLoading(true);
        try {
          const trackingData = await getOrderTracking(orderId, session.user.id);
          if (trackingData) {
            setTracking(trackingData);
          } else {
            setError('Tracking information not found');
          }
        } catch (error) {
          console.error('Error fetching tracking information:', error);
          setError('Failed to load tracking information');
        } finally {
          setIsLoading(false);
        }
      }
    }

    if (session?.user) {
      fetchTrackingInfo();
    }
  }, [session, orderId]);

  // Function to refresh tracking information
  const refreshTracking = async () => {
    if (!session?.user?.id || !orderId) return;
    
    setIsLoading(true);
    try {
      // Call API to update tracking
      const response = await fetch('/api/orders/update-tracking', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ orderId }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update tracking information');
      }
      
      // Fetch updated tracking information
      const trackingData = await getOrderTracking(orderId, session.user.id);
      if (trackingData) {
        setTracking(trackingData);
      } else {
        setError('Tracking information not found');
      }
    } catch (error) {
      console.error('Error refreshing tracking information:', error);
      setError('Failed to refresh tracking information');
    } finally {
      setIsLoading(false);
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
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 pb-6 border-b border-[#ECECEC]">
            <div>
              <h1 className="text-2xl font-bold text-[#253D4E]">Order Tracking</h1>
              <p className="text-[#7E7E7E]">Order #{orderId}</p>
            </div>
            <div className="mt-4 md:mt-0">
              <button
                onClick={refreshTracking}
                className="bg-[#006B51] text-white px-4 py-2 rounded-md hover:bg-[#005541] transition-colors flex items-center"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="inline-block mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                  </svg>
                )}
                Refresh Tracking
              </button>
            </div>
          </div>

          {error ? (
            <div className="bg-red-50 p-4 rounded-md text-red-800 mb-6">
              <p>{error}</p>
            </div>
          ) : !tracking ? (
            <div className="bg-gray-50 p-8 rounded-md text-center">
              <p className="text-[#7E7E7E] mb-4">No tracking information available.</p>
            </div>
          ) : !tracking.has_tracking ? (
            <div className="bg-gray-50 p-8 rounded-md text-center">
              <p className="text-[#7E7E7E] mb-4">This order doesn't have tracking information yet.</p>
              <p className="text-[#7E7E7E]">Please check back later.</p>
            </div>
          ) : (
            <div>
              <div className="mb-8">
                <div className="bg-gray-50 p-4 rounded-md mb-6">
                  <div className="flex flex-col md:flex-row justify-between">
                    <div className="mb-4 md:mb-0">
                      <p className="text-[#7E7E7E] text-sm">Courier</p>
                      <p className="font-semibold">{tracking.courier?.name || 'Unknown'}</p>
                    </div>
                    <div className="mb-4 md:mb-0">
                      <p className="text-[#7E7E7E] text-sm">Tracking Number</p>
                      <p className="font-semibold">{tracking.tracking_id}</p>
                    </div>
                    <div>
                      <p className="text-[#7E7E7E] text-sm">Status</p>
                      <p className={`font-semibold ${
                        tracking.current_status === 'Delivered' ? 'text-green-600' :
                        tracking.current_status === 'Cancelled' || tracking.current_status === 'Returned' ? 'text-red-600' :
                        'text-blue-600'
                      }`}>
                        {tracking.current_status}
                      </p>
                    </div>
                  </div>
                </div>

                <h2 className="text-lg font-semibold text-[#253D4E] mb-4">Tracking History</h2>
                
                {tracking.tracking.length === 0 ? (
                  <div className="bg-gray-50 p-4 rounded-md text-center">
                    <p className="text-[#7E7E7E]">No tracking updates available yet.</p>
                  </div>
                ) : (
                  <div className="relative">
                    {/* Timeline line */}
                    <div className="absolute left-3 top-5 bottom-5 w-0.5 bg-gray-200"></div>
                    
                    {/* Timeline events */}
                    <div className="space-y-6">
                      {tracking.tracking.map((event, index) => (
                        <div key={event.id} className="flex items-start">
                          <div className={`relative flex items-center justify-center w-6 h-6 rounded-full mt-1 mr-4 ${
                            index === 0 ? 'bg-[#006B51]' : 'bg-gray-300'
                          }`}>
                            <div className="h-2 w-2 bg-white rounded-full"></div>
                          </div>
                          <div className="flex-1">
                            <div className="flex flex-col md:flex-row md:justify-between md:items-center">
                              <h3 className={`font-semibold ${index === 0 ? 'text-[#006B51]' : 'text-gray-700'}`}>
                                {event.status}
                              </h3>
                              <span className="text-sm text-gray-500">{event.timestamp}</span>
                            </div>
                            <p className="text-gray-600 mt-1">{event.details}</p>
                            {event.location && (
                              <p className="text-sm text-gray-500 mt-1">
                                <span className="inline-block mr-1">
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                                  </svg>
                                </span>
                                {event.location}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer />
      <Copyright />
    </div>
  );
}
