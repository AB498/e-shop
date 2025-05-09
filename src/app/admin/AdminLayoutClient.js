'use client';

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  ChartBarIcon,
  ShoppingBagIcon,
  UserGroupIcon,
  CogIcon,
  TagIcon,
  Bars3Icon,
  XMarkIcon,
  BellIcon,
  TruckIcon,
  ArrowLeftIcon,
  PhotoIcon,
  MapPinIcon,
  ArchiveBoxIcon
} from "@heroicons/react/24/outline";
import { FiPackage, FiTruck, FiShoppingCart, FiUsers, FiSettings } from "react-icons/fi";

// Icon mapping object
const iconComponents = {
  ChartBarIcon,
  ShoppingBagIcon,
  UserGroupIcon,
  CogIcon,
  TagIcon,
  TruckIcon,
  PhotoIcon,
  MapPinIcon,
  ArchiveBoxIcon
};

// Custom icon mapping object
const customIconComponents = {
  FiPackage: () => <FiPackage className="w-5 h-5" />,
  FiTruck: () => <FiTruck className="w-5 h-5" />,
  FiShoppingCart: () => <FiShoppingCart className="w-5 h-5" />,
  FiUsers: () => <FiUsers className="w-5 h-5" />,
  FiSettings: () => <FiSettings className="w-5 h-5" />
};

