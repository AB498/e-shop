'use client';

import {
  PencilIcon,
  TrashIcon,
  PlusIcon
} from '@heroicons/react/24/outline';
import Table from '@/components/ui/table';
import Image from 'next/image';

export default function ProductsTable({
  products,
  isLoading,
  onEdit,
  onDelete,
  onAddStock,
  onSelectionChange,
  selectedProducts
}) {
  // Define table columns
  const columns = [
    {
      key: 'id',
      label: 'ID',
      sortable: true
    },
    {
      key: 'image',
      label: 'Image',
      sortable: false,
      render: (product) => (
        <div className="relative h-10 w-10 rounded-md overflow-hidden">
          <Image
            src={product.image || "/images/product-image.png"}
            alt={product.name}
            fill
            className="object-cover"
            sizes="40px"
          />
        </div>
      )
    },
    {
      key: 'name',
      label: 'Product Name',
      sortable: true
    },
    {
      key: 'sku',
      label: 'SKU',
      sortable: true,
      responsive: 'md'
    },
    {
      key: 'category',
      label: 'Category',
      sortable: true,
      responsive: 'md'
    },
    {
      key: 'price',
      label: 'Price',
      sortable: true,
      render: (product) => (
        <div className="font-medium">${product.price.toFixed(2)}</div>
      )
    },
    {
      key: 'stock',
      label: 'Stock',
      sortable: true,
      render: (product) => (
        <div className={product.stock === 0 ? 'text-red-500 font-medium' : 'font-medium'}>
          {product.stock}
        </div>
      )
    },
    {
      key: 'threshold',
      label: 'Threshold',
      sortable: true,
      responsive: 'lg'
    },
    {
      key: 'stockStatus',
      label: 'Stock Status',
      sortable: true,
      render: (product) => (
        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full
          ${product.stockStatus === 'In Stock' ? 'bg-green-100 text-green-800' :
            product.stockStatus === 'Low Stock' ? 'bg-yellow-100 text-yellow-800' :
            'bg-red-100 text-red-800'}`}>
          {product.stockStatus}
        </span>
      )
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (product) => (
        <div className="flex space-x-2">
          <button
            onClick={() => onEdit(product)}
            className="text-blue-600 hover:text-blue-900"
            title="Edit Product"
          >
            <PencilIcon className="h-5 w-5" />
          </button>
          <button
            onClick={() => onAddStock(product)}
            className="text-emerald-600 hover:text-emerald-900"
            title="Add Stock"
          >
            <PlusIcon className="h-5 w-5" />
          </button>
          <button
            onClick={() => onDelete(product.id)}
            className="text-red-600 hover:text-red-900"
            title="Delete Product"
          >
            <TrashIcon className="h-5 w-5" />
          </button>
        </div>
      )
    }
  ];

  // Custom toolbar actions
  const tableActions = [];

  return (
    <Table
      data={products}
      columns={columns}
      title="Products"
      actions={tableActions}
      isLoading={isLoading}
      emptyMessage="No products found"
      enableSorting={true}
      enablePagination={true}
      enableSelection={true}
      pageSizeOptions={[10, 25, 50, 100]}
      initialState={{
        pageSize: 10,
        sortBy: 'name',
        sortDirection: 'asc',
        selectedRows: selectedProducts || []
      }}
      onStateChange={(state) => {
        if (state.selectedRows && onSelectionChange) {
          onSelectionChange(state.selectedRows);
        }
      }}
    />
  );
}
