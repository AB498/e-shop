'use client'
import React from 'react';

const EmptyProductState = ({ search }) => {
  const handleClearFilters = () => {
    window.location.href = '/products';
  };

  return (
    <div className="col-span-full py-6 sm:py-8 md:py-10 text-center">
      <p className="text-[#7E7E7E] text-sm sm:text-base md:text-lg">No products found.</p>
      {search && (
        <p className="text-[#7E7E7E] text-xs sm:text-sm md:text-base mt-1 sm:mt-2">
          No results for "<span className="font-semibold">{search}</span>".
        </p>
      )}
      <p className="text-[#7E7E7E] text-xs sm:text-sm md:text-base mt-1 sm:mt-2">Try adjusting your filters or search criteria.</p>
      <button
        onClick={handleClearFilters}
        className="mt-3 sm:mt-4 bg-[#006B51] text-white font-semibold text-xs sm:text-sm py-1.5 sm:py-2 px-3 sm:px-4 rounded-full hover:bg-[#005541] transition-colors"
      >
        Clear all filters
      </button>
    </div>
  );
};

export default EmptyProductState;
