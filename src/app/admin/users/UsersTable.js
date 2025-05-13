'use client';

import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import Table from '@/components/ui/table';
import Image from 'next/image';

export default function UsersTable({ users, isLoading, onEdit, onDelete, currentUserId }) {
  const columns = [
    {
      key: 'fullName',
      label: 'Name',
      render: (user) => (
        <div className="flex items-center">
          <div className="h-8 w-8 rounded-full bg-gradient-to-r from-emerald-500 to-emerald-600 flex items-center justify-center text-white mr-3">
            {user.firstName.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="font-medium text-gray-900">{user.fullName}</div>
            <div className="text-gray-500 text-sm">{user.email}</div>
          </div>
        </div>
      ),
      sortable: true,
    },
    {
      key: 'email',
      label: 'Email',
      render: (user) => user.email,
      sortable: true,
    },
    {
      key: 'phone',
      label: 'Phone',
      render: (user) => user.phone || '-',
      sortable: true,
    },
    {
      key: 'createdAt',
      label: 'Created At',
      render: (user) => user.createdAt,
      sortable: true,
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (user) => (
        <div className="flex space-x-2">
          <button
            onClick={() => onEdit(user)}
            className="text-emerald-600 hover:text-emerald-900"
            title="Edit Admin User"
          >
            <PencilIcon className="h-5 w-5" />
          </button>
          {/* Don't allow deleting the current user */}
          {user.id !== currentUserId && (
            <button
              onClick={() => onDelete(user)}
              className="text-red-600 hover:text-red-900"
              title="Delete Admin User"
            >
              <TrashIcon className="h-5 w-5" />
            </button>
          )}
        </div>
      )
    }
  ];

  return (
    <Table
      data={users}
      columns={columns}
      title="Admin Users"
      isLoading={isLoading}
      emptyMessage="No admin users found"
      enableSorting={true}
      enablePagination={true}
      pageSizeOptions={[10, 25, 50, 100]}
      initialState={{
        pageSize: 10,
        sortBy: 'fullName',
        sortDirection: 'asc',
      }}
    />
  );
}
