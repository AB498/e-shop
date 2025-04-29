'use client'
import React, { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';

const ProductListControls = ({ totalProducts }) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Get current values from URL
  const currentLimit = Number(searchParams.get('limit')) || 12;
  const currentSortBy = searchParams.get('sortBy') || 'id';
  const currentSortOrder = searchParams.get('sortOrder') || 'asc';

  // State for dropdowns
  const [showLimitDropdown, setShowLimitDropdown] = useState(false);
  const [showSortDropdown, setShowSortDropdown] = useState(false);

  // Refs for dropdown containers
  const limitDropdownRef = useRef(null);
  const sortDropdownRef = useRef(null);

  // Available options
  const limitOptions = [12, 24, 36, 48];
  const sortOptions = [
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
    return option ? option.label : 'Featured';
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
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-[#7E7E7E] text-base">
        We found {totalProducts} items for you!
      </h2>

      <div className="flex space-x-4">
        {/* Limit Dropdown */}
        <div className="relative" ref={limitDropdownRef}>
          <div
            className="flex items-center border border-[#ECECEC] rounded-[10px] px-4 py-2 cursor-pointer hover:bg-[#F9F9F9] transition-colors"
            onClick={() => setShowLimitDropdown(!showLimitDropdown)}
          >
            <Image src="/images/navigation/filter.png" alt="Filter" width={16} height={16} />
            <span className="text-[#777777] text-sm ml-2 font-semibold">Show:</span>
            <span className="text-[#7E7E7E] text-sm font-semibold ml-2">{currentLimit}</span>
            <Image
              src="/images/navigation/chevron-down.png"
              alt="Dropdown"
              width={12}
              height={12}
              className={`ml-2 transition-transform ${showLimitDropdown ? 'rotate-180' : ''}`}
            />
          </div>

          {showLimitDropdown && (
            <div className="absolute top-full left-0 mt-1 w-full bg-white border border-[#ECECEC] rounded-[10px] shadow-lg z-10">
              {limitOptions.map((limit) => (
                <div
                  key={limit}
                  className={`px-4 py-2 cursor-pointer hover:bg-[#F9F9F9] transition-colors ${
                    limit === currentLimit ? 'bg-[#F9F9F9] text-[#006B51] font-semibold' : 'text-[#7E7E7E]'
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
        <div className="relative" ref={sortDropdownRef}>
          <div
            className="flex items-center border border-[#ECECEC] rounded-[10px] px-4 py-2 cursor-pointer hover:bg-[#F9F9F9] transition-colors"
            onClick={() => setShowSortDropdown(!showSortDropdown)}
          >
            <Image src="/images/navigation/sort.png" alt="Sort" width={16} height={16} />
            <span className="text-[#777777] text-sm ml-2 font-semibold">Sort by:</span>
            <span className="text-[#7E7E7E] text-sm font-semibold ml-2">
              {getCurrentSortLabel()}
            </span>
            <Image
              src="/images/navigation/chevron-down.png"
              alt="Dropdown"
              width={12}
              height={12}
              className={`ml-2 transition-transform ${showSortDropdown ? 'rotate-180' : ''}`}
            />
          </div>

          {showSortDropdown && (
            <div className="absolute top-full right-0 mt-1 w-48 bg-white border border-[#ECECEC] rounded-[10px] shadow-lg z-10">
              {sortOptions.map((option, index) => (
                <div
                  key={index}
                  className={`px-4 py-2 cursor-pointer hover:bg-[#F9F9F9] transition-colors ${
                    option.value === currentSortBy && option.order === currentSortOrder
                      ? 'bg-[#F9F9F9] text-[#006B51] font-semibold'
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
