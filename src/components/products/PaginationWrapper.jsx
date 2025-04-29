'use client'
import React, { Suspense } from 'react';
import Pagination from './Pagination';

// Fallback component to show while Pagination is loading
const PaginationFallback = () => {
  return (
    <div className="flex justify-center mt-8 animate-pulse">
      <div className="flex space-x-2">
        <div className="h-10 bg-gray-200 rounded w-10"></div>
        <div className="h-10 bg-gray-200 rounded w-10"></div>
        <div className="h-10 bg-gray-200 rounded w-10"></div>
      </div>
    </div>
  );
};

// Wrapper component that adds Suspense boundary
const PaginationWrapper = ({ pagination }) => {
  return (
    <Suspense fallback={<PaginationFallback />}>
      <Pagination pagination={pagination} />
    </Suspense>
  );
};

export default PaginationWrapper;
