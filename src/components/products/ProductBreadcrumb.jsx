import React from 'react';
import Image from 'next/image';
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
        <div className="container my-12 mx-auto bg-cover bg-center px-12 py-12 rounded-[20px]" style={{ backgroundImage: "url('/images/breadcrumb/breadcrumb-bg.png')" }}>
            <div className="container mx-auto px-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div className="flex flex-col space-y-4 py-4">
                    {/* Page Title */}
                    <h1 className="text-[#253D4E] text-5xl font-bold">{categoryName}</h1>

                    {/* Breadcrumb Navigation */}
                    <div className="flex items-center flex-wrap">
                        <Link href="/" className="text-[#3BB77E] font-semibold text-sm uppercase flex items-center hover:text-[#2A9D6E] transition-colors">
                            <Image src="/images/breadcrumb/home-icon.svg" alt="Home" width={14} height={14} className="mr-1" />
                            Home
                        </Link>
                        <Image src="/images/breadcrumb/arrow-icon.svg" alt=">" width={3} height={6} className="mx-2" />
                        <Link href="/products" className="text-[#7E7E7E] font-semibold text-sm uppercase hover:text-[#3BB77E] transition-colors">
                            Shop
                        </Link>
                        {currentCategory && (
                            <>
                                <Image src="/images/breadcrumb/arrow-icon2.svg" alt=">" width={3} height={6} className="mx-2" />
                                <span className="text-[#7E7E7E] font-semibold text-sm uppercase">{categoryName}</span>
                            </>
                        )}
                    </div>
                </div>

                {/* Category Pills */}
                <div className="flex flex-wrap gap-4">
                    {popularCategories.map((category, index) => (
                        <Link
                            key={category.id}
                            href={`/products?categoryId=${category.id}`}
                            className="flex items-center bg-white rounded-[30px] px-5 py-3 shadow-[5px_5px_15px_0px_rgba(0,0,0,0.05)] border border-[#ECECEC] hover:shadow-md transition-shadow"
                        >
                            <span className={`font-bold text-[17px] ${
                                currentCategory && currentCategory.id === category.id
                                    ? 'text-[#253D4E]'
                                    : 'text-[#3BB77E]'
                            }`}>
                                {category.name}
                            </span>
                            <Image
                                src={`/images/breadcrumb/${index === 0 ? 'beauty' : index === 1 ? 'skincare' : index === 2 ? 'face' : index === 3 ? 'toner' : 'cosmetics'}-icon.svg`}
                                alt={category.name}
                                width={10}
                                height={10}
                                className="ml-3"
                            />
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
