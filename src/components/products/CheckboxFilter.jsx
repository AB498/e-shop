'use client'
import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

const CheckboxFilter = ({ type, options }) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Initialize selected options from URL
  const [selectedOptions, setSelectedOptions] = useState([]);

  useEffect(() => {
    const filterParam = searchParams.get(type);
    if (filterParam) {
      setSelectedOptions(filterParam.split(','));
    }
  }, [searchParams, type]);

  const handleCheckboxChange = (value) => {
    let newSelectedOptions;

    if (selectedOptions.includes(value)) {
      // Remove option if already selected
      newSelectedOptions = selectedOptions.filter(option => option !== value);
    } else {
      // Add option if not selected
      newSelectedOptions = [...selectedOptions, value];
    }

    setSelectedOptions(newSelectedOptions);
  };

  const applyFilter = () => {
    // Create new URLSearchParams object
    const params = new URLSearchParams(searchParams.toString());

    // Update filter parameter
    if (selectedOptions.length > 0) {
      params.set(type, selectedOptions.join(','));
    } else {
      params.delete(type);
    }

    // Reset to page 1 when filtering
    params.set('page', '1');

    // Navigate with updated parameters
    window.location.href = `/products?${params.toString()}`;
  };

  return (
    <div className="mb-4">
      <div className="space-y-2">
        {options.map((option) => (
          <div key={option.value} className="flex items-center">
            <input
              type="checkbox"
              id={`${type}-${option.value}`}
              className="mr-2 border-2 border-[#CED4DA] rounded"
              checked={selectedOptions.includes(option.value)}
              onChange={() => handleCheckboxChange(option.value)}
            />
            <label htmlFor={`${type}-${option.value}`} className="text-[#687188] text-sm">
              {option.label} ({option.count})
            </label>
          </div>
        ))}
      </div>

      {selectedOptions.length > 0 && (
        <button
          onClick={applyFilter}
          className="mt-3 bg-[#006B51] text-white text-xs font-semibold py-1 px-3 rounded-full hover:bg-[#005541] transition-colors"
        >
          Apply Filter
        </button>
      )}
    </div>
  );
};

export default CheckboxFilter;
