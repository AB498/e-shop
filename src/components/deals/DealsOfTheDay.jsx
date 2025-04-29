import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

const DealsOfTheDay = () => {
  return (
    <div className="py-10">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-3">
          <h2 className="text-2xl font-semibold text-black">Deals Of The Day</h2>
          <Image
            src="/images/deals/discount-coupon-icon.png"
            alt="Discount"
            width={30}
            height={30}
            className="object-contain"
          />
        </div>
        <div className="flex items-center text-[#7E7E7E]">
          <Link href="/deals" className="flex items-center hover:text-[#006B51] transition-colors">
            <span className="text-base font-normal">All Deals</span>
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="ml-1"
            >
              <path
                d="M9 6L15 12L9 18"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Link>
        </div>
      </div>

      {/* Deals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Deal Card 1 */}
        <div className="bg-white rounded-[15px] overflow-hidden shadow-sm hover:shadow-md transition-shadow">
          {/* Product Image */}
          <div className="relative h-64">
            <Image
              src="/images/deals/product-deal-1.png"
              alt="Product"
              fill
              className="object-cover"
            />
          </div>

          {/* Product Details */}
          <div className="p-5 shadow-[5px_5px_15px_0px_rgba(0,0,0,0.05)] rounded-[10px] -mt-5 mx-4 bg-white relative">
            <h3 className="text-[#253D4E] text-base font-bold leading-tight mb-2 ">
              Product Name Goes To Here<br />
              Product Name 2nd Line
            </h3>

            <div className="flex items-center gap-2 mb-1">
              <div className="w-20 h-4">
                <Image
                  src="/images/star-rating.png"
                  alt="Rating"
                  width={80}
                  height={16}
                  className="object-contain"
                />
              </div>
              <span className="text-[#B6B6B6] text-sm ">(4.0)</span>
            </div>

            <div className="flex justify-between items-center mt-2">
              <span className="text-[#006B51] text-sm ">Beauty & Care</span>
              <button className="bg-[#006B51] text-white text-sm font-bold py-1 px-3 rounded-md flex items-center ">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="mr-1"
                >
                  <path
                    d="M12 5V19M5 12H19"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Add
              </button>
            </div>
          </div>
        </div>

        {/* Deal Card 2 */}
        <div className="bg-white rounded-[15px] overflow-hidden shadow-sm hover:shadow-md transition-shadow">
          {/* Product Image */}
          <div className="relative h-64">
            <Image
              src="/images/deals/product-deal-2.png"
              alt="Product"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0">
              <Image
                src="/images/deals/product-deal-2-overlay.png"
                alt="Product Overlay"
                fill
                className="object-cover"
              />
            </div>
          </div>

          {/* Product Details */}
          <div className="p-5 shadow-[5px_5px_15px_0px_rgba(0,0,0,0.05)] rounded-[10px] -mt-5 mx-4 bg-white relative">
            <h3 className="text-[#253D4E] text-base font-bold leading-tight mb-2 ">
              Product Name Goes To Here<br />
              Product Name 2nd Line
            </h3>

            <div className="flex items-center gap-2 mb-1">
              <div className="w-20 h-4">
                <Image
                  src="/images/star-rating.png"
                  alt="Rating"
                  width={80}
                  height={16}
                  className="object-contain"
                />
              </div>
              <span className="text-[#B6B6B6] text-sm ">(4.0)</span>
            </div>

            <div className="flex justify-between items-center mt-2">
              <span className="text-[#006B51] text-sm ">Beauty & Care</span>
              <button className="bg-[#006B51] text-white text-sm font-bold py-1 px-3 rounded-md flex items-center ">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="mr-1"
                >
                  <path
                    d="M12 5V19M5 12H19"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Add
              </button>
            </div>
          </div>
        </div>

        {/* Deal Card 3 */}
        <div className="bg-white rounded-[15px] overflow-hidden shadow-sm hover:shadow-md transition-shadow">
          {/* Product Image */}
          <div className="relative h-64">
            <Image
              src="/images/deals/product-deal-3.png"
              alt="Product"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0">
              <Image
                src="/images/deals/product-deal-3-overlay.png"
                alt="Product Overlay"
                fill
                className="object-cover"
              />
            </div>
          </div>

          {/* Product Details */}
          <div className="p-5 shadow-[5px_5px_15px_0px_rgba(0,0,0,0.05)] rounded-[10px] -mt-5 mx-4 bg-white relative">
            <h3 className="text-[#253D4E] text-base font-bold leading-tight mb-2 ">
              Product Name Goes To Here<br />
              Product Name 2nd Line
            </h3>

            <div className="flex items-center gap-2 mb-1">
              <div className="w-20 h-4">
                <Image
                  src="/images/star-rating.png"
                  alt="Rating"
                  width={80}
                  height={16}
                  className="object-contain"
                />
              </div>
              <span className="text-[#B6B6B6] text-sm ">(4.0)</span>
            </div>

            <div className="flex justify-between items-center mt-2">
              <div>
                <span className="text-[#006B51] text-sm  mr-2">Beauty & Care</span>
                <div className="mt-1">
                  <span className="text-[#006B51] font-bold text-lg ">৳920.85</span>
                  <span className="text-[#ADADAD] font-bold text-sm ml-2 line-through ">৳33.8</span>
                </div>
              </div>
              <button className="bg-[#006B51] text-white text-sm font-bold py-1 px-3 rounded-md flex items-center ">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="mr-1"
                >
                  <path
                    d="M12 5V19M5 12H19"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Add
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DealsOfTheDay;
