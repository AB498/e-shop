'use client';

import { useState, useRef, useEffect } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import { toast } from 'react-hot-toast';
import MultipleImageUpload from '@/components/admin/MultipleImageUpload';

export default function AddProductModal({ onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    category_id: '',
    price: '',
    stock: 0,
    weight: 0.5,
    description: '',
    image: '', // Keep for backward compatibility
  });

  const [productImages, setProductImages] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Fetch categories when component mounts
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/categories');
        if (!response.ok) {
          throw new Error('Failed to fetch categories');
        }
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error('Error fetching categories:', error);
        setError('Failed to load categories. Please try again.');
      }
    };

    fetchCategories();
  }, []);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value, type } = e.target;

    // Handle numeric inputs
    if (type === 'number') {
      setFormData(prevFormData => ({
        ...prevFormData,
        [name]: value === '' ? '' : Number(value),
      }));
    } else {
      setFormData(prevFormData => ({
        ...prevFormData,
        [name]: value,
      }));
    }
  };

  // Handle images change from MultipleImageUpload component
  const handleImagesChange = (images) => {
    setProductImages(images);

    // If there's a primary image, also set it as the main image for backward compatibility
    const primaryImage = images.find(img => img.isPrimary);
    if (primaryImage) {
      setFormData(prevFormData => ({
        ...prevFormData,
        image: primaryImage.url,
      }));
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setIsSubmitting(true);
      setError(null);

      // Validate required fields
      if (!formData.name || !formData.price) {
        setError('Name and price are required');
        return;
      }

      // Create product
      const response = await fetch('/api/admin/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create product');
      }

      const productData = await response.json();

      // If we have product images, save them
      if (productImages.length > 0) {
        try {
          const imagesResponse = await fetch('/api/admin/product-images', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              productId: productData.product.id,
              images: productImages,
            }),
          });

          if (!imagesResponse.ok) {
            const errorData = await imagesResponse.json();
            console.error('Warning: Failed to save product images:', errorData.error);
            toast.error('Product created but failed to save images');
          } else {
            toast.success('Product created successfully with images');
          }
        } catch (imageErr) {
          console.error('Error saving product images:', imageErr);
          toast.error('Product created but failed to save images');
        }
      } else {
        toast.success('Product created successfully');
      }

      onSubmit(productData.product);
    } catch (err) {
      console.error('Error creating product:', err);
      setError(err.message || 'Failed to create product');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-3 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-xl max-h-[85vh] overflow-hidden">
        <div className="flex justify-between items-center px-3 sm:px-4 py-2 sm:py-3 border-b">
          <h2 className="text-base sm:text-lg font-semibold text-gray-900">Add New Product</h2>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>

        <div className="px-3 sm:px-4 py-2 sm:py-3 overflow-y-auto max-h-[calc(85vh-7rem)]">
          {error && (
            <div className="mb-3 sm:mb-4 bg-red-50 border border-red-200 text-red-800 px-3 py-2 sm:px-4 sm:py-3 rounded-md text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-y-3 sm:gap-y-4 gap-x-2 sm:gap-x-3 sm:grid-cols-6">
              {/* Product Name */}
              <div className="sm:col-span-6">
                <label htmlFor="name" className="block text-xs sm:text-sm font-medium text-gray-700">
                  Product Name *
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="name"
                    id="name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    className="shadow-sm focus:ring-emerald-500 focus:border-emerald-500 block w-full text-xs sm:text-sm border-gray-300 rounded-md py-1.5"
                  />
                </div>
              </div>

              {/* SKU */}
              <div className="col-span-1 sm:col-span-3">
                <label htmlFor="sku" className="block text-xs sm:text-sm font-medium text-gray-700">
                  SKU
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="sku"
                    id="sku"
                    value={formData.sku}
                    onChange={handleInputChange}
                    className="shadow-sm focus:ring-emerald-500 focus:border-emerald-500 block w-full text-xs sm:text-sm border-gray-300 rounded-md py-1.5"
                  />
                </div>
              </div>

              {/* Category */}
              <div className="col-span-1 sm:col-span-3">
                <label htmlFor="category_id" className="block text-xs sm:text-sm font-medium text-gray-700">
                  Category
                </label>
                <div className="mt-1">
                  <select
                    id="category_id"
                    name="category_id"
                    value={formData.category_id}
                    onChange={handleInputChange}
                    className="shadow-sm focus:ring-emerald-500 focus:border-emerald-500 block w-full text-xs sm:text-sm border-gray-300 rounded-md py-1.5"
                  >
                    <option value="">Select a category</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Price */}
              <div className="col-span-1 sm:col-span-2">
                <label htmlFor="price" className="block text-xs sm:text-sm font-medium text-gray-700">
                  Price *
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 text-xs sm:text-sm">৳</span>
                  </div>
                  <input
                    type="number"
                    name="price"
                    id="price"
                    required
                    min="0"
                    step="0.01"
                    value={formData.price}
                    onChange={handleInputChange}
                    className="focus:ring-emerald-500 focus:border-emerald-500 block w-full pl-7 pr-12 text-xs sm:text-sm border-gray-300 rounded-md py-1.5"
                    placeholder="0.00"
                  />
                </div>
              </div>

              {/* Stock */}
              <div className="col-span-1 sm:col-span-2">
                <label htmlFor="stock" className="block text-xs sm:text-sm font-medium text-gray-700">
                  Stock
                </label>
                <div className="mt-1">
                  <input
                    type="number"
                    name="stock"
                    id="stock"
                    min="0"
                    value={formData.stock}
                    onChange={handleInputChange}
                    className="shadow-sm focus:ring-emerald-500 focus:border-emerald-500 block w-full text-xs sm:text-sm border-gray-300 rounded-md py-1.5"
                  />
                </div>
              </div>

              {/* Weight */}
              <div className="col-span-1 sm:col-span-2">
                <label htmlFor="weight" className="block text-xs sm:text-sm font-medium text-gray-700">
                  Weight (kg)
                </label>
                <div className="mt-1">
                  <input
                    type="number"
                    name="weight"
                    id="weight"
                    min="0"
                    step="0.01"
                    value={formData.weight}
                    onChange={handleInputChange}
                    className="shadow-sm focus:ring-emerald-500 focus:border-emerald-500 block w-full text-xs sm:text-sm border-gray-300 rounded-md py-1.5"
                  />
                </div>
              </div>

              {/* Description */}
              <div className="sm:col-span-6">
                <label htmlFor="description" className="block text-xs sm:text-sm font-medium text-gray-700">
                  Description
                </label>
                <div className="mt-1">
                  <textarea
                    id="description"
                    name="description"
                    rows={3}
                    value={formData.description}
                    onChange={handleInputChange}
                    className="shadow-sm focus:ring-emerald-500 focus:border-emerald-500 block w-full text-xs sm:text-sm border-gray-300 rounded-md py-1.5"
                  />
                </div>
              </div>

              {/* Multiple Image Upload */}
              <div className="sm:col-span-6">
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                  Product Images
                </label>
                <MultipleImageUpload
                  onImagesChange={handleImagesChange}
                  initialImages={[]}
                />
              </div>
            </div>

            <div className="mt-4 sm:mt-5 flex flex-col sm:flex-row sm:justify-end space-y-2 sm:space-y-0 sm:space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="w-full sm:w-auto px-3 py-1.5 border border-gray-300 rounded-md shadow-sm text-xs sm:text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto px-3 py-1.5 border border-transparent rounded-md shadow-sm text-xs sm:text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Creating...' : 'Create Product'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
