'use client';

import {
  PencilIcon,
  TrashIcon,
  PlusIcon
} from '@heroicons/react/24/outline';
import Table from '@/components/ui/table';
import Image from 'next/image';
import { slateValueToText } from '@/components/ui/slate/SlateUtils';

export default function ProductsTable({
  products,
  isLoading,
  onEdit,
  onDelete,
  onAddStock,
  onSelectionChange,
  selectedProducts
}) {
  // Helper function to extract plain text from rich text descriptions
  const getPlainTextDescription = (description) => {
    if (!description) return '';

    // If it's already plain text, return as is
    if (typeof description === 'string') {
      try {
        // Try to parse as JSON (rich text format)
        const parsed = JSON.parse(description);
        if (Array.isArray(parsed)) {
          // It's rich text, convert to plain text
          return slateValueToText(parsed);
        }
        // If parsing succeeds but it's not an array, treat as plain text
        return description;
      } catch {
        // If JSON parsing fails, it's plain text
        return description;
      }
    }

    // If it's already an array (rich text format), convert to plain text
    if (Array.isArray(description)) {
      return slateValueToText(description);
    }

    // Fallback to string conversion
    return String(description);
  };
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
      key: 'brand',
      label: 'Brand',
      sortable: true,
      responsive: 'lg',
      render: (product) => (
        <div className="max-w-xs truncate" title={product.brand}>
          {product.brand || 'N/A'}
        </div>
      )
    },
    {
      key: 'type',
      label: 'Type',
      sortable: true,
      responsive: 'lg',
      render: (product) => (
        <div className="max-w-xs truncate" title={product.type}>
          {product.type || 'N/A'}
        </div>
      )
    },
    {
      key: 'price',
      label: 'Price',
      sortable: true,
      render: (product) => (
        <div className="font-medium">৳{product.price.toFixed(2)}</div>
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
      key: 'description',
      label: 'Description',
      sortable: true,
      responsive: 'lg',
      render: (product) => {
        const plainText = getPlainTextDescription(product.description);
        const truncatedText = plainText ? plainText.substring(0, 50) + (plainText.length > 50 ? '...' : '') : '';
        return (
          <div className="max-w-xs truncate" title={plainText}>
            {truncatedText}
          </div>
        );
      }
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
      key: 'createdAt',
      label: 'Created',
      sortable: true,
      responsive: 'lg',
      render: (product) => (
        <div className="text-sm text-gray-600">
          {product.createdAt}
        </div>
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
            onClick={() => onDelete(product)}
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
        sortBy: 'createdAt',
        sortDirection: 'desc',
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
