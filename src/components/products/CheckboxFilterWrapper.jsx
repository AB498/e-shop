'use client'
import React, { Suspense } from 'react';
import CheckboxFilter from './CheckboxFilter';

// Fallback component to show while CheckboxFilter is loading
const CheckboxFilterFallback = ({ title }) => {
  return (
    <div className="mb-6 animate-pulse">
      <div className="h-6 bg-gray-200 rounded w-32 mb-4"></div>
      <div className="space-y-3">
        <div className="h-5 bg-gray-200 rounded w-3/4"></div>
        <div className="h-5 bg-gray-200 rounded w-2/3"></div>
        <div className="h-5 bg-gray-200 rounded w-4/5"></div>
      </div>
    </div>
  );
};

// Wrapper component that adds Suspense boundary
const CheckboxFilterWrapper = ({ title, options, type }) => {
  return (
    <Suspense fallback={<CheckboxFilterFallback title={title} />}>
      <CheckboxFilter title={title} options={options} type={type} />
    </Suspense>
  );
};

export default CheckboxFilterWrapper;
