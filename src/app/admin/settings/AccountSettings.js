'use client';

import { useState, useEffect } from 'react';
import { ArrowPathIcon } from '@heroicons/react/24/outline';
import { useSession, signOut, signIn } from 'next-auth/react';

export default function AccountSettings() {
  const { data: session, update: updateSession } = useSession();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Fetch user data on component mount
  useEffect(() => {
    if (session?.user) {
      setFormData({
        firstName: session.user.firstName || '',
        lastName: session.user.lastName || '',
        email: session.user.email || '',
      });
      setLoading(false);
    }
  }, [session]);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form
    if (!formData.firstName || !formData.lastName || !formData.email) {
      setError('First name, last name, and email are required');
      return;
    }

    try {
      setSaving(true);
      setError(null);
      setSuccess(null);

      const response = await fetch('/api/admin/update-profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to update profile');
      }

      const data = await response.json();

      // Force a complete session refresh
      const currentPath = window.location.pathname;

      // First try to update the session normally
      try {
        await updateSession();
      } catch (sessionError) {
        console.error('Error updating session:', sessionError);
        // Continue even if session update fails
      }

      setSuccess('Account settings updated successfully in the database. Click "Refresh Page" to update the display.');
    } catch (error) {
      console.error('Error updating profile:', error);
      setError(error.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  // Handle cancel
  const handleCancel = () => {
    // Reset form to original values
    if (session?.user) {
      setFormData({
        firstName: session.user.firstName || '',
        lastName: session.user.lastName || '',
        email: session.user.email || '',
      });
    }
    setError(null);
    setSuccess(null);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-24 md:h-32">
        <ArrowPathIcon className="h-6 w-6 md:h-8 md:w-8 text-gray-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-4 md:space-y-6">
      <h3 className="text-base md:text-lg font-medium leading-6 text-gray-900">Account Settings</h3>

      {error && (
        <div className="bg-red-50 p-3 md:p-4 rounded-md">
          <p className="text-xs md:text-sm text-red-700">{error}</p>
        </div>
      )}

      {success && (
        <div className="bg-green-50 p-3 md:p-4 rounded-md">
          <div className="flex justify-between items-center">
            <p className="text-xs md:text-sm text-green-700">{success}</p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="text-xs md:text-sm text-emerald-600 hover:text-emerald-800 font-medium"
              >
                Refresh Page
              </button>
              <button
                type="button"
                onClick={async () => {
                  // Force a complete session refresh by signing out and back in
                  await signOut({ redirect: false });
                  window.location.href = '/auth/login?callbackUrl=/admin/settings';
                }}
                className="text-xs md:text-sm text-blue-600 hover:text-blue-800 font-medium"
              >
                Logout & Login Again
              </button>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 gap-y-4 md:gap-y-6 gap-x-3 md:gap-x-4 xs:grid-cols-2 sm:grid-cols-6">
          <div className="xs:col-span-1 sm:col-span-3">
            <label htmlFor="firstName" className="block text-xs md:text-sm font-medium text-gray-700">
              First name
            </label>
            <div className="mt-1">
              <input
                type="text"
                name="firstName"
                id="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="shadow-sm focus:ring-emerald-500 focus:border-emerald-500 block w-full text-xs md:text-sm border-gray-300 rounded-md h-9 md:h-10"
              />
            </div>
          </div>

          <div className="xs:col-span-1 sm:col-span-3">
            <label htmlFor="lastName" className="block text-xs md:text-sm font-medium text-gray-700">
              Last name
            </label>
            <div className="mt-1">
              <input
                type="text"
                name="lastName"
                id="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="shadow-sm focus:ring-emerald-500 focus:border-emerald-500 block w-full text-xs md:text-sm border-gray-300 rounded-md h-9 md:h-10"
              />
            </div>
          </div>

          <div className="xs:col-span-2 sm:col-span-4">
            <label htmlFor="email" className="block text-xs md:text-sm font-medium text-gray-700">
              Email address
            </label>
            <div className="mt-1">
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className="shadow-sm focus:ring-emerald-500 focus:border-emerald-500 block w-full text-xs md:text-sm border-gray-300 rounded-md h-9 md:h-10"
              />
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
            disabled={saving}
            className="w-auto ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-xs md:text-sm font-medium rounded-md text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
          >
            {saving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </form>
    </div>
  );
}
