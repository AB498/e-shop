'use client'
import React, { useState, useEffect } from 'react';
import { signOut } from 'next-auth/react';
import Link from 'next/link';
import Image from 'next/image';
import { getUserOrders } from '@/lib/actions/orders';

const ProfileContent = ({ user, defaultTab = 'account' }) => {
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch user orders when the component mounts or when the user changes
  useEffect(() => {
    const fetchOrders = async () => {
      if (user?.id) {
        setIsLoading(true);
        try {
          console.log('Fetching orders for user ID:', user.id, 'Type:', typeof user.id);

          // Convert user.id to number if it's a string
          const userId = typeof user.id === 'string' ? parseInt(user.id, 10) : user.id;

          const userOrders = await getUserOrders(userId);
          console.log('Fetched user orders:', userOrders);
          setOrders(userOrders);
        } catch (error) {
          console.error('Error fetching orders:', error);
        } finally {
          setIsLoading(false);
        }
      } else {
        console.log('No user ID available, cannot fetch orders');
      }
    };

    fetchOrders();
  }, [user?.id]);

  const handleSignOut = async () => {
    await signOut({ redirect: true, callbackUrl: '/' });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
      {/* Sidebar */}
      <div className="col-span-1">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-bold mb-6 text-[#253D4E]">My Account</h2>

          <nav className="space-y-2">
            <button
              onClick={() => setActiveTab('account')}
              className={`w-full text-left px-4 py-2 rounded-md ${
                activeTab === 'account'
                  ? 'bg-[#006B51] text-white'
                  : 'text-[#7E7E7E] hover:bg-gray-100'
              }`}
            >
              Account Information
            </button>

            <button
              onClick={() => setActiveTab('orders')}
              className={`w-full text-left px-4 py-2 rounded-md ${
                activeTab === 'orders'
                  ? 'bg-[#006B51] text-white'
                  : 'text-[#7E7E7E] hover:bg-gray-100'
              }`}
            >
              My Orders
            </button>

            <button
              onClick={() => setActiveTab('wishlist')}
              className={`w-full text-left px-4 py-2 rounded-md ${
                activeTab === 'wishlist'
                  ? 'bg-[#006B51] text-white'
                  : 'text-[#7E7E7E] hover:bg-gray-100'
              }`}
            >
              My Wishlist
            </button>

            <button
              onClick={() => setActiveTab('address')}
              className={`w-full text-left px-4 py-2 rounded-md ${
                activeTab === 'address'
                  ? 'bg-[#006B51] text-white'
                  : 'text-[#7E7E7E] hover:bg-gray-100'
              }`}
            >
              Address Book
            </button>

            <button
              onClick={handleSignOut}
              className="w-full text-left px-4 py-2 rounded-md text-red-600 hover:bg-red-50"
            >
              Sign Out
            </button>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="col-span-1 md:col-span-3">
        <div className="bg-white rounded-lg shadow-sm p-6">
          {activeTab === 'account' && (
            <div>
              <h2 className="text-2xl font-bold mb-6 text-[#253D4E]">Account Information</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4 text-[#253D4E]">Personal Information</h3>

                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-[#7E7E7E]">Name</p>
                      <p className="font-medium">{user.firstName} {user.lastName}</p>
                    </div>

                    <div>
                      <p className="text-sm text-[#7E7E7E]">Email</p>
                      <p className="font-medium">{user.email}</p>
                    </div>

                    <div>
                      <p className="text-sm text-[#7E7E7E]">Role</p>
                      <p className="font-medium capitalize">{user.role}</p>
                    </div>
                  </div>

                  <div className="mt-6">
                    <button className="bg-[#006B51] text-white px-4 py-2 rounded-md hover:bg-[#005541] transition-colors">
                      Edit Profile
                    </button>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-4 text-[#253D4E]">Account Security</h3>

                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-[#7E7E7E]">Password</p>
                      <p className="font-medium">••••••••</p>
                    </div>
                  </div>

                  <div className="mt-6">
                    <button className="bg-[#006B51] text-white px-4 py-2 rounded-md hover:bg-[#005541] transition-colors">
                      Change Password
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'orders' && (
            <div>
              <h2 className="text-2xl font-bold mb-6 text-[#253D4E]">My Orders</h2>

              {isLoading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#006B51]"></div>
                </div>
              ) : orders.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Order ID
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Total
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Items
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {orders.map((order) => (
                        <tr key={order.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">#{order.id}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{order.created_at}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                              ${order.status === 'Processing' ? 'bg-blue-100 text-blue-800' :
                                order.status === 'Shipped' ? 'bg-yellow-100 text-yellow-800' :
                                order.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                                order.status === 'Cancelled' ? 'bg-red-100 text-red-800' :
                                'bg-gray-100 text-gray-800'}`}>
                              {order.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">৳{parseFloat(order.total).toFixed(2)}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.items.length}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <div className="flex space-x-3">
                              <Link
                                href={`/profile/orders/${order.id}`}
                                className="text-blue-600 hover:text-blue-900"
                              >
                                View Details
                              </Link>

                              {order.status === 'Pending' && (
                                <Link
                                  href={`/profile/orders/${order.id}/pay`}
                                  className="text-green-600 hover:text-green-900"
                                >
                                  Continue Payment
                                </Link>
                              )}

                              {order.courier_tracking_id && (
                                <Link
                                  href={`/profile/orders/${order.id}`}
                                  className="text-orange-600 hover:text-orange-900"
                                >
                                  Track Order
                                </Link>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="bg-gray-50 p-8 rounded-md text-center">
                  <p className="text-[#7E7E7E] mb-4">You haven't placed any orders yet.</p>
                  <Link
                    href="/products"
                    className="bg-[#006B51] text-white px-4 py-2 rounded-md hover:bg-[#005541] transition-colors inline-block"
                  >
                    Start Shopping
                  </Link>
                </div>
              )}
            </div>
          )}

          {activeTab === 'wishlist' && (
            <div>
              <h2 className="text-2xl font-bold mb-6 text-[#253D4E]">My Wishlist</h2>

              <div className="bg-gray-50 p-8 rounded-md text-center">
                <p className="text-[#7E7E7E] mb-4">Your wishlist is empty.</p>
                <Link
                  href="/products"
                  className="bg-[#006B51] text-white px-4 py-2 rounded-md hover:bg-[#005541] transition-colors inline-block"
                >
                  Discover Products
                </Link>
              </div>
            </div>
          )}

          {activeTab === 'address' && (
            <div>
              <h2 className="text-2xl font-bold mb-6 text-[#253D4E]">Address Book</h2>

              <div className="bg-gray-50 p-8 rounded-md text-center">
                <p className="text-[#7E7E7E] mb-4">You haven't added any addresses yet.</p>
                <button className="bg-[#006B51] text-white px-4 py-2 rounded-md hover:bg-[#005541] transition-colors">
                  Add New Address
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileContent;
