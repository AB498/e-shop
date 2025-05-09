'use client'
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { usePathname } from 'next/navigation';

const Topbar = ({ serverSession, serverAuthStatus }) => {
  // Use server-provided auth state as initial values, then use client-side session for updates
  const { data: clientSession, status } = useSession();
  const [showUserMenu, setShowUserMenu] = useState(false);

  // Prioritize client-side session if available (for real-time updates), otherwise use server session
  const session = clientSession || serverSession;

  // Use client-side auth status if available, otherwise use server-provided status
  const isAuthenticated = status === 'authenticated' || serverAuthStatus?.isAuthenticated;
  const isAdmin = (status === 'authenticated' && clientSession?.user?.role === 'admin') ||
    serverAuthStatus?.isAdmin;

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      if (showUserMenu) {
        setShowUserMenu(false);
      }
    };

    // Only add listener if menu is open
    if (showUserMenu) {
      document.addEventListener('click', handleClickOutside);
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [showUserMenu]);

  const handleSignOut = async () => {
    await signOut({ redirect: true, callbackUrl: '/' });
  };

  const pathname = usePathname();

  if (pathname.startsWith('/admin')) {
    return null;
  }

  return (
    <div className="border-b border-[#E3E3E3]">
      <div className="container mx-auto px-4 py-2">
        {/* Mobile View */}
        <div className="md:hidden flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Image src="/images/topbar/map-marker.png" alt="Location" width={16} height={16} />
            <span className="text-[#616161] text-xs">Dhaka</span>
          </div>

          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-1">
              <span className="text-[#616161] text-xs">EN|BN</span>
              <Image src="/images/topbar/language.png" alt="Language" width={14} height={14} />
            </div>

            <div className="w-px h-4 bg-[#D5D5D5]"></div>

            {isAuthenticated ? (
              <div className="relative">
                <button
                  className="flex items-center space-x-1 hover:text-[#3BB77E] transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowUserMenu(!showUserMenu);
                  }}
                >
                  <Image src="/images/topbar/user.png" alt="User" width={14} height={14} />
                  <span className="text-[#616161] text-xs">
                    {session.user.firstName?.substring(0, 6) || 'Account'}
                    {isAdmin && <span className="ml-1 text-[8px] text-emerald-600 font-semibold">(A)</span>}
                  </span>
                </button>

                {showUserMenu && (
                  <div className="fixed inset-0 z-20 md:hidden" onClick={() => setShowUserMenu(false)}>
                    <div className="absolute inset-0 bg-black opacity-30"></div>
                    <div className="absolute right-4 top-8 w-40 bg-white rounded-md shadow-lg py-1">
                      <Link
                        href="/profile"
                        className="block px-3 py-2 text-xs text-gray-700 hover:bg-gray-100"
                        onClick={() => setShowUserMenu(false)}
                      >
                        My Profile
                      </Link>
                      <Link
                        href="/profile/orders"
                        className="block px-3 py-2 text-xs text-gray-700 hover:bg-gray-100"
                        onClick={() => setShowUserMenu(false)}
                      >
                        My Orders
                      </Link>

                      {isAdmin && (
                        <>
                          <div className="border-t border-gray-200 my-1"></div>
                          <Link
                            href="/admin"
                            className="block px-3 py-2 text-xs text-emerald-600 hover:bg-gray-100"
                            onClick={() => setShowUserMenu(false)}
                          >
                            Admin Panel
                          </Link>
                        </>
                      )}

                      <div className="border-t border-gray-200 my-1"></div>
                      <button
                        onClick={handleSignOut}
                        className="block w-full text-left px-3 py-2 text-xs text-red-600 hover:bg-gray-100"
                      >
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link href="/auth/login" className="flex items-center space-x-1 hover:text-[#3BB77E] transition-colors">
                <Image src="/images/topbar/user.png" alt="User" width={14} height={14} />
                <span className="text-[#616161] text-xs">Login</span>
              </Link>
            )}
          </div>
        </div>

        {/* Desktop View - Preserved exactly as original */}
        <div className="hidden md:flex justify-between items-center">
          <div className="text-[#616161] text-sm">
            <Link href="/about" className="hover:text-[#3BB77E] transition-colors">About Us</Link>
            <span className="mx-2"> | </span>
            <Link href="/contact" className="hover:text-[#3BB77E] transition-colors">Contact Us</Link>
            <span className="mx-2"> | </span>
            <Link href="/delivery" className="hover:text-[#3BB77E] transition-colors">Delivery</Link>
          </div>
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
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowUserMenu(!showUserMenu);
                  }}
                >
                  <Image src="/images/topbar/user.png" alt="User" width={16} height={16} />
                  <span className="text-[#616161] text-sm">
                    {session.user.firstName || 'My Account'}
                    {isAdmin && <span className="ml-1 text-xs text-emerald-600 font-semibold">(Admin)</span>}
                  </span>
                  <Image src="/images/topbar/chevron-down.png" alt="Dropdown" width={12} height={12} />
                </button>

                {showUserMenu && (
                  <div className="hidden md:block absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 py-1">
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
    </div>
  );
};

export default Topbar;