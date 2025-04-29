'use client'
import React, { useState } from 'react';
import { signOut } from 'next-auth/react';
import Link from 'next/link';

const ProfileContent = ({ user }) => {
  const [activeTab, setActiveTab] = useState('account');
  
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
              
              <div className="bg-gray-50 p-8 rounded-md text-center">
                <p className="text-[#7E7E7E] mb-4">You haven't placed any orders yet.</p>
                <Link 
                  href="/products" 
                  className="bg-[#006B51] text-white px-4 py-2 rounded-md hover:bg-[#005541] transition-colors inline-block"
                >
                  Start Shopping
                </Link>
              </div>
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
