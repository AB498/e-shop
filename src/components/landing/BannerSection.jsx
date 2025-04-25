"use client";

const BannerSection = () => {
  return (
    <section className="container mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
      {/* Promo Banner */}
      <div className="relative h-[300px] rounded-lg overflow-visible">
        <div 
          className="absolute inset-0 bg-cover bg-center overflow-visible"
          style={{ backgroundImage: "url('/images/banners/promo-bg.png')" }}
        />
        <div className="absolute inset-0 flex flex-col justify-center p-8">
          <img 
            src="/images/banners/gluta-product.png" 
            alt="Sanil Gluta Product" 
            className="absolute right-0 bottom-0 h-[120%] object-contain"
          />
          <div className="max-w-[60%]">
            <h3 className="text-white text-3xl font-semibold leading-tight mb-4">
              Buy Sanil Gluta &<br />
              Save Up to 25% With<br />
              Promo Code
            </h3>
            <span className="text-white text-lg font-semibold">
              THAIB25
            </span>
          </div>
        </div>
      </div>

      {/* Free Delivery Banner */}
      <div className="relative h-[300px] rounded-lg overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/images/banners/delivery-bg.png')" }}
        />
        <div className="absolute inset-0 flex flex-col justify-center p-8">
          <div className="max-w-[80%]">
            <h3 className="text-white text-3xl font-semibold leading-tight mb-4">
              Free Delivery To<br />
              Your Door
            </h3>
            <p className="text-white text-lg font-semibold mb-6 leading-relaxed">
              Collect a basket worth more than ৳1500 and<br />
              get free delivery to your door.
            </p>
            <button className="bg-[#CB1111] text-white px-8 py-2 rounded-full font-semibold hover:bg-[#a80e0e] transition-colors">
              SHOP NOW
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BannerSection; 