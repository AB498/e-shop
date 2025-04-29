'use client';

import { useState } from 'react';
import { 
  PlusIcon, 
  MagnifyingGlassIcon, 
  PencilIcon, 
  TrashIcon, 
  ArrowUpIcon, 
  ArrowDownIcon,
  FunnelIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';
import { DataGrid } from '@mui/x-data-grid';

export default function ProductsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [filterMenuOpen, setFilterMenuOpen] = useState(false);

  // Sample product data
  const products = [
    { 
      id: 1, 
      name: 'Wireless Headphones', 
      sku: 'WH-001', 
      category: 'Electronics', 
      price: 129.99, 
      stock: 45, 
      status: 'Active' 
    },
    { 
      id: 2, 
      name: 'Smart Watch', 
      sku: 'SW-002', 
      category: 'Electronics', 
      price: 199.99, 
      stock: 28, 
      status: 'Active' 
    },
    { 
      id: 3, 
      name: 'Bluetooth Speaker', 
      sku: 'BS-003', 
      category: 'Electronics', 
      price: 79.99, 
      stock: 62, 
      status: 'Active' 
    },
    { 
      id: 4, 
      name: 'Laptop Backpack', 
      sku: 'LB-004', 
      category: 'Accessories', 
      price: 49.99, 
      stock: 120, 
      status: 'Active' 
    },
    { 
      id: 5, 
      name: 'USB-C Cable', 
      sku: 'UC-005', 
      category: 'Accessories', 
      price: 12.99, 
      stock: 200, 
      status: 'Active' 
    },
    { 
      id: 6, 
      name: 'Wireless Mouse', 
      sku: 'WM-006', 
      category: 'Electronics', 
      price: 29.99, 
      stock: 75, 
      status: 'Active' 
    },
    { 
      id: 7, 
      name: 'Desk Lamp', 
      sku: 'DL-007', 
      category: 'Home', 
      price: 34.99, 
      stock: 50, 
      status: 'Active' 
    },
    { 
      id: 8, 
      name: 'Coffee Mug', 
      sku: 'CM-008', 
      category: 'Home', 
      price: 14.99, 
      stock: 150, 
      status: 'Active' 
    },
    { 
      id: 9, 
      name: 'Wireless Charger', 
      sku: 'WC-009', 
      category: 'Electronics', 
      price: 39.99, 
      stock: 85, 
      status: 'Active' 
    },
    { 
      id: 10, 
      name: 'Fitness Tracker', 
      sku: 'FT-010', 
      category: 'Electronics', 
      price: 89.99, 
      stock: 0, 
      status: 'Out of Stock' 
    },
  ];

  // Filter products based on search term
  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle product selection
  const handleSelectionChange = (newSelection) => {
    setSelectedProducts(newSelection);
  };

  // Handle edit product
  const handleEditProduct = (product) => {
    setCurrentProduct(product);
    setShowEditModal(true);
  };

  // Handle delete product
  const handleDeleteProduct = (productId) => {
    // In a real app, you would call an API to delete the product
    console.log(`Delete product with ID: ${productId}`);
    // Then update the UI
  };

  // DataGrid columns
  const columns = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'name', headerName: 'Product Name', width: 250 },
    { field: 'sku', headerName: 'SKU', width: 120 },
    { field: 'category', headerName: 'Category', width: 150 },
    { 
      field: 'price', 
      headerName: 'Price', 
      width: 120,
      renderCell: (params) => (
        <div className="font-medium">${params.value.toFixed(2)}</div>
      ),
    },
    { 
      field: 'stock', 
      headerName: 'Stock', 
      width: 120,
      renderCell: (params) => (
        <div className={params.value === 0 ? 'text-red-500 font-medium' : 'font-medium'}>
          {params.value}
        </div>
      ),
    },
    { 
      field: 'status', 
      headerName: 'Status', 
      width: 150,
      renderCell: (params) => (
        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
          params.value === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {params.value}
        </span>
      ),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      renderCell: (params) => (
        <div className="flex space-x-2">
          <button
            onClick={() => handleEditProduct(params.row)}
            className="text-blue-600 hover:text-blue-900"
          >
            <PencilIcon className="h-5 w-5" />
          </button>
          <button
            onClick={() => handleDeleteProduct(params.row.id)}
            className="text-red-600 hover:text-red-900"
          >
            <TrashIcon className="h-5 w-5" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Products</h1>
          <p className="mt-2 text-sm text-gray-700">
            A list of all the products in your store including their name, SKU, category, price, and stock.
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
          >
            <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
            Add Product
          </button>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row justify-between space-y-3 sm:space-y-0 sm:space-x-4">
            <div className="relative flex-grow max-w-lg">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                placeholder="Search products..."
              />
            </div>
            <div className="flex space-x-2">
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setFilterMenuOpen(!filterMenuOpen)}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                >
                  <FunnelIcon className="-ml-1 mr-2 h-5 w-5 text-gray-400" aria-hidden="true" />
                  Filter
                </button>
                {filterMenuOpen && (
                  <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
                    <div className="py-1" role="menu" aria-orientation="vertical">
                      <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem">
                        All Products
                      </a>
                      <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem">
                        Active Products
                      </a>
                      <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem">
                        Out of Stock
                      </a>
                      <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem">
                        Low Stock
                      </a>
                    </div>
                  </div>
                )}
              </div>
              <button
                type="button"
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
              >
                <ArrowPathIcon className="-ml-1 mr-2 h-5 w-5 text-gray-400" aria-hidden="true" />
                Refresh
              </button>
            </div>
          </div>
        </div>

        <div style={{ height: 600, width: '100%' }}>
          <DataGrid
            rows={filteredProducts}
            columns={columns}
            pageSize={10}
            rowsPerPageOptions={[10, 25, 50]}
            checkboxSelection
            disableSelectionOnClick
            onSelectionModelChange={handleSelectionChange}
            selectionModel={selectedProducts}
          />
        </div>

        {selectedProducts.length > 0 && (
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700">
                {selectedProducts.length} {selectedProducts.length === 1 ? 'product' : 'products'} selected
              </div>
              <div className="flex space-x-2">
                <button
                  type="button"
                  className="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                >
                  Edit Selected
                </button>
                <button
                  type="button"
                  className="inline-flex items-center px-3 py-1.5 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  Delete Selected
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Add Product Modal - Would be implemented in a real app */}
      {showAddModal && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Add New Product</h3>
                    <div className="mt-4 space-y-4">
                      {/* Form fields would go here */}
                      <p className="text-sm text-gray-500">Form implementation would be added in a real application.</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-emerald-600 text-base font-medium text-white hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Add Product
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Product Modal - Would be implemented in a real app */}
      {showEditModal && currentProduct && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Edit Product: {currentProduct.name}</h3>
                    <div className="mt-4 space-y-4">
                      {/* Form fields would go here */}
                      <p className="text-sm text-gray-500">Form implementation would be added in a real application.</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-emerald-600 text-base font-medium text-white hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
