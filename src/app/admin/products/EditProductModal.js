'use client';

import { useState, useEffect } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import { toast } from 'react-hot-toast';
import MultipleImageUpload from '@/components/admin/MultipleImageUpload';
import SlateEditor from '@/components/ui/slate/SlateEditor';

export default function EditProductModal({ product, onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    name: product.name || '',
    sku: product.sku || '',
    category_id: product.categoryId || '',
    price: product.price || '',
    stock: product.stock || 0,
    weight: product.weight || 0.5,
    description: product.description || '',
    image: product.image || '', // Keep for backward compatibility
    // New product attributes
    sizes: product.sizes || [],
    colors: product.colors || [],
    tags: product.tags || [],
    type: product.type || '',
    brand: product.brand || '',
    material: product.material || '',
    origin_country: product.originCountry || '',
    mfg_date: product.mfgDate || '',
    lifespan: product.lifespan || '',
  });

  const [productImages, setProductImages] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [loadingImages, setLoadingImages] = useState(true);

  // Fetch categories and product images when component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch categories
        const categoriesResponse = await fetch('/api/categories');
        if (!categoriesResponse.ok) {
          throw new Error('Failed to fetch categories');
        }
        const categoriesData = await categoriesResponse.json();
        setCategories(categoriesData);

        // Fetch product images
        const imagesResponse = await fetch(`/api/admin/product-images?productId=${product.id}`);
        if (imagesResponse.ok) {
          const imagesData = await imagesResponse.json();
          setProductImages(imagesData);
        } else {
          console.error('Failed to fetch product images');
          // If no images found, create a default one from the main image
          if (product.image) {
            setProductImages([{
              id: 0,
              url: product.image,
              key: '',
              altText: product.name,
              position: 0,
              isPrimary: true
            }]);
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to load data. Please try again.');
      } finally {
        setLoadingImages(false);
      }
    };

    fetchData();
  }, [product.id, product.image, product.name]);

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

  // Handle array inputs (sizes, colors, tags)
  const handleArrayInputChange = (fieldName, value) => {
    // Split by comma and trim whitespace
    const arrayValue = value.split(',').map(item => item.trim()).filter(item => item !== '');
    setFormData(prevFormData => ({
      ...prevFormData,
      [fieldName]: arrayValue,
    }));
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

      // Update product
      const response = await fetch(`/api/admin/products/${product.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update product');
      }

      const productData = await response.json();

      // Handle product images
      try {
        // First, delete all existing images for this product
        const deleteResponse = await fetch(`/api/admin/product-images?productId=${product.id}`, {
          method: 'DELETE',
        });

        if (!deleteResponse.ok) {
          console.warn('Warning: Failed to delete existing product images');
        } else {
          const deleteData = await deleteResponse.json();
          console.log(deleteData.message);
        }

        // Then, add the new images
        if (productImages.length > 0) {
          const imagesResponse = await fetch('/api/admin/product-images', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              productId: product.id,
              images: productImages,
            }),
          });

          if (!imagesResponse.ok) {
            const errorData = await imagesResponse.json();
            console.error('Warning: Failed to update product images:', errorData.error);
            toast.error('Product updated but failed to update images');
          } else {
            // no need to show toast here as it's already shown ealier
            console.log('Product updated successfully with images');
          }
        } else {
        }
      } catch (imageErr) {
        console.error('Error updating product images:', imageErr);
        toast.error('Product updated but failed to update images');
      }

      onSubmit(productData.product);
    } catch (err) {
      console.error('Error updating product:', err);
      setError(err.message || 'Failed to update product');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 !mt-0 flex items-center justify-center p-3 sm:p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        <div className="flex justify-between items-center px-3 sm:px-6 py-3 sm:py-4 border-b">
          <h2 className="text-base sm:text-xl font-semibold text-gray-900 truncate">
            Edit Product: {product.name}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <XMarkIcon className="h-5 w-5 sm:h-6 sm:w-6" />
          </button>
        </div>

        <div className="px-3 sm:px-6 py-3 sm:py-4 overflow-y-auto max-h-[calc(90vh-8rem)]">
          {error && (
            <div className="mb-3 sm:mb-4 bg-red-50 border border-red-200 text-red-800 px-3 py-2 sm:px-4 sm:py-3 rounded-md text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-y-3 sm:gap-y-6 gap-x-2 sm:gap-x-4 sm:grid-cols-6">
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
                    className="shadow-sm focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 focus:bg-white block w-full text-xs sm:text-sm border border-gray-300 bg-gray-50 rounded-md py-1.5 px-3 transition-colors"
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
                    className="shadow-sm focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 focus:bg-white block w-full text-xs sm:text-sm border border-gray-300 bg-gray-50 rounded-md py-1.5 px-3 transition-colors"
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
                    className="shadow-sm focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 focus:bg-white block w-full text-xs sm:text-sm border border-gray-300 bg-gray-50 rounded-md py-1.5 px-3 transition-colors"
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
                    className="focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 focus:bg-white block w-full pl-7 pr-12 text-xs sm:text-sm border border-gray-300 bg-gray-50 rounded-md py-1.5 transition-colors"
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
                    className="shadow-sm focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 focus:bg-white block w-full text-xs sm:text-sm border border-gray-300 bg-gray-50 rounded-md py-1.5 px-3 transition-colors"
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
                    className="shadow-sm focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 focus:bg-white block w-full text-xs sm:text-sm border border-gray-300 bg-gray-50 rounded-md py-1.5 px-3 transition-colors"
                  />
                </div>
              </div>

              {/* Description */}
              <div className="sm:col-span-6">
                <label htmlFor="description" className="block text-xs sm:text-sm font-medium text-gray-700">
                  Description
                </label>
                <div className="mt-1">
                  <SlateEditor
                    value={formData.description}
                    onChange={(value) => setFormData(prev => ({ ...prev, description: value }))}
                    placeholder="Enter product description..."
                  />
                </div>
              </div>

              {/* Product Type */}
              <div className="sm:col-span-3">
                <label htmlFor="type" className="block text-xs sm:text-sm font-medium text-gray-700">
                  Product Type
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="type"
                    id="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    placeholder="e.g., Shampoo, Grooming Kit"
                    className="shadow-sm focus:ring-emerald-500 focus:border-emerald-500 block w-full text-xs sm:text-sm border-gray-300 rounded-md py-1.5"
                  />
                </div>
              </div>

              {/* Brand */}
              <div className="sm:col-span-3">
                <label htmlFor="brand" className="block text-xs sm:text-sm font-medium text-gray-700">
                  Brand
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="brand"
                    id="brand"
                    value={formData.brand}
                    onChange={handleInputChange}
                    placeholder="e.g., GroomMaster, BeardCraft"
                    className="shadow-sm focus:ring-emerald-500 focus:border-emerald-500 block w-full text-xs sm:text-sm border-gray-300 rounded-md py-1.5"
                  />
                </div>
              </div>

              {/* Sizes */}
              <div className="sm:col-span-3">
                <label htmlFor="sizes" className="block text-xs sm:text-sm font-medium text-gray-700">
                  Available Sizes
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="sizes"
                    id="sizes"
                    value={formData.sizes.join(', ')}
                    onChange={(e) => handleArrayInputChange('sizes', e.target.value)}
                    placeholder="e.g., 30ml, 50ml, 100ml"
                    className="shadow-sm focus:ring-emerald-500 focus:border-emerald-500 block w-full text-xs sm:text-sm border-gray-300 rounded-md py-1.5"
                  />
                </div>
                <p className="mt-1 text-xs text-gray-500">Separate multiple sizes with commas</p>
              </div>

              {/* Colors */}
              <div className="sm:col-span-3">
                <label htmlFor="colors" className="block text-xs sm:text-sm font-medium text-gray-700">
                  Available Colors
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="colors"
                    id="colors"
                    value={formData.colors.join(', ')}
                    onChange={(e) => handleArrayInputChange('colors', e.target.value)}
                    placeholder="e.g., Black, Silver, Blue"
                    className="shadow-sm focus:ring-emerald-500 focus:border-emerald-500 block w-full text-xs sm:text-sm border-gray-300 rounded-md py-1.5"
                  />
                </div>
                <p className="mt-1 text-xs text-gray-500">Separate multiple colors with commas</p>
              </div>

              {/* Tags */}
              <div className="sm:col-span-6">
                <label htmlFor="tags" className="block text-xs sm:text-sm font-medium text-gray-700">
                  Product Tags
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="tags"
                    id="tags"
                    value={formData.tags.join(', ')}
                    onChange={(e) => handleArrayInputChange('tags', e.target.value)}
                    placeholder="e.g., Men's Grooming, Shaving, Kit, Essential"
                    className="shadow-sm focus:ring-emerald-500 focus:border-emerald-500 block w-full text-xs sm:text-sm border-gray-300 rounded-md py-1.5"
                  />
                </div>
                <p className="mt-1 text-xs text-gray-500">Separate multiple tags with commas</p>
              </div>

              {/* Material */}
              <div className="sm:col-span-3">
                <label htmlFor="material" className="block text-xs sm:text-sm font-medium text-gray-700">
                  Material
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="material"
                    id="material"
                    value={formData.material}
                    onChange={handleInputChange}
                    placeholder="e.g., Natural Oils, Stainless Steel"
                    className="shadow-sm focus:ring-emerald-500 focus:border-emerald-500 block w-full text-xs sm:text-sm border-gray-300 rounded-md py-1.5"
                  />
                </div>
              </div>

              {/* Origin Country */}
              <div className="sm:col-span-3">
                <label htmlFor="origin_country" className="block text-xs sm:text-sm font-medium text-gray-700">
                  Origin Country
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="origin_country"
                    id="origin_country"
                    value={formData.origin_country}
                    onChange={handleInputChange}
                    placeholder="e.g., Germany, USA, Morocco"
                    className="shadow-sm focus:ring-emerald-500 focus:border-emerald-500 block w-full text-xs sm:text-sm border-gray-300 rounded-md py-1.5"
                  />
                </div>
              </div>

              {/* Manufacturing Date */}
              <div className="sm:col-span-3">
                <label htmlFor="mfg_date" className="block text-xs sm:text-sm font-medium text-gray-700">
                  Manufacturing Date
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="mfg_date"
                    id="mfg_date"
                    value={formData.mfg_date}
                    onChange={handleInputChange}
                    placeholder="e.g., Mar 15, 2024"
                    className="shadow-sm focus:ring-emerald-500 focus:border-emerald-500 block w-full text-xs sm:text-sm border-gray-300 rounded-md py-1.5"
                  />
                </div>
              </div>

              {/* Lifespan */}
              <div className="sm:col-span-3">
                <label htmlFor="lifespan" className="block text-xs sm:text-sm font-medium text-gray-700">
                  Product Lifespan
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="lifespan"
                    id="lifespan"
                    value={formData.lifespan}
                    onChange={handleInputChange}
                    placeholder="e.g., 2 years, 18 months"
                    className="shadow-sm focus:ring-emerald-500 focus:border-emerald-500 block w-full text-xs sm:text-sm border-gray-300 rounded-md py-1.5"
                  />
                </div>
              </div>

              {/* Multiple Image Upload */}
              <div className="sm:col-span-6">
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                  Product Images
                </label>
                {loadingImages ? (
                  <div className="flex items-center justify-center h-24 sm:h-32">
                    <p className="text-sm text-gray-500">Loading images...</p>
                  </div>
                ) : (
                  <MultipleImageUpload
                    onImagesChange={handleImagesChange}
                    initialImages={productImages}
                  />
                )}
              </div>
            </div>

            <div className="mt-4 sm:mt-6 flex flex-col sm:flex-row sm:justify-end space-y-2 sm:space-y-0 sm:space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="w-full sm:w-auto px-3 sm:px-4 py-1.5 sm:py-2 border border-gray-300 rounded-md shadow-sm text-xs sm:text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto px-3 sm:px-4 py-1.5 sm:py-2 border border-transparent rounded-md shadow-sm text-xs sm:text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
