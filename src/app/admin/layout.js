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
  UserCircleIcon,
  TruckIcon,
  ArrowLeftIcon,
  PhotoIcon,
  MapPinIcon,
  ArchiveBoxIcon
} from "@heroicons/react/24/outline";
import { FiPackage, FiTruck, FiShoppingCart, FiUsers, FiSettings } from "react-icons/fi";

export default function AdminLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  const navigationItems = [
    {
      name: 'Dashboard',
      href: '/admin',
      icon: ChartBarIcon,
      customIcon: () => <FiShoppingCart className="w-5 h-5" />
    },
    {
      name: 'Products',
      href: '/admin/products',
      icon: ArchiveBoxIcon,
      customIcon: () => <FiPackage className="w-5 h-5" />
    },
    {
      name: 'Categories',
      href: '/admin/categories',
      icon: TagIcon
    },
    {
      name: 'Orders',
      href: '/admin/orders',
      icon: ShoppingBagIcon,
      customIcon: () => <FiShoppingCart className="w-5 h-5" />
    },
    {
      name: 'Courier Management',
      href: '/admin/couriers',
      icon: TruckIcon,
      customIcon: () => <FiTruck className="w-5 h-5" />
    },
    {
      name: 'Delivery Persons',
      href: '/admin/delivery-persons',
      icon: UserGroupIcon,
      customIcon: () => <FiUsers className="w-5 h-5" />
    },
    {
      name: 'Courier Orders',
      href: '/admin/courier-orders',
      icon: TruckIcon,
      customIcon: () => <FiTruck className="w-5 h-5" />
    },
    {
      name: 'Store Locations',
      href: '/admin/store-locations',
      icon: MapPinIcon
    },
    {
      name: 'Customers',
      href: '/admin/customers',
      icon: UserGroupIcon,
      customIcon: () => <FiUsers className="w-5 h-5" />
    },
    {
      name: 'Files',
      href: '/admin/files',
      icon: PhotoIcon
    },
    {
      name: 'Analytics',
      href: '/admin/analytics',
      icon: ChartBarIcon
    },
    {
      name: 'Settings',
      href: '/admin/settings',
      icon: CogIcon,
      customIcon: () => <FiSettings className="w-5 h-5" />
    },
  ];

  // Add current property based on the current pathname
  const navigation = navigationItems.map(item => ({
    ...item,
    current: pathname === item.href ||
      (item.href !== '/admin' && pathname.startsWith(item.href))
  }));

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
            <nav className="mt-5 px-2 space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`group flex items-center px-2 py-2 text-base font-medium rounded-md ${item.current
                    ? 'bg-emerald-100 text-emerald-900'
                    : 'text-gray-600 hover:bg-emerald-50 hover:text-emerald-900'
                    }`}
                >
                  {item.customIcon ? (
                    <span className={`mr-4 ${item.current ? 'text-emerald-500' : 'text-gray-400 group-hover:text-emerald-500'}`}>
                      {item.customIcon()}
                    </span>
                  ) : (
                    <item.icon
                      className={`mr-4 h-6 w-6 ${item.current ? 'text-emerald-500' : 'text-gray-400 group-hover:text-emerald-500'}`}
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
                <div>
                  <UserCircleIcon className="inline-block h-10 w-10 rounded-full text-gray-500" />
                </div>
                <div className="ml-3">
                  <p className="text-base font-medium text-gray-700 group-hover:text-gray-900">
                    Admin User
                  </p>
                  <p className="text-sm font-medium text-gray-500 group-hover:text-gray-700">
                    View profile
                  </p>
                </div>
              </div>
            </div>

            {/* Back to Site button for mobile */}
            <Link
              href="/"
              className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-md text-white bg-gradient-to-r from-[#006B51] to-[#008B6A] hover:from-[#00604A] hover:to-[#007D5F] transition-all duration-200"
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
            <nav className="mt-5 flex-1 px-2 bg-white space-y-1 flex flex-col">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${item.current
                    ? 'bg-emerald-100 text-emerald-900'
                    : 'text-gray-600 hover:bg-emerald-50 hover:text-emerald-900'
                    }`}
                >
                  {item.customIcon ? (
                    <span className={`mr-3 flex-shrink-0 ${item.current ? 'text-emerald-500' : 'text-gray-400 group-hover:text-emerald-500'}`}>
                      {item.customIcon()}
                    </span>
                  ) : (
                    <item.icon
                      className={`mr-3 flex-shrink-0 h-6 w-6 ${item.current ? 'text-emerald-500' : 'text-gray-400 group-hover:text-emerald-500'}`}
                      aria-hidden="true"
                    />
                  )}
                  {item.name}
                </Link>
              ))}

              <div className="grow"></div>
              {/* Back to Site button for desktop sidebar */}
              <Link
                href="/"
                className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md text-white bg-gradient-to-r from-[#006B51] to-[#008B6A] hover:from-[#00604A] hover:to-[#007D5F] shadow-md transition-all duration-200 mt-4`} >
                <ArrowLeftIcon
                  className={`mr-3 flex-shrink-0 h-5 w-5 text-white`}
                  aria-hidden="true"
                />
                Back to Site
              </Link>
            </nav>
          </div>
          <div className="flex-shrink-0 flex flex-col border-t border-gray-200 p-2">
            <div className="flex-shrink-0 w-full group block mb-4">
              <div className="flex items-center">
                <div>
                  <UserCircleIcon className="inline-block h-9 w-9 rounded-full text-gray-500" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                    Admin User
                  </p>
                  <p className="text-xs font-medium text-gray-500 group-hover:text-gray-700">
                    View profile
                  </p>
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
        <div className="sticky top-0 z-10 flex-shrink-0 flex h-16 bg-gradient-to-r from-[#006B51] to-[#008B6A] shadow-md">
          <div className="flex-1 px-4 flex justify-between">
            <div className="flex-1 flex items-center">
              <h1 className="text-2xl font-semibold text-white">Admin Dashboard</h1>
            </div>
            <div className="ml-4 flex items-center md:ml-6 space-x-4">
              <Link
                href="/"
                className="hidden sm:flex items-center px-3 py-1 rounded-md bg-white/20 text-white text-sm hover:bg-white/30 transition-colors duration-200"
              >
                <ArrowLeftIcon className="h-4 w-4 mr-1" />
                Back to Site
              </Link>

              <button
                type="button"
                className="bg-white/10 p-2 rounded-full text-white hover:bg-white/20 focus:outline-none transition-colors duration-200"
              >
                <span className="sr-only">View notifications</span>
                <BellIcon className="h-5 w-5" aria-hidden="true" />
              </button>

              {/* Profile dropdown */}
              <div className="relative">
                <div>
                  <button
                    type="button"
                    className="flex items-center text-sm rounded-full focus:outline-none"
                    id="user-menu-button"
                  >
                    <span className="sr-only">Open user menu</span>
                    <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors duration-200">
                      <UserCircleIcon className="h-6 w-6" />
                    </div>
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