'use client';

import { PencilIcon, TrashIcon, PhotoIcon } from '@heroicons/react/24/outline';
import Table from '@/components/ui/table';

export default function CategoriesTable({ categories, onEdit, onDelete, isLoading }) {
  // Format date to a readable format
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Define table columns
  const columns = [
    {
      key: 'image',
      label: 'Image',
      render: (category) => (
        <div className="flex-shrink-0 h-12 w-12 relative">
          {category.image ? (
            <>
              <img
                src={category.image}
                alt={category.name}
                className="rounded-md object-cover w-12 h-12 border border-gray-200"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.nextElementSibling.style.display = 'flex';
                }}
                loading="lazy"
              />
              <div className="hidden h-12 w-12 rounded-md bg-gray-100 items-center justify-center text-gray-500 border border-gray-200">
                <PhotoIcon className="h-6 w-6 text-gray-400" />
              </div>
            </>
          ) : (
            <div className="h-12 w-12 rounded-md bg-gray-100 flex items-center justify-center text-gray-500 border border-gray-200">
              <PhotoIcon className="h-6 w-6 text-gray-400" />
            </div>
          )}
        </div>
      )
    },
    {
      key: 'name',
      label: 'Name',
      sortable: true,
      render: (category) => (
        <div className="text-sm font-medium text-gray-900">{category.name}</div>
      )
    },
    {
      key: 'slug',
      label: 'Slug',
      sortable: true,
      render: (category) => (
        <div className="text-sm text-gray-500">{category.slug}</div>
      )
    },
    {
      key: 'created_at',
      label: 'Created',
      sortable: true,
      responsive: 'md',
      render: (category) => (
        <div className="text-sm text-gray-500">{formatDate(category.created_at)}</div>
      )
    },
    {
      key: 'updated_at',
      label: 'Updated',
      sortable: true,
      responsive: 'lg',
      render: (category) => (
        <div className="text-sm text-gray-500">{formatDate(category.updated_at)}</div>
      )
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (category) => (
        <div className="flex space-x-3">
          <button
            onClick={() => onEdit(category)}
            className="text-emerald-600 hover:text-emerald-900"
            title="Edit Category"
            disabled={isLoading}
          >
            <PencilIcon className="h-5 w-5" />
          </button>
          <button
            onClick={() => onDelete(category)}
            className="text-red-600 hover:text-red-900"
            title="Delete Category"
            disabled={isLoading}
          >
            <TrashIcon className="h-5 w-5" />
          </button>
        </div>
      )
    }
  ];

  return (
    <Table
      data={categories}
      columns={columns}
      title="Categories"
      isLoading={isLoading}
      emptyMessage="No categories found"
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
