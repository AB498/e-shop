'use client';

import { useState, useEffect } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';
import { signOut, useSession } from 'next-auth/react';

export default function EditProfileModal({ user, onClose, onUpdate }) {
  const { update: updateSession } = useSession();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    address: '',
    city: '',
    postCode: '',
    country: '',
    region: '',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Initialize form data with user data
  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        password: '',
        confirmPassword: '',
        phone: user.phone || '',
        address: user.address || '',
        city: user.city || '',
        postCode: user.postCode || '',
        country: user.country || '',
        region: user.region || '',
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
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    // Validate password only if it's provided
    if (formData.password) {
      if (formData.password.length < 6) {
        newErrors.password = 'Password must be at least 6 characters';
      }

      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
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
      // Remove confirmPassword from the data sent to the API
      const { confirmPassword, ...dataToSubmit } = formData;

      // Only include password if it's not empty
      if (!dataToSubmit.password) {
        delete dataToSubmit.password;
      }

      const response = await fetch('/api/user/update-profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSubmit),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update profile');
      }

      toast.success('Profile updated successfully');

      // Update the session with the new user data
      await updateSession({
        user: {
          ...data.user
        }
      });

      // If email was changed, sign out the user
      if (user.email !== formData.email) {
        toast.success('Email changed. Please sign in with your new email.');
        setTimeout(() => {
          signOut({ callbackUrl: '/auth/login' });
        }, 2000);
        return;
      }

      // Call the onUpdate callback with the updated user data
      if (onUpdate) {
        onUpdate(data.user);
      }

      onClose();
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error(error.message || 'Failed to update profile');
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
          <div className="bg-white px-3 pt-4 pb-3 sm:p-5 sm:pb-4">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-base font-medium text-gray-900">Edit Profile</h3>
              <button
                type="button"
                onClick={onClose}
                className="text-gray-400 hover:text-gray-500 focus:outline-none"
              >
                <XMarkIcon className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-3">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {/* First Name */}
                <div>
                  <label htmlFor="firstName" className="block text-[#444444] text-xs mb-1">
                    First Name*
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    id="firstName"
                    required
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className={`w-full p-2 text-sm border ${errors.firstName ? 'border-red-500' : 'border-[#E9E9E9]'} rounded-md focus:outline-none focus:ring-1 focus:ring-[#3BB77E]`}
                  />
                  {errors.firstName && (
                    <p className="mt-1 text-xs text-red-600">{errors.firstName}</p>
                  )}
                </div>

                {/* Last Name */}
                <div>
                  <label htmlFor="lastName" className="block text-[#444444] text-xs mb-1">
                    Last Name*
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    id="lastName"
                    required
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className={`w-full p-2 text-sm border ${errors.lastName ? 'border-red-500' : 'border-[#E9E9E9]'} rounded-md focus:outline-none focus:ring-1 focus:ring-[#3BB77E]`}
                  />
                  {errors.lastName && (
                    <p className="mt-1 text-xs text-red-600">{errors.lastName}</p>
                  )}
                </div>

                {/* Email */}
                <div className="sm:col-span-2">
                  <label htmlFor="email" className="block text-[#444444] text-xs mb-1">
                    Email*
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`w-full p-2 text-sm border ${errors.email ? 'border-red-500' : 'border-[#E9E9E9]'} rounded-md focus:outline-none focus:ring-1 focus:ring-[#3BB77E]`}
                  />
                  {errors.email && (
                    <p className="mt-1 text-xs text-red-600">{errors.email}</p>
                  )}
                  {formData.email !== user.email && (
                    <p className="mt-1 text-xs text-amber-600">
                      Changing your email will require you to sign in again.
                    </p>
                  )}
                </div>

                {/* Password */}
                <div className="sm:col-span-2">
                  <label htmlFor="password" className="block text-[#444444] text-xs mb-1">
                    Password (leave blank to keep current)
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      id="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className={`w-full p-2 text-sm border ${errors.password ? 'border-red-500' : 'border-[#E9E9E9]'} rounded-md focus:outline-none focus:ring-1 focus:ring-[#3BB77E]`}
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-xs leading-5"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? 'Hide' : 'Show'}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="mt-1 text-xs text-red-600">{errors.password}</p>
                  )}
                </div>

                {/* Confirm Password */}
                {formData.password && (
                  <div className="sm:col-span-2">
                    <label htmlFor="confirmPassword" className="block text-[#444444] text-xs mb-1">
                      Confirm Password
                    </label>
                    <input
                      type={showPassword ? "text" : "password"}
                      name="confirmPassword"
                      id="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className={`w-full p-2 text-sm border ${errors.confirmPassword ? 'border-red-500' : 'border-[#E9E9E9]'} rounded-md focus:outline-none focus:ring-1 focus:ring-[#3BB77E]`}
                    />
                    {errors.confirmPassword && (
                      <p className="mt-1 text-xs text-red-600">{errors.confirmPassword}</p>
                    )}
                  </div>
                )}

                {/* Phone */}
                <div className="sm:col-span-2">
                  <label htmlFor="phone" className="block text-[#444444] text-xs mb-1">
                    Phone
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    id="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full p-2 text-sm border border-[#E9E9E9] rounded-md focus:outline-none focus:ring-1 focus:ring-[#3BB77E]"
                  />
                </div>

                {/* Address */}
                <div className="sm:col-span-2">
                  <label htmlFor="address" className="block text-[#444444] text-xs mb-1">
                    Address
                  </label>
                  <input
                    type="text"
                    name="address"
                    id="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="w-full p-2 text-sm border border-[#E9E9E9] rounded-md focus:outline-none focus:ring-1 focus:ring-[#3BB77E]"
                  />
                </div>

                {/* City */}
                <div>
                  <label htmlFor="city" className="block text-[#444444] text-xs mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    name="city"
                    id="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className="w-full p-2 text-sm border border-[#E9E9E9] rounded-md focus:outline-none focus:ring-1 focus:ring-[#3BB77E]"
                  />
                </div>

                {/* Post Code */}
                <div>
                  <label htmlFor="postCode" className="block text-[#444444] text-xs mb-1">
                    Post Code
                  </label>
                  <input
                    type="text"
                    name="postCode"
                    id="postCode"
                    value={formData.postCode}
                    onChange={handleInputChange}
                    className="w-full p-2 text-sm border border-[#E9E9E9] rounded-md focus:outline-none focus:ring-1 focus:ring-[#3BB77E]"
                  />
                </div>

                {/* Country */}
                <div>
                  <label htmlFor="country" className="block text-[#444444] text-xs mb-1">
                    Country
                  </label>
                  <input
                    type="text"
                    name="country"
                    id="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    className="w-full p-2 text-sm border border-[#E9E9E9] rounded-md focus:outline-none focus:ring-1 focus:ring-[#3BB77E]"
                  />
                </div>

                {/* Region */}
                <div>
                  <label htmlFor="region" className="block text-[#444444] text-xs mb-1">
                    Region/State
                  </label>
                  <input
                    type="text"
                    name="region"
                    id="region"
                    value={formData.region}
                    onChange={handleInputChange}
                    className="w-full p-2 text-sm border border-[#E9E9E9] rounded-md focus:outline-none focus:ring-1 focus:ring-[#3BB77E]"
                  />
                </div>
              </div>

              <div className="mt-4 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="inline-flex justify-center py-1.5 px-3 border border-gray-300 shadow-sm text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-[#3BB77E]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex justify-center py-1.5 px-3 border border-transparent shadow-sm text-xs font-medium rounded-md text-white bg-[#3BB77E] hover:bg-[#2A9D6E] focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-[#3BB77E] disabled:opacity-50"
                >
                  {isSubmitting ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
