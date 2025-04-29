'use client'
import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

const PriceRangeFilter = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(1000);
  const [sliderPosition, setSliderPosition] = useState(50); // Percentage position of slider

  // Initialize price range from URL on component mount
  useEffect(() => {
    const minFromUrl = searchParams.get('minPrice');
    const maxFromUrl = searchParams.get('maxPrice');

    if (minFromUrl) {
      setMinPrice(Number(minFromUrl));
    }

    if (maxFromUrl) {
      setMaxPrice(Number(maxFromUrl));
    }

    // Calculate slider position based on current price range
    if (minFromUrl && maxFromUrl) {
      const range = 1000; // Maximum possible range
      const position = ((Number(maxFromUrl) - Number(minFromUrl)) / range) * 100;
      setSliderPosition(position);
    }
  }, [searchParams]);

  const handlePriceChange = (e) => {
    const value = parseInt(e.target.value);
    setSliderPosition(value);

    // Calculate min and max price based on slider position
    const range = 1000; // Maximum possible range
    const newMin = 0;
    const newMax = Math.round((value / 100) * range);

    setMinPrice(newMin);
    setMaxPrice(newMax);
  };

  const applyPriceFilter = () => {
    // Create new URLSearchParams object
    const params = new URLSearchParams(searchParams.toString());

    // Update price parameters
    params.set('minPrice', minPrice.toString());
    params.set('maxPrice', maxPrice.toString());

    // Reset to page 1 when filtering
    params.set('page', '1');

    // Navigate with updated parameters
    window.location.href = `/products?${params.toString()}`;
  };

  return (
    <div className="mb-4">
      <p className="text-[#7E7E7E] text-sm mb-2">From: ৳{minPrice}</p>
      <p className="text-[#7E7E7E] text-sm mb-4">To: ৳{maxPrice}</p>

      {/* Price Range Slider */}
      <div className="relative h-1 bg-[#D6D7D9] rounded mb-6">
        <div
          className="absolute left-0 top-0 h-1 bg-[#006B51] rounded"
          style={{ width: `${sliderPosition}%` }}
        ></div>
        <input
          type="range"
          min="0"
          max="100"
          value={sliderPosition}
          onChange={handlePriceChange}
          className="absolute w-full h-1 opacity-0 cursor-pointer"
        />
        <div
          className="absolute left-0 top-[-4px] w-3 h-3 rounded-full bg-[#006B51]"
        ></div>
        <div
          className="absolute top-[-4px] w-3 h-3 rounded-full bg-[#006B51]"
          style={{ left: `${sliderPosition}%` }}
        ></div>
      </div>

      <button
        onClick={applyPriceFilter}
        className="bg-[#006B51] text-white text-xs font-semibold py-1 px-3 rounded-full hover:bg-[#005541] transition-colors"
      >
        Apply Filter
      </button>
    </div>
  );
};

export default PriceRangeFilter;
