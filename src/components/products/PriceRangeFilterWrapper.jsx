'use client'
import React, { Suspense } from 'react';
import PriceRangeFilter from './PriceRangeFilter';

// Fallback component to show while PriceRangeFilter is loading
const PriceRangeFilterFallback = () => {
  return (
    <div className="mb-6 animate-pulse">
      <div className="h-6 bg-gray-200 rounded w-32 mb-4"></div>
      <div className="h-4 bg-gray-200 rounded w-full mb-6"></div>
      <div className="flex justify-between mb-4">
        <div className="h-10 bg-gray-200 rounded w-24"></div>
        <div className="h-10 bg-gray-200 rounded w-24"></div>
      </div>
      <div className="h-10 bg-gray-200 rounded w-full"></div>
    </div>
  );
};

// Wrapper component that adds Suspense boundary
const PriceRangeFilterWrapper = () => {
  return (
    <Suspense fallback={<PriceRangeFilterFallback />}>
      <PriceRangeFilter />
    </Suspense>
  );
};

export default PriceRangeFilterWrapper;
