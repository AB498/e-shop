'use client'
import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';

const Topbar = () => {
  const { data: session, status } = useSession();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const isAuthenticated = status === 'authenticated';
  const isAdmin = isAuthenticated && session?.user?.role === 'admin';

  const handleSignOut = async () => {
    await signOut({ redirect: true, callbackUrl: '/' });
  };

  return (
    <div className="border-b border-[#E3E3E3]">
      <div className="container mx-auto px-4 py-2 flex justify-between items-center">
        <span className="text-[#616161] text-sm">About Us   |   Contact Us   |   Delivery</span>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Image src="/images/topbar/map-marker.png" alt="Location" width={16} height={16} />
              <span className="text-[#616161] text-sm">Dhaka</span>
              <Image src="/images/topbar/chevron-down.png" alt="Dropdown" width={12} height={12} />
            </div>
            <div className="w-px h-4 bg-[#D5D5D5]"></div>
            <div className="flex items-center space-x-2">
              <span className="text-[#616161] text-sm">EN|BN</span>
              <Image src="/images/topbar/language.png" alt="Language" width={16} height={16} />
            </div>
            <div className="w-px h-4 bg-[#D5D5D5]"></div>
            <div className="flex items-center space-x-2">
              <Image src="/images/topbar/phone.png" alt="Phone" width={16} height={16} />
              <span className="text-[#616161] text-sm">+880 1407-016740</span>
            </div>
          </div>
          <div className="w-px h-4 bg-[#D5D5D5]"></div>
          <Link href="/wishlist" className="flex items-center space-x-2 hover:text-[#3BB77E] transition-colors">
            <Image src="/images/topbar/wishlist.png" alt="Wishlist" width={16} height={16} />
            <span className="text-[#616161] text-sm">Wishlist</span>
          </Link>
          <div className="w-px h-4 bg-[#D5D5D5]"></div>

          {isAuthenticated ? (
            <div className="relative">
              <button
                className="flex items-center space-x-2 hover:text-[#3BB77E] transition-colors"
                onClick={() => setShowUserMenu(!showUserMenu)}
              >
                <Image src="/images/topbar/user.png" alt="User" width={16} height={16} />
                <span className="text-[#616161] text-sm">
                  {session.user.firstName || 'My Account'}
                  {isAdmin && <span className="ml-1 text-xs text-emerald-600 font-semibold">(Admin)</span>}
                </span>
                <Image src="/images/topbar/chevron-down.png" alt="Dropdown" width={12} height={12} />
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 py-1">
                  <Link
                    href="/profile"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setShowUserMenu(false)}
                  >
                    My Profile
                  </Link>
                  <Link
                    href="/profile/orders"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setShowUserMenu(false)}
                  >
                    My Orders
                  </Link>

                  {isAdmin && (
                    <>
                      <div className="border-t border-gray-200 my-1"></div>
                      <Link
                        href="/admin"
                        className="block px-4 py-2 text-sm text-emerald-600 hover:bg-gray-100"
                        onClick={() => setShowUserMenu(false)}
                      >
                        Admin Panel
                      </Link>
                      <Link
                        href="/dev"
                        className="block px-4 py-2 text-sm text-emerald-600 hover:bg-gray-100"
                        onClick={() => setShowUserMenu(false)}
                      >
                        Dev Tools
                      </Link>
                    </>
                  )}

                  <div className="border-t border-gray-200 my-1"></div>
                  <button
                    onClick={handleSignOut}
                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link href="/auth/login" className="flex items-center space-x-2 hover:text-[#3BB77E] transition-colors">
              <Image src="/images/topbar/user.png" alt="User" width={16} height={16} />
              <span className="text-[#616161] text-sm">Login/Registration</span>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default Topbar;