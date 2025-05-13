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
    <div className="w-full py-0 sm:py-6 md:py-8 my-4 sm:my-6 md:my-8">
      <div className="container mx-auto px-0 sm:px-3">
        <div
          className="flex overflow-x-auto gap-3 sm:gap-4 md:gap-6 lg:justify-between"
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
              className="flex flex-col items-center justify-center flex-shrink-0 px-2 first:pl-3 last:pr-3 sm:px-0 sm:flex-shrink"
              style={{ width: 'calc(100% / 3.5)', minWidth: '90px', maxWidth: '140px' }}
            >
              <div className="w-[50px] h-[50px] sm:w-[60px] sm:h-[60px] md:w-[70px] md:h-[70px] rounded-full bg-[#E0DCD6] flex items-center justify-center mb-1.5 sm:mb-2 shadow-sm">
                <img
                  src={feature.icon}
                  alt={feature.text.replace('\n', ' ')}
                  className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 object-contain"
                />
              </div>
              <p
                className="text-center font-semibold text-sm sm:text-[14px] md:text-[16px] leading-[1.2] sm:leading-[1.3]"
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