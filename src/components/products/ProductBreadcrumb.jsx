import React from 'react';
import Image from 'next/image';

const ProductBreadcrumb = () => {
    return (
        <div className="container my-12 mx-auto bg-cover bg-center px-12 py-12 rounded-[20px]" style={{ backgroundImage: "url('/images/breadcrumb/breadcrumb-bg.png')" }}>
            <div className="container mx-auto px-4 flex items-center justify-between">
                <div className="flex flex-col space-y-4 py-4">
                    {/* Page Title */}
                    <h1 className="text-[#253D4E] text-5xl font-bold ">Skin Care</h1>

                    {/* Breadcrumb Navigation */}
                    <div className="flex items-center">
                        <a href="/" className="text-[#3BB77E] font-semibold text-sm uppercase flex items-center">
                            <Image src="/images/breadcrumb/home-icon.svg" alt="Home" width={14} height={14} className="mr-1" />
                            Home
                        </a>
                        <Image src="/images/breadcrumb/arrow-icon.svg" alt=">" width={3} height={6} className="mx-2" />
                        <a href="/shop" className="text-[#7E7E7E] font-semibold text-sm uppercase">
                            Shop
                        </a>
                        <Image src="/images/breadcrumb/arrow-icon2.svg" alt=">" width={3} height={6} className="mx-2" />
                        <span className="text-[#7E7E7E] font-semibold text-sm uppercase">Skin Care</span>
                    </div>

                </div>

                {/* Category Pills */}
                <div className="flex flex-wrap gap-4">
                    <div className="flex items-center bg-white rounded-[30px] px-5 py-3 shadow-[5px_5px_15px_0px_rgba(0,0,0,0.05)] border border-[#ECECEC]">
                        <span className="text-[#3BB77E] font-bold text-[17px]">Beauty</span>
                        <Image src="/images/breadcrumb/beauty-icon.svg" alt="Beauty" width={10} height={10} className="ml-3" />
                    </div>
                    <div className="flex items-center bg-white rounded-[30px] px-5 py-3 shadow-[5px_5px_15px_0px_rgba(0,0,0,0.05)] border border-[#ECECEC]">
                        <span className="text-[#253D4E] font-bold text-[17px]">Skin Care</span>
                        <Image src="/images/breadcrumb/skincare-icon.svg" alt="Skin Care" width={10} height={10} className="ml-3" />
                    </div>
                    <div className="flex items-center bg-white rounded-[30px] px-5 py-3 shadow-[5px_5px_15px_0px_rgba(0,0,0,0.05)] border border-[#ECECEC]">
                        <span className="text-[#3BB77E] font-bold text-[17px]">Face</span>
                        <Image src="/images/breadcrumb/face-icon.svg" alt="Face" width={10} height={10} className="ml-3" />
                    </div>
                    <div className="flex items-center bg-white rounded-[30px] px-5 py-3 shadow-[5px_5px_15px_0px_rgba(0,0,0,0.05)] border border-[#ECECEC]">
                        <span className="text-[#3BB77E] font-bold text-[17px]">Toner</span>
                        <Image src="/images/breadcrumb/toner-icon.svg" alt="Toner" width={10} height={10} className="ml-3" />
                    </div>
                    <div className="flex items-center bg-white rounded-[30px] px-5 py-3 shadow-[5px_5px_15px_0px_rgba(0,0,0,0.05)] border border-[#ECECEC]">
                        <span className="text-[#3BB77E] font-bold text-[17px]">Cosmetics</span>
                        <Image src="/images/breadcrumb/cosmetics-icon.svg" alt="Cosmetics" width={10} height={10} className="ml-3" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductBreadcrumb;
