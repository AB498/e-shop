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
import { getOrderDetails } from '@/lib/actions/orders';

export default async function OrderDetailsPage({ params }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
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

    if (session?.user) {
      fetchOrderDetails();
    }
  }, [session, orderId, router]);

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

  // If order not found, return null (will redirect in useEffect)
  if (!order && !isLoading) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Topbar />
      <Navigation />

      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center mb-6">
          <Link href="/profile" className="text-[#006B51] hover:underline flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            Back to My Account
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-[rgba(0,0,0,0.1)]">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 pb-6 border-b border-[#ECECEC]">
            <div>
              <h1 className="text-2xl font-bold text-[#253D4E]">Order #{order.id}</h1>
              <p className="text-[#7E7E7E]">Placed on {order.created_at}</p>
            </div>
            <div className="mt-4 md:mt-0">
              <span className={`px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full
                ${order.status === 'Processing' ? 'bg-blue-100 text-blue-800' :
                  order.status === 'Shipped' ? 'bg-yellow-100 text-yellow-800' :
                  order.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                  order.status === 'Cancelled' ? 'bg-red-100 text-red-800' :
                  'bg-gray-100 text-gray-800'}`}>
                {order.status}
              </span>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-lg font-semibold text-[#253D4E] mb-4">Order Items</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Product
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Quantity
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {order.items.map((item) => (
                    <tr key={item.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 flex-shrink-0 mr-3">
                            {item.product_image ? (
                              <Image
                                src={item.product_image}
                                alt={item.product_name}
                                width={40}
                                height={40}
                                className="h-10 w-10 rounded-md object-cover"
                              />
                            ) : (
                              <div className="h-10 w-10 rounded-md bg-gray-200 flex items-center justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                              </div>
                            )}
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">{item.product_name}</div>
                            <div className="text-sm text-gray-500">ID: {item.product_id}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">৳{parseFloat(item.price).toFixed(2)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.quantity}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">৳{(parseFloat(item.price) * item.quantity).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between gap-8">
            <div className="md:w-1/2">
              <h2 className="text-lg font-semibold text-[#253D4E] mb-4">Order Summary</h2>
              <div className="bg-gray-50 p-4 rounded-md">
                <div className="flex justify-between py-2">
                  <span className="text-[#7E7E7E]">Subtotal</span>
                  <span className="font-medium">৳{parseFloat(order.total).toFixed(2)}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-[#7E7E7E]">Shipping</span>
                  <span className="font-medium">৳0.00</span>
                </div>
                <div className="flex justify-between py-2 border-t border-gray-200 mt-2 pt-2">
                  <span className="font-semibold">Total</span>
                  <span className="font-bold text-[#006B51]">৳{parseFloat(order.total).toFixed(2)}</span>
                </div>
              </div>

              {/* Shipping & Tracking Information */}
              {(order.shipping_address || order.courier_tracking_id) && (
                <div className="mt-6">
                  <h2 className="text-lg font-semibold text-[#253D4E] mb-4">Shipping & Tracking</h2>
                  <div className="bg-gray-50 p-4 rounded-md">
                    {order.shipping_address && (
                      <div className="mb-4">
                        <h3 className="text-sm font-medium text-gray-500 mb-2">Shipping Address</h3>
                        <p className="text-sm">{order.shipping_address}</p>
                        {order.shipping_city && <p className="text-sm">{order.shipping_city}</p>}
                        {order.shipping_post_code && <p className="text-sm">Postal Code: {order.shipping_post_code}</p>}
                        {order.shipping_phone && <p className="text-sm">Phone: {order.shipping_phone}</p>}
                      </div>
                    )}

                    {order.courier && (
                      <div className="mb-4">
                        <h3 className="text-sm font-medium text-gray-500 mb-2">Courier Service</h3>
                        <p className="text-sm font-medium">{order.courier.name}</p>
                      </div>
                    )}

                    {order.courier_tracking_id && (
                      <div className="mb-4">
                        <h3 className="text-sm font-medium text-gray-500 mb-2">Tracking Information</h3>
                        <p className="text-sm">Tracking ID: {order.courier_tracking_id}</p>
                        {order.courier_status && (
                          <p className="text-sm mt-1">
                            Status: <span className={`font-medium ${
                              order.courier_status === 'Delivered' ? 'text-green-600' :
                              order.courier_status === 'Cancelled' || order.courier_status === 'Returned' ? 'text-red-600' :
                              'text-blue-600'
                            }`}>{order.courier_status}</span>
                          </p>
                        )}
                        <div className="mt-3">
                          <Link
                            href={`/profile/orders/${order.id}/track`}
                            className="text-[#006B51] hover:text-[#005541] text-sm font-medium flex items-center"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                            </svg>
                            Track Order
                          </Link>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="md:w-1/2">
              <h2 className="text-lg font-semibold text-[#253D4E] mb-4">Order Actions</h2>
              <div className="bg-gray-50 p-4 rounded-md">
                {order.status === 'Pending' && (
                  <p className="text-sm text-gray-600 mb-4">
                    Your order is pending payment. Please complete the payment to process your order.
                  </p>
                )}
                {order.status === 'Processing' && (
                  <p className="text-sm text-gray-600 mb-4">
                    Your order is being processed. We'll update you when it ships.
                  </p>
                )}
                {order.status === 'Shipped' && (
                  <p className="text-sm text-gray-600 mb-4">
                    Your order has been shipped and is on its way to you.
                  </p>
                )}
                {order.status === 'Delivered' && (
                  <p className="text-sm text-gray-600 mb-4">
                    Your order has been delivered. Thank you for shopping with us!
                  </p>
                )}
                {order.status === 'Cancelled' && (
                  <p className="text-sm text-gray-600 mb-4">
                    This order has been cancelled.
                  </p>
                )}

                <div className="flex flex-wrap gap-2">
                  {order.status === 'Pending' && (
                    <Link
                      href={`/profile/orders/${order.id}/pay`}
                      className="bg-[#006B51] text-white font-semibold py-2 px-4 rounded-full hover:bg-[#005541] transition-colors"
                    >
                      Continue Payment
                    </Link>
                  )}

                  <Link
                    href="/products"
                    className={`${order.status === 'Pending' ? 'bg-white text-[#006B51] border border-[#006B51]' : 'bg-[#006B51] text-white'} font-semibold py-2 px-4 rounded-full hover:bg-[#005541] hover:text-white transition-colors`}
                  >
                    Continue Shopping
                  </Link>

                  {order.status !== 'Cancelled' && (
                    <button
                      className="bg-white text-[#006B51] border border-[#006B51] font-semibold py-2 px-4 rounded-full hover:bg-[#f9f9f9] transition-colors"
                      onClick={() => alert('Contact support feature coming soon!')}
                    >
                      Contact Support
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
      <Copyright />
    </div>
  );
}
