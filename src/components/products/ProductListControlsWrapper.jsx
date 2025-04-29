'use client'
import React, { Suspense } from 'react';
import ProductListControls from './ProductListControls';

// Fallback component to show while ProductListControls is loading
const ProductListControlsFallback = ({ totalProducts }) => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-center mb-6 animate-pulse">
      <div className="w-full md:w-auto mb-4 md:mb-0">
        <div className="h-6 bg-gray-200 rounded w-48"></div>
      </div>
      <div className="flex space-x-4">
        <div className="h-10 bg-gray-200 rounded w-32"></div>
        <div className="h-10 bg-gray-200 rounded w-32"></div>
      </div>
    </div>
  );
};

// Wrapper component that adds Suspense boundary
const ProductListControlsWrapper = ({ totalProducts }) => {
  return (
    <Suspense fallback={<ProductListControlsFallback totalProducts={totalProducts} />}>
      <ProductListControls totalProducts={totalProducts} />
    </Suspense>
  );
};

export default ProductListControlsWrapper;
