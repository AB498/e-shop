import { useState, useRef } from 'react';
import { XMarkIcon, PhotoIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import { createPromotion } from '@/lib/actions/promotions';

export default function AddPromotionModal({ onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image_url: '',
    link_url: '',
    type: 'carousel',
    position: 'home',
    start_date: '',
    end_date: '',
    is_active: true,
    priority: 0,
    discount: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
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
    });

    setUploadingImage(false);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setIsSubmitting(true);
      setError(null);

      // Create FormData for file upload
      const { imageFile, ...submitData } = formData;

      // Create promotion
      const result = await createPromotion(submitData, imageFile);

      if (result) {
        onSubmit();
      } else {
        setError('Failed to create promotion. Please try again.');
      }
    } catch (err) {
      console.error('Error creating promotion:', err);
      setError(err.message || 'Failed to create promotion');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-3 sm:p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        <div className="flex justify-between items-center px-3 sm:px-6 py-3 sm:py-4 border-b">
          <h2 className="text-base sm:text-xl font-semibold text-gray-900">Add New Promotion</h2>
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
                    value={formData.description}
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
                      {uploadingImage ? 'Uploading...' : 'Upload Image'}
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
                  Image URL (alternative to upload)
                </label>
                <div className="mt-1">
                  <input
                    type="url"
                    name="image_url"
                    id="image_url"
                    value={formData.image_url}
                    onChange={handleInputChange}
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full text-xs sm:text-sm border-gray-300 rounded-md py-1.5"
                    placeholder="https://example.com/image.jpg"
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
                    type="url"
                    name="link_url"
                    id="link_url"
                    value={formData.link_url}
                    onChange={handleInputChange}
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full text-xs sm:text-sm border-gray-300 rounded-md py-1.5"
                    placeholder="https://example.com/page"
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
                    value={formData.discount}
                    onChange={handleInputChange}
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full text-xs sm:text-sm border-gray-300 rounded-md py-1.5"
                    placeholder="e.g., 25"
                  />
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  Only applicable for deal type promotions
                </p>
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

            <div className="mt-4 sm:mt-6 flex flex-col sm:flex-row sm:justify-end space-y-2 sm:space-y-0 sm:space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="w-full sm:w-auto px-3 sm:px-4 py-1.5 sm:py-2 border border-gray-300 rounded-md shadow-sm text-xs sm:text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || (!formData.image_url && !formData.imageFile)}
                className="w-full sm:w-auto px-3 sm:px-4 py-1.5 sm:py-2 border border-transparent rounded-md shadow-sm text-xs sm:text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Creating...' : 'Create Promotion'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
