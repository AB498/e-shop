'use client';

import { useState, useEffect } from 'react';
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
import { getAllProductsWithInventory, updateProductStock } from '@/lib/actions/admin';

export default function ProductsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddStockModal, setShowAddStockModal] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [filterMenuOpen, setFilterMenuOpen] = useState(false);
  const [filterStock, setFilterStock] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);

  // Fetch products from the database
  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const data = await getAllProductsWithInventory();

        // Process the data to add stockStatus based on stock levels
        const processedData = data.map(product => {
          // Convert price string like "৳129.99" to number 129.99
          const numericPrice = typeof product.price === 'string'
            ? parseFloat(product.price.replace('৳', ''))
            : product.price;

          // Determine stock status based on stock level and threshold
          // Default threshold if not set
          const threshold = product.threshold || 10;
          let stockStatus = 'In Stock';

          if (product.stock <= 0) {
            stockStatus = 'Out of Stock';
          } else if (product.stock <= threshold) {
            stockStatus = 'Low Stock';
          }

          return {
            ...product,
            price: numericPrice,
            threshold: threshold,
            stockStatus: stockStatus
          };
        });

        setProducts(processedData);
      } catch (error) {
        console.error('Error fetching products:', error);
        setError('Failed to load products. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Filter products based on search term and stock filter
  const filteredProducts = products.filter(product => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter =
      filterStock === 'all' ||
      (filterStock === 'low' && product.stockStatus === 'Low Stock') ||
      (filterStock === 'out' && product.stockStatus === 'Out of Stock');

    return matchesSearch && matchesFilter;
  });

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

  // Handle add stock
  const handleAddStock = (product) => {
    setCurrentProduct(product);
    setShowAddStockModal(true);
  };

  // Handle stock update
  const handleStockUpdate = async (productId, quantityToAdd) => {
    if (!quantityToAdd || isNaN(quantityToAdd) || parseInt(quantityToAdd) <= 0) {
      setError('Please enter a valid quantity');
      return;
    }

    setIsLoading(true);
    try {
      // Find the current product to get its current stock
      const product = products.find(p => p.id === productId);
      if (!product) {
        throw new Error('Product not found');
      }

      // Calculate new stock level
      const newStockLevel = product.stock + parseInt(quantityToAdd);

      // Update stock in the database
      const updatedProduct = await updateProductStock(productId, newStockLevel);

      if (!updatedProduct) {
        throw new Error('Failed to update stock');
      }

      // Update the products state with the new stock level
      setProducts(prevProducts =>
        prevProducts.map(p => {
          if (p.id === productId) {
            // Determine new stock status
            let stockStatus = 'In Stock';
            if (newStockLevel <= 0) {
              stockStatus = 'Out of Stock';
            } else if (newStockLevel <= (p.threshold || 10)) {
              stockStatus = 'Low Stock';
            }

            return {
              ...p,
              stock: newStockLevel,
              stockStatus
            };
          }
          return p;
        })
      );

      setShowAddStockModal(false);
    } catch (error) {
      console.error('Error updating stock:', error);
      setError('Failed to update stock. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // DataGrid columns
  const columns = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'name', headerName: 'Product Name', width: 200 },
    { field: 'sku', headerName: 'SKU', width: 100 },
    { field: 'category', headerName: 'Category', width: 120 },
    {
      field: 'price',
      headerName: 'Price',
      width: 100,
      renderCell: (params) => (
        <div className="font-medium">${params.value.toFixed(2)}</div>
      ),
    },
    {
      field: 'stock',
      headerName: 'Stock',
      width: 80,
      renderCell: (params) => (
        <div className={params.value === 0 ? 'text-red-500 font-medium' : 'font-medium'}>
          {params.value}
        </div>
      ),
    },
    {
      field: 'threshold',
      headerName: 'Threshold',
      width: 100,
    },
    {
      field: 'stockStatus',
      headerName: 'Stock Status',
      width: 120,
      renderCell: (params) => (
        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full
          ${params.value === 'In Stock' ? 'bg-green-100 text-green-800' :
            params.value === 'Low Stock' ? 'bg-yellow-100 text-yellow-800' :
            'bg-red-100 text-red-800'}`}>
          {params.value}
        </span>
      ),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 180,
      renderCell: (params) => (
        <div className="flex space-x-2">
          <button
            onClick={() => handleEditProduct(params.row)}
            className="text-blue-600 hover:text-blue-900"
            title="Edit Product"
          >
            <PencilIcon className="h-5 w-5" />
          </button>
          <button
            onClick={() => handleAddStock(params.row)}
            className="text-emerald-600 hover:text-emerald-900"
            title="Add Stock"
          >
            <PlusIcon className="h-5 w-5" />
          </button>
          <button
            onClick={() => handleDeleteProduct(params.row.id)}
            className="text-red-600 hover:text-red-900"
            title="Delete Product"
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
              <select
                value={filterStock}
                onChange={(e) => setFilterStock(e.target.value)}
                className="block pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm rounded-md"
              >
                <option value="all">All Stock</option>
                <option value="low">Low Stock</option>
                <option value="out">Out of Stock</option>
              </select>
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

        {error && (
          <div className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg">
            <p>{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-2 text-white bg-red-600 hover:bg-red-700 focus:ring-4 focus:ring-red-300 font-medium rounded-md text-sm px-5 py-2"
            >
              Retry
            </button>
          </div>
        )}

        {isLoading ? (
          <div className="flex justify-center items-center h-96">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
          </div>
        ) : (
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
        )}

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

      {/* Add Stock Modal */}
      {showAddStockModal && currentProduct && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75" onClick={() => !isLoading && setShowAddStockModal(false)}></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Add Stock: {currentProduct.name}</h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Current stock: <span className="font-medium">{currentProduct.stock}</span> units
                      </p>
                    </div>

                    {error && (
                      <div className="mt-2 p-2 text-sm text-red-700 bg-red-100 rounded-md">
                        {error}
                      </div>
                    )}

                    <div className="mt-4">
                      <div>
                        <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">
                          Quantity to Add
                        </label>
                        <div className="mt-1">
                          <input
                            type="number"
                            name="quantity"
                            id="quantity"
                            min="1"
                            disabled={isLoading}
                            className="shadow-sm focus:ring-emerald-500 focus:border-emerald-500 block w-full sm:text-sm border-gray-300 rounded-md"
                            placeholder="Enter quantity"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  disabled={isLoading}
                  onClick={() => handleStockUpdate(currentProduct.id, document.getElementById('quantity').value)}
                  className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 ${
                    isLoading ? 'bg-emerald-400' : 'bg-emerald-600 hover:bg-emerald-700'
                  } text-base font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 sm:ml-3 sm:w-auto sm:text-sm`}
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </>
                  ) : (
                    'Add Stock'
                  )}
                </button>
                <button
                  type="button"
                  disabled={isLoading}
                  onClick={() => setShowAddStockModal(false)}
                  className={`mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 ${
                    isLoading ? 'bg-gray-200 text-gray-500' : 'bg-white text-gray-700 hover:bg-gray-50'
                  } text-base font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm`}
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
