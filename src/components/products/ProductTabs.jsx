'use client';
import React from 'react';
import { useState } from 'react';

const ProductTabs = ({ description, sku, type }) => {
  const [activeTab, setActiveTab] = useState('description');

  // Default description if none provided
  const productDescription = description ||
    "This product has no description yet. Please check back later for more information.";

  // Sample specifications
  const specifications = [
    { label: "Type Of Packing", value: "Bottle" },
    { label: "Color", value: "Green, Pink, Powder Blue, Purple" },
    { label: "Quantity Per Case", value: "100ml" },
    { label: "Ethyl Alcohol", value: "70%" },
    { label: "Piece In One", value: "Carton" },
    { label: "SKU", value: sku || "N/A" },
    { label: "Type", value: type || "N/A" },
  ];

  // Sample reviews
  const reviews = [
    { id: 1, author: "Sarah Johnson", rating: 5, date: "June 15, 2023", comment: "This product is amazing! I've been using it for a month and my skin has never looked better." },
    { id: 2, author: "Michael Chen", rating: 4, date: "May 22, 2023", comment: "Good product, but a bit pricey. I like the results though." },
    { id: 3, author: "Emma Wilson", rating: 5, date: "April 10, 2023", comment: "Absolutely love this! Will definitely purchase again." },
  ];

  return (
    <div className="bg-white rounded-md p-3 sm:p-4 shadow-sm mb-3 sm:mb-4 border border-[#DEDEDE]">
      {/* Tab Navigation */}
      <div className="flex flex-wrap gap-2 mb-4 sm:mb-5">
        <button
          onClick={() => setActiveTab('description')}
          className={`py-1.5 sm:py-2 px-3 sm:px-4 rounded-full bg-white font-semibold text-sm sm:text-base border border-[#ECECEC] transition-all ${
            activeTab === 'description'
              ? 'text-[#3BB77E] shadow-sm'
              : 'text-[#7E7E7E] hover:bg-[#F9F9F9]'
          }`}
        >
          Description
        </button>
        <button
          onClick={() => setActiveTab('additional')}
          className={`py-1.5 sm:py-2 px-3 sm:px-4 rounded-full bg-white font-semibold text-sm sm:text-base border border-[#ECECEC] transition-all ${
            activeTab === 'additional'
              ? 'text-[#3BB77E] shadow-sm'
              : 'text-[#7E7E7E] hover:bg-[#F9F9F9]'
          }`}
        >
          Additional info
        </button>
        <button
          onClick={() => setActiveTab('vendor')}
          className={`py-1.5 sm:py-2 px-3 sm:px-4 rounded-full bg-white font-semibold text-sm sm:text-base border border-[#ECECEC] transition-all ${
            activeTab === 'vendor'
              ? 'text-[#3BB77E] shadow-sm'
              : 'text-[#7E7E7E] hover:bg-[#F9F9F9]'
          }`}
        >
          Vendor
        </button>
        <button
          onClick={() => setActiveTab('reviews')}
          className={`py-1.5 sm:py-2 px-3 sm:px-4 rounded-full bg-white font-semibold text-sm sm:text-base border border-[#ECECEC] transition-all ${
            activeTab === 'reviews'
              ? 'text-[#3BB77E] shadow-sm'
              : 'text-[#7E7E7E] hover:bg-[#F9F9F9]'
          }`}
        >
          Reviews ({reviews.length})
        </button>
      </div>

      {/* Description Tab */}
      {activeTab === 'description' && (
        <div className="text-[#7E7E7E]">
          <p className="text-sm mb-2 sm:mb-3">
            {productDescription}
          </p>

          {/* Product Specifications */}
          <div className="mb-3 sm:mb-4">
            {specifications.map((spec, index) => (
              <div key={index} className="flex mb-1.5">
                <span className="text-[#7E7E7E] text-xs sm:text-sm font-normal w-1/3">{spec.label}</span>
                <span className="text-[#7E7E7E] text-xs sm:text-sm font-normal bg-[#9B9B9B] bg-opacity-10 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded">{spec.value}</span>
              </div>
            ))}
          </div>

          <div className="border-t border-[#7E7E7E] border-opacity-25 pt-3 sm:pt-4 mb-3 sm:mb-4">
            <h3 className="text-[#253D4E] text-lg sm:text-xl font-semibold mb-2 sm:mb-3">Packaging & Delivery</h3>
            <p className="text-xs sm:text-sm mb-2 sm:mb-3">
              Less lion goodness that euphemistically robin expeditiously bluebird smugly scratched far while thus cackled sheepishly rigid after due one assenting regarding censorious while occasional or this more crane went more as this less much amid overhung anathematic because much held one exuberantly sheep goodness so where rat wry well concomitantly.
            </p>

            <h3 className="text-[#253D4E] text-lg sm:text-xl font-semibold mb-2 sm:mb-3">Suggested Use</h3>
            <ul className="list-disc pl-4 sm:pl-5 mb-3 sm:mb-4">
              <li className="text-[#7E7E7E] text-xs sm:text-sm mb-1">Refrigeration not necessary.</li>
              <li className="text-[#7E7E7E] text-xs sm:text-sm mb-1">Stir before serving</li>
            </ul>

            <h3 className="text-[#253D4E] text-lg sm:text-xl font-semibold mb-2 sm:mb-3">Other Ingredients</h3>
            <ul className="list-disc pl-4 sm:pl-5 mb-3 sm:mb-4">
              <li className="text-[#7E7E7E] text-xs sm:text-sm mb-1">Organic raw pecans, organic raw cashews.</li>
              <li className="text-[#7E7E7E] text-xs sm:text-sm mb-1">This butter was produced using a LTG (Low Temperature Grinding) process</li>
              <li className="text-[#7E7E7E] text-xs sm:text-sm mb-1">Made in machinery that processes tree nuts but does not process peanuts, gluten, dairy or soy</li>
            </ul>

            <h3 className="text-[#253D4E] text-lg sm:text-xl font-semibold mb-2 sm:mb-3">Warnings</h3>
            <ul className="list-disc pl-4 sm:pl-5">
              <li className="text-[#7E7E7E] text-xs sm:text-sm">Oil separation occurs naturally. May contain pieces of shell.</li>
            </ul>
          </div>
        </div>
      )}

      {/* Additional Info Tab */}
      {activeTab === 'additional' && (
        <div className="text-[#7E7E7E]">
          <h3 className="text-[#253D4E] text-lg sm:text-xl font-semibold mb-2 sm:mb-3">Additional Information</h3>
          <div className="mb-3 sm:mb-4">
            {specifications.map((spec, index) => (
              <div key={index} className="flex mb-1.5 border-b border-[#ECECEC] pb-1.5">
                <span className="text-[#7E7E7E] text-xs sm:text-sm font-semibold w-1/3">{spec.label}</span>
                <span className="text-[#7E7E7E] text-xs sm:text-sm">{spec.value}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Vendor Tab */}
      {activeTab === 'vendor' && (
        <div className="text-[#7E7E7E]">
          <h3 className="text-[#253D4E] text-lg sm:text-xl font-semibold mb-2 sm:mb-3">Vendor Information</h3>
          <div className="mb-3 sm:mb-4">
            <div className="flex mb-1.5 border-b border-[#ECECEC] pb-1.5">
              <span className="text-[#7E7E7E] text-xs sm:text-sm font-semibold w-1/3">Vendor</span>
              <span className="text-[#7E7E7E] text-xs sm:text-sm">Thai Beauty Products Co.</span>
            </div>
            <div className="flex mb-1.5 border-b border-[#ECECEC] pb-1.5">
              <span className="text-[#7E7E7E] text-xs sm:text-sm font-semibold w-1/3">Store Name</span>
              <span className="text-[#7E7E7E] text-xs sm:text-sm">Thai Beauty Official Store</span>
            </div>
            <div className="flex mb-1.5 border-b border-[#ECECEC] pb-1.5">
              <span className="text-[#7E7E7E] text-xs sm:text-sm font-semibold w-1/3">Address</span>
              <span className="text-[#7E7E7E] text-xs sm:text-sm">123 Beauty Street, Bangkok, Thailand</span>
            </div>
            <div className="flex mb-1.5 border-b border-[#ECECEC] pb-1.5">
              <span className="text-[#7E7E7E] text-xs sm:text-sm font-semibold w-1/3">Vendor Rating</span>
              <span className="text-[#7E7E7E] text-xs sm:text-sm">4.8/5 (256 ratings)</span>
            </div>
          </div>
        </div>
      )}

      {/* Reviews Tab */}
      {activeTab === 'reviews' && (
        <div className="text-[#7E7E7E]">
          <h3 className="text-[#253D4E] text-lg sm:text-xl font-semibold mb-2 sm:mb-3">Customer Reviews</h3>
          <div className="mb-3 sm:mb-4">
            {reviews.map((review) => (
              <div key={review.id} className="mb-3 border-b border-[#ECECEC] pb-2 sm:pb-3">
                <div className="flex justify-between mb-1">
                  <span className="text-[#253D4E] text-xs sm:text-sm font-semibold">{review.author}</span>
                  <span className="text-[#B6B6B6] text-[10px] sm:text-xs">{review.date}</span>
                </div>
                <div className="flex mb-1">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill={i < review.rating ? "#FDC040" : "none"}
                      stroke="#FDC040"
                      className="mr-0.5"
                    >
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  ))}
                </div>
                <p className="text-[#7E7E7E] text-xs sm:text-sm">{review.comment}</p>
              </div>
            ))}
          </div>

          <div className="bg-[#F9F9F9] p-3 sm:p-4 rounded-md">
            <h4 className="text-[#253D4E] text-sm sm:text-base font-semibold mb-2 sm:mb-3">Add a review</h4>
            <p className="text-[#7E7E7E] text-xs sm:text-sm mb-2 sm:mb-3">Your email address will not be published. Required fields are marked *</p>

            <div className="flex items-center mb-2 sm:mb-3">
              <span className="text-[#7E7E7E] text-xs sm:text-sm mr-1.5">Your rating *</span>
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#FDC040"
                    className="mr-0.5 cursor-pointer hover:fill-[#FDC040]"
                  >
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                ))}
              </div>
            </div>

            <div className="mb-2 sm:mb-3">
              <label className="block text-[#7E7E7E] text-xs sm:text-sm mb-1">Your review *</label>
              <textarea
                className="w-full border border-[#ECECEC] rounded text-xs sm:text-sm p-2 focus:outline-none focus:border-[#3BB77E]"
                rows="3"
              ></textarea>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-3 mb-2 sm:mb-3">
              <div>
                <label className="block text-[#7E7E7E] text-xs sm:text-sm mb-1">Name *</label>
                <input
                  type="text"
                  className="w-full border border-[#ECECEC] rounded text-xs sm:text-sm p-1.5 sm:p-2 focus:outline-none focus:border-[#3BB77E]"
                />
              </div>
              <div>
                <label className="block text-[#7E7E7E] text-xs sm:text-sm mb-1">Email *</label>
                <input
                  type="email"
                  className="w-full border border-[#ECECEC] rounded text-xs sm:text-sm p-1.5 sm:p-2 focus:outline-none focus:border-[#3BB77E]"
                />
              </div>
            </div>

            <button className="bg-[#3BB77E] text-white text-xs sm:text-sm font-semibold py-1.5 sm:py-2 px-3 sm:px-4 rounded-full hover:bg-[#2A9D6E] transition-colors">
              Submit Review
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductTabs;
