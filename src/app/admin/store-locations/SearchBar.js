'use client';

import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

export default function SearchBar({ searchTerm, onSearchChange }) {
  return (
    <div className="mt-6 flex flex-col sm:flex-row justify-between">
      <div className="relative flex items-center w-full sm:w-64">
        <input
          type="text"
          placeholder="Search locations..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm pl-10 py-2"
        />
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
        </div>
      </div>
    </div>
  );
}
