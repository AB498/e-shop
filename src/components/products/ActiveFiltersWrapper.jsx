'use client'
import React, { Suspense } from 'react';
import ActiveFilters from './ActiveFilters';

// Fallback component to show while ActiveFilters is loading
const ActiveFiltersFallback = () => {
  return (
    <div className="mb-4 bg-white rounded-lg p-3 shadow-sm animate-pulse">
      <div className="h-6 bg-gray-200 rounded w-48"></div>
    </div>
  );
};

// Wrapper component that adds Suspense boundary
const ActiveFiltersWrapper = ({ promotionName }) => {
  return (
    <Suspense fallback={<ActiveFiltersFallback />}>
      <ActiveFilters promotionName={promotionName} />
    </Suspense>
  );
};

export default ActiveFiltersWrapper;
