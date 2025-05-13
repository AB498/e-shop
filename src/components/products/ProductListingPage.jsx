import React from 'react';
import Image from 'next/image';

import Navigation from '../layout/Navigation';
import ProductBreadcrumb from './ProductBreadcrumb';
import ProductLeftBarWrapper from './ProductLeftBarWrapper';
import DealsOfTheDay from '../deals/DealsOfTheDay';
import ProductList from './ProductList';
import Footer from '../layout/Footer';
import Copyright from '../layout/Copyright';
import { getAllCategories } from '@/lib/actions/products';
import BottomBanner from './BottomBanner';
import MobileFilterButton from './MobileFilterButton';

// This is a Server Component that fetches data
export default async function ProductListingPage({ searchParams }) {
  // Extract query parameters with defaults
  await searchParams;
  const page = searchParams?.page || '1';
  const limit = searchParams?.limit || '24';
  const sortBy = searchParams?.sortBy || 'id';
  const sortOrder = searchParams?.sortOrder || 'asc';
  const categoryId = searchParams?.categoryId || null;
  const search = searchParams?.search || '';

  // Extract filter parameters
  const minPrice = searchParams?.minPrice || null;
  const maxPrice = searchParams?.maxPrice || null;
  const color = searchParams?.color || null;
  const condition = searchParams?.condition || null;

  console.log('ProductListingPage - Search param:', search);

  // Fetch categories for the sidebar
  const categories = await getAllCategories();

  return (
    <div className="min-h-screen flex flex-col">
      <div className="container mx-auto px-4 py-4 md:py-6">
        <ProductBreadcrumb categoryId={categoryId} />
      </div>

      <div className="container mx-auto px-4 py-4 md:py-6 relative">
        {/* Mobile Filter Button - Only visible on mobile */}
        <div className="md:hidden mb-4">
          <MobileFilterButton />
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Left Sidebar - Hidden by default on mobile, shown via MobileFilterButton */}
          <div className="hidden md:block md:w-64 flex-shrink-0">
            <ProductLeftBarWrapper categories={categories} isMobile={false} />
          </div>

          {/* Main Content */}
          <div className="flex-1 bg-[#FAF8F5] px-0 md:px-6">
            {/* Product Listing */}
            <ProductList
              page={page}
              limit={limit}
              sortBy={sortBy}
              sortOrder={sortOrder}
              categoryId={categoryId}
              search={search}
              minPrice={minPrice}
              maxPrice={maxPrice}
              color={color}
              condition={condition}
            />

            {/* Deals Of The Day Section */}
            <DealsOfTheDay />
          </div>
        </div>
      </div>

      <BottomBanner />

      
    </div>
  );
}
