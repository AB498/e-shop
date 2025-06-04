'use client'
import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';

const ProductListControls = ({ totalProducts }) => {
  const searchParams = useSearchParams();

  // Get current values from URL
  const currentLimit = Number(searchParams.get('limit')) || 24;
  const currentSortBy = searchParams.get('sortBy') || 'created_at';
  const currentSortOrder = searchParams.get('sortOrder') || 'desc';

  // State for dropdowns
  const [showLimitDropdown, setShowLimitDropdown] = useState(false);
  const [showSortDropdown, setShowSortDropdown] = useState(false);

  // Refs for dropdown containers
  const limitDropdownRef = useRef(null);
  const sortDropdownRef = useRef(null);

  // Available options
  const limitOptions = [12, 24, 36, 48];
  const sortOptions = [
    { value: 'created_at', label: 'Newest First', order: 'desc' },
    { value: 'id', label: 'Featured', order: 'asc' },
    { value: 'name', label: 'Name (A-Z)', order: 'asc' },
    { value: 'name', label: 'Name (Z-A)', order: 'desc' },
    { value: 'price', label: 'Price (Low to High)', order: 'asc' },
    { value: 'price', label: 'Price (High to Low)', order: 'desc' }
  ];

  // Get current sort option label
  const getCurrentSortLabel = () => {
    const option = sortOptions.find(
      opt => opt.value === currentSortBy && opt.order === currentSortOrder
    );
    return option ? option.label : 'Newest First';
  };

  // Handle limit change
  const handleLimitChange = (limit) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('limit', limit.toString());
    params.set('page', '1'); // Reset to page 1 when changing limit
    window.location.href = `/products?${params.toString()}`;
    setShowLimitDropdown(false);
  };

  // Handle sort change
  const handleSortChange = (sortBy, sortOrder) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('sortBy', sortBy);
    params.set('sortOrder', sortOrder);
    window.location.href = `/products?${params.toString()}`;
    setShowSortDropdown(false);
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (limitDropdownRef.current && !limitDropdownRef.current.contains(event.target)) {
        setShowLimitDropdown(false);
      }
      if (sortDropdownRef.current && !sortDropdownRef.current.contains(event.target)) {
        setShowSortDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-2 sm:mb-3 md:mb-4 gap-1 sm:gap-0">
      <h2 className="text-[#7E7E7E] text-[10px] sm:text-xs whitespace-nowrap">
        We found {totalProducts} items for you!
      </h2>

      <div className="flex w-full sm:w-auto space-x-1 sm:space-x-2">
        {/* Limit Dropdown */}
        <div className="relative flex-1 sm:flex-none" ref={limitDropdownRef}>
          <div
            className="flex items-center border border-[#ECECEC] rounded px-1.5 sm:px-2 py-0.5 sm:py-1 cursor-pointer hover:bg-[#F9F9F9] transition-colors"
            onClick={() => setShowLimitDropdown(!showLimitDropdown)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#777777" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-2.5 h-2.5 sm:w-3 sm:h-3">
              <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
            </svg>
            <span className="text-[#777777] text-[9px] sm:text-[10px] ml-0.5 sm:ml-1 font-medium">Show:</span>
            <span className="text-[#7E7E7E] text-[9px] sm:text-[10px] font-medium ml-0.5 sm:ml-1">{currentLimit}</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="8"
              height="8"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#777777"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={`w-1.5 h-1.5 sm:w-2 sm:h-2 ml-0.5 sm:ml-1 transition-transform ${showLimitDropdown ? 'rotate-180' : ''}`}
            >
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </div>

          {showLimitDropdown && (
            <div className="absolute top-full left-0 mt-0.5 w-full bg-white border border-[#ECECEC] rounded shadow-sm z-10">
              {limitOptions.map((limit) => (
                <div
                  key={limit}
                  className={`px-1.5 py-0.5 sm:px-2 sm:py-1 text-[9px] sm:text-[10px] cursor-pointer hover:bg-[#F9F9F9] transition-colors ${
                    limit === currentLimit ? 'bg-[#F9F9F9] text-[#006B51] font-medium' : 'text-[#7E7E7E]'
                  }`}
                  onClick={() => handleLimitChange(limit)}
                >
                  {limit}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Sort Dropdown */}
        <div className="relative flex-1 sm:flex-none" ref={sortDropdownRef}>
          <div
            className="flex items-center border border-[#ECECEC] rounded px-1.5 sm:px-2 py-0.5 sm:py-1 cursor-pointer hover:bg-[#F9F9F9] transition-colors"
            onClick={() => setShowSortDropdown(!showSortDropdown)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#777777" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-2.5 h-2.5 sm:w-3 sm:h-3">
              <line x1="4" y1="9" x2="20" y2="9"></line>
              <line x1="4" y1="15" x2="14" y2="15"></line>
              <line x1="4" y1="21" x2="9" y2="21"></line>
              <line x1="4" y1="3" x2="9" y2="3"></line>
            </svg>
            <span className="text-[#777777] text-[9px] sm:text-[10px] ml-0.5 sm:ml-1 font-medium whitespace-nowrap">Sort:</span>
            <span className="text-[#7E7E7E] text-[9px] sm:text-[10px] font-medium ml-0.5 sm:ml-1 truncate max-w-[40px] sm:max-w-[50px]">
              {getCurrentSortLabel()}
            </span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="8"
              height="8"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#777777"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={`w-1.5 h-1.5 sm:w-2 sm:h-2 ml-0.5 sm:ml-1 transition-transform ${showSortDropdown ? 'rotate-180' : ''}`}
            >
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </div>

          {showSortDropdown && (
            <div className="absolute top-full right-0 mt-0.5 w-28 sm:w-32 bg-white border border-[#ECECEC] rounded shadow-sm z-10">
              {sortOptions.map((option, index) => (
                <div
                  key={index}
                  className={`px-1.5 py-0.5 sm:px-2 sm:py-1 text-[9px] sm:text-[10px] cursor-pointer hover:bg-[#F9F9F9] transition-colors ${
                    option.value === currentSortBy && option.order === currentSortOrder
                      ? 'bg-[#F9F9F9] text-[#006B51] font-medium'
                      : 'text-[#7E7E7E]'
                  }`}
                  onClick={() => handleSortChange(option.value, option.order)}
                >
                  {option.label}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductListControls;
