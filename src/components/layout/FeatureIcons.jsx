"use client";

const FeatureIcons = () => {
  // Feature data array with line breaks for text formatting
  const features = [
    {
      id: 1,
      icon: "/images/topbar/icon-best-prices.png",
      text: "Best prices\n& offers"
    },
    {
      id: 2,
      icon: "/images/topbar/icon-free-delivery.png",
      text: "Free\ndelivery"
    },
    {
      id: 3,
      icon: "/images/topbar/icon-daily-deal.png",
      text: "Great daily\ndeal"
    },
    {
      id: 4,
      icon: "/images/topbar/icon-easy-returns.png",
      text: "Easy\nreturns"
    },
    {
      id: 5,
      icon: "/images/topbar/icon-products.png",
      text: "+15000 products to\nshop from"
    },
    {
      id: 6,
      icon: "/images/topbar/icon-pay-after.png",
      text: "Pay after receiving\nproducts"
    },
    {
      id: 7,
      icon: "/images/topbar/icon-save-money.png",
      text: "Get offers that\nSave Money"
    }
  ];

  return (
    <div className="w-full py-4 sm:py-8 md:py-10 my-6 sm:my-8 md:my-10">
      <div className="container mx-auto px-0 sm:px-4">
        <div
          className="flex overflow-x-auto gap-4 sm:gap-6 md:gap-8 lg:justify-between"
          style={{
            msOverflowStyle: 'none',  /* IE and Edge */
            scrollbarWidth: 'none',   /* Firefox */
          }}
        >
          {/* Hide scrollbar for Chrome, Safari and Opera */}
          <style jsx>{`
            div::-webkit-scrollbar {
              display: none;
            }
          `}</style>

          {features.map((feature) => (
            <div
              key={feature.id}
              className="flex flex-col items-center justify-center flex-shrink-0 px-3 first:pl-4 last:pr-4 sm:px-0 sm:flex-shrink"
              style={{ width: 'calc(100% / 3.5)', minWidth: '100px', maxWidth: '160px' }}
            >
              <div className="w-[60px] h-[60px] sm:w-[70px] sm:h-[70px] md:w-[80px] md:h-[80px] rounded-full bg-[#E0DCD6] flex items-center justify-center mb-2 sm:mb-3 shadow-sm">
                <img
                  src={feature.icon}
                  alt={feature.text.replace('\n', ' ')}
                  className="w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 object-contain"
                />
              </div>
              <p
                className="text-center font-semibold text-md sm:text-[16px] md:text-[18px] leading-[1.3] sm:leading-[1.36]"
                style={{ whiteSpace: 'pre-line' }}
              >
                {feature.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeatureIcons;