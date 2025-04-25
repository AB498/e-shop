'use client'
import React from 'react';
import Image from 'next/image';

const Topbar = () => {
  return (
    <div className="w-full bg-[#FAF8F5] border-b border-[#E3E3E3] py-1.5">
      <div className="w-full px-4 flex flex-col md:flex-row justify-between items-center">
        {/* Left section with About Us, Contact Us, Delivery */}
        <div className="text-[#006B51] text-sm font-['Open_Sans'] hidden md:block">
          <span className="px-2">About Us</span>
          <span className="px-2">|</span>
          <span className="px-2">Contact Us</span>
          <span className="px-2">|</span>
          <span className="px-2">Delivery</span>
        </div>
        
        {/* Right section with Location, Language, Phone, Wishlist, Login/Registration */}
        <div className="flex items-center space-x-5 flex-wrap justify-center">
          {/* Location */}
          <div className="flex items-center space-x-1 cursor-pointer">
            <div className="relative w-4 h-4">
              <Image
                src="/images/topbar/map-marker.png"
                alt="Location"
                fill
                className="object-contain"
              />
            </div>
            <span className="text-[#616161] text-sm font-['Open_Sans']">Dhaka</span>
            <div className="relative w-3 h-3 ml-1">
              <Image
                src="/images/topbar/chevron-down.png"
                alt="Dropdown"
                fill
                className="object-contain"
              />
            </div>
          </div>
          
          {/* Separator */}
          <div className="h-4 w-px bg-[#D5D5D5] hidden md:block"></div>
          
          {/* Language */}
          <div className="flex items-center space-x-1 cursor-pointer">
            <div className="relative w-4 h-4">
              <Image
                src="/images/topbar/language.png"
                alt="Language"
                fill
                className="object-contain"
              />
            </div>
            <span className="text-[#616161] text-sm font-['Open_Sans'] ml-1">EN|BN</span>
          </div>
          
          {/* Separator */}
          <div className="h-4 w-px bg-[#D5D5D5] hidden md:block"></div>
          
          {/* Phone */}
          <div className="flex items-center space-x-1">
            <div className="relative w-4 h-4">
              <Image
                src="/images/topbar/phone.png"
                alt="Phone"
                fill
                className="object-contain"
              />
            </div>
            <span className="text-[#616161] text-sm font-['Open_Sans'] ml-1">+880 1407-016740</span>
          </div>
          
          {/* Separator */}
          <div className="h-4 w-px bg-[#D5D5D5] hidden md:block"></div>
          
          {/* Wishlist */}
          <div className="flex items-center space-x-1 cursor-pointer">
            <div className="relative w-4 h-4">
              <Image
                src="/images/topbar/wishlist.png"
                alt="Wishlist"
                fill
                className="object-contain"
              />
            </div>
            <span className="text-[#616161] text-sm font-['Open_Sans'] ml-1">Wishlist</span>
          </div>
          
          {/* Separator */}
          <div className="h-4 w-px bg-[#D5D5D5] hidden md:block"></div>
          
          {/* Login/Registration */}
          <div className="flex items-center space-x-1 cursor-pointer">
            <div className="relative w-4 h-4">
              <Image
                src="/images/topbar/user.png"
                alt="User"
                fill
                className="object-contain"
              />
            </div>
            <span className="text-[#616161] text-sm font-['Open_Sans'] ml-1">Login/Registration</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Topbar; 