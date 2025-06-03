'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { PhotoIcon } from '@heroicons/react/24/outline';
import { uploadFileToS3 } from '@/lib/client-upload';

export default function EditCategoryModal({ isOpen, onClose, onSubmit, category }) {
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    image: '',
    display_order: 1,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);

  // Update form data when category changes
  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name || '',
        slug: category.slug || '',
        image: category.image || '',
        display_order: category.display_order || 0,
      });
      setImagePreview(category.image || null);
    }
  }, [category]);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Auto-generate slug from name if slug field is empty or if name is changed and slug matches the old name
    if (name === 'name' && (
      !formData.slug ||
      (category && formData.slug === category.slug)
    )) {
      const slug = value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      setFormData((prev) => ({
        ...prev,
        slug,
      }));
    }

    // If image URL changes manually, update the preview
    if (name === 'image' && value) {
      setImagePreview(value);
    } else if (name === 'image' && !value) {
      setImagePreview(null);
    }
  };

  // Handle image upload
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check file type
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
    if (!validTypes.includes(file.type)) {
      setError('Please upload a valid image file (JPEG, PNG, GIF, WEBP, SVG)');
      return;
    }

    // Check file size (max 50MB for client-side upload)
    if (file.size > 50 * 1024 * 1024) {
      setError('Image size should be less than 50MB');
      return;
    }

    try {
      setUploadingImage(true);
      setError(null);

      // Create a temporary object URL for preview
      const objectUrl = URL.createObjectURL(file);
      setImagePreview(objectUrl);

      // Store the file in the form data for later submission
      setFormData(prev => ({
        ...prev,
        imageFile: file,
        // Keep the existing image URL if any
        image: prev.image
      }));
    } catch (err) {
      setError(err.message || 'Failed to process image');
    } finally {
      setUploadingImage(false);
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // If we have a new image file, upload it first using client-side upload
      if (formData.imageFile) {
        const uploadResult = await uploadFileToS3(formData.imageFile, 'categories');

        if (!uploadResult.success) {
          throw new Error(uploadResult.error || 'Failed to upload image');
        }

        // Update form data with the image URL
        formData.image = uploadResult.url;
      }

      // Remove the imageFile property before submitting
      const { imageFile, ...submitData } = formData;

      await onSubmit(category.id, submitData);
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to update category');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen || !category) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>

        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                <h3 className="text-lg leading-6 font-medium text-gray-900">Edit Category</h3>
                <div className="mt-4">
                  {error && (
                    <div className="mb-4 bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-md">
                      <p>{error}</p>
                    </div>
                  )}

                  <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                        Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="name"
                        id="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                      />
                    </div>

                    <div className="mb-4">
                      <label htmlFor="slug" className="block text-sm font-medium text-gray-700">
                        Slug
                      </label>
                      <input
                        type="text"
                        name="slug"
                        id="slug"
                        value={formData.slug}
                        onChange={handleInputChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                      />
                      <p className="mt-1 text-xs text-gray-500">
                        Auto-generated from name if left empty. Used in URLs.
                      </p>
                    </div>

                    <div className="mb-4">
                      <label htmlFor="display_order" className="block text-sm font-medium text-gray-700">
                        Display Order
                      </label>
                      <input
                        type="number"
                        name="display_order"
                        id="display_order"
                        value={formData.display_order}
                        onChange={handleInputChange}
                        min="1"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                      />
                      <p className="mt-1 text-xs text-gray-500">
                        Order in which the category will be displayed. Lower numbers appear first (1 is the top position).
                      </p>
                    </div>

                    <div className="mb-4">
                      <label htmlFor="image" className="block text-sm font-medium text-gray-700">
                        Category Image
                      </label>

                      {/* Image Preview */}
                      {imagePreview && (
                        <div className="mt-2 relative w-full h-48 border rounded-md overflow-hidden">
                          <Image
                            src={imagePreview}
                            alt="Category preview"
                            fill
                            style={{ objectFit: 'contain' }}
                            unoptimized={true}
                          />
                        </div>
                      )}

                      {/* Image Upload */}
                      <div className="mt-2">
                        <div className="flex items-center justify-center w-full">
                          <label
                            htmlFor="file-upload-edit"
                            className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
                          >
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                              <PhotoIcon className="w-8 h-8 mb-3 text-gray-400" />
                              <p className="mb-2 text-sm text-gray-500">
                                <span className="font-semibold">Click to upload</span> or drag and drop
                              </p>
                              <p className="text-xs text-gray-500">PNG, JPG, GIF or WEBP (MAX. 50MB)</p>
                            </div>
                            <input
                              id="file-upload-edit"
                              type="file"
                              className="hidden"
                              accept="image/*"
                              onChange={handleImageUpload}
                              ref={fileInputRef}
                              disabled={uploadingImage}
                            />
                          </label>
                        </div>
                        {uploadingImage && (
                          <p className="mt-2 text-sm text-emerald-600">Uploading image...</p>
                        )}
                      </div>

                      {/* Manual URL Input */}
                      <div className="mt-3">
                        <label htmlFor="image-url-edit" className="block text-xs font-medium text-gray-700">
                          Or enter image URL manually:
                        </label>
                        <input
                          type="text"
                          name="image"
                          id="image-url-edit"
                          value={formData.image}
                          onChange={handleInputChange}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                        />
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-emerald-600 text-base font-medium text-white hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 sm:ml-3 sm:w-auto sm:text-sm"
            >
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
