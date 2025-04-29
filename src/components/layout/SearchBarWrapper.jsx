'use client'
import React, { Suspense } from 'react';
import SearchBar from './SearchBar';

// Fallback component to show while SearchBar is loading
const SearchBarFallback = ({ placeholder }) => {
  return (
    <div className="relative flex-grow max-w-2xl">
      <div className="flex items-center border border-[#D2D2D2] rounded-full px-4 py-2 bg-white">
        <input
          type="text"
          placeholder={placeholder}
          className="flex-grow bg-transparent outline-none text-[#555555] text-base"
          disabled
        />
        <div className="relative w-5 h-5 ml-2">
          {/* Placeholder for search icon */}
          <div className="w-5 h-5 bg-gray-200 rounded-full"></div>
        </div>
      </div>
    </div>
  );
};

// Wrapper component that adds Suspense boundary
const SearchBarWrapper = ({ placeholder }) => {
  return (
    <Suspense fallback={<SearchBarFallback placeholder={placeholder} />}>
      <SearchBar placeholder={placeholder} />
    </Suspense>
  );
};

export default SearchBarWrapper;
