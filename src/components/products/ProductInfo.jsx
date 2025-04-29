import React from 'react';
import Image from 'next/image';

const ProductInfo = () => {
  return (
    <div className="w-full md:w-1/2 lg:w-3/5 pl-0 md:pl-8">
      <h1 className="text-[#253D4E] text-4xl font-bold mb-4">
        Some By Mi Snail Truecica Miracle Repair Serum
      </h1>
      
      <div className="flex items-center gap-2 mb-4">
        <div className="flex">
          <Image src="/images/star-rating.png" alt="Rating" width={100} height={20} className="object-contain" />
        </div>
        <span className="text-[#B6B6B6] text-sm">(32 reviews)</span>
      </div>
      
      <div className="flex items-center gap-3 mb-6">
        <span className="text-[#3BB77E] text-6xl font-bold">$38</span>
        <div className="flex flex-col">
          <span className="text-[#FDC040] text-xs font-semibold">26% Off</span>
          <span className="text-[#B6B6B6] text-3xl font-bold line-through">$52</span>
        </div>
      </div>
      
      <p className="text-[#7E7E7E] text-lg mb-6">
        Lorem ipsum dolor, sit amet consectetur adipisicing elit. Aliquam rem officia, corrupti reiciendis minima nisi modi, quasi, odio minus dolore impedit fuga eum eligendi.
      </p>
      
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-[#7E7E7E] font-semibold">Size / Weight:</span>
          <div className="flex gap-2">
            <button className="border border-[#ECECEC] rounded-md px-4 py-2 text-[#7E7E7E]">50g</button>
            <button className="bg-[#3BB77E] text-white rounded-md px-4 py-2">60g</button>
            <button className="border border-[#ECECEC] rounded-md px-4 py-2 text-[#7E7E7E]">80g</button>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-y-2 mb-6">
          <div className="w-full sm:w-1/2 flex items-center gap-2">
            <span className="text-[#7E7E7E] text-sm">Type: Thai Brand</span>
          </div>
          <div className="w-full sm:w-1/2 flex items-center gap-2">
            <span className="text-[#7E7E7E] text-sm">MFG: Apr 4.2025</span>
          </div>
          <div className="w-full sm:w-1/2 flex items-center gap-2">
            <span className="text-[#7E7E7E] text-sm">LIFE: 70 days</span>
          </div>
          <div className="w-full sm:w-1/2 flex items-center gap-2">
            <span className="text-[#7E7E7E] text-sm">SKU: FWM15VKT</span>
          </div>
          <div className="w-full flex items-center gap-2">
            <span className="text-[#7E7E7E] text-sm">Tags: Beauty, Thai Brand, Skin Care</span>
          </div>
          <div className="w-full flex items-center gap-2">
            <span className="text-[#7E7E7E] text-sm">Stock:</span>
            <span className="text-[#3BB77E] text-sm">8 Items In Stock</span>
          </div>
        </div>
        
        {/* Quantity and Add to Cart */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex items-center border border-[#3BB77E] rounded-[40px] w-32">
            <button className="px-3 py-2 text-[#7E7E7E] text-xl">-</button>
            <input 
              type="text" 
              value="1" 
              className="w-10 text-center border-none focus:outline-none text-[#253D4E]"
              readOnly
            />
            <button className="px-3 py-2 text-[#7E7E7E] text-xl">+</button>
          </div>
          
          <button className="bg-[#3BB77E] text-white font-bold py-3 px-6 rounded-[40px] flex items-center justify-center">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-2">
              <path d="M9 22C9.55228 22 10 21.5523 10 21C10 20.4477 9.55228 20 9 20C8.44772 20 8 20.4477 8 21C8 21.5523 8.44772 22 9 22Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M20 22C20.5523 22 21 21.5523 21 21C21 20.4477 20.5523 20 20 20C19.4477 20 19 20.4477 19 21C19 21.5523 19.4477 22 20 22Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M1 1H5L7.68 14.39C7.77144 14.8504 8.02191 15.264 8.38755 15.5583C8.75318 15.8526 9.2107 16.009 9.68 16H19.4C19.8693 16.009 20.3268 15.8526 20.6925 15.5583C21.0581 15.264 21.3086 14.8504 21.4 14.39L23 6H6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Add to cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductInfo;
