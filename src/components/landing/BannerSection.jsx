"use client";

const BannerSection = () => {
  return (
    <section className="container mx-auto py-6 md:py-8 grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mt-6 md:mt-10">
      {/* Promo Banner */}
      <div className="relative h-[200px] sm:h-[250px] md:h-[300px] rounded-lg overflow-hidden bg-emerald-300">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/images/banner-background.png')" }}
        />
        <div className="absolute inset-0 flex flex-col justify-center p-4 md:p-8">
          <img
            src="/images/banners/gluta-product.png"
            alt="Sanil Gluta Product"
            className="absolute right-[-20px] sm:right-0 bottom-0 h-[100%] sm:h-[110%] md:h-[120%] object-contain z-10"
          />
          <div className="max-w-[70%] sm:max-w-[60%] z-20">
            <h3 className="text-white text-xl sm:text-2xl md:text-3xl font-semibold leading-tight mb-2 md:mb-4">
              Buy Sanil Gluta &<br />
              Save Up to 25% With<br />
              Promo Code
            </h3>
            <span className="text-white text-base sm:text-lg font-semibold">
              THAIB25
            </span>
          </div>
        </div>
      </div>

      {/* Free Delivery Banner */}
      <div className="relative h-[200px] sm:h-[250px] md:h-[300px] rounded-lg overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/images/banners/delivery-bg.png')" }}
        />
        <div className="absolute inset-0 flex flex-col justify-center p-4 md:p-8">
          <div className="max-w-[90%] sm:max-w-[80%]">
            <h3 className="text-white text-xl sm:text-2xl md:text-3xl font-semibold leading-tight mb-2 md:mb-4">
              Free Delivery To<br />
              Your Door
            </h3>
            <p className="text-white text-sm sm:text-base md:text-lg font-semibold mb-3 md:mb-6 leading-relaxed">
              Collect a basket worth more than ৳1500 and<br className="hidden sm:block" />
              get free delivery to your door.
            </p>
            <button className="bg-[#CB1111] text-white px-4 sm:px-6 md:px-8 py-1.5 md:py-2 rounded-full font-semibold hover:bg-[#a80e0e] transition-colors text-sm sm:text-base">
              SHOP NOW
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BannerSection;