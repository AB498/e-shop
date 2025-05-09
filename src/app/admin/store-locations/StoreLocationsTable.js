'use client';

import { CheckCircleIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import Table from '@/components/ui/table';

export default function StoreLocationsTable({
  locations,
  isLoading,
  onEdit,
  onDelete
}) {
  // Define table columns
  const columns = [
    {
      key: 'name',
      label: 'Name',
      sortable: true,
      render: (location) => (
        <div className="text-sm font-medium text-gray-900">{location.name}</div>
      )
    },
    {
      key: 'contact',
      label: 'Contact',
      render: (location) => (
        <div className="text-sm text-gray-500">
          <div>{location.contact_name}</div>
          <div>{location.contact_number}</div>
          {location.secondary_contact && (
            <div className="text-xs text-gray-400">{location.secondary_contact}</div>
          )}
        </div>
      )
    },
    {
      key: 'address',
      label: 'Address',
      responsive: 'md',
      render: (location) => (
        <div className="text-sm text-gray-500">{location.address}</div>
      )
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      render: (location) => (
        <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
          location.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {location.is_active ? 'Active' : 'Inactive'}
        </span>
      )
    },
    {
      key: 'default',
      label: 'Default',
      responsive: 'lg',
      render: (location) => (
        location.is_default ? (
          <CheckCircleIcon className="h-5 w-5 text-green-500" />
        ) : (
          <span className="text-gray-400">-</span>
        )
      )
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (location) => (
        <div className="flex space-x-3">
          <button
            onClick={() => onEdit(location)}
            className="text-indigo-600 hover:text-indigo-900"
            title="Edit Location"
          >
            <PencilIcon className="h-5 w-5" />
            <span className="sr-only">Edit</span>
          </button>
          <button
            onClick={() => onDelete(location.id)}
            className="text-red-600 hover:text-red-900"
            title="Delete Location"
          >
            <TrashIcon className="h-5 w-5" />
            <span className="sr-only">Delete</span>
          </button>
        </div>
      )
    }
  ];

  return (
    <Table
      data={locations}
      columns={columns}
      title="Store Locations"
      isLoading={isLoading}
      emptyMessage="No store locations found"
      enableSorting={true}
      enablePagination={true}
      pageSizeOptions={[10, 25, 50, 100]}
      initialState={{
        pageSize: 10,
        sortBy: 'name',
        sortDirection: 'asc',
      }}
    />
  );
}
