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
    },
    {
      id: 8,
      icon: "/images/topbar/icon-daily-deal.png",
      text: "24/7 Customer\nSupport"
    }
  ];

  return (
    <div className="w-full py-0 sm:py-6 md:py-8 my-3 sm:my-6 md:my-8">
      <div className="container mx-auto px-2 sm:px-3">
        <div
          className="flex flex-wrap sm:flex-nowrap sm:overflow-x-auto justify-center sm:justify-between overflow-x-hidden gap-y-3 gap-x-1 sm:gap-4 md:gap-6 py-3"
        >
          {features.map((feature) => (
            <div
              key={feature.id}
              className="flex flex-col items-center justify-center"
              style={{
                width: 'calc(25% - 4px)',
                minWidth: '65px',
                maxWidth: '140px'
              }}
            >
              <div className="w-[40px] h-[40px] sm:w-[60px] sm:h-[60px] md:w-[70px] md:h-[70px] rounded-full bg-[#E0DCD6] flex items-center justify-center mb-1 sm:mb-2 shadow-sm">
                <img
                  src={feature.icon}
                  alt={feature.text.replace('\n', ' ')}
                  className="w-4 h-4 sm:w-7 sm:h-7 md:w-8 md:h-8 object-contain"
                />
              </div>
              <p
                className="text-center font-semibold text-[10px] sm:text-[12px] leading-[1.1] sm:leading-[1.3] h-[2.6em] sm:h-[4.0em] flex items-center justify-center"
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