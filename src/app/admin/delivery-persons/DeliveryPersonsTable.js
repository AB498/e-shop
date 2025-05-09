'use client';

import {
  UserIcon,
  PencilIcon,
  TrashIcon,
  StarIcon,
} from '@heroicons/react/24/outline';
import Table from '@/components/ui/table';

export default function DeliveryPersonsTable({ 
  deliveryPersons, 
  isLoading, 
  onEdit, 
  onDelete 
}) {
  // Helper function to get status badge class
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'on_delivery':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Define table columns
  const columns = [
    {
      key: 'profile',
      label: 'Profile',
      render: (person) => (
        <div className="flex items-center">
          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
            {person.profile_image ? (
              <img
                src={person.profile_image}
                alt={person.name}
                className="h-10 w-10 rounded-full"
              />
            ) : (
              <UserIcon className="h-5 w-5 text-gray-500" />
            )}
          </div>
          <div className="ml-4">
            <div className="text-sm font-medium text-gray-900">{person.name}</div>
          </div>
        </div>
      )
    },
    {
      key: 'contact',
      label: 'Contact',
      responsive: 'md',
      render: (person) => (
        <div>
          <div className="text-sm text-gray-900">{person.phone}</div>
          {person.email && <div className="text-sm text-gray-500">{person.email}</div>}
        </div>
      )
    },
    {
      key: 'location',
      label: 'Location',
      responsive: 'lg',
      render: (person) => (
        <div>
          <div className="text-sm text-gray-900">{person.city}</div>
          <div className="text-sm text-gray-500">{person.area}</div>
        </div>
      )
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      render: (person) => (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass(person.status)}`}>
          {person.status === 'on_delivery' ? 'On Delivery' : person.status === 'active' ? 'Active' : 'Inactive'}
        </span>
      )
    },
    {
      key: 'orders',
      label: 'Orders',
      sortable: true,
      responsive: 'md',
      render: (person) => (
        <div>
          <div className="text-sm text-gray-500">Current: {person.current_orders}</div>
          <div className="text-sm text-gray-500">Total: {person.total_orders}</div>
        </div>
      )
    },
    {
      key: 'rating',
      label: 'Rating',
      sortable: true,
      render: (person) => (
        <div className="flex items-center">
          <StarIcon className="h-4 w-4 text-yellow-400 mr-1" />
          <span>{person.rating}</span>
        </div>
      )
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (person) => (
        <div className="flex space-x-2">
          <button
            onClick={() => onEdit(person)}
            className="text-indigo-600 hover:text-indigo-900"
            title="Edit Delivery Person"
          >
            <PencilIcon className="h-5 w-5" />
          </button>
          <button
            onClick={() => onDelete(person)}
            className="text-red-600 hover:text-red-900"
            title="Delete Delivery Person"
          >
            <TrashIcon className="h-5 w-5" />
          </button>
        </div>
      )
    }
  ];

  return (
    <Table
      data={deliveryPersons}
      columns={columns}
      title="Delivery Persons"
      isLoading={isLoading}
      emptyMessage="No delivery persons found"
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
