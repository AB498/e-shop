'use client'
import React, { useState, useEffect } from 'react';
import { signOut } from 'next-auth/react';
import Link from 'next/link';
import Image from 'next/image';
import { getUserOrders } from '@/lib/actions/orders';
import { useWishlist } from '@/context/WishlistContext';
import WishlistItem from '@/components/wishlist/WishlistItem';
import EmptyWishlist from '@/components/wishlist/EmptyWishlist';
import EditProfileModal from '@/components/profile/EditProfileModal';
import AddressForm from '@/components/profile/AddressForm';
import { toast } from 'react-hot-toast';

const ProfileContent = ({ user, defaultTab = 'account' }) => {
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [userData, setUserData] = useState(user);
  const { wishlist, wishlistCount, isLoading: isWishlistLoading } = useWishlist();

  // Initialize userData when user prop changes
  useEffect(() => {
    if (user) {
      setUserData(user);
    }
  }, [user]);

  // Fetch user orders when the component mounts or when the user changes
  useEffect(() => {
    const fetchOrders = async () => {
      if (userData?.id) {
        setIsLoading(true);
        try {
          // Convert user.id to number if it's a string
          const userId = typeof userData.id === 'string' ? parseInt(userData.id, 10) : userData.id;

          const userOrders = await getUserOrders(userId);
          setOrders(userOrders);
        } catch (error) {
          console.error('Error fetching orders:', error);
          toast.error('Failed to load orders');
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchOrders();
  }, [userData?.id]);

  const handleSignOut = async () => {
    await signOut({ redirect: true, callbackUrl: '/' });
  };

  const handleProfileUpdate = (updatedUser) => {
    setUserData(updatedUser);
  };

  return (
    <>
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
                      <p className="font-medium">{userData.firstName} {userData.lastName}</p>
                    </div>

                    <div>
                      <p className="text-sm text-[#7E7E7E]">Email</p>
                      <p className="font-medium">{userData.email}</p>
                    </div>

                    <div>
                      <p className="text-sm text-[#7E7E7E]">Phone</p>
                      <p className="font-medium">{userData.phone || 'Not provided'}</p>
                    </div>

                    <div>
                      <p className="text-sm text-[#7E7E7E]">Role</p>
                      <p className="font-medium capitalize">{userData.role}</p>
                    </div>
                  </div>

                  <div className="mt-6">
                    <button
                      onClick={() => setShowEditProfileModal(true)}
                      className="bg-[#006B51] text-white px-4 py-2 rounded-md hover:bg-[#005541] transition-colors"
                    >
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
                    <button
                      onClick={() => setShowEditProfileModal(true)}
                      className="bg-[#006B51] text-white px-4 py-2 rounded-md hover:bg-[#005541] transition-colors"
                    >
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
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                <h2 className="text-2xl font-bold text-[#253D4E] mb-4 md:mb-0">
                  My Wishlist {wishlistCount > 0 && `(${wishlistCount})`}
                </h2>
                {wishlistCount > 0 && (
                  <Link
                    href="/wishlist"
                    className="text-[#006B51] hover:text-[#005541] transition-colors inline-flex items-center gap-2 text-sm font-medium"
                  >
                    <span>View Full Wishlist</span>
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M1 7H13M13 7L7 1M13 7L7 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </Link>
                )}
              </div>

              {isWishlistLoading ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="w-12 h-12 border-4 border-[#006B51] border-t-transparent rounded-full animate-spin"></div>
                  <p className="mt-4 text-[#7E7E7E]">Loading your wishlist...</p>
                </div>
              ) : wishlist.length === 0 ? (
                <EmptyWishlist />
              ) : (
                <div>
                  <div className="w-full h-px bg-[#EEEEEE] mb-6"></div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {wishlist.slice(0, 6).map((item) => (
                      <WishlistItem key={item.id} item={item} />
                    ))}
                  </div>

                  {wishlist.length > 6 && (
                    <div className="mt-6 text-center">
                      <Link
                        href="/wishlist"
                        className="bg-[#006B51] text-white px-6 py-3 rounded-md hover:bg-[#005541] transition-colors inline-flex items-center justify-center gap-2"
                      >
                        <span>View All {wishlist.length} Items</span>
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M1 7H13M13 7L7 1M13 7L7 13" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {activeTab === 'address' && (
            <div>
              <h2 className="text-2xl font-bold mb-6 text-[#253D4E]">Address Book</h2>

              {userData.address ? (
                <div className="bg-white border border-gray-200 rounded-md p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-semibold text-[#253D4E]">Default Address</h3>
                    <button
                      onClick={() => setShowAddressForm(true)}
                      className="text-[#006B51] hover:text-[#005541] text-sm font-medium"
                    >
                      Edit
                    </button>
                  </div>

                  <div className="space-y-2">
                    <p className="text-gray-700">{userData.firstName} {userData.lastName}</p>
                    <p className="text-gray-700">{userData.address}</p>
                    <p className="text-gray-700">{userData.city}, {userData.region || ''} {userData.postCode}</p>
                    <p className="text-gray-700">{userData.country}</p>
                    {userData.phone && <p className="text-gray-700">Phone: {userData.phone}</p>}
                  </div>
                </div>
              ) : (
                <div className="bg-gray-50 p-8 rounded-md text-center">
                  <p className="text-[#7E7E7E] mb-4">You haven't added any addresses yet.</p>
                  <button
                    onClick={() => setShowAddressForm(true)}
                    className="bg-[#006B51] text-white px-4 py-2 rounded-md hover:bg-[#005541] transition-colors"
                  >
                    Add New Address
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      </div>

      {/* Edit Profile Modal */}
      {showEditProfileModal && (
        <EditProfileModal
          user={userData}
          onClose={() => setShowEditProfileModal(false)}
          onUpdate={handleProfileUpdate}
        />
      )}

      {/* Address Form Modal */}
      {showAddressForm && (
        <AddressForm
          user={userData}
          onClose={() => setShowAddressForm(false)}
          onUpdate={handleProfileUpdate}
        />
      )}
    </>
  );
};

export default ProfileContent;
