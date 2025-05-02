'use client';

import { CheckCircleIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';

export default function StoreLocationsTable({ 
  locations, 
  isLoading, 
  onEdit, 
  onDelete 
}) {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (locations.length === 0) {
    return (
      <div className="text-center py-12 px-4 sm:px-6 lg:px-8">
        <p className="text-gray-500">No store locations found.</p>
      </div>
    );
  }

  return (
    <table className="min-w-full divide-y divide-gray-300">
      <thead className="bg-gray-50">
        <tr>
          <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
            Name
          </th>
          <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
            Contact
          </th>
          <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
            Address
          </th>
          <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
            Status
          </th>
          <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
            Default
          </th>
          <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
            <span className="sr-only">Actions</span>
          </th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-200 bg-white">
        {locations.map((location) => (
          <tr key={location.id}>
            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
              {location.name}
            </td>
            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
              <div>{location.contact_name}</div>
              <div>{location.contact_number}</div>
              {location.secondary_contact && (
                <div className="text-xs text-gray-400">{location.secondary_contact}</div>
              )}
            </td>
            <td className="px-3 py-4 text-sm text-gray-500">
              {location.address}
            </td>
            <td className="whitespace-nowrap px-3 py-4 text-sm">
              <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                location.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {location.is_active ? 'Active' : 'Inactive'}
              </span>
            </td>
            <td className="whitespace-nowrap px-3 py-4 text-sm">
              {location.is_default ? (
                <CheckCircleIcon className="h-5 w-5 text-green-500" />
              ) : (
                <span className="text-gray-400">-</span>
              )}
            </td>
            <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
              <button
                onClick={() => onEdit(location)}
                className="text-indigo-600 hover:text-indigo-900 mr-4"
              >
                <PencilIcon className="h-5 w-5" />
                <span className="sr-only">Edit</span>
              </button>
              <button
                onClick={() => onDelete(location.id)}
                className="text-red-600 hover:text-red-900"
              >
                <TrashIcon className="h-5 w-5" />
                <span className="sr-only">Delete</span>
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
