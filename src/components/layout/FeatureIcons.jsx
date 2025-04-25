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
    <div className="w-full bg-white py-10">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-6 justify-items-center">
          {features.map((feature) => (
            <div key={feature.id} className="flex flex-col items-center max-w-[160px]">
              <div className="w-[80px] h-[80px] rounded-full bg-[#E0DCD6] flex items-center justify-center mb-3 shadow-sm">
                <img 
                  src={feature.icon} 
                  alt={feature.text.replace('\n', ' ')} 
                  className="w-9 h-9 object-contain"
                />
              </div>
              <p className="text-center font-semibold text-[19px] leading-[1.36]" style={{ whiteSpace: 'pre-line' }}>
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