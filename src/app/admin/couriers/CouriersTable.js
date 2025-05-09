'use client';

import { ArrowsUpDownIcon } from '@heroicons/react/24/outline';
import Table from '@/components/ui/table';

export default function CouriersTable({ 
  couriers, 
  isLoading, 
  onToggleStatus 
}) {
  // Define table columns
  const columns = [
    {
      key: 'name',
      label: 'Name',
      sortable: true,
      render: (courier) => (
        <div className="text-sm font-medium text-gray-900">{courier.name}</div>
      )
    },
    {
      key: 'description',
      label: 'Description',
      render: (courier) => (
        <div className="text-sm text-gray-500">{courier.description}</div>
      )
    },
    {
      key: 'type',
      label: 'Type',
      sortable: true,
      responsive: 'md',
      render: (courier) => (
        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
          ${courier.type === 'internal' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'}`}>
          {courier.type === 'internal' ? 'Internal' : 'External'}
        </span>
      )
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      render: (courier) => (
        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
          ${courier.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {courier.is_active ? 'Active' : 'Inactive'}
        </span>
      )
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (courier) => (
        <div className="flex justify-end">
          <button
            onClick={() => onToggleStatus(courier.id)}
            className={`inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white ${courier.is_active
                ? 'bg-red-600 hover:bg-red-700'
                : 'bg-green-600 hover:bg-green-700'
              } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
          >
            <ArrowsUpDownIcon className="-ml-0.5 mr-1 h-4 w-4" />
            {courier.is_active ? 'Deactivate' : 'Activate'}
          </button>
        </div>
      )
    }
  ];

  return (
    <Table
      data={couriers}
      columns={columns}
      title="Couriers"
      isLoading={isLoading}
      emptyMessage="No couriers found"
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
