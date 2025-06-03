import React from 'react';
import Link from 'next/link';
import { getAllCategories } from '@/lib/actions/products';

// This is a Server Component that fetches data
export default async function ProductBreadcrumb({ categoryId = null }) {
    // Fetch all categories
    const categories = await getAllCategories();

    // Find the current category if categoryId is provided
    const currentCategory = categoryId && categories.find(cat => cat.id.toString() === categoryId.toString());

    // Default category name if none is selected
    const categoryName = currentCategory ? currentCategory.name : 'All Products';

    // Get popular categories for pills (limit to 5)
    const popularCategories = categories.slice(0, 5);

    return (
        <div className="container my-3 md:my-6 mx-auto bg-cover bg-center px-3 sm:px-4 md:px-6 py-4 md:py-8 rounded-lg" style={{ backgroundImage: "url('/images/breadcrumb/breadcrumb-bg.png')" }}>
            <div className="container mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-2 md:gap-3">
                <div className="flex flex-col space-y-1 md:space-y-1 py-1 md:py-2 w-full md:w-auto">
                    {/* Page Title */}
                    <h1 className="text-3xl md:text-4xl lg:text-[42px] font-bold text-[#253D4E] mb-4">{categoryName}</h1>

                    {/* Breadcrumb Navigation */}
                    <div className="flex items-center flex-wrap">
                        <Link href="/" className="text-[#3BB77E] font-medium text-[10px] sm:text-xs uppercase flex items-center hover:text-[#2A9D6E] transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-0.5">
                                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                                <polyline points="9 22 9 12 15 12 15 22"></polyline>
                            </svg>
                            Home
                        </Link>
                        <svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="#7E7E7E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mx-1">
                            <polyline points="9 18 15 12 9 6"></polyline>
                        </svg>
                        <Link href="/products" className="text-[#7E7E7E] font-medium text-[10px] sm:text-xs uppercase hover:text-[#3BB77E] transition-colors">
                            Shop
                        </Link>
                        {currentCategory && (
                            <>
                                <svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="#7E7E7E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mx-1">
                                    <polyline points="9 18 15 12 9 6"></polyline>
                                </svg>
                                <span className="text-[#7E7E7E] font-medium text-[10px] sm:text-xs uppercase truncate max-w-[120px] sm:max-w-[150px]">{categoryName}</span>
                            </>
                        )}
                    </div>
                </div>

                {/* Category Pills */}
                <div className="flex flex-wrap gap-1 sm:gap-1.5 md:gap-2 mt-2 md:mt-0 w-full md:w-auto justify-start md:justify-end">
                    {popularCategories.map((category, index) => (
                        <Link
                            key={category.id}
                            href={`/products?categoryId=${category.id}`}
                            className="flex items-center bg-white rounded-full px-2 sm:px-2.5 md:px-3 py-1 md:py-1.5 shadow-sm border border-[#ECECEC] hover:shadow transition-shadow"
                        >
                            <span className={`font-medium text-xs sm:text-sm truncate max-w-[80px] sm:max-w-[100px] md:max-w-[120px] ${
                                currentCategory && currentCategory.id === category.id
                                    ? 'text-[#253D4E]'
                                    : 'text-[#3BB77E]'
                            }`}>
                                {category.name}
                            </span>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="8"
                                height="8"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke={currentCategory && currentCategory.id === category.id ? "#253D4E" : "#3BB77E"}
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="ml-1 md:ml-1.5 flex-shrink-0"
                            >
                                {index === 0 ? (
                                    // Beauty icon (flower)
                                    <path d="M12 2s.35 3.9 3.6 7.15a9.08 9.08 0 0 1 0 12.85c-3.25 3.25-7.15 3.6-7.15 3.6s-.35-3.9-3.6-7.15a9.08 9.08 0 0 1 0-12.85C8.1 2.35 12 2 12 2z"></path>
                                ) : index === 1 ? (
                                    // Skincare icon (droplet)
                                    <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"></path>
                                ) : index === 2 ? (
                                    // Face icon (smile)
                                    <circle cx="12" cy="12" r="10"></circle>
                                ) : index === 3 ? (
                                    // Toner icon (bottle)
                                    <path d="M8 2h8l4 10v10H4V12L8 2z"></path>
                                ) : (
                                    // Cosmetics icon (star)
                                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                                )}
                            </svg>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
