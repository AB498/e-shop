import React from 'react';
import Image from 'next/image';

const ProductLeftBar = () => {
    return (
        <div className="w-72 flex-shrink-0">

            {/* Category Section */}
            <div className="bg-white rounded-[15px] p-5 shadow-[5px_5px_15px_0px_rgba(0,0,0,0.05)] mb-6">
                <div className="border-b border-[#ECECEC] mb-4">
                    <h3 className="text-[#253D4E] text-2xl font-bold mb-2">Category</h3>
                    <div className="w-12 h-1 bg-[#BCE3C9] mb-2"></div>
                </div>

                <div className="space-y-2">
                    {/* Category Item 1 */}
                    <div className="flex items-center justify-between p-2 border border-[#F2F3F4] rounded-md">
                        <div className="flex items-center gap-2">
                            <div className="w-6 h-6 flex items-center justify-center">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M20 14.66V20a2 2 0 01-2 2H4a2 2 0 01-2-2V6a2 2 0 012-2h5.34" stroke="#3BB77E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M18 2l4 4-10 10H8v-4L18 2z" stroke="#FDC040" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
                            <span className="text-[#253D4E] text-sm">Serums & Treatments</span>
                        </div>
                        <div className="bg-[#BCE3C9] rounded-full px-2 py-1">
                            <span className="text-[#253D4E] text-xs">11</span>
                        </div>
                    </div>

                    {/* Category Item 2 */}
                    <div className="flex items-center justify-between p-2 border border-[#F2F3F4] rounded-md">
                        <div className="flex items-center gap-2">
                            <div className="w-6 h-6 flex items-center justify-center">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="#3BB77E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M8 10l3 3 5-5" stroke="#FDC040" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
                            <span className="text-[#253D4E] text-sm">Toners & Exfoliators</span>
                        </div>
                        <div className="bg-[#BCE3C9] rounded-full px-2 py-1">
                            <span className="text-[#253D4E] text-xs">13</span>
                        </div>
                    </div>

                    {/* Category Item 3 */}
                    <div className="flex items-center justify-between p-2 border border-[#F2F3F4] rounded-md">
                        <div className="flex items-center gap-2">
                            <div className="w-6 h-6 flex items-center justify-center">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M20 7h-3V4c0-1.1-.9-2-2-2H9c-1.1 0-2 .9-2 2v3H4c-1.1 0-2 .9-2 2v9c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V9c0-1.1-.9-2-2-2z" stroke="#3BB77E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M9 4v3h6V4" stroke="#FDC040" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
                            <span className="text-[#253D4E] text-sm">Cleansers</span>
                        </div>
                        <div className="bg-[#BCE3C9] rounded-full px-2 py-1">
                            <span className="text-[#253D4E] text-xs">15</span>
                        </div>
                    </div>

                    {/* Category Item 4 */}
                    <div className="flex items-center justify-between p-2 border border-[#F2F3F4] rounded-md">
                        <div className="flex items-center gap-2">
                            <div className="w-6 h-6 flex items-center justify-center">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="#3BB77E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M12 12m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" stroke="#FDC040" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
                            <span className="text-[#253D4E] text-sm">Eyes</span>
                        </div>
                        <div className="bg-[#BCE3C9] rounded-full px-2 py-1">
                            <span className="text-[#253D4E] text-xs">25</span>
                        </div>
                    </div>

                    {/* Category Item 5 */}
                    <div className="flex items-center justify-between p-2 border border-[#F2F3F4] rounded-md">
                        <div className="flex items-center gap-2">
                            <div className="w-6 h-6 flex items-center justify-center">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M17.5 10h-11a6 6 0 000 12h11a6 6 0 000-12z" stroke="#3BB77E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M5 10V7a4 4 0 014-4h6a4 4 0 014 4v3" stroke="#FDC040" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
                            <span className="text-[#253D4E] text-sm">Lip Care</span>
                        </div>
                        <div className="bg-[#BCE3C9] rounded-full px-2 py-1">
                            <span className="text-[#253D4E] text-xs">32</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filter by Price Section */}
            <div className="bg-white rounded-[15px] p-5 mb-6 shadow-[5px_5px_15px_0px_rgba(0,0,0,0.05)]">
                <div className="border-b border-[#ECECEC] mb-4">
                    <h3 className="text-[#253D4E] text-2xl font-bold mb-2">Fill by price</h3>
                    <div className="w-12 h-1 bg-[#BCE3C9] mb-2"></div>
                </div>

                <div className="mb-4">
                    <p className="text-[#7E7E7E] text-sm mb-2">From: $500</p>
                    <p className="text-[#7E7E7E] text-sm mb-4">To: $1,000</p>

                    {/* Price Range Slider */}
                    <div className="relative h-1 bg-[#D6D7D9] rounded mb-6">
                        <div className="absolute left-0 top-0 h-1 w-1/2 bg-[#006B51] rounded"></div>
                        <div className="absolute left-0 top-[-4px] w-3 h-3 rounded-full bg-[#006B51]"></div>
                        <div className="absolute left-1/2 top-[-4px] w-3 h-3 rounded-full bg-[#006B51]"></div>
                    </div>
                </div>

                {/* Color Filter */}
                <div className="mb-4">
                    <h4 className="text-[#7E7E7E] font-extrabold text-sm mb-3">Color</h4>

                    <div className="space-y-2">
                        <div className="flex items-center">
                            <input type="checkbox" id="color-red" className="mr-2 border-2 border-[#CED4DA] rounded" />
                            <label htmlFor="color-red" className="text-[#687188] text-sm">Red (56)</label>
                        </div>

                        <div className="flex items-center">
                            <input type="checkbox" id="color-green" className="mr-2 border-2 border-[#CED4DA] rounded" />
                            <label htmlFor="color-green" className="text-[#687188] text-sm">Green (78)</label>
                        </div>

                        <div className="flex items-center">
                            <input type="checkbox" id="color-blue" className="mr-2 border-2 border-[#CED4DA] rounded" />
                            <label htmlFor="color-blue" className="text-[#687188] text-sm">Blue (54)</label>
                        </div>
                    </div>
                </div>

                {/* Item Condition Filter */}
                <div className="mb-6">
                    <h4 className="text-[#7E7E7E] font-extrabold text-sm mb-3">Item Condition</h4>

                    <div className="space-y-2">
                        <div className="flex items-center">
                            <input type="checkbox" id="condition-new" className="mr-2 border-2 border-[#CED4DA] rounded" />
                            <label htmlFor="condition-new" className="text-[#687188] text-sm">New (1506)</label>
                        </div>

                        <div className="flex items-center">
                            <input type="checkbox" id="condition-refurbished" className="mr-2 border-2 border-[#CED4DA] rounded" />
                            <label htmlFor="condition-refurbished" className="text-[#687188] text-sm">Refurbished (27)</label>
                        </div>

                        <div className="flex items-center">
                            <input type="checkbox" id="condition-used" className="mr-2 border-2 border-[#CED4DA] rounded" />
                            <label htmlFor="condition-used" className="text-[#687188] text-sm">Thai Products(45)</label>
                        </div>
                    </div>
                </div>

                {/* Filter Button */}
                <button className="w-full bg-[#006B51] text-white font-bold text-xs tracking-wider py-2 px-4 rounded-full flex items-center justify-center">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-2">
                        <path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    FILTER
                </button>
            </div>
            {/* New Products Section */}
            <div className="bg-white rounded-[15px] p-5 mb-6 shadow-[5px_5px_15px_0px_rgba(0,0,0,0.05)]">
                <div className="border-b border-[#ECECEC] mb-4">
                    <h3 className="text-[#253D4E] text-2xl font-bold mb-2">New products</h3>
                    <div className="w-12 h-1 bg-[#BCE3C9] mb-2"></div>
                </div>

                {/* Product Item 1 */}
                <div className="border-b border-dashed border-[rgba(0,0,0,0.15)] pb-4 mb-4">
                    <div className="flex gap-3">
                        <div className="w-20 h-20 bg-[#F2F3F4] rounded-md flex-shrink-0 flex items-center justify-center">
                            <Image src="/images/product-image.png" alt="Cosrx Salicylic Acid" width={70} height={70} className="object-contain" />
                        </div>
                        <div>
                            <h4 className="text-[#3BB77E] font-bold text-base mb-1">Cosrx Salicylic Acid Daily</h4>
                            <p className="text-[#7E7E7E] text-base">$99.50</p>
                            <div className="flex mt-1">
                                <Image src="/images/star-rating.png" alt="Rating" width={80} height={15} className="object-contain" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Product Item 2 */}
                <div className="border-b border-dashed border-[rgba(0,0,0,0.15)] pb-4 mb-4">
                    <div className="flex gap-3">
                        <div className="w-20 h-20 bg-[#F2F3F4] rounded-md flex-shrink-0 flex items-center justify-center">
                            <Image src="/images/product-image.png" alt="Snail Truecica" width={70} height={70} className="object-contain" />
                        </div>
                        <div>
                            <h4 className="text-[#3BB77E] font-bold text-base mb-1">Snail Truecica Miracle Repair</h4>
                            <p className="text-[#7E7E7E] text-base">$89.50</p>
                            <div className="flex mt-1">
                                <Image src="/images/star-rating.png" alt="Rating" width={80} height={15} className="object-contain" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Product Item 3 */}
                <div>
                    <div className="flex gap-3">
                        <div className="w-20 h-20 bg-[#F2F3F4] rounded-md flex-shrink-0 flex items-center justify-center">
                            <Image src="/images/product-image.png" alt="Tocobo Mint" width={70} height={70} className="object-contain" />
                        </div>
                        <div>
                            <h4 className="text-[#3BB77E] font-bold text-base mb-1">Tocobo Mint Cooling Lip Mask</h4>
                            <p className="text-[#7E7E7E] text-base">$25</p>
                            <div className="flex mt-1">
                                <Image src="/images/star-rating.png" alt="Rating" width={80} height={15} className="object-contain" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductLeftBar;
