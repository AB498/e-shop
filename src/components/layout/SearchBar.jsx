'use client'
import React, { useState, useEffect } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import Image from 'next/image';

const SearchBar = ({ placeholder = "Search for products (e.g. eggs, milk, potato)" }) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState('');

  // Initialize search term from URL on component mount
  useEffect(() => {
    const search = searchParams.get('search');
    if (search) {
      setSearchTerm(search);
    }
  }, [searchParams]);

  const handleSearch = (e) => {
    e.preventDefault();

    // Create new URLSearchParams object
    const params = new URLSearchParams(searchParams.toString());

    // Update or remove search parameter
    if (searchTerm.trim()) {
      params.set('search', searchTerm.trim());
      console.log('Setting search term:', searchTerm.trim());
    } else {
      params.delete('search');
      console.log('Removing search term');
    }

    // Reset to page 1 when searching
    params.set('page', '1');

    // Navigate to products page with search parameters
    const queryString = params.toString();
    console.log('Search query string:', queryString);

    // Use window.location for a full page refresh to ensure server components re-render
    window.location.href = `/products?${queryString}`;
  };

  return (
    <form onSubmit={handleSearch} className="relative w-full">
      <div className="flex items-center border border-[#D2D2D2] rounded-full px-2.5 sm:px-3 py-1 sm:py-1.5 bg-white">
        <input
          type="text"
          placeholder={placeholder}
          className="flex-grow bg-transparent outline-none text-[#555555] text-xs sm:text-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button
          type="submit"
          className="relative w-3.5 h-3.5 sm:w-4 sm:h-4 ml-1.5 cursor-pointer"
          aria-label="Search"
        >
          <Image
            src="/images/navigation/search.png"
            alt="Search"
            fill
            className="object-contain"
          />
        </button>
      </div>
    </form>
  );
};

export default SearchBar;
