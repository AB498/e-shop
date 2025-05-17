'use client'
import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';

const PriceRangeFilter = () => {
  const searchParams = useSearchParams();
  const sliderRef = useRef(null);

  // Set a very high maximum value
  const MAX_PRICE = 10000;

  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(MAX_PRICE);
  const [minPercent, setMinPercent] = useState(0);
  const [maxPercent, setMaxPercent] = useState(100);
  const [isDragging, setIsDragging] = useState(null); // 'min', 'max', or null

  // Non-linear scale function to make steps smaller at lower price ranges
  // This uses a power function to map slider percentage to price
  const percentToPrice = (percent) => {
    // Apply a power curve: price = (percent/100)^3 * MAX_PRICE
    // This makes movements at the lower end of the scale result in much smaller price changes
    // The higher the exponent, the more sensitive the lower range becomes
    return Math.round(Math.pow(percent / 100, 3) * MAX_PRICE);
  };

  // Inverse function to map price back to percent for the slider
  const priceToPercent = (price) => {
    // Inverse of the power function: percent = 100 * (price/MAX_PRICE)^(1/3)
    return 100 * Math.pow(price / MAX_PRICE, 1/3);
  };

  // Initialize price range from URL on component mount
  useEffect(() => {
    const minFromUrl = searchParams.get('minPrice');
    const maxFromUrl = searchParams.get('maxPrice');

    // Set min price from URL or default to 0, ensuring it's not negative
    const newMinPrice = Math.max(0, minFromUrl ? Number(minFromUrl) : 0);
    setMinPrice(newMinPrice);
    setMinPercent(priceToPercent(newMinPrice));

    // Set max price from URL or default to MAX_PRICE, ensuring it's greater than min price
    const newMaxPrice = Math.max(newMinPrice + 1, maxFromUrl ? Number(maxFromUrl) : MAX_PRICE);
    setMaxPrice(newMaxPrice);
    setMaxPercent(priceToPercent(newMaxPrice));
  }, [searchParams]);

  // Handle mouse/touch events for dragging
  useEffect(() => {
    // Function to prevent text selection during dragging
    const preventTextSelection = (e) => {
      e.preventDefault();
    };

    const handleMouseMove = (e) => {
      if (!isDragging || !sliderRef.current) return;

      // Prevent default behavior to avoid text selection
      e.preventDefault();

      const rect = sliderRef.current.getBoundingClientRect();
      const sliderWidth = rect.width;

      // Handle both mouse and touch events
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;

      // Clamp clientX to the slider boundaries to prevent going outside
      const clampedClientX = Math.max(rect.left, Math.min(rect.right, clientX));
      const offsetX = clampedClientX - rect.left;

      // Calculate percentage (clamped between 0 and 100)
      let percent = Math.max(0, Math.min(100, (offsetX / sliderWidth) * 100));

      if (isDragging === 'min') {
        // Ensure min handle doesn't go beyond max handle and stays at or above 0
        percent = Math.min(Math.max(0, percent), maxPercent - 1);
        setMinPercent(percent);
        // Calculate price using non-linear scale and ensure it's never negative
        const calculatedPrice = percentToPrice(percent);
        setMinPrice(Math.max(0, calculatedPrice));
      } else if (isDragging === 'max') {
        // Ensure max handle doesn't go below min handle
        percent = Math.max(percent, minPercent + 1);
        setMaxPercent(percent);
        // Calculate price using non-linear scale and ensure it's never below min price + 1
        const calculatedPrice = percentToPrice(percent);
        setMaxPrice(Math.max(minPrice + 1, calculatedPrice));
      }
    };

    const handleTouchMove = (e) => {
      // Prevent page scrolling when dragging the slider
      e.preventDefault();
      handleMouseMove(e);
    };

    const handleMouseUp = () => {
      setIsDragging(null);
      // Remove the text selection prevention when done dragging
      document.removeEventListener('selectstart', preventTextSelection);
    };

    if (isDragging) {
      // Add event listener to prevent text selection during dragging
      document.addEventListener('selectstart', preventTextSelection);
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.addEventListener('touchmove', handleTouchMove, { passive: false });
      document.addEventListener('touchend', handleMouseUp);

      // Add a class to the body to indicate dragging state
      document.body.style.userSelect = 'none';
      document.body.style.webkitUserSelect = 'none';
      document.body.style.mozUserSelect = 'none';
      document.body.style.msUserSelect = 'none';
    }

    return () => {
      // Clean up all event listeners and styles
      document.removeEventListener('selectstart', preventTextSelection);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('touchmove', handleTouchMove, { passive: false });
      document.removeEventListener('touchend', handleMouseUp);

      // Reset body styles
      document.body.style.userSelect = '';
      document.body.style.webkitUserSelect = '';
      document.body.style.mozUserSelect = '';
      document.body.style.msUserSelect = '';
    };
  }, [isDragging, minPercent, maxPercent]);

  // Handle direct input for min price
  const handleMinPriceInput = (e) => {
    const value = parseInt(e.target.value) || 0;
    const newMinPrice = Math.max(0, Math.min(value, maxPrice - 1));
    setMinPrice(newMinPrice);
    setMinPercent(priceToPercent(newMinPrice));
  };

  // Handle direct input for max price
  const handleMaxPriceInput = (e) => {
    const value = parseInt(e.target.value) || 0;
    const newMaxPrice = Math.max(minPrice + 1, Math.min(value, MAX_PRICE));
    setMaxPrice(newMaxPrice);
    setMaxPercent(priceToPercent(newMaxPrice));
  };

  const applyPriceFilter = () => {
    // Create new URLSearchParams object
    const params = new URLSearchParams(searchParams.toString());

    // Update price parameters
    params.set('minPrice', minPrice.toString());

    // Only set maxPrice if it's not the maximum value
    if (maxPrice < MAX_PRICE) {
      params.set('maxPrice', maxPrice.toString());
    } else {
      // Remove maxPrice parameter if it's set to the maximum
      params.delete('maxPrice');
    }

    // Reset to page 1 when filtering
    params.set('page', '1');

    // Navigate with updated parameters
    window.location.href = `/products?${params.toString()}`;
  };

  // Format price for display
  const formatPrice = (price) => {
    if (price >= MAX_PRICE) return "Max";
    return `৳${price}`;
  };

  return (
    <div className="mb-4 select-none">
      <div className="flex justify-between mb-4">
        <div>
          <label className="text-[#7E7E7E] text-xs mb-1 block">Min Price</label>
          <div className="relative">
            <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500 text-xs">৳</span>
            <input
              type="number"
              value={minPrice}
              onChange={handleMinPriceInput}
              className="w-20 p-1 pl-5 border border-gray-300 rounded text-sm select-auto"
              min="0"
              max={maxPrice - 1}
            />
          </div>
        </div>
        <div>
          <label className="text-[#7E7E7E] text-xs mb-1 block">Max Price</label>
          <div className="relative">
            <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500 text-xs">৳</span>
            <input
              type="number"
              value={maxPrice === MAX_PRICE ? "" : maxPrice}
              onChange={handleMaxPriceInput}
              className="w-20 p-1 pl-5 border border-gray-300 rounded text-sm select-auto"
              min={minPrice + 1}
              max={MAX_PRICE}
              placeholder="Max"
            />
          </div>
        </div>
      </div>

      {/* Price Range Slider */}
      <div
        ref={sliderRef}
        className="relative h-1 bg-[#D6D7D9] rounded mb-6 mt-8 cursor-pointer select-none"
        style={{ touchAction: "none" }}
        onMouseDown={(e) => e.preventDefault()}
        onClick={(e) => {
          if (!sliderRef.current) return;
          const rect = sliderRef.current.getBoundingClientRect();
          const offsetX = e.clientX - rect.left;
          const percent = (offsetX / rect.width) * 100;

          // Determine which handle to move based on which one is closer
          const distToMin = Math.abs(percent - minPercent);
          const distToMax = Math.abs(percent - maxPercent);

          if (distToMin <= distToMax) {
            // Move min handle (ensure it stays at or above 0 and below max handle)
            const newMinPercent = Math.min(Math.max(0, percent), maxPercent - 1);
            setMinPercent(newMinPercent);
            // Calculate price using non-linear scale and ensure it's never negative
            const calculatedPrice = percentToPrice(newMinPercent);
            setMinPrice(Math.max(0, calculatedPrice));
          } else {
            // Move max handle (ensure it stays above min handle)
            const newMaxPercent = Math.max(percent, minPercent + 1);
            setMaxPercent(newMaxPercent);
            // Calculate price using non-linear scale and ensure it's never below min price + 1
            const calculatedPrice = percentToPrice(newMaxPercent);
            setMaxPrice(Math.max(minPrice + 1, calculatedPrice));
          }
        }}
      >
        {/* Background track */}
        <div className="absolute top-0 left-0 h-1 w-full bg-[#D6D7D9] rounded"></div>

        {/* Colored track between handles */}
        <div
          className="absolute top-0 h-1 bg-[#006B51] rounded"
          style={{
            left: `${minPercent}%`,
            width: `${maxPercent - minPercent}%`
          }}
        ></div>

        {/* Min handle */}
        <div
          className="absolute top-[-6px] w-4 h-4 rounded-full bg-[#006B51] cursor-pointer shadow-md hover:bg-[#005541] transition-colors select-none"
          style={{ left: `${minPercent}%`, marginLeft: "-8px", touchAction: "none" }}
          onMouseDown={(e) => {
            e.preventDefault(); // Prevent text selection
            setIsDragging('min');
          }}
          onTouchStart={(e) => {
            e.preventDefault(); // Prevent text selection
            setIsDragging('min');
          }}
        ></div>

        {/* Max handle */}
        <div
          className="absolute top-[-6px] w-4 h-4 rounded-full bg-[#006B51] cursor-pointer shadow-md hover:bg-[#005541] transition-colors select-none"
          style={{ left: `${maxPercent}%`, marginLeft: "-8px", touchAction: "none" }}
          onMouseDown={(e) => {
            e.preventDefault(); // Prevent text selection
            setIsDragging('max');
          }}
          onTouchStart={(e) => {
            e.preventDefault(); // Prevent text selection
            setIsDragging('max');
          }}
        ></div>
      </div>

      <div className="flex justify-between text-xs text-[#7E7E7E] mb-4">
        <span>{formatPrice(minPrice)}</span>
        <span>{formatPrice(maxPrice)}</span>
      </div>

      <button
        onClick={applyPriceFilter}
        className="bg-[#006B51] text-white text-xs font-semibold py-2 px-4 rounded-full hover:bg-[#005541] transition-colors w-full"
      >
        Apply Filter
      </button>
    </div>
  );
};

export default PriceRangeFilter;
