'use client'
import React from 'react';
import Image from 'next/image';

const Topbar = () => {
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
          <div className="flex items-center space-x-2">
            <Image src="/images/topbar/wishlist.png" alt="Wishlist" width={16} height={16} />
            <span className="text-[#616161] text-sm">Wishlist</span>
          </div>
          <div className="w-px h-4 bg-[#D5D5D5]"></div>
          <div className="flex items-center space-x-2">
            <Image src="/images/topbar/user.png" alt="User" width={16} height={16} />
            <span className="text-[#616161] text-sm">Login/Registration</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Topbar; 