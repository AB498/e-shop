import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

export default function SearchBar({ searchTerm, onSearchChange }) {
  return (
    <div className="w-full sm:max-w-xs">
      <label htmlFor="search" className="sr-only">
        Search promotions
      </label>
      <div className="relative text-gray-400 focus-within:text-gray-600">
        <div className="pointer-events-none absolute inset-y-0 left-0 pl-3 flex items-center">
          <MagnifyingGlassIcon className="h-5 w-5" aria-hidden="true" />
        </div>
        <input
          id="search"
          className="block w-full bg-white py-2 pl-10 pr-3 border border-gray-300 rounded-md leading-5 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
          placeholder="Search promotions..."
          type="search"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
    </div>
  );
}
