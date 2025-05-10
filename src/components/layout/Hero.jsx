'use client'

const Hero = () => {
    return (
        <div className="rounded-2xl mt-10 relative">
            {/* Background Image - Full bleed */}
            <img
                src="/images/hero/bg.png"
                alt="Thai Bangla Background"
                className=" w-full h-full object-contain opacity-90"
            />
            <div className="absolute top-1/2 w-1/2 left-[5%] flex flex-col h-1/2 md:pt-3 break-words">
            {/* Subtitle with shape */}
                <div className="flex items-center md:mb-3 max-w-[520px]">
                    <img
                        src="/images/hero/shape2.png"
                        alt=""
                        className="w-2 h-2 mr-1 md:mr-4 object-contain"
                    />
                    <p className="text-[6px] text-white font-normal">
                        Your Trusted Source for Thai & Bangladeshi Groceries
                    </p>
                </div>

                {/* Search Box */}
                <div className="relative hidden md:block max-w-1/2 mb-3">
                    <div className="w-[340px] h-[30px] rounded-[30px] bg-white/40 border border-[#BABABA] flex items-center px-4">
                        <input
                            type="text"
                            placeholder="Search for products (e.g. eggs, milk, potato)"
                            className="w-full bg-transparent border-none outline-none text-[12px] text-white placeholder-white "
                        />
                        <img
                            src="/images/hero/search-icon.png"
                            alt="Search"
                            className="w-4   h-4   ml-3"
                        />
                    </div>
                </div>

                {/* Description text */}
                <p className="text-[4px]  font-normal text-white max-w-[560px] tracking-wide">
                    From Bangkok to Dhaka — premium Thai imports and everyday Bangladeshi<br />
                    essentials delivered to your doorstep.
                </p>
            </div>

        </div>
    );
};

export default Hero; 