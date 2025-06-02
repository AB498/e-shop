'use client'

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';

const Hero = () => {
    const searchParams = useSearchParams();
    const [searchTerm, setSearchTerm] = useState('');

    const handleSearch = (e) => {
        e.preventDefault();

        // Create new URLSearchParams object
        const params = new URLSearchParams(searchParams.toString());

        // Update or remove search parameter
        if (searchTerm.trim()) {
            params.set('search', searchTerm.trim());
        } else {
            params.delete('search');
        }

        // Reset to page 1 when searching
        params.set('page', '1');

        // Navigate to products page with search parameters
        const queryString = params.toString();

        // Use window.location for a full page refresh to ensure server components re-render
        window.location.href = `/products?${queryString}`;
    };

    return (
        <div className="relative z-0 w-full md:px-6 md:container md:mx-auto">
            <div className="rounded-2xl mt-0 md:mt-10 relative">
                {/* Desktop Banner */}
                <div className="relative hidden md:flex">
                    <img
                        src="/images/hero/bg.png"
                        alt="Thai Bangla Background"
                        className="w-full h-full object-contain opacity-90"
                    />
                    <div className="absolute top-1/2 w-1/2 pl-[5%] flex flex-col h-1/2 pt-2 break-words">
                        {/* Subtitle with shape */}
                        <div className="flex items-center mb-2 w-full">
                            <img
                                src="/images/hero/shape2.png"
                                alt=""
                                className="w-5 h-5 mr-3 object-contain"
                            />
                            <p className="text-[10px] md:text-[10px] lg:text-[16px] xl:text-[20px] text-white font-normal whitespace-nowrap">
                                Your Trusted Source for Thai & Bangladeshi Groceries
                            </p>
                        </div>

                        {/* Search Box */}
                        <div className="relative w-full mb-2 pr-[10%]">
                            <form onSubmit={handleSearch}>
                                <div className="w-full h-[16px] md:h-[20px] lg:h-[32px] rounded-[28px] bg-white/40 border border-[#BABABA] flex items-center px-3">
                                    <input
                                        type="text"
                                        placeholder="Search for products (e.g. eggs, milk, potato)"
                                        className="w-full bg-transparent border-none outline-none text-[10px] md:text-[10px] lg:text-[14px] text-white placeholder-white"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                    <button
                                        type="submit"
                                        className="cursor-pointer"
                                    >
                                        <img
                                            src="/images/hero/search-icon.png"
                                            alt="Search"
                                            className="w-3.5 h-3.5 ml-2"
                                        />
                                    </button>
                                </div>
                            </form>
                        </div>

                        {/* Description text */}
                        <p className="text-[8px] md:text-[8px] lg:text-[12px] xl:text-[14px] font-normal text-white max-w-[520px] tracking-wide">
                            From Bangkok to Dhaka — premium Thai imports and everyday Bangladeshi essentials delivered to your doorstep.
                        </p>
                    </div>
                </div>

                {/* Mobile Banner */}
                <div className="flex flex-col md:hidden">
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



                        {/* Description text */}
                        <p className="text-[12px] font-normal text-white tracking-wide">
                            From Bangkok to Dhaka — premium Thai imports and everyday Bangladeshi essentials delivered to your doorstep.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Hero;