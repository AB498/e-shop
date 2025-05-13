'use client'
import React, { Suspense } from 'react';
import ProductLeftBar from './ProductLeftBar';

// Fallback component to show while ProductLeftBar is loading
const ProductLeftBarFallback = () => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 animate-pulse">
      <div className="h-8 bg-gray-200 rounded mb-6"></div>
      <div className="space-y-4">
        <div className="h-6 bg-gray-200 rounded w-3/4"></div>
        <div className="h-6 bg-gray-200 rounded w-2/3"></div>
        <div className="h-6 bg-gray-200 rounded w-4/5"></div>
      </div>
    </div>
  );
};

// Wrapper component that adds Suspense boundary
const ProductLeftBarWrapper = ({
  categories,
  categoryCounts = {},
  newProducts = [],
  isMobile = false
}) => {
  return (
    <Suspense fallback={<ProductLeftBarFallback />}>
      <ProductLeftBar
        categories={categories}
        categoryCounts={categoryCounts}
        newProducts={newProducts}
        isMobile={isMobile}
      />
    </Suspense>
  );
};

export default ProductLeftBarWrapper;
