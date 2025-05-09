'use client';

import { EyeIcon } from '@heroicons/react/24/outline';
import Table from '@/components/ui/table';

export default function CustomersTable({ 
  customers, 
  isLoading, 
  onViewCustomer 
}) {
  // Define table columns
  const columns = [
    {
      key: 'name',
      label: 'Name',
      sortable: true,
      render: (customer) => (
        <div className="text-sm font-medium text-gray-900">{customer.name}</div>
      )
    },
    {
      key: 'email',
      label: 'Email',
      sortable: true,
      render: (customer) => (
        <div className="text-sm text-gray-500">{customer.email}</div>
      )
    },
    {
      key: 'orders',
      label: 'Orders',
      sortable: true,
      responsive: 'md',
      render: (customer) => (
        <div className="text-sm text-gray-500">{customer.orders}</div>
      )
    },
    {
      key: 'totalSpent',
      label: 'Total Spent',
      sortable: true,
      render: (customer) => (
        <div className="text-sm text-gray-900">{customer.totalSpent}</div>
      )
    },
    {
      key: 'lastOrder',
      label: 'Last Order',
      sortable: true,
      responsive: 'lg',
      render: (customer) => (
        <div className="text-sm text-gray-500">{customer.lastOrder}</div>
      )
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      render: (customer) => (
        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
          ${customer.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
          {customer.status}
        </span>
      )
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (customer) => (
        <button
          onClick={() => onViewCustomer(customer)}
          className="text-emerald-600 hover:text-emerald-900"
          title="View Customer"
        >
          <EyeIcon className="h-5 w-5" />
        </button>
      )
    }
  ];

  return (
    <Table
      data={customers}
      columns={columns}
      title="Customers"
      isLoading={isLoading}
      emptyMessage="No customers found"
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
