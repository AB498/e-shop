'use client'

import { useEffect, useState } from 'react';

const Hero = () => {

    return (
        <div className="rounded-2xl mt-0 sm:mt-10 relative">
            {/* Desktop Banner */}
            <div className="relative hidden sm:flex">
                <img
                    src="/images/hero/bg.png"
                    alt="Thai Bangla Background"
                    className="w-full h-full object-contain opacity-90"
                />
                <div className="absolute top-1/2 w-1/2 left-[5%] flex flex-col h-1/2 pt-2 break-words">
                    {/* Subtitle with shape */}
                    <div className="flex items-center mb-2 max-w-[480px]">
                        <img
                            src="/images/hero/shape2.png"
                            alt=""
                            className="w-5 h-5 mr-3 object-contain"
                        />
                        <p className="text-[12px] text-white font-normal">
                            Your Trusted Source for Thai & Bangladeshi Groceries
                        </p>
                    </div>

                    {/* Search Box */}
                    <div className="relative max-w-1/2 mb-2">
                        <div className="w-[300px] h-[28px] rounded-[28px] bg-white/40 border border-[#BABABA] flex items-center px-3">
                            <input
                                type="text"
                                placeholder="Search for products (e.g. eggs, milk, potato)"
                                className="w-full bg-transparent border-none outline-none text-[11px] text-white placeholder-white"
                            />
                            <img
                                src="/images/hero/search-icon.png"
                                alt="Search"
                                className="w-3.5 h-3.5 ml-2"
                            />
                        </div>
                    </div>

                    {/* Description text */}
                    <p className="text-[11px] font-normal text-white max-w-[520px] tracking-wide">
                        From Bangkok to Dhaka — premium Thai imports and everyday Bangladeshi<br />
                        essentials delivered to your doorstep.
                    </p>
                </div>
            </div>

            {/* Mobile Banner */}
            <div className="flex flex-col sm:hidden">
                {/* Banner Image Container */}
                <div className="p-4 w-full relative overflow-hidden bg-[url('/banner-bg.png')] bg-cover bg-center">
                    {/* Background Image */}
                    <img
                        src="/banner-subject.png"
                        alt="Thai Bangla Mobile Background"
                        className="w-full object-cover"
                    />
                </div>

                {/* Content Section Below Image */}
                <div className="text-center bg-[url('/banner-bg.png')] p-4 bg-cover bg-center">
                    {/* Subtitle */}
                    <p className="text-[14px] text-white font-medium mb-3">
                        Your Trusted Source for Thai & Bangladeshi Groceries
                    </p>

                    {/* Search Box */}
                    <div className="relative mb-3">
                        <div className="w-full h-[30px] rounded-[30px] bg-white/40 border border-[#BABABA] flex items-center px-3">
                            <input
                                type="text"
                                placeholder="Search products..."
                                className="w-full bg-transparent border-none outline-none text-[12px] text-white placeholder-white"
                            />
                            <img
                                src="/images/hero/search-icon.png"
                                alt="Search"
                                className="w-4 h-4 ml-2"
                            />
                        </div>
                    </div>

                    {/* Description text */}
                    <p className="text-[12px] font-normal text-white tracking-wide">
                        From Bangkok to Dhaka — premium Thai imports and everyday Bangladeshi essentials delivered to your doorstep.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Hero;