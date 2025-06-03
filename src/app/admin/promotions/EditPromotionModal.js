import { useState, useRef, useEffect } from 'react';
import { XMarkIcon, PhotoIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import { updatePromotion } from '@/lib/actions/promotions';
import { updateProductPromotionRelations, getProductsByPromotionId } from '@/lib/actions/product-promotions';
import MultiSelectProducts from '@/components/admin/MultiSelectProducts';

export default function EditPromotionModal({ promotion, onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    title: promotion.title || '',
    description: promotion.description || '',
    image_url: promotion.image_url || '',
    link_url: promotion.link_url || '',
    type: promotion.type || 'carousel',
    position: promotion.position || 'home',
    start_date: promotion.start_date ? new Date(promotion.start_date).toISOString().slice(0, 16) : '',
    end_date: promotion.end_date ? new Date(promotion.end_date).toISOString().slice(0, 16) : '',
    is_active: promotion.is_active !== undefined ? promotion.is_active : true,
    priority: promotion.priority || 0,
    discount: promotion.discount || '',
  });

  const [selectedProducts, setSelectedProducts] = useState([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imagePreview, setImagePreview] = useState(promotion.image_url || null);
  const fileInputRef = useRef(null);

  // Fetch existing product-promotion relationships
  useEffect(() => {
    const fetchProductRelations = async () => {
      try {
        setIsLoadingProducts(true);
        const products = await getProductsByPromotionId(promotion.id);
        setSelectedProducts(products);
      } catch (error) {
        console.error('Error fetching product relations:', error);
        // Don't set error state to avoid blocking the form
      } finally {
        setIsLoadingProducts(false);
      }
    };

    fetchProductRelations();
  }, [promotion.id]);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;

    setFormData(prevFormData => ({
      ...prevFormData,
      [name]: newValue,
    }));

    // If discount is changed, update all selected products with the new discount value
    if (name === 'discount' && selectedProducts.length > 0) {
      const discountValue = parseFloat(newValue) || 0;
      console.log(`Updating discount for all products to ${discountValue}%`);

      // Update all selected products with the new discount value
      const updatedProducts = selectedProducts.map(product => ({
        ...product,
        discountPercentage: discountValue
      }));

      setSelectedProducts(updatedProducts);
    }
  };

  // Handle image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setError('Please upload a valid image file (JPEG, PNG, GIF, WEBP)');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image size should be less than 5MB');
      return;
    }

    setUploadingImage(true);
    setError(null);

    // Create object URL for preview
    const objectUrl = URL.createObjectURL(file);
    setImagePreview(objectUrl);

    // Store file for form submission
    setFormData({
      ...formData,
      imageFile: file,
      image_url: '', // Clear the image URL if we're uploading a new file
    });

    setUploadingImage(false);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setIsSubmitting(true);
      setError(null);

      // Validate required fields
      if (!formData.title) {
        setError('Title is required');
        setIsSubmitting(false);
        return;
      }

      // Image is optional now - the server will use a default if none is provided
      // We've removed the validation to allow updating promotions without explicitly providing an image

      // Extract file for upload
      const { imageFile, ...submitData } = formData;

      // Update promotion
      const result = await updatePromotion(promotion.id, submitData, imageFile);

      if (result) {
        // Update product-promotion relationships
        try {
          // Format product relations for the API - the server will use the promotion's discount for all products
          const productRelations = selectedProducts.map(product => ({
            productId: product.id,
            // We don't need to set discountPercentage here as the server will use the promotion's discount
            discountPercentage: 0 // This will be overridden by the server with the promotion's discount
          }));

          // Update product-promotion relationships
          await updateProductPromotionRelations(promotion.id, productRelations);
        } catch (relationError) {
          console.error('Error updating product-promotion relationships:', relationError);
          // Continue with success even if relationships fail
          // We don't want to block the promotion update if only the relationships fail
        }

        onSubmit();
      } else {
        setError('Failed to update promotion. Please try again.');
      }
    } catch (err) {
      console.error('Error updating promotion:', err);
      setError(err.message || 'Failed to update promotion');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-3 sm:p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        <div className="flex justify-between items-center px-3 sm:px-6 py-3 sm:py-4 border-b">
          <h2 className="text-base sm:text-xl font-semibold text-gray-900">Edit Promotion</h2>
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
            <div className="mb-3 sm:mb-4 bg-red-50 border border-red-200 text-red-800 px-3 py-2 sm:px-4 sm:py-3 rounded-md text-xs sm:text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-y-3 sm:gap-y-6 gap-x-2 sm:gap-x-4 sm:grid-cols-6">
              {/* Title */}
              <div className="sm:col-span-6">
                <label htmlFor="title" className="block text-xs sm:text-sm font-medium text-gray-700">
                  Title *
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="title"
                    id="title"
                    required
                    value={formData.title}
                    onChange={handleInputChange}
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full text-xs sm:text-sm border-gray-300 rounded-md py-1.5"
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
                    value={formData.description || ''}
                    onChange={handleInputChange}
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full text-xs sm:text-sm border-gray-300 rounded-md py-1.5"
                  />
                </div>
              </div>

              {/* Image Upload */}
              <div className="sm:col-span-6">
                <label className="block text-xs sm:text-sm font-medium text-gray-700">
                  Image *
                </label>
                <div className="mt-1 flex flex-col sm:flex-row items-start sm:items-center">
                  <div className="flex-shrink-0 mb-2 sm:mb-0">
                    {imagePreview ? (
                      <div className="relative h-24 w-24 sm:h-32 sm:w-32 rounded-md overflow-hidden">
                        <Image
                          src={imagePreview}
                          alt="Preview"
                          fill
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="h-24 w-24 sm:h-32 sm:w-32 border-2 border-gray-300 border-dashed rounded-md flex items-center justify-center">
                        <PhotoIcon className="h-10 w-10 sm:h-12 sm:w-12 text-gray-400" />
                      </div>
                    )}
                  </div>
                  <div className="sm:ml-4 flex flex-col">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleImageUpload}
                      accept="image/*"
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current.click()}
                      className="inline-flex items-center px-3 py-1.5 sm:px-4 sm:py-2 border border-gray-300 rounded-md shadow-sm text-xs sm:text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      disabled={uploadingImage}
                    >
                      {uploadingImage ? 'Uploading...' : 'Change Image'}
                    </button>
                    <p className="mt-1 text-xs text-gray-500">
                      PNG, JPG, GIF up to 5MB
                    </p>
                  </div>
                </div>
              </div>

              {/* Image URL (alternative to upload) */}
              <div className="sm:col-span-6">
                <label htmlFor="image_url" className="block text-xs sm:text-sm font-medium text-gray-700">
                  Image URL
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="image_url"
                    id="image_url"
                    value={formData.image_url || ''}
                    onChange={handleInputChange}
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full text-xs sm:text-sm border-gray-300 rounded-md py-1.5"
                    placeholder="https://example.com/image.jpg or /images/custom.jpg"
                  />
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  Either upload an image or provide an image URL
                </p>
              </div>

              {/* Link URL */}
              <div className="sm:col-span-6">
                <label htmlFor="link_url" className="block text-xs sm:text-sm font-medium text-gray-700">
                  Link URL
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="link_url"
                    id="link_url"
                    value={formData.link_url || ''}
                    onChange={handleInputChange}
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full text-xs sm:text-sm border-gray-300 rounded-md py-1.5"
                    placeholder="https://example.com/page or /products?category=1"
                  />
                </div>
              </div>

              {/* Type and Position */}
              <div className="col-span-1 sm:col-span-3">
                <label htmlFor="type" className="block text-xs sm:text-sm font-medium text-gray-700">
                  Type
                </label>
                <div className="mt-1">
                  <select
                    id="type"
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full text-xs sm:text-sm border-gray-300 rounded-md py-1.5"
                  >
                    <option value="carousel">Carousel</option>
                    <option value="banner">Banner</option>
                    <option value="deal">Deal</option>
                    <option value="popup">Popup</option>
                  </select>
                </div>
              </div>

              <div className="col-span-1 sm:col-span-3">
                <label htmlFor="position" className="block text-xs sm:text-sm font-medium text-gray-700">
                  Position
                </label>
                <div className="mt-1">
                  <select
                    id="position"
                    name="position"
                    value={formData.position}
                    onChange={handleInputChange}
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full text-xs sm:text-sm border-gray-300 rounded-md py-1.5"
                  >
                    <option value="home">Home Page</option>
                    <option value="category">Category Page</option>
                    <option value="product">Product Page</option>
                    <option value="checkout">Checkout Page</option>
                  </select>
                </div>
              </div>

              {/* Start and End Dates */}
              <div className="col-span-1 sm:col-span-3">
                <label htmlFor="start_date" className="block text-xs sm:text-sm font-medium text-gray-700">
                  Start Date
                </label>
                <div className="mt-1">
                  <input
                    type="datetime-local"
                    name="start_date"
                    id="start_date"
                    value={formData.start_date}
                    onChange={handleInputChange}
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full text-xs sm:text-sm border-gray-300 rounded-md py-1.5"
                  />
                </div>
              </div>

              <div className="col-span-1 sm:col-span-3">
                <label htmlFor="end_date" className="block text-xs sm:text-sm font-medium text-gray-700">
                  End Date
                </label>
                <div className="mt-1">
                  <input
                    type="datetime-local"
                    name="end_date"
                    id="end_date"
                    value={formData.end_date}
                    onChange={handleInputChange}
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full text-xs sm:text-sm border-gray-300 rounded-md py-1.5"
                  />
                </div>
              </div>

              {/* Discount (for deals) */}
              <div className="col-span-1 sm:col-span-3">
                <label htmlFor="discount" className="block text-xs sm:text-sm font-medium text-gray-700">
                  Discount Percentage
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="discount"
                    id="discount"
                    value={formData.discount || ''}
                    onChange={handleInputChange}
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full text-xs sm:text-sm border-gray-300 rounded-md py-1.5"
                    placeholder="e.g., 25"
                  />
                </div>
              </div>

              {/* Priority and Active Status */}
              <div className="col-span-1 sm:col-span-3">
                <label htmlFor="priority" className="block text-xs sm:text-sm font-medium text-gray-700">
                  Priority
                </label>
                <div className="mt-1">
                  <input
                    type="number"
                    name="priority"
                    id="priority"
                    min="0"
                    max="100"
                    value={formData.priority}
                    onChange={handleInputChange}
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full text-xs sm:text-sm border-gray-300 rounded-md py-1.5"
                  />
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  Higher priority items appear first
                </p>
              </div>

              <div className="col-span-1 sm:col-span-3">
                <div className="flex items-center h-full mt-3 sm:mt-6">
                  <input
                    id="is_active"
                    name="is_active"
                    type="checkbox"
                    checked={formData.is_active}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label htmlFor="is_active" className="ml-2 block text-xs sm:text-sm text-gray-700">
                    Active
                  </label>
                </div>
              </div>
            </div>

            {/* Product Selection Section */}
            <div className="mt-6 sm:mt-8">
              <h3 className="text-sm sm:text-base font-medium text-gray-900 mb-3">
                Apply Promotion to Products
              </h3>
              <p className="text-xs text-gray-500 mb-4">
                Search and select products to apply this promotion to. All selected products will use the promotion's discount percentage.
              </p>

              {isLoadingProducts ? (
                <div className="flex justify-center items-center py-8">
                  <div className="animate-spin h-6 w-6 border-2 border-gray-500 border-t-transparent rounded-full"></div>
                  <span className="ml-2 text-sm text-gray-500">Loading products...</span>
                </div>
              ) : (
                <MultiSelectProducts
                  selectedProducts={selectedProducts}
                  onChange={setSelectedProducts}
                  defaultDiscountPercentage={formData.type === 'deal' && formData.discount ? parseFloat(formData.discount) : 10}
                />
              )}
            </div>

            <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row sm:justify-end space-y-2 sm:space-y-0 sm:space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="w-full sm:w-auto px-3 sm:px-4 py-1.5 sm:py-2 border border-gray-300 rounded-md shadow-sm text-xs sm:text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto px-3 sm:px-4 py-1.5 sm:py-2 border border-transparent rounded-md shadow-sm text-xs sm:text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-300 disabled:cursor-not-allowed"
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
