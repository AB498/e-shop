"use client";

import ResponsiveText from '@/components/ui/ResponsiveText';

const BannerSection = () => {
  return (
    <section className="container mx-auto py-3 sm:py-4 grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-3 mt-3 sm:mt-4">
      {/* Promo Banner */}
      <div className="relative h-[150px] sm:h-[180px] md:h-[200px] rounded-md overflow-visible bg-emerald-300">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/images/banner-background.png')" }}
        />
        <div className="absolute inset-0 flex flex-col justify-center p-3 sm:p-4">
          <img
            src="/images/banners/gluta-product.png"
            alt="Sanil Gluta Product"
            className="absolute right-0 bottom-0 w-1/2 h-[100%] h-[105%] sm:h-[110%] object-contain z-10"
          />
          <div className="max-w-[70%] sm:max-w-[60%] z-20">
            <ResponsiveText
              as="h3"
              size="lg"
              className="text-white font-medium leading-tight mb-1 sm:mb-2"
            >
              Buy Sanil Gluta &<br />
              Save Up to 25% With<br />
              Promo Code
            </ResponsiveText>
            <ResponsiveText
              as="span"
              size="sm"
              className="text-white font-semibold"
            >
              THAIB25
            </ResponsiveText>
          </div>
        </div>
      </div>

      {/* Free Delivery Banner */}
      <div className="relative h-[150px] sm:h-[180px] md:h-[200px] rounded-md overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-right"
          style={{ backgroundImage: "url('/images/banners/delivery-bg.png')" }}
        />
        <div className="absolute inset-0 flex flex-col justify-center p-3 sm:p-4">
          <div className="max-w-[90%] sm:max-w-[80%]">
            <ResponsiveText
              as="h3"
              size="lg"
              className="text-white font-medium leading-tight mb-1 sm:mb-2"
            >
              Free Delivery To<br />
              Your Door
            </ResponsiveText>
            <ResponsiveText
              as="p"
              size="sm"
              className="text-white font-normal mb-2 sm:mb-3 leading-relaxed"
            >
              Collect a basket worth more than ৳1500 and<br className="hidden sm:block" />
              get free delivery to your door.
            </ResponsiveText>
            <button className="bg-[#CB1111] text-white px-2 sm:px-3 py-1 rounded-full font-medium hover:bg-[#a80e0e] transition-colors text-responsive-xs">
              SHOP NOW
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BannerSection;