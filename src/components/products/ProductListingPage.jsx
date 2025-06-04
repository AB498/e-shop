import React from 'react';
import Image from 'next/image';

import Navigation from '../layout/Navigation';
import ProductBreadcrumb from './ProductBreadcrumb';
import ProductLeftBarServer from './ProductLeftBarServer';
import DealsOfTheDay from '../deals/DealsOfTheDay';
import ProductList from './ProductList';
import Footer from '../layout/Footer';
import Copyright from '../layout/Copyright';
import BottomBanner from './BottomBanner';
import MobileFilterButton from './MobileFilterButton';
import ActiveFiltersServer from './ActiveFiltersServer';

// This is a Server Component that fetches data
export default async function ProductListingPage({ searchParams }) {
  // Extract query parameters with defaults
  await searchParams;
  const page = searchParams?.page || '1';
  const limit = searchParams?.limit || '24';
  const sortBy = searchParams?.sortBy || 'created_at';
  const sortOrder = searchParams?.sortOrder || 'desc';
  const categoryId = searchParams?.categoryId || null;
  const search = searchParams?.search || '';

  // Extract filter parameters
  const minPrice = searchParams?.minPrice || null;
  const maxPrice = searchParams?.maxPrice || null;
  const color = searchParams?.color || null;
  const condition = searchParams?.condition || null;
  const rating = searchParams?.rating || null;
  const promotionId = searchParams?.promotion || null;

  console.log('ProductListingPage - Search param:', search);

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5]">
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
            <ProductLeftBarServer />
          </div>

          {/* Main Content */}
          <div className="flex-1 px-0 md:px-6">
            {/* Active Filters - Only shown when filters are applied */}
            <ActiveFiltersServer promotionId={promotionId} />

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
              rating={rating}
              promotionId={promotionId}
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
