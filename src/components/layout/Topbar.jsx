'use client'
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import { useWishlist } from '@/context/WishlistContext';

const Topbar = ({ serverSession, serverAuthStatus }) => {
  // Use server-provided auth state as initial values, then use client-side session for updates
  const { data: clientSession, status } = useSession();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { wishlistCount } = useWishlist();
  const pathname = usePathname();

  // Prioritize client-side session if available (for real-time updates), otherwise use server session
  const session = clientSession || serverSession;

  // Use client-side auth status if available, otherwise use server-provided status
  const isAuthenticated = status === 'authenticated' || serverAuthStatus?.isAuthenticated;
  const isAdmin = (status === 'authenticated' && clientSession?.user?.role === 'admin') ||
    serverAuthStatus?.isAdmin;

  // Check if current page is wishlist
  const isWishlistPage = pathname === '/wishlist';

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

  if (pathname.startsWith('/admin')) {
    return null;
  }

  return (
    <div className="border-b border-[#E3E3E3] z-30 relative">
      <div className="container mx-auto px-3 py-1.5">
        {/* Mobile View */}
        <div className="md:hidden flex justify-between items-center">
          <div className="flex items-center space-x-1.5">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#616161" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-map-pin">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg>
            <span className="text-[#616161] text-[10px]">Dhaka</span>
          </div>

          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-0.5">
              <span className="text-[#616161] text-[10px]">EN|BN</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#616161" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-globe">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="2" y1="12" x2="22" y2="12"></line>
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
              </svg>
            </div>

            <div className="w-px h-3 bg-[#D5D5D5]"></div>

            {isAuthenticated ? (
              <div className="relative">
                <button
                  className="flex items-center space-x-0.5 hover:text-[#3BB77E] transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowUserMenu(!showUserMenu);
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#616161" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-user">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                  <span className="text-[#616161] text-[10px]">
                    {session.user.firstName?.substring(0, 6) || 'Account'}
                    {isAdmin && <span className="ml-0.5 text-[7px] text-emerald-600 font-semibold">(A)</span>}
                  </span>
                </button>

                {showUserMenu && (
                  <div className="fixed inset-0 z-20 md:hidden" onClick={() => setShowUserMenu(false)}>
                    <div className="absolute inset-0 bg-black opacity-30"></div>
                    <div className="absolute right-3 top-7 w-36 bg-white rounded-md shadow-lg py-0.5">
                      <Link
                        href="/profile"
                        className="block px-2.5 py-1.5 text-[10px] text-gray-700 hover:bg-gray-100"
                        onClick={() => setShowUserMenu(false)}
                      >
                        My Profile
                      </Link>
                      <Link
                        href="/profile/orders"
                        className="block px-2.5 py-1.5 text-[10px] text-gray-700 hover:bg-gray-100"
                        onClick={() => setShowUserMenu(false)}
                      >
                        My Orders
                      </Link>

                      {isAdmin && (
                        <>
                          <div className="border-t border-gray-200 my-0.5"></div>
                          <Link
                            href="/admin"
                            className="block px-2.5 py-1.5 text-[10px] text-emerald-600 hover:bg-gray-100"
                            onClick={() => setShowUserMenu(false)}
                          >
                            Admin Panel
                          </Link>
                        </>
                      )}

                      <div className="border-t border-gray-200 my-0.5"></div>
                      <button
                        onClick={handleSignOut}
                        className="block w-full text-left px-2.5 py-1.5 text-[10px] text-red-600 hover:bg-gray-100"
                      >
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link href="/auth/login" className="flex items-center space-x-0.5 hover:text-[#3BB77E] transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#616161" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-user">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
                <span className="text-[#616161] text-[10px]">Login</span>
              </Link>
            )}
          </div>
        </div>

        {/* Desktop View - Reduced sizes */}
        <div className="hidden md:flex justify-between items-center">
          <div className="text-[#616161] text-xs">
            <Link href="/about" className="hover:text-[#3BB77E] transition-colors">About Us</Link>
            <span className="mx-1.5"> | </span>
            <Link href="/contact" className="hover:text-[#3BB77E] transition-colors">Contact Us</Link>
            <span className="mx-1.5"> | </span>
            <Link href="/profile/orders" className="hover:text-[#3BB77E] transition-colors">Delivery</Link>
          </div>
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-1.5">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#616161" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-map-pin">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
                <span className="text-[#616161] text-xs">Dhaka</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#616161" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-chevron-down">
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </div>
              <div className="w-px h-3.5 bg-[#D5D5D5]"></div>
              <div className="flex items-center space-x-1.5">
                <span className="text-[#616161] text-xs">EN|BN</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#616161" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-globe">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="2" y1="12" x2="22" y2="12"></line>
                  <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                </svg>
              </div>
              <div className="w-px h-3.5 bg-[#D5D5D5]"></div>
              <div className="flex items-center space-x-1.5">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#616161" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-phone">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                </svg>
                <span className="text-[#616161] text-xs">+880 1407-016740</span>
              </div>
            </div>
            <div className="w-px h-3.5 bg-[#D5D5D5]"></div>
            <Link
              href="/wishlist"
              className={`flex items-center space-x-1.5 transition-colors ${isWishlistPage ? 'text-[#3BB77E]' : 'hover:text-[#3BB77E]'}`}
            >
              <div className="relative">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#616161" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-heart">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                </svg>
                {wishlistCount > 0 && (
                  <div className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-[#DD2222] flex items-center justify-center">
                    <span className="text-[7px] text-white font-bold">{wishlistCount}</span>
                  </div>
                )}
              </div>
              <span className={`text-xs ${isWishlistPage ? 'text-[#3BB77E] font-semibold' : 'text-[#616161]'}`}>
                Wishlist
              </span>
            </Link>
            <div className="w-px h-3.5 bg-[#D5D5D5]"></div>

            {isAuthenticated ? (
              <div className="relative">
                <button
                  className="flex items-center space-x-1.5 hover:text-[#3BB77E] transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowUserMenu(!showUserMenu);
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#616161" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-user">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                  <span className="text-[#616161] text-xs">
                    {session.user.firstName || 'My Account'}
                    {isAdmin && <span className="ml-0.5 text-[10px] text-emerald-600 font-semibold">(Admin)</span>}
                  </span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#616161" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-chevron-down">
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </button>

                {showUserMenu && (
                  <div className="hidden md:block absolute right-0 mt-1.5 w-40 bg-white rounded-md shadow-lg z-10 py-0.5">
                    <Link
                      href="/profile"
                      className="block px-3 py-1.5 text-xs text-gray-700 hover:bg-gray-100"
                      onClick={() => setShowUserMenu(false)}
                    >
                      My Profile
                    </Link>
                    <Link
                      href="/profile/orders"
                      className="block px-3 py-1.5 text-xs text-gray-700 hover:bg-gray-100"
                      onClick={() => setShowUserMenu(false)}
                    >
                      My Orders
                    </Link>

                    {isAdmin && (
                      <>
                        <div className="border-t border-gray-200 my-0.5"></div>
                        <Link
                          href="/admin"
                          className="block px-3 py-1.5 text-xs text-emerald-600 hover:bg-gray-100"
                          onClick={() => setShowUserMenu(false)}
                        >
                          Admin Panel
                        </Link>
                      </>
                    )}

                    <div className="border-t border-gray-200 my-0.5"></div>
                    <button
                      onClick={handleSignOut}
                      className="block w-full text-left px-3 py-1.5 text-xs text-red-600 hover:bg-gray-100"
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link href="/auth/login" className="flex items-center space-x-1.5 hover:text-[#3BB77E] transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#616161" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-user">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
                <span className="text-[#616161] text-xs">Login/Registration</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Topbar;