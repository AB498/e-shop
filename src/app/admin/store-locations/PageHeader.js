'use client';

import { PlusIcon } from '@heroicons/react/24/outline';

export default function PageHeader({ onAddClick }) {
  return (
    <div className="sm:flex sm:items-center">
      <div className="sm:flex-auto">
        <h1 className="text-2xl font-semibold text-gray-900">Store Locations</h1>
        <p className="mt-2 text-sm text-gray-700">
          Manage store locations for courier pickups. These locations will be used by Pathao courier service to pick up items for delivery.
        </p>
      </div>
      <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
        <button
          type="button"
          onClick={onAddClick}
          className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
        >
          <PlusIcon className="h-4 w-4 mr-2" />
          Add Store Location
        </button>
      </div>
    </div>
  );
}
