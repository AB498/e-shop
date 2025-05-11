'use client';

import { useState, useEffect } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';
import { useSession } from 'next-auth/react';

export default function AddressForm({ user, onClose, onUpdate }) {
  const { update: updateSession } = useSession();
  const [formData, setFormData] = useState({
    address: '',
    city: '',
    postCode: '',
    country: '',
    region: '',
    phone: '',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize form data with user data
  useEffect(() => {
    if (user) {
      setFormData({
        address: user.address || '',
        city: user.city || '',
        postCode: user.postCode || '',
        country: user.country || '',
        region: user.region || '',
        phone: user.phone || '',
      });
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Validate required fields
    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    }

    if (!formData.city.trim()) {
      newErrors.city = 'City is required';
    }

    if (!formData.postCode.trim()) {
      newErrors.postCode = 'Post code is required';
    }

    if (!formData.country.trim()) {
      newErrors.country = 'Country is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // We'll use the same update profile API but only update address fields
      const dataToSubmit = {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        ...formData
      };

      const response = await fetch('/api/user/update-profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSubmit),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update address');
      }

      toast.success('Address updated successfully');

      // Update the session with the new user data
      await updateSession({
        user: {
          ...data.user
        }
      });

      // Call the onUpdate callback with the updated user data
      if (onUpdate) {
        onUpdate(data.user);
      }

      onClose();
    } catch (error) {
      console.error('Error updating address:', error);
      toast.error(error.message || 'Failed to update address');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>

        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">Update Address</h3>
              <button
                type="button"
                onClick={onClose}
                className="text-gray-400 hover:text-gray-500 focus:outline-none"
              >
                <XMarkIcon className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {/* Address */}
                <div className="sm:col-span-2">
                  <label htmlFor="address" className="block text-[#444444] mb-2">
                    Address*
                  </label>
                  <input
                    type="text"
                    name="address"
                    id="address"
                    required
                    value={formData.address}
                    onChange={handleInputChange}
                    className={`w-full p-3 border ${errors.address ? 'border-red-500' : 'border-[#E9E9E9]'} rounded-md focus:outline-none focus:ring-2 focus:ring-[#3BB77E]`}
                  />
                  {errors.address && (
                    <p className="mt-1 text-sm text-red-600">{errors.address}</p>
                  )}
                </div>

                {/* City */}
                <div>
                  <label htmlFor="city" className="block text-[#444444] mb-2">
                    City*
                  </label>
                  <input
                    type="text"
                    name="city"
                    id="city"
                    required
                    value={formData.city}
                    onChange={handleInputChange}
                    className={`w-full p-3 border ${errors.city ? 'border-red-500' : 'border-[#E9E9E9]'} rounded-md focus:outline-none focus:ring-2 focus:ring-[#3BB77E]`}
                  />
                  {errors.city && (
                    <p className="mt-1 text-sm text-red-600">{errors.city}</p>
                  )}
                </div>

                {/* Post Code */}
                <div>
                  <label htmlFor="postCode" className="block text-[#444444] mb-2">
                    Post Code*
                  </label>
                  <input
                    type="text"
                    name="postCode"
                    id="postCode"
                    required
                    value={formData.postCode}
                    onChange={handleInputChange}
                    className={`w-full p-3 border ${errors.postCode ? 'border-red-500' : 'border-[#E9E9E9]'} rounded-md focus:outline-none focus:ring-2 focus:ring-[#3BB77E]`}
                  />
                  {errors.postCode && (
                    <p className="mt-1 text-sm text-red-600">{errors.postCode}</p>
                  )}
                </div>

                {/* Country */}
                <div>
                  <label htmlFor="country" className="block text-[#444444] mb-2">
                    Country*
                  </label>
                  <input
                    type="text"
                    name="country"
                    id="country"
                    required
                    value={formData.country}
                    onChange={handleInputChange}
                    className={`w-full p-3 border ${errors.country ? 'border-red-500' : 'border-[#E9E9E9]'} rounded-md focus:outline-none focus:ring-2 focus:ring-[#3BB77E]`}
                  />
                  {errors.country && (
                    <p className="mt-1 text-sm text-red-600">{errors.country}</p>
                  )}
                </div>

                {/* Region */}
                <div>
                  <label htmlFor="region" className="block text-[#444444] mb-2">
                    Region/State
                  </label>
                  <input
                    type="text"
                    name="region"
                    id="region"
                    value={formData.region}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-[#E9E9E9] rounded-md focus:outline-none focus:ring-2 focus:ring-[#3BB77E]"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label htmlFor="phone" className="block text-[#444444] mb-2">
                    Phone
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    id="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-[#E9E9E9] rounded-md focus:outline-none focus:ring-2 focus:ring-[#3BB77E]"
                  />
                </div>
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#3BB77E]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-[#3BB77E] hover:bg-[#2A9D6E] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#3BB77E] disabled:opacity-50"
                >
                  {isSubmitting ? 'Saving...' : 'Save Address'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
