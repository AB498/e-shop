'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  PlusIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';
import Table from '@/components/ui/table';

export default function TableDemo() {
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Sample data
  const data = [
    { id: 1, name: 'Product A', category: 'Electronics', price: 299.99, stock: 25, status: 'In Stock' },
    { id: 2, name: 'Product B', category: 'Clothing', price: 49.99, stock: 100, status: 'In Stock' },
    { id: 3, name: 'Product C', category: 'Home', price: 199.99, stock: 5, status: 'Low Stock' },
    { id: 4, name: 'Product D', category: 'Electronics', price: 599.99, stock: 0, status: 'Out of Stock' },
    { id: 5, name: 'Product E', category: 'Books', price: 19.99, stock: 50, status: 'In Stock' },
    { id: 6, name: 'Product F', category: 'Clothing', price: 79.99, stock: 30, status: 'In Stock' },
    { id: 7, name: 'Product G', category: 'Home', price: 149.99, stock: 8, status: 'Low Stock' },
    { id: 8, name: 'Product H', category: 'Electronics', price: 899.99, stock: 3, status: 'Low Stock' },
    { id: 9, name: 'Product I', category: 'Books', price: 29.99, stock: 0, status: 'Out of Stock' },
    { id: 10, name: 'Product J', category: 'Clothing', price: 39.99, stock: 75, status: 'In Stock' },
    { id: 11, name: 'Product K', category: 'Home', price: 249.99, stock: 12, status: 'In Stock' },
    { id: 12, name: 'Product L', category: 'Electronics', price: 399.99, stock: 0, status: 'Out of Stock' },
  ];

  // Filter data based on search term
  const filteredData = data.filter(item =>
    (item.name && item.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (item.category && item.category.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (item.status && item.status.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Table columns configuration
  const columns = [
    {
      key: 'id',
      label: 'ID',
      sortable: true,
      maxWidth: '60px',
      noWrap: true
    },
    {
      key: 'name',
      label: 'Product Name',
      sortable: true,
      maxWidth: '180px'
      // Default behavior - text will wrap naturally
    },
    {
      key: 'category',
      label: 'Category',
      sortable: true,
      responsive: 'md', // Only show on medium screens and up
      maxWidth: '120px',
      truncate: true
    },
    {
      key: 'price',
      label: 'Price',
      sortable: true,
      maxWidth: '100px',
      noWrap: true,
      render: (row) => (
        <div className="font-medium">৳{row.price.toFixed(2)}</div>
      )
    },
    {
      key: 'stock',
      label: 'Stock',
      sortable: true,
      responsive: 'lg', // Only show on large screens and up
      maxWidth: '80px',
      noWrap: true,
      render: (row) => (
        <div className={row.stock === 0 ? 'text-red-500 font-medium' : 'font-medium'}>
          {row.stock}
        </div>
      )
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      maxWidth: '120px',
      render: (row) => {
        const statusColors = {
          'In Stock': 'bg-green-100 text-green-800',
          'Low Stock': 'bg-yellow-100 text-yellow-800',
          'Out of Stock': 'bg-red-100 text-red-800'
        };

        return (
          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColors[row.status]}`}>
            {row.status}
          </span>
        );
      }
    },
    {
      key: 'actions',
      label: 'Actions',
      sortable: false,
      maxWidth: '100px',
      render: (row) => (
        <div className="flex space-x-2">
          <button
            className="text-blue-600 hover:text-blue-900"
            title="Edit Product"
            onClick={() => alert(`Edit product ${row.id}`)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button
            className="text-red-600 hover:text-red-900"
            title="Delete Product"
            onClick={() => alert(`Delete product ${row.id}`)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      )
    }
  ];

  // Table actions
  const tableActions = [
    <div key="search" className="relative w-full sm:w-64 md:w-72">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
      </div>
      <input
        type="text"
        placeholder="Search..."
        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
    </div>,
    <button
      key="filter"
      className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
    >
      <FunnelIcon className="-ml-0.5 mr-2 h-4 w-4" />
      Filter
    </button>,
    <button
      key="refresh"
      className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
      onClick={() => {
        setIsLoading(true);
        setTimeout(() => setIsLoading(false), 1000);
      }}
    >
      <ArrowPathIcon className={`-ml-0.5 mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
      Refresh
    </button>,
    <button
      key="add"
      className="inline-flex items-center px-3 py-2 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-md text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
      onClick={() => alert('Add new product')}
    >
      <PlusIcon className="-ml-0.5 mr-2 h-4 w-4" />
      Add Product
    </button>
  ];

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <h1 className="text-2xl font-semibold text-gray-900">Table Component Demo</h1>
        <p className="mt-2 text-gray-600">
          This demo shows the basic table functionality. Check out the{' '}
          <Link href="/admin/table-demo" className="text-emerald-600 hover:text-emerald-800 font-medium">
            Text Handling Demo
          </Link>{' '}
          to see how to control cell content overflow.
        </p>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="py-4">
          <Table
            data={filteredData}
            columns={columns}
            title="Products"
            actions={tableActions}
            isLoading={isLoading}
            enableSorting={true}
            enablePagination={true}
            enableSelection={true}
            pageSizeOptions={[5, 10, 20, 50]}
            initialState={{
              pageSize: 5,
              sortBy: 'id',
              sortDirection: 'asc',
            }}
          />
        </div>
      </div>
    </div>
  );
}
