"use client";

const Copyright = () => {
  return (
    <div className="w-full bg-[#BC0000] text-white">
      <div className="container mx-auto px-3 py-3">
        <div className="flex flex-col lg:flex-row justify-between items-center">

          <p className="text-xs font-semibold mr-3 leading-relaxed">© Thai Bangla Store. All Rights Reserved.</p>

          {/* Quick Links */}
          <div className="text-xs font-semibold leading-relaxed text-center">
            <a href="#" className="hover:underline">🛒 Shop Now</a> |
            <a href="#" className="hover:underline"> 📦 View Product Categories</a> |
            <a href="#" className="hover:underline"> 📍Track Your Order</a>
          </div>

          {/* Copyright and Payment Methods */}
          <div className="flex flex-col lg:flex-row items-center mb-3 lg:mb-0">
            <div className="flex space-x-2 mt-2 lg:mt-0">
              <img src="/images/footer/payment-1.png" alt="Payment Method" className="h-3.5" />
              <img src="/images/footer/payment-2.png" alt="Payment Method" className="h-3.5" />
              <img src="/images/footer/payment-3.png" alt="Payment Method" className="h-3.5" />
              <img src="/images/footer/payment-4.png" alt="Payment Method" className="h-3.5" />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Copyright;