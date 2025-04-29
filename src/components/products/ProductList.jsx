import React from 'react';
import Image from 'next/image';

const ProductList = () => {
    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-[#7E7E7E] text-base ">We found 29 items for you!</h2>

                <div className="flex space-x-4">
                    <div className="flex items-center border border-[#ECECEC] rounded-[10px] px-4 py-2">
                        <Image src="/images/navigation/filter.png" alt="Filter" width={16} height={16} />
                        <span className="text-[#777777] text-sm ml-2 font-semibold ">Show:</span>
                        <span className="text-[#7E7E7E] text-sm font-semibold ml-2 ">50</span>
                        <Image src="/images/navigation/chevron-down.png" alt="Dropdown" width={12} height={12} className="ml-2" />
                    </div>

                    <div className="flex items-center border border-[#ECECEC] rounded-[10px] px-4 py-2">
                        <Image src="/images/navigation/sort.png" alt="Sort" width={16} height={16} />
                        <span className="text-[#777777] text-sm ml-2 font-semibold ">Sort by:</span>
                        <span className="text-[#7E7E7E] text-sm font-semibold ml-2 ">Featured</span>
                        <Image src="/images/navigation/chevron-down.png" alt="Dropdown" width={12} height={12} className="ml-2" />
                    </div>
                </div>
            </div>

            {/* Product Grid */}
            <div className="grid grid-cols-4 gap-6 mb-8">
                {/* Product Card 1 */}
                <div className="bg-white rounded-[10px] p-4 shadow-sm">
                    <div className="relative mb-4">
                        <Image src="/images/products/product-image.png" alt="Product" width={240} height={240} className="w-full h-48 object-cover rounded-[10px]" />
                        <div className="absolute top-2 left-2">
                            <div className="bg-[#006B51] text-white text-xs font-semibold py-1 px-2 rounded-[10px]">-10%</div>
                        </div>
                        <div className="absolute top-2 right-2">
                            <Image src="/images/products/wishlist-icon.png" alt="Wishlist" width={24} height={24} />
                        </div>
                    </div>
                    <div className="text-center">
                        <div className="text-[#A9A9A9] text-xs font-semibold uppercase mb-1 ">CATEGORY</div>
                        <h3 className="text-[#3F3F3F] text-base font-semibold mb-2 ">Product Name Here</h3>
                        <div className="flex items-center justify-center space-x-2">
                            <span className="text-[#E12625] text-sm line-through ">৳86.00</span>
                            <span className="text-[#006B51] text-sm font-medium ">৳86.00</span>
                        </div>
                    </div>
                </div>

                {/* Product Card 2 - With Add to Cart */}
                <div className="bg-white rounded-[10px] p-4 shadow-sm">
                    <div className="relative mb-4">
                        <Image src="/images/products/product-image.png" alt="Product" width={240} height={240} className="w-full h-48 object-cover rounded-[10px]" />
                        <div className="absolute top-2 left-2 flex space-x-2">
                            <div className="bg-[#006B51] text-white text-xs font-semibold py-1 px-2 rounded-[10px]">-10%</div>
                            <div className="bg-[#D70100] text-white text-xs font-semibold py-1 px-2 rounded-[10px]">HOT</div>
                        </div>
                        <div className="absolute top-2 right-2">
                            <Image src="/images/products/wishlist-icon.png" alt="Wishlist" width={24} height={24} />
                        </div>
                    </div>
                    <div className="text-center">
                        <div className="text-[#A9A9A9] text-xs font-semibold uppercase mb-1 ">CATEGORY</div>
                        <h3 className="text-[#3F3F3F] text-base font-semibold mb-2 ">Product Name Here</h3>
                        <div className="flex items-center justify-center space-x-2 mb-3">
                            <span className="text-[#E12625] text-sm line-through ">৳86.00</span>
                            <span className="text-[#006B51] text-sm font-medium ">৳86.00</span>
                        </div>
                        <button className="bg-[#006B51] text-white text-sm font-semibold py-2 px-4 rounded-2xl flex items-center justify-center w-full ">
                            <Image src="/images/products/cart-icon.png" alt="Cart" width={16} height={16} className="mr-2" />
                            Add To Cart
                        </button>
                    </div>
                </div>

                {/* Product Card 3 */}
                <div className="bg-white rounded-[10px] p-4 shadow-sm">
                    <div className="relative mb-4">
                        <Image src="/images/products/product-image.png" alt="Product" width={240} height={240} className="w-full h-48 object-cover rounded-[10px]" />
                        <div className="absolute top-2 left-2">
                            <div className="bg-[#006B51] text-white text-xs font-semibold py-1 px-2 rounded-[10px]">-10%</div>
                        </div>
                        <div className="absolute top-2 right-2">
                            <Image src="/images/products/wishlist-icon.png" alt="Wishlist" width={24} height={24} />
                        </div>
                    </div>
                    <div className="text-center">
                        <div className="text-[#A9A9A9] text-xs font-semibold uppercase mb-1 ">CATEGORY</div>
                        <h3 className="text-[#3F3F3F] text-base font-semibold mb-2 ">Product Name Here</h3>
                        <div className="flex items-center justify-center space-x-2">
                            <span className="text-[#E12625] text-sm line-through ">৳86.00</span>
                            <span className="text-[#006B51] text-sm font-medium ">৳86.00</span>
                        </div>
                    </div>
                </div>

                {/* Product Card 4 */}
                <div className="bg-white rounded-[10px] p-4 shadow-sm">
                    <div className="relative mb-4">
                        <Image src="/images/products/product-image.png" alt="Product" width={240} height={240} className="w-full h-48 object-cover rounded-[10px]" />
                        <div className="absolute top-2 left-2">
                            <div className="bg-[#006B51] text-white text-xs font-semibold py-1 px-2 rounded-[10px]">-10%</div>
                        </div>
                        <div className="absolute top-2 right-2">
                            <Image src="/images/products/wishlist-icon.png" alt="Wishlist" width={24} height={24} />
                        </div>
                    </div>
                    <div className="text-center">
                        <div className="text-[#A9A9A9] text-xs font-semibold uppercase mb-1 ">CATEGORY</div>
                        <h3 className="text-[#3F3F3F] text-base font-semibold mb-2 ">Product Name Here</h3>
                        <div className="flex items-center justify-center space-x-2">
                            <span className="text-[#E12625] text-sm line-through ">৳86.00</span>
                            <span className="text-[#006B51] text-sm font-medium ">৳86.00</span>
                        </div>
                    </div>
                </div>

                {/* Additional Product Cards (5-8) */}
                {Array(4).fill(0).map((_, index) => (
                    <div key={index + 5} className="bg-white rounded-[10px] p-4 shadow-sm">
                        <div className="relative mb-4">
                            <Image src="/images/products/product-image.png" alt="Product" width={240} height={240} className="w-full h-48 object-cover rounded-[10px]" />
                            <div className="absolute top-2 left-2">
                                <div className="bg-[#006B51] text-white text-xs font-semibold py-1 px-2 rounded-[10px]">-10%</div>
                            </div>
                            <div className="absolute top-2 right-2">
                                <Image src="/images/products/wishlist-icon.png" alt="Wishlist" width={24} height={24} />
                            </div>
                        </div>
                        <div className="text-center">
                            <div className="text-[#A9A9A9] text-xs font-semibold uppercase mb-1 ">CATEGORY</div>
                            <h3 className="text-[#3F3F3F] text-base font-semibold mb-2 ">Product Name Here</h3>
                            <div className="flex items-center justify-center space-x-2">
                                <span className="text-[#E12625] text-sm line-through ">৳86.00</span>
                                <span className="text-[#006B51] text-sm font-medium ">৳86.00</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Pagination */}
            <div className="flex justify-center items-center space-x-2 mb-10">
                <button className="w-10 h-10 rounded-full bg-[#F2F3F4] flex items-center justify-center">
                    <Image src="/images/navigation/chevron-left.png" alt="Previous" width={16} height={16} />
                </button>

                <button className="w-10 h-10 rounded-full bg-[#F2F3F4] flex items-center justify-center">
                    <span className="text-[#7E7E7E] font-bold ">1</span>
                </button>

                <button className="w-10 h-10 rounded-full bg-[#006B51] flex items-center justify-center">
                    <span className="text-white font-bold ">2</span>
                </button>

                <button className="w-10 h-10 rounded-full bg-[#F2F3F4] flex items-center justify-center">
                    <span className="text-[#7E7E7E] font-bold ">3</span>
                </button>

                <span className="text-[#7E7E7E] font-bold  tracking-widest">...</span>

                <button className="w-10 h-10 rounded-full bg-[#F2F3F4] flex items-center justify-center">
                    <span className="text-[#7E7E7E] font-bold ">6</span>
                </button>

                <button className="w-10 h-10 rounded-full bg-[#F2F3F4] flex items-center justify-center">
                    <Image src="/images/navigation/chevron-right.png" alt="Next" width={16} height={16} />
                </button>
            </div>
        </div>
    );
};

export default ProductList;
