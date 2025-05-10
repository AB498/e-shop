'use client'
import React, { Suspense } from 'react';
import { usePathname } from 'next/navigation';
import SidebarClient from './SidebarClient';

// Fallback component to show while SidebarClient is loading
const SidebarFallback = () => {
  return (
    <>
      {/* fake div to make the sidebar occupy width */}
      <div className="transition-all duration-300 w-0 sm:w-[var(--sidebar-width)]"></div>
      <div className="w-0 sm:w-[var(--sidebar-width)] h-screen bg-white border-r border-[#E3E3E3] fixed left-0 overflow-y-auto transition-all duration-300 ease-in-out z-10">
        {/* Loading indicator */}
        <div className="px-2 sm:px-3 py-4 sm:py-6 flex items-center justify-center">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gray-200 animate-pulse"></div>
        </div>
      </div>
    </>
  );
};

// Wrapper component that adds Suspense boundary
const SidebarWrapper = ({ categories }) => {
  const pathname = usePathname();

  if (pathname.startsWith('/admin')) {
    return null;
  }

  return (
    <Suspense fallback={<SidebarFallback />}>
      <SidebarClient categories={categories} />
    </Suspense>
  );
};

export default SidebarWrapper;
