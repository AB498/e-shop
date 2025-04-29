import React from 'react';
import Image from 'next/image';
import Topbar from '../layout/Topbar';
import Navigation from '../layout/Navigation';
import ProductBreadcrumb from './ProductBreadcrumb';
import ProductLeftBarWrapper from './ProductLeftBarWrapper';
import DealsOfTheDay from '../deals/DealsOfTheDay';
import ProductList from './ProductList';
import Footer from '../layout/Footer';
import Copyright from '../layout/Copyright';
import { getAllCategories } from '@/lib/actions/products';

// This is a Server Component that fetches data
export default async function ProductListingPage({ searchParams }) {
  // Extract query parameters with defaults
  const page = searchParams?.page || '1';
  const limit = searchParams?.limit || '12';
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
      <Topbar />
      <Navigation />

      <ProductBreadcrumb categoryId={categoryId} />

      <div className="container mx-auto px-4 py-6 flex flex-col md:flex-row gap-6">
        {/* Left Sidebar */}
        <div className="w-full md:w-64 flex-shrink-0">
          <ProductLeftBarWrapper categories={categories} />
        </div>

        {/* Main Content */}
        <div className="flex-1 bg-[#FAF8F5] px-6">
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

      {/* Bottom Banner */}
      <div className="container mx-auto px-4 py-6 mb-10">
        <div className="bg-[url('/images/banner-background.png')] bg-cover bg-center rounded-[20px] p-10 relative overflow-hidden">
          <div className="max-w-lg relative z-10">
            <h2 className="text-[#253D4E] text-4xl font-bold leading-tight mb-4">
              Stay home & get your daily<br />
              needs from our shop
            </h2>
            <p className="text-[#7E7E7E] text-lg mb-8">Start Your Daily Shopping with Nest Mart</p>

            <div className="flex flex-col sm:flex-row">
              <input
                type="email"
                placeholder="Your email address"
                className="bg-white rounded-l-full py-4 px-6 w-full text-[#838383]"
              />
              <button className="bg-[#3BB77E] text-white font-bold py-4 px-8 rounded-full sm:-ml-6 mt-2 sm:mt-0 tracking-wider hover:bg-[#2A9D6E] transition-colors">
                Subscribe
              </button>
            </div>
          </div>

          {/* Banner Image */}
          <div className="absolute right-0 bottom-0 h-full w-1/2 flex items-end justify-end">
            <img
              src="/images/banner-image.png"
              alt="Banner"
              className="object-contain h-full"
            />
          </div>
        </div>
      </div>

      <Footer />
      <Copyright />
    </div>
  );
}
