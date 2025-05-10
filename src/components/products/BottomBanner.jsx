import React from 'react';
import Image from 'next/image';

const BottomBanner = () => {
  return (
    <div className="container mx-auto px-4 py-6 mb-10">
      <div className="bg-[url('/images/banner-background.png')] bg-cover bg-center rounded-[20px] p-4 sm:p-6 md:p-10 relative overflow-hidden">
        {/* Content wrapper with responsive width */}
        <div className="relative z-10 w-full md:max-w-lg">
          <h2 className="text-[#253D4E] text-2xl sm:text-3xl md:text-4xl font-bold leading-tight mb-2 md:mb-4">
            Stay home & get your daily
            <span className="hidden sm:inline"><br /></span> needs from our shop
          </h2>
          <p className="text-[#7E7E7E] text-sm sm:text-base md:text-lg mb-4 md:mb-8">Start Your Daily Shopping with Nest Mart</p>

          {/* Responsive subscription form */}
          <div className="flex flex-col sm:flex-row sm:w-auto w-1/2">
            <input
              type="email"
              placeholder="Your email address"
              className="bg-white rounded-full sm:rounded-l-full sm:rounded-r-none py-3 sm:py-4 px-4 sm:px-6 w-full text-[#838383] mb-2 sm:mb-0"
            />
            <button className="bg-[#3BB77E] text-white font-bold py-3 sm:py-4 px-6 sm:px-8 rounded-full sm:-ml-6 tracking-wider text-sm sm:text-base">
              Subscribe
            </button>
          </div>
        </div>

        {/* Banner Image - responsive positioning and sizing */}
        <div className="absolute right-0 bottom-0 h-[60%] sm:h-[70%] md:h-full w-1/2 flex items-end justify-end">
          <img
            src="/images/banner-image.png"
            alt="Banner"
            className="object-contain h-full max-h-[180px] sm:max-h-[220px] md:max-h-none"
          />
        </div>
      </div>
    </div>
  );
};

export default BottomBanner;
