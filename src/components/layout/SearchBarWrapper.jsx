'use client'
import React, { Suspense } from 'react';
import SearchBar from './SearchBar';

// Fallback component to show while SearchBar is loading
const SearchBarFallback = ({ placeholder }) => {
  return (
    <div className="relative w-full">
      <div className="flex items-center border border-[#D2D2D2] rounded-full px-2.5 sm:px-3 py-1 sm:py-1.5 bg-white">
        <input
          type="text"
          placeholder={placeholder}
          className="flex-grow bg-transparent outline-none text-[#555555] text-xs sm:text-sm"
          disabled
        />
        <div className="relative w-3.5 h-3.5 sm:w-4 sm:h-4 ml-1.5">
          {/* Placeholder for search icon */}
          <div className="w-3.5 h-3.5 sm:w-4 sm:h-4 bg-gray-200 rounded-full"></div>
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
