'use client';

import { useState, useEffect, useRef } from 'react';
import { XMarkIcon, MagnifyingGlassIcon, PlusIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import { searchProducts } from '@/lib/actions/product-promotions';

export default function MultiSelectProducts({
  selectedProducts = [],
  onChange,
  defaultDiscountPercentage = 10
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef(null);
  const resultsRef = useRef(null);

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Handle search for products
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchTerm.trim().length >= 2) {
        setIsSearching(true);
        try {
          const results = await searchProducts(searchTerm);
          // Filter out already selected products
          const filteredResults = results.filter(
            product => !selectedProducts.some(selected => selected.id === product.id)
          );
          setSearchResults(filteredResults);
          setShowResults(true);
        } catch (error) {
          console.error('Error searching products:', error);
        } finally {
          setIsSearching(false);
        }
      } else {
        setSearchResults([]);
        setShowResults(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, selectedProducts]);

  // Handle click outside to close search results
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target) &&
        resultsRef.current &&
        !resultsRef.current.contains(event.target)
      ) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Update all products' discount values when defaultDiscountPercentage changes
  useEffect(() => {
    if (selectedProducts.length > 0) {
      // Update all selected products with the new discount value
      const updatedProducts = selectedProducts.map(product => ({
        ...product,
        discountPercentage: defaultDiscountPercentage
      }));

      // Only update if the discount values have actually changed
      const hasChanges = updatedProducts.some(
        (product, index) => product.discountPercentage !== selectedProducts[index].discountPercentage
      );

      if (hasChanges) {
        console.log(`Updating all products to use discount: ${defaultDiscountPercentage}%`);
        onChange(updatedProducts);
      }
    }
  }, [defaultDiscountPercentage]);

  // Add product to selected list
  const handleAddProduct = (product) => {
    // Always use the promotion's discount value for all products
    const newProduct = {
      ...product,
      discountPercentage: defaultDiscountPercentage
    };

    // Add the new product to the selected products list
    const updatedProducts = [...selectedProducts, newProduct];
    onChange(updatedProducts);

    // Clear search
    setSearchTerm('');
    setSearchResults([]);
    setShowResults(false);
  };

  // Remove product from selected list
  const handleRemoveProduct = (productId) => {
    onChange(selectedProducts.filter(product => product.id !== productId));
  };

  // Update discount percentage for a product - now disabled as all products use the promotion's discount
  const handleDiscountChange = (productId, value) => {
    // This function is kept for backward compatibility but is no longer used
    // All products now use the promotion's discount value
    const numValue = parseFloat(value);
    const validValue = isNaN(numValue) ? 0 : Math.min(Math.max(numValue, 0), 100);

    onChange(
      selectedProducts.map(product =>
        product.id === productId
          ? { ...product, discountPercentage: validValue }
          : product
      )
    );
  };

  return (
    <div className="space-y-4">
      <div className="relative" ref={searchRef}>
        <div className="flex items-center border border-gray-300 rounded-md shadow-sm">
          <div className="pointer-events-none absolute inset-y-0 left-0 pl-3 flex items-center">
            <MagnifyingGlassIcon className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Search products by name or SKU..."
            className="block w-full pl-10 pr-3 py-2 border-0 focus:ring-0 text-xs sm:text-sm rounded-md"
          />
          {isSearching && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
              <div className="animate-spin h-4 w-4 border-2 border-gray-500 border-t-transparent rounded-full"></div>
            </div>
          )}
        </div>

        {/* Search Results Dropdown */}
        {showResults && searchResults.length > 0 && (
          <div
            ref={resultsRef}
            className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md max-h-60 overflow-auto border border-gray-200"
          >
            <ul className="py-1 text-xs sm:text-sm">
              {searchResults.map(product => (
                <li
                  key={product.id}
                  className="px-3 py-2 hover:bg-gray-100 cursor-pointer flex items-center justify-between"
                  onClick={() => handleAddProduct(product)}
                >
                  <div className="flex items-center space-x-3 min-w-0 flex-1">
                    <div className="relative h-8 w-8 flex-shrink-0">
                      <Image
                        src={product.image || "/images/product-image.png"}
                        alt={product.name}
                        fill
                        className="object-cover rounded-md"
                        sizes="32px"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="font-medium truncate max-w-[150px] sm:max-w-[200px] md:max-w-[300px]">
                        {product.name}
                      </div>
                      <div className="text-gray-500 text-xs truncate max-w-[150px] sm:max-w-[200px] md:max-w-[300px]">
                        SKU: {product.sku}
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="text-emerald-600 hover:text-emerald-800 flex-shrink-0 ml-2"
                    aria-label="Add product"
                  >
                    <PlusIcon className="h-4 w-4" />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Selected Products List */}
      <div className="border border-gray-200 rounded-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Discount %
                </th>
                <th scope="col" className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {selectedProducts.length === 0 ? (
                <tr>
                  <td colSpan="3" className="px-3 py-4 text-center text-xs sm:text-sm text-gray-500">
                    No products selected. Search and add products above.
                  </td>
                </tr>
              ) : (
                selectedProducts.map(product => (
                  <tr key={product.id}>
                    <td className="px-3 py-2">
                      <div className="flex items-center space-x-3">
                        <div className="relative h-8 w-8 flex-shrink-0">
                          <Image
                            src={product.image || "/images/product-image.png"}
                            alt={product.name}
                            fill
                            className="object-cover rounded-md"
                            sizes="32px"
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="font-medium text-xs sm:text-sm truncate max-w-[150px] sm:max-w-[200px] md:max-w-[250px]">
                            {product.name}
                          </div>
                          <div className="text-gray-500 text-xs truncate max-w-[150px] sm:max-w-[200px] md:max-w-[250px]">
                            SKU: {product.sku}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-2">
                      <div className="flex items-center">
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={product.discountPercentage || defaultDiscountPercentage}
                          disabled
                          className="w-12 sm:w-16 text-xs sm:text-sm border-gray-200 bg-gray-50 rounded-md shadow-sm text-gray-500"
                        />
                        <span className="ml-1 sm:ml-2 text-xs text-gray-500">%</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1 hidden sm:block">Uses promotion's discount value</p>
                    </td>
                    <td className="px-3 py-2 text-right">
                      <button
                        type="button"
                        onClick={() => handleRemoveProduct(product.id)}
                        className="text-red-600 hover:text-red-900"
                        aria-label="Remove product"
                      >
                        <XMarkIcon className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
