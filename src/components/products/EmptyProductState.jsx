'use client'
import React from 'react';

const EmptyProductState = ({ search }) => {
  const handleClearFilters = () => {
    window.location.href = '/products';
  };

  return (
    <div className="col-span-4 py-10 text-center">
      <p className="text-[#7E7E7E] text-lg">No products found.</p>
      {search && (
        <p className="text-[#7E7E7E] mt-2">
          No results for "<span className="font-semibold">{search}</span>".
        </p>
      )}
      <p className="text-[#7E7E7E] mt-2">Try adjusting your filters or search criteria.</p>
      <button 
        onClick={handleClearFilters}
        className="mt-4 bg-[#006B51] text-white font-semibold py-2 px-4 rounded-full hover:bg-[#005541] transition-colors"
      >
        Clear all filters
      </button>
    </div>
  );
};

export default EmptyProductState;
