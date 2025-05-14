'use client';

import { useState } from 'react';
import { ArrowPathIcon } from '@heroicons/react/24/outline';
import { useSession } from 'next-auth/react';

export default function SecuritySettings() {
  const { data: session } = useSession();
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear specific error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    if (!formData.currentPassword) {
      newErrors.currentPassword = 'Current password is required';
    }

    if (!formData.newPassword) {
      newErrors.newPassword = 'New password is required';
    } else if (formData.newPassword.length < 8) {
      newErrors.newPassword = 'Password must be at least 8 characters';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your new password';
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      const response = await fetch('/api/admin/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to update password');
      }

      // Clear form
      setFormData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });

      setSuccess('Password updated successfully');
    } catch (error) {
      console.error('Error updating password:', error);
      setError(error.message || 'Failed to update password');
    } finally {
      setLoading(false);
    }
  };

  // Handle cancel
  const handleCancel = () => {
    // Reset form
    setFormData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
    setErrors({});
    setError(null);
    setSuccess(null);
  };

  return (
    <div className="space-y-4 md:space-y-6">
      <h3 className="text-base md:text-lg font-medium leading-6 text-gray-900">Security Settings</h3>

      {error && (
        <div className="bg-red-50 p-3 md:p-4 rounded-md">
          <p className="text-xs md:text-sm text-red-700">{error}</p>
        </div>
      )}

      {success && (
        <div className="bg-green-50 p-3 md:p-4 rounded-md">
          <p className="text-xs md:text-sm text-green-700">{success}</p>
        </div>
      )}

      <div className="space-y-4 md:space-y-6">
        <div>
          <h4 className="text-xs md:text-sm font-medium text-gray-900">Change Password</h4>
          <form onSubmit={handleSubmit} className="mt-2">
            <div className="grid grid-cols-1 gap-y-4 md:gap-y-6 gap-x-3 md:gap-x-4 xs:grid-cols-2 sm:grid-cols-6">
              <div className="xs:col-span-2 sm:col-span-4">
                <label htmlFor="currentPassword" className="block text-xs md:text-sm font-medium text-gray-700">
                  Current Password
                </label>
                <div className="mt-1">
                  <input
                    type="password"
                    name="currentPassword"
                    id="currentPassword"
                    value={formData.currentPassword}
                    onChange={handleChange}
                    className={`shadow-sm focus:ring-emerald-500 focus:border-emerald-500 block w-full text-xs md:text-sm border-gray-300 rounded-md h-9 md:h-10 ${
                      errors.currentPassword ? 'border-red-300' : ''
                    }`}
                  />
                  {errors.currentPassword && (
                    <p className="mt-1 text-xs text-red-600">{errors.currentPassword}</p>
                  )}
                </div>
              </div>

              <div className="xs:col-span-2 sm:col-span-4">
                <label htmlFor="newPassword" className="block text-xs md:text-sm font-medium text-gray-700">
                  New Password
                </label>
                <div className="mt-1">
                  <input
                    type="password"
                    name="newPassword"
                    id="newPassword"
                    value={formData.newPassword}
                    onChange={handleChange}
                    className={`shadow-sm focus:ring-emerald-500 focus:border-emerald-500 block w-full text-xs md:text-sm border-gray-300 rounded-md h-9 md:h-10 ${
                      errors.newPassword ? 'border-red-300' : ''
                    }`}
                  />
                  {errors.newPassword && (
                    <p className="mt-1 text-xs text-red-600">{errors.newPassword}</p>
                  )}
                </div>
              </div>

              <div className="xs:col-span-2 sm:col-span-4">
                <label htmlFor="confirmPassword" className="block text-xs md:text-sm font-medium text-gray-700">
                  Confirm New Password
                </label>
                <div className="mt-1">
                  <input
                    type="password"
                    name="confirmPassword"
                    id="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={`shadow-sm focus:ring-emerald-500 focus:border-emerald-500 block w-full text-xs md:text-sm border-gray-300 rounded-md h-9 md:h-10 ${
                      errors.confirmPassword ? 'border-red-300' : ''
                    }`}
                  />
                  {errors.confirmPassword && (
                    <p className="mt-1 text-xs text-red-600">{errors.confirmPassword}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="flex flex-row justify-end gap-2 mt-4">
              <button
                type="button"
                onClick={handleCancel}
                className="w-auto bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-xs md:text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="w-auto ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-xs md:text-sm font-medium rounded-md text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
              >
                {loading ? (
                  <span className="flex items-center">
                    <ArrowPathIcon className="h-4 w-4 mr-2 animate-spin" />
                    Updating...
                  </span>
                ) : (
                  'Save'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