export default function AdminLayoutClient({
  children,
  navigationItems,
  userData,
  pendingOrdersCount
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  // Add current property based on the current pathname and resolve icon components
  const navigation = navigationItems.map(item => {
    const current = pathname === item.href ||
      (item.href !== '/admin' && pathname.startsWith(item.href));

    // Get the actual icon component from the name
    const IconComponent = iconComponents[item.iconName];

    // Get the custom icon component function if it exists
    const customIconFunction = item.customIconName ? customIconComponents[item.customIconName] : null;

    return {
      ...item,
      current,
      icon: IconComponent,
      customIcon: customIconFunction
    };
  });

  return (
    <div className="h-screen bg-gray-50">
      {/* Mobile sidebar */}
      <div className={`fixed inset-0 z-40 flex md:hidden ${sidebarOpen ? 'visible' : 'invisible'}`}>
        <div className={`fixed inset-0 bg-gray-600 bg-opacity-75 transition-opacity ${sidebarOpen ? 'opacity-100 ease-out duration-300' : 'opacity-0 ease-in duration-200'}`}
          onClick={() => setSidebarOpen(false)}
        />

        <div className={`relative flex-1 flex flex-col max-w-xs w-full bg-white transition ease-in-out duration-300 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="absolute top-0 right-0 -mr-12 pt-2 z-10">
            <button
              type="button"
              className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              onClick={() => setSidebarOpen(false)}
            >
              <span className="sr-only">Close sidebar</span>
              <XMarkIcon className="h-6 w-6 text-white" aria-hidden="true" />
            </button>
          </div>

          <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
            <div className="flex-shrink-0 flex items-center px-4">
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 rounded-full bg-[#006B51] flex items-center justify-center">
                  <span className="text-white font-bold text-lg">E</span>
                </div>
                <span className="text-xl font-bold text-emerald-600">Thai Bangla Store</span>
              </div>
            </div>
            <nav className="mt-5 px-2 space-y-0.5">
              {/* Navigation section header */}
              <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Main Navigation
              </div>

              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`group flex items-center px-3 py-2.5 text-base font-medium rounded-md transition-all duration-200 ${item.current
                    ? 'bg-gradient-to-r from-emerald-50 to-emerald-100 text-emerald-800 border-l-4 border-emerald-500'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-emerald-700 hover:border-l-4 hover:border-emerald-300'
                    }`}
                >
                  {item.customIcon ? (
                    <span className={`mr-4 ${item.current ? 'text-emerald-600' : 'text-gray-400 group-hover:text-emerald-500'}`}>
                      {item.customIcon()}
                    </span>
                  ) : (
                    <item.icon
                      className={`mr-4 h-5 w-5 ${item.current ? 'text-emerald-600' : 'text-gray-400 group-hover:text-emerald-500'}`}
                      aria-hidden="true"
                    />
                  )}
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex-shrink-0 flex flex-col border-t border-gray-200 p-4">
            <div className="flex-shrink-0 group block mb-4">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  {userData.image ? (
                    <Image
                      src={userData.image}
                      alt={userData.name}
                      width={40}
                      height={40}
                      className="h-10 w-10 rounded-full object-cover border-2 border-emerald-100"
                    />
                  ) : (
                    <div className="h-10 w-10 rounded-full bg-gradient-to-r from-emerald-500 to-emerald-600 flex items-center justify-center text-white font-medium text-lg">
                      {userData.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <div className="ml-3">
                  <p className="text-base font-medium text-gray-800">
                    {userData.name}
                  </p>
                  <p className="text-sm text-gray-500 truncate max-w-[180px]">
                    {userData.email}
                  </p>
                  <div className="mt-1 flex items-center">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-emerald-100 text-emerald-800">
                      {userData.role === 'admin' ? 'Administrator' : userData.role}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Back to Site button for mobile */}
            <Link
              href="/"
              className="w-full inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 hover:text-emerald-600 transition-all duration-200"
            >
              <ArrowLeftIcon className="h-5 w-5 mr-2" aria-hidden="true" />
              Back to Site
            </Link>
          </div>
        </div>

        <div className="flex-shrink-0 w-14" aria-hidden="true">
          {/* Force sidebar to shrink to fit close icon */}
        </div>
      </div>

      {/* Static sidebar for desktop */}
      <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 z-10">
        <div className="flex-1 flex flex-col min-h-0 border-r border-gray-200 bg-white">
          <div className="flex-1 flex flex-col pt-5 pb-2 overflow-y-auto">
            <div className="flex items-center flex-shrink-0 px-4">
              <div className="flex items-center space-x-4">

                <Link href="/">
                  <div className="relative w-10 h-10 ">
                    <Image
                      src="/images/navigation/logo.png"
                      alt="Thai Bangla Logo"
                      fill
                      className="object-contain"
                    />
                  </div>
                </Link>

                <span className="text-xl font-bold text-emerald-600">Thai Bangla Store</span>
              </div>
            </div>
            <nav className="mt-5 flex-1 px-2 bg-white space-y-0.5 flex flex-col">
              {/* Navigation section header */}
              <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Main Navigation
              </div>

              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`group flex items-center px-3 py-2.5 text-sm font-medium rounded-md transition-all duration-200 ${item.current
                    ? 'bg-gradient-to-r from-emerald-50 to-emerald-100 text-emerald-800 border-l-4 border-emerald-500'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-emerald-700 hover:border-l-4 hover:border-emerald-300'
                    }`}
                >
                  {item.customIcon ? (
                    <span className={`mr-3 flex-shrink-0 ${item.current ? 'text-emerald-600' : 'text-gray-400 group-hover:text-emerald-500'}`}>
                      {item.customIcon()}
                    </span>
                  ) : (
                    <item.icon
                      className={`mr-3 flex-shrink-0 h-5 w-5 ${item.current ? 'text-emerald-600' : 'text-gray-400 group-hover:text-emerald-500'}`}
                      aria-hidden="true"
                    />
                  )}
                  {item.name}
                </Link>
              ))}

              <div className="grow"></div>
            </nav>
          </div>
          <div className="flex-shrink-0 flex flex-col border-t border-gray-200 p-4">
            <div className="flex-shrink-0 w-full group block">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  {userData.image ? (
                    <Image
                      src={userData.image}
                      alt={userData.name}
                      width={40}
                      height={40}
                      className="h-10 w-10 rounded-full object-cover border-2 border-emerald-100"
                    />
                  ) : (
                    <div className="h-10 w-10 rounded-full bg-gradient-to-r from-emerald-500 to-emerald-600 flex items-center justify-center text-white font-medium text-lg">
                      {userData.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-800">
                    {userData.name}
                  </p>
                  <p className="text-xs text-gray-500 truncate max-w-[140px]">
                    {userData.email}
                  </p>
                  <div className="mt-1 flex items-center">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-emerald-100 text-emerald-800">
                      {userData.role === 'admin' ? 'Administrator' : userData.role}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="md:pl-64 flex flex-col flex-1">
        <div className="sticky top-0 z-10 md:hidden pl-1 pt-1 sm:pl-3 sm:pt-3 bg-white">
          <button
            type="button"
            className="-ml-0.5 -mt-0.5 h-12 w-12 inline-flex items-center justify-center rounded-md text-gray-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-emerald-500"
            onClick={() => setSidebarOpen(true)}
          >
            <span className="sr-only">Open sidebar</span>
            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>

        {/* Header */}
        <div className="sticky top-0 z-10 flex-shrink-0 flex h-16 bg-white border-b border-gray-200 shadow-sm">
          <div className="flex-1 px-4 flex justify-between">
            <div className="flex-1 flex items-center">
              <h1 className="text-xl font-semibold text-gray-800">
                <span className="text-emerald-600 mr-1">|</span> Admin Dashboard
              </h1>
            </div>
            <div className="ml-4 flex items-center md:ml-6 space-x-3">
              <Link
                href="/"
                className="flex items-center px-3 py-1.5 rounded-md border border-gray-300 text-gray-700 text-sm hover:bg-gray-50 hover:text-emerald-600 transition-colors duration-200"
              >
                <ArrowLeftIcon className="h-4 w-4 mr-1.5" />
                Back to Site
              </Link>

              <div className="relative">
                <button
                  type="button"
                  className="p-1.5 rounded-md text-gray-500 hover:text-emerald-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors duration-200"
                >
                  <span className="sr-only">View notifications</span>
                  <BellIcon className="h-6 w-6" aria-hidden="true" />
                  {pendingOrdersCount > 0 && (
                    <span className="absolute top-0 right-0 -mt-1 -mr-1 flex items-center justify-center h-5 w-5 rounded-full bg-red-500 text-xs font-medium text-white ring-2 ring-white">
                      {pendingOrdersCount > 99 ? '99+' : pendingOrdersCount}
                    </span>
                  )}
                </button>
              </div>

              {/* Profile dropdown */}
              <div className="relative ml-1">
                <div>
                  <button
                    type="button"
                    className="flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-emerald-500 p-1"
                    id="user-menu-button"
                  >
                    <span className="sr-only">Open user menu</span>
                    {userData.image ? (
                      <Image
                        src={userData.image}
                        alt={userData.name}
                        width={32}
                        height={32}
                        className="h-8 w-8 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-emerald-500 to-emerald-600 flex items-center justify-center text-white">
                        {userData.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <main className="flex-1">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
