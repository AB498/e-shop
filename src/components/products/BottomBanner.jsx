import React from 'react';

const BottomBanner = () => {
  return (
    <div className="container mx-auto px-3 py-3 sm:py-4 mb-5 sm:mb-6">
      <div className="bg-[url('/images/banner-background.png')] bg-cover bg-center rounded-lg p-3 sm:p-4 md:p-5 relative overflow-hidden">
        {/* Content wrapper with responsive width */}
        <div className="relative z-10 w-full md:max-w-md">
          <h2 className="text-[#253D4E] text-lg sm:text-xl md:text-2xl font-semibold leading-tight mb-1 sm:mb-2">
            Stay home & get your daily
            <span className="hidden sm:inline"><br /></span> needs from our shop
          </h2>
          <p className="text-[#7E7E7E] text-xs sm:text-sm mb-2 sm:mb-3 md:mb-4">Start Your Daily Shopping with Nest Mart</p>

          {/* Responsive subscription form */}
          <div className="flex flex-col sm:flex-row sm:w-auto w-1/2">
            <input
              type="email"
              placeholder="Your email address"
              className="bg-white rounded-full sm:rounded-l-full sm:rounded-r-none py-2 sm:py-2.5 px-3 sm:px-4 w-full text-[#838383] text-xs mb-1.5 sm:mb-0"
            />
            <button className="bg-[#3BB77E] text-white font-medium py-2 sm:py-2.5 px-4 sm:px-5 rounded-full sm:-ml-4 tracking-wide text-xs">
              Subscribe
            </button>
          </div>
        </div>

        {/* Banner Image - responsive positioning and sizing */}
        <div className="absolute right-0 bottom-0 h-[50%] sm:h-[60%] md:h-[80%] w-1/2 flex items-end justify-end">
          <img
            src="/images/banner-image.png"
            alt="Banner"
            className="object-contain h-full max-h-[120px] sm:max-h-[160px] md:max-h-[200px]"
          />
        </div>
      </div>
    </div>
  );
};

export default BottomBanner;
