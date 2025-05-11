'use client'
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import PriceRangeFilterWrapper from './PriceRangeFilterWrapper';
import CheckboxFilterWrapper from './CheckboxFilterWrapper';
import StarRating from '@/components/ui/StarRating';

const ProductLeftBar = ({ categories = [], isMobile = false }) => {
    const searchParams = useSearchParams();
    const currentCategoryId = searchParams.get('categoryId');

    // State for new products
    const [newProducts, setNewProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // Fetch new products on component mount
    useEffect(() => {
        const fetchNewProducts = async () => {
            try {
                setIsLoading(true);
                const response = await fetch('/api/products/new?limit=3');
                if (!response.ok) {
                    throw new Error('Failed to fetch new products');
                }
                const data = await response.json();
                setNewProducts(data.products || []);
            } catch (error) {
                console.error('Error fetching new products:', error);
                setNewProducts([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchNewProducts();
    }, []);

    // Array of SVG icons to cycle through for categories
    const categoryIcons = [
        // Icon 1: Document/Edit
        <svg key="icon1" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M20 14.66V20a2 2 0 01-2 2H4a2 2 0 01-2-2V6a2 2 0 012-2h5.34" stroke="#3BB77E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M18 2l4 4-10 10H8v-4L18 2z" stroke="#FDC040" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>,
        // Icon 2: Shield/Check
        <svg key="icon2" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="#3BB77E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M8 10l3 3 5-5" stroke="#FDC040" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>,
        // Icon 3: Briefcase
        <svg key="icon3" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M20 7h-3V4c0-1.1-.9-2-2-2H9c-1.1 0-2 .9-2 2v3H4c-1.1 0-2 .9-2 2v9c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V9c0-1.1-.9-2-2-2z" stroke="#3BB77E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M9 4v3h6V4" stroke="#FDC040" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>,
        // Icon 4: Eye
        <svg key="icon4" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="#3BB77E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M12 12m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" stroke="#FDC040" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>,
        // Icon 5: Bag
        <svg key="icon5" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M17.5 10h-11a6 6 0 000 12h11a6 6 0 000-12z" stroke="#3BB77E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M5 10V7a4 4 0 014-4h6a4 4 0 014 4v3" stroke="#FDC040" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    ];

    // Color filter options
    const colorOptions = [
        { value: 'red', label: 'Red', count: 56 },
        { value: 'green', label: 'Green', count: 78 },
        { value: 'blue', label: 'Blue', count: 54 }
    ];

    // Condition filter options
    const conditionOptions = [
        { value: 'new', label: 'New', count: 1506 },
        { value: 'refurbished', label: 'Refurbished', count: 27 },
        { value: 'thai', label: 'Thai Products', count: 45 }
    ];

    // Function to preserve existing query parameters when changing category
    const getCategoryUrl = (categoryId) => {
        const params = new URLSearchParams(searchParams);
        params.set('categoryId', categoryId);
        params.set('page', '1'); // Reset to page 1 when changing category
        return `/products?${params.toString()}`;
    };

    // Determine if we should show the "New Products" section
    // Hide it on mobile to save space
    const showNewProducts = !isMobile;

    // Use smaller text and padding for mobile view
    const sectionClass = isMobile
        ? "bg-white rounded-[10px] p-3 shadow-sm mb-4"
        : "bg-white rounded-[15px] p-5 shadow-[5px_5px_15px_0px_rgba(0,0,0,0.05)] mb-6";

    const headingClass = isMobile
        ? "text-[#253D4E] text-lg font-bold mb-2"
        : "text-[#253D4E] text-2xl font-bold mb-2";

    return (
        <div className={`w-full ${isMobile ? "" : "md:w-72"} flex-shrink-0`}>
            {/* Category Section */}
            <div className={sectionClass}>
                <div className="border-b border-[#ECECEC] mb-3">
                    <h3 className={headingClass}>Category</h3>
                    <div className="w-12 h-1 bg-[#BCE3C9] mb-2"></div>
                </div>

                <div className={`${isMobile ? "max-h-40 overflow-y-auto" : ""} space-y-1`}>
                    {categories && categories.length > 0 ? (
                        categories.map((category, index) => (
                            <Link
                                key={category.id}
                                href={getCategoryUrl(category.id)}
                                className={`block hover:bg-[#F9F9F9] transition-colors ${
                                    currentCategoryId === category.id.toString() ? 'bg-[#F9F9F9]' : ''
                                }`}
                            >
                                <div className="flex items-center justify-between p-2 border border-[#F2F3F4] rounded-md">
                                    <div className="flex items-center gap-2">
                                        <div className="w-5 h-5 flex items-center justify-center">
                                            {categoryIcons[index % categoryIcons.length]}
                                        </div>
                                        <span className={`text-sm ${
                                            currentCategoryId === category.id.toString()
                                                ? 'text-[#006B51] font-semibold'
                                                : 'text-[#253D4E]'
                                        }`}>
                                            {category.name}
                                        </span>
                                    </div>
                                    <div className="bg-[#BCE3C9] flex items-center justify-center rounded-full w-6 h-6">
                                        <span className="text-[#253D4E] text-xs">{Math.floor(Math.random() * 30) + 5}</span>
                                    </div>
                                </div>
                            </Link>
                        ))
                    ) : (
                        <div className="text-center py-4 text-[#7E7E7E]">No categories found</div>
                    )}
                </div>
            </div>

            {/* Filter by Price Section */}
            <div className={sectionClass}>
                <div className="border-b border-[#ECECEC] mb-3">
                    <h3 className={headingClass}>Filter by price</h3>
                    <div className="w-12 h-1 bg-[#BCE3C9] mb-2"></div>
                </div>

                {/* Price Range Filter Component */}
                <PriceRangeFilterWrapper />

                {/* Color Filter */}
                <div className="mb-3">
                    <h4 className="text-[#7E7E7E] font-extrabold text-sm mb-2">Color</h4>
                    <CheckboxFilterWrapper title="Color" type="color" options={colorOptions} />
                </div>

                {/* Item Condition Filter */}
                <div className="mb-4">
                    <h4 className="text-[#7E7E7E] font-extrabold text-sm mb-2">Item Condition</h4>
                    <CheckboxFilterWrapper title="Item Condition" type="condition" options={conditionOptions} />
                </div>

                {/* Clear All Filters Button */}
                <Link href="/products" className="w-full bg-[#006B51] text-white font-bold text-xs tracking-wider py-2 px-4 rounded-full flex items-center justify-center hover:bg-[#005541] transition-colors">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-2">
                        <path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    CLEAR FILTERS
                </Link>
            </div>

            {/* New Products Section - Only show on desktop */}
            {showNewProducts && (
                <div className={sectionClass}>
                    <div className="border-b border-[#ECECEC] mb-4">
                        <h3 className={headingClass}>New products</h3>
                        <div className="w-12 h-1 bg-[#BCE3C9] mb-2"></div>
                    </div>

                    {isLoading ? (
                        <div className="py-4 text-center text-[#7E7E7E]">Loading new products...</div>
                    ) : newProducts.length === 0 ? (
                        <div className="py-4 text-center text-[#7E7E7E]">No new products found</div>
                    ) : (
                        <>
                            {newProducts.map((product, index) => (
                                <div
                                    key={product.id}
                                    className={`${
                                        index < newProducts.length - 1
                                            ? "border-b border-dashed border-[rgba(0,0,0,0.15)] pb-4 mb-4"
                                            : ""
                                    }`}
                                >
                                    <div className="flex gap-3">
                                        <div className="w-20 h-20 bg-[#F2F3F4] rounded-md flex-shrink-0 flex items-center justify-center">
                                            <Image
                                                src={product.image || "/images/product-image.png"}
                                                alt={product.name}
                                                width={70}
                                                height={70}
                                                className="object-contain"
                                                unoptimized={product.image && product.image.startsWith('http')}
                                                onError={(e) => {
                                                    e.target.src = "/images/product-image.png";
                                                }}
                                            />
                                        </div>
                                        <div>
                                            <Link href={`/products/${product.id}`}>
                                                <h4 className="text-[#3BB77E] font-bold text-base mb-1 hover:underline">
                                                    {product.name}
                                                </h4>
                                            </Link>
                                            <p className="text-[#7E7E7E] text-base">${parseFloat(product.price).toFixed(2)}</p>
                                            <div className="flex mt-1">
                                                <StarRating
                                                    rating={parseFloat(product.rating) || 4.0}
                                                    reviewCount={product.reviewCount || 0}
                                                    size="sm"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </>
                    )}
                </div>
            )}
        </div>
    );
};

export default ProductLeftBar;
