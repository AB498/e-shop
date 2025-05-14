'use client'
import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { XMarkIcon } from '@heroicons/react/24/outline';

const ActiveFilters = ({ promotionName }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [hasActiveFilters, setHasActiveFilters] = useState(false);
  const [activeFilters, setActiveFilters] = useState([]);

  useEffect(() => {
    const filters = [];
    let hasFilters = false;

    // Check for promotion filter
    const promotionId = searchParams.get('promotion');
    if (promotionId) {
      hasFilters = true;
      filters.push({
        type: 'promotion',
        label: promotionName || `Promotion`,
        value: promotionId,
        priority: 1 // Higher priority to show first
      });
    }

    // Check for category filter
    const categoryId = searchParams.get('categoryId');
    if (categoryId) {
      hasFilters = true;
      filters.push({
        type: 'categoryId',
        label: `Category`,
        value: categoryId,
        priority: 2
      });
    }

    // Check for price range filter
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    if (minPrice || maxPrice) {
      hasFilters = true;
      let priceLabel = 'Price: ';

      if (minPrice && maxPrice) {
        priceLabel += `৳${minPrice} - ৳${maxPrice}`;
      } else if (minPrice) {
        priceLabel += `Min ৳${minPrice}`;
      } else if (maxPrice) {
        priceLabel += `Max ৳${maxPrice}`;
      }

      filters.push({
        type: 'price',
        label: priceLabel,
        value: 'price',
        priority: 3
      });
    }

    // Check for color filter
    const color = searchParams.get('color');
    if (color) {
      hasFilters = true;
      filters.push({
        type: 'color',
        label: `Color: ${color.split(',').join(', ')}`,
        value: color,
        priority: 4
      });
    }

    // Check for condition filter
    const condition = searchParams.get('condition');
    if (condition) {
      hasFilters = true;
      filters.push({
        type: 'condition',
        label: `Condition: ${condition.split(',').join(', ')}`,
        value: condition,
        priority: 5
      });
    }

    // Sort filters by priority
    filters.sort((a, b) => a.priority - b.priority);

    // Set state
    setHasActiveFilters(hasFilters);
    setActiveFilters(filters);
  }, [searchParams, promotionName]);

  // If no active filters, don't render anything
  if (!hasActiveFilters) {
    return null;
  }

  const handleClearFilter = (type) => {
    // Create new URLSearchParams object
    const params = new URLSearchParams(searchParams.toString());

    // Handle different filter types
    if (type === 'price') {
      // For price filter, remove both min and max
      params.delete('minPrice');
      params.delete('maxPrice');
    } else {
      // Remove the specific filter
      params.delete(type);
    }

    // Reset to page 1 when changing filters
    params.set('page', '1');

    // Navigate with updated parameters
    router.push(`/products?${params.toString()}`);
  };

  const handleClearAllFilters = () => {
    router.push('/products');
  };

  return (
    <div className="mb-4 bg-white rounded-lg p-2 sm:p-3 shadow-sm border border-[#ECECEC]">
      <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
        <div className="flex items-center justify-between w-full sm:w-auto mb-1.5 sm:mb-0">
          <span className="text-xs sm:text-sm text-[#7E7E7E] font-medium">Active filters:</span>

          {activeFilters.length > 0 && (
            <button
              onClick={handleClearAllFilters}
              className="text-xs text-[#006B51] hover:text-[#005541] font-semibold flex items-center sm:hidden"
            >
              <XMarkIcon className="h-3.5 w-3.5 mr-1" />
              Clear all
            </button>
          )}
        </div>

        <div className="flex flex-wrap gap-1.5 sm:gap-2 w-full sm:w-auto">
          {activeFilters.map((filter, index) => (
            <div
              key={index}
              className="inline-flex items-center bg-[#F0F7F5] text-[#006B51] text-xs rounded-full px-2.5 sm:px-3 py-1 sm:py-1.5 border border-[#E3F1EC]"
            >
              <span className="mr-1 font-medium line-clamp-1">{filter.label}</span>
              <button
                onClick={() => handleClearFilter(filter.type)}
                className="ml-1 text-[#006B51] hover:text-[#005541] focus:outline-none flex-shrink-0"
                aria-label={`Remove ${filter.label} filter`}
                title="Remove filter"
              >
                <XMarkIcon className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>

        {activeFilters.length > 0 && (
          <button
            onClick={handleClearAllFilters}
            className="text-xs text-[#006B51] hover:text-[#005541] font-semibold ml-auto hidden sm:flex items-center"
          >
            <XMarkIcon className="h-3.5 w-3.5 mr-1" />
            Clear all filters
          </button>
        )}
      </div>
    </div>
  );
};

export default ActiveFilters;
