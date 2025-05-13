'use client';

import React from 'react';
import Link from 'next/link';
import ResponsiveContainer from '@/components/ui/ResponsiveContainer';

const AboutHeader = () => {
  return (
    <div className="px-4 sm:px-8 md:px-10 lg:px-12 w-full bg-[url('/images/breadcrumb/breadcrumb-bg.png')] bg-cover bg-center py-8 md:py-10 lg:py-12 rounded-[20px]">
      <ResponsiveContainer>
        <h1 className="text-3xl md:text-4xl lg:text-[42px] font-bold text-[#253D4E] mb-4">About</h1>
        <div className="flex items-center">
          <Link href="/" className="text-[#3BB77E] font-semibold text-xs sm:text-sm md:text-[14px] uppercase flex items-center">
            Home
          </Link>
          <svg xmlns="http://www.w3.org/2000/svg" width="6" height="10" viewBox="0 0 6 10" fill="none" className="mx-2">
            <path d="M1 9L5 5L1 1" stroke="#7E7E7E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span className="text-[#7E7E7E] font-semibold text-xs sm:text-sm md:text-[14px] uppercase">About</span>
        </div>
      </ResponsiveContainer>
    </div>
  );
};

export default AboutHeader;
