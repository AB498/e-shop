'use client';

import { useState, useEffect } from 'react';
import {
  PlusIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';
import { getAllProductsWithInventory, updateProductStock } from '@/lib/actions/admin';
import { toast } from 'react-hot-toast';
import ProductsTable from './ProductsTable';
import AddProductModal from './AddProductModal';
import EditProductModal from './EditProductModal';
import ConfirmDeleteModal from './ConfirmDeleteModal';

// Helper function to process product data
const processProductData = (data) => {
  return data.map(product => {
    // Convert price string like "$129.99" to number 129.99
    const numericPrice = typeof product.price === 'string'
      ? parseFloat(product.price.replace('$', ''))
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
};

export default function ProductsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddStockModal, setShowAddStockModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
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
      setError(null);
      try {
        const data = await getAllProductsWithInventory();
        const processedData = processProductData(data);
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
      product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (product.description && product.description.toLowerCase().includes(searchTerm.toLowerCase()));

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

  // Handle add product
  const handleAddProduct = (newProduct) => {
    setShowAddModal(false);
    // Refresh the products list
    setIsLoading(true);
    getAllProductsWithInventory()
      .then(data => {
        const processedData = processProductData(data);
        setProducts(processedData);
        toast.success('Product added successfully');
      })
      .catch(err => {
        console.error('Error refreshing products:', err);
        setError('Failed to refresh products. Please try again later.');
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  // Handle edit product
  const handleEditProduct = (product) => {
    setCurrentProduct(product);
    setShowEditModal(true);
  };

  // Handle update product
  const handleUpdateProduct = (updatedProduct) => {
    setShowEditModal(false);
    // Refresh the products list
    setIsLoading(true);
    getAllProductsWithInventory()
      .then(data => {
        const processedData = processProductData(data);
        setProducts(processedData);
        toast.success('Product updated successfully');
      })
      .catch(err => {
        console.error('Error refreshing products:', err);
        setError('Failed to refresh products. Please try again later.');
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  // Handle show delete modal
  const handleShowDeleteModal = (product) => {
    setCurrentProduct(product);
    setShowDeleteModal(true);
  };

  // Handle delete product
  const handleDeleteProduct = (productId) => {
    setShowDeleteModal(false);
    // Remove the product from the UI
    setProducts(prevProducts => prevProducts.filter(p => p.id !== productId));
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

  // No need for columns definition here as it's moved to ProductsTable component

  return (
    <div className="space-y-6">
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">Products</h1>
          <p className="mt-1 sm:mt-2 text-xs sm:text-sm text-gray-700">
            A list of all the products in your store including their name, SKU, category, price, and stock.
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center px-3 py-1.5 sm:px-4 sm:py-2 border border-transparent rounded-md shadow-sm text-xs sm:text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
          >
            <PlusIcon className="-ml-1 mr-1.5 h-4 w-4 sm:h-5 sm:w-5" aria-hidden="true" />
            Add Product
          </button>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="p-3 sm:p-4 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row justify-between space-y-2 sm:space-y-0 sm:space-x-3">
            <div className="relative flex-grow max-w-lg">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" aria-hidden="true" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-9 sm:pl-10 pr-3 py-1.5 sm:py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 text-xs sm:text-sm"
                placeholder="Search products..."
              />
            </div>
            <div className="flex space-x-2">
              <select
                value={filterStock}
                onChange={(e) => setFilterStock(e.target.value)}
                className="block pl-2 sm:pl-3 pr-8 sm:pr-10 py-1.5 sm:py-2 text-xs sm:text-sm border border-gray-300 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 rounded-md"
              >
                <option value="all">All Stock</option>
                <option value="low">Low Stock</option>
                <option value="out">Out of Stock</option>
              </select>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setFilterMenuOpen(!filterMenuOpen)}
                  className="inline-flex items-center px-2.5 py-1.5 sm:px-4 sm:py-2 border border-gray-300 rounded-md shadow-sm text-xs sm:text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                >
                  <FunnelIcon className="-ml-1 mr-1.5 h-4 w-4 sm:h-5 sm:w-5 text-gray-400" aria-hidden="true" />
                  Filter
                </button>
                {filterMenuOpen && (
                  <div className="origin-top-right absolute right-0 mt-2 w-48 sm:w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
                    <div className="py-1" role="menu" aria-orientation="vertical">
                      <a href="#" className="block px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm text-gray-700 hover:bg-gray-100" role="menuitem">
                        All Products
                      </a>
                      <a href="#" className="block px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm text-gray-700 hover:bg-gray-100" role="menuitem">
                        Active Products
                      </a>
                      <a href="#" className="block px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm text-gray-700 hover:bg-gray-100" role="menuitem">
                        Out of Stock
                      </a>
                      <a href="#" className="block px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm text-gray-700 hover:bg-gray-100" role="menuitem">
                        Low Stock
                      </a>
                    </div>
                  </div>
                )}
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsLoading(true);
                  setError(null);
                  getAllProductsWithInventory()
                    .then(data => {
                      const processedData = processProductData(data);
                      setProducts(processedData);
                    })
                    .catch(err => {
                      console.error('Error refreshing products:', err);
                      setError('Failed to refresh products. Please try again later.');
                    })
                    .finally(() => {
                      setIsLoading(false);
                    });
                }}
                disabled={isLoading}
                className="inline-flex items-center px-2.5 py-1.5 sm:px-4 sm:py-2 border border-gray-300 rounded-md shadow-sm text-xs sm:text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
              >
                <ArrowPathIcon className={`-ml-1 mr-1.5 h-4 w-4 sm:h-5 sm:w-5 ${isLoading ? 'animate-spin text-emerald-500' : 'text-gray-400'}`} aria-hidden="true" />
                {isLoading ? 'Refreshing...' : 'Refresh'}
              </button>
            </div>
          </div>
        </div>

        {error && (
          <div className="p-3 mb-3 text-xs sm:text-sm text-red-700 bg-red-100 rounded-lg">
            <p>{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-1.5 text-white bg-red-600 hover:bg-red-700 focus:ring-2 focus:ring-red-300 font-medium rounded-md text-xs sm:text-sm px-3 sm:px-4 py-1 sm:py-1.5"
            >
              Retry
            </button>
          </div>
        )}

        <ProductsTable
          products={filteredProducts}
          isLoading={isLoading}
          onEdit={handleEditProduct}
          onDelete={handleShowDeleteModal}
          onAddStock={handleAddStock}
          onSelectionChange={handleSelectionChange}
          selectedProducts={selectedProducts}
        />

        {selectedProducts.length > 0 && (
          <div className="px-3 sm:px-4 py-2 sm:py-3 bg-gray-50 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="text-xs sm:text-sm text-gray-700">
                {selectedProducts.length} {selectedProducts.length === 1 ? 'product' : 'products'} selected
              </div>
              <div className="flex space-x-2">
                <button
                  type="button"
                  className="inline-flex items-center px-2 py-1 sm:px-3 sm:py-1.5 border border-gray-300 rounded-md shadow-sm text-xs sm:text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                >
                  Edit Selected
                </button>
                <button
                  type="button"
                  className="inline-flex items-center px-2 py-1 sm:px-3 sm:py-1.5 border border-transparent rounded-md shadow-sm text-xs sm:text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  Delete Selected
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Add Product Modal */}
      {showAddModal && (
        <AddProductModal
          onClose={() => setShowAddModal(false)}
          onSubmit={handleAddProduct}
        />
      )}

      {/* Edit Product Modal */}
      {showEditModal && currentProduct && (
        <EditProductModal
          product={currentProduct}
          onClose={() => setShowEditModal(false)}
          onSubmit={handleUpdateProduct}
        />
      )}

      {/* Delete Product Modal */}
      {showDeleteModal && currentProduct && (
        <ConfirmDeleteModal
          product={currentProduct}
          onClose={() => setShowDeleteModal(false)}
          onDelete={handleDeleteProduct}
        />
      )}

      {/* Add Stock Modal */}
      {showAddStockModal && currentProduct && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75" onClick={() => !isLoading && setShowAddStockModal(false)}></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-6 sm:align-middle sm:max-w-md sm:w-full">
              <div className="bg-white px-3 pt-4 pb-3 sm:p-5 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-2 text-center sm:mt-0 sm:ml-3 sm:text-left w-full">
                    <h3 className="text-base sm:text-lg leading-6 font-medium text-gray-900">Add Stock: {currentProduct.name}</h3>
                    <div className="mt-1 sm:mt-2">
                      <p className="text-xs sm:text-sm text-gray-500">
                        Current stock: <span className="font-medium">{currentProduct.stock}</span> units
                      </p>
                    </div>

                    {error && (
                      <div className="mt-1.5 sm:mt-2 p-1.5 sm:p-2 text-xs sm:text-sm text-red-700 bg-red-100 rounded-md">
                        {error}
                      </div>
                    )}

                    <div className="mt-3 sm:mt-4">
                      <div>
                        <label htmlFor="quantity" className="block text-xs sm:text-sm font-medium text-gray-700">
                          Quantity to Add
                        </label>
                        <div className="mt-1">
                          <input
                            type="number"
                            name="quantity"
                            id="quantity"
                            min="1"
                            disabled={isLoading}
                            className="shadow-sm focus:ring-emerald-500 focus:border-emerald-500 block w-full text-xs sm:text-sm border-gray-300 rounded-md py-1.5"
                            placeholder="Enter quantity"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-3 py-2 sm:px-5 sm:py-3 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  disabled={isLoading}
                  onClick={() => handleStockUpdate(currentProduct.id, document.getElementById('quantity').value)}
                  className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-3 py-1.5 sm:px-4 sm:py-2 ${
                    isLoading ? 'bg-emerald-400' : 'bg-emerald-600 hover:bg-emerald-700'
                  } text-xs sm:text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 sm:ml-3 sm:w-auto`}
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-1.5 h-3 w-3 sm:h-4 sm:w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
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
                  className={`mt-2 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-3 py-1.5 sm:px-4 sm:py-2 ${
                    isLoading ? 'bg-gray-200 text-gray-500' : 'bg-white text-gray-700 hover:bg-gray-50'
                  } text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 sm:mt-0 sm:ml-3 sm:w-auto`}
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
