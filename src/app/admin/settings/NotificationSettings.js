'use client';

import { useState, useEffect } from 'react';
import { ArrowPathIcon } from '@heroicons/react/24/outline';

export default function NotificationSettings() {
  const [settings, setSettings] = useState({
    notify_orders: true,
    notify_stock: true,
    notify_customers: false
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Fetch notification settings on component mount
  useEffect(() => {
    async function fetchSettings() {
      try {
        setLoading(true);
        const response = await fetch('/api/admin/settings');

        if (!response.ok) {
          throw new Error('Failed to fetch settings');
        }

        const data = await response.json();
        
        // Find notification settings
        const notifyOrders = data.find(setting => setting.key === 'notify_orders');
        const notifyStock = data.find(setting => setting.key === 'notify_stock');
        const notifyCustomers = data.find(setting => setting.key === 'notify_customers');
        
        setSettings({
          notify_orders: notifyOrders ? notifyOrders.value === 'true' : true,
          notify_stock: notifyStock ? notifyStock.value === 'true' : true,
          notify_customers: notifyCustomers ? notifyCustomers.value === 'true' : false
        });
      } catch (error) {
        console.error('Error fetching notification settings:', error);
        setError('Failed to load notification settings. Please try again.');
      } finally {
        setLoading(false);
      }
    }

    fetchSettings();
  }, []);

  // Handle checkbox change
  const handleChange = (e) => {
    const { name, checked } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: checked
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setSaving(true);
      setError(null);
      setSuccess(null);

      // Update each setting
      const updatePromises = Object.entries(settings).map(([key, value]) => {
        return fetch('/api/admin/settings', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            key,
            value: value.toString()
          }),
        });
      });

      const responses = await Promise.all(updatePromises);
      
      // Check if all responses are ok
      const allSuccessful = responses.every(response => response.ok);
      
      if (!allSuccessful) {
        throw new Error('Failed to update one or more notification settings');
      }

      setSuccess('Notification settings updated successfully');
    } catch (error) {
      console.error('Error updating notification settings:', error);
      setError(error.message || 'Failed to update notification settings');
    } finally {
      setSaving(false);
    }
  };

  // Handle cancel
  const handleCancel = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/settings');

      if (!response.ok) {
        throw new Error('Failed to fetch settings');
      }

      const data = await response.json();
      
      // Find notification settings
      const notifyOrders = data.find(setting => setting.key === 'notify_orders');
      const notifyStock = data.find(setting => setting.key === 'notify_stock');
      const notifyCustomers = data.find(setting => setting.key === 'notify_customers');
      
      setSettings({
        notify_orders: notifyOrders ? notifyOrders.value === 'true' : true,
        notify_stock: notifyStock ? notifyStock.value === 'true' : true,
        notify_customers: notifyCustomers ? notifyCustomers.value === 'true' : false
      });
      
      setError(null);
      setSuccess(null);
    } catch (error) {
      console.error('Error resetting notification settings:', error);
      setError('Failed to reset notification settings');
    } finally {
      setLoading(false);
    }
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
      <h3 className="text-base md:text-lg font-medium leading-6 text-gray-900">Notification Preferences</h3>
      
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
      
      <form onSubmit={handleSubmit}>
        <div className="space-y-3 md:space-y-4">
          <div className="relative flex items-start">
            <div className="flex items-center h-5">
              <input
                id="notify_orders"
                name="notify_orders"
                type="checkbox"
                checked={settings.notify_orders}
                onChange={handleChange}
                className="focus:ring-emerald-500 h-4 w-4 text-emerald-600 border-gray-300 rounded"
              />
            </div>
            <div className="ml-3">
              <label htmlFor="notify_orders" className="font-medium text-xs md:text-sm text-gray-700">
                New Orders
              </label>
              <p className="text-xs md:text-sm text-gray-500">Get notified when a new order is placed</p>
            </div>
          </div>
          
          <div className="relative flex items-start">
            <div className="flex items-center h-5">
              <input
                id="notify_stock"
                name="notify_stock"
                type="checkbox"
                checked={settings.notify_stock}
                onChange={handleChange}
                className="focus:ring-emerald-500 h-4 w-4 text-emerald-600 border-gray-300 rounded"
              />
            </div>
            <div className="ml-3">
              <label htmlFor="notify_stock" className="font-medium text-xs md:text-sm text-gray-700">
                Low Stock Alerts
              </label>
              <p className="text-xs md:text-sm text-gray-500">Get notified when products are running low</p>
            </div>
          </div>
          
          <div className="relative flex items-start">
            <div className="flex items-center h-5">
              <input
                id="notify_customers"
                name="notify_customers"
                type="checkbox"
                checked={settings.notify_customers}
                onChange={handleChange}
                className="focus:ring-emerald-500 h-4 w-4 text-emerald-600 border-gray-300 rounded"
              />
            </div>
            <div className="ml-3">
              <label htmlFor="notify_customers" className="font-medium text-xs md:text-sm text-gray-700">
                New Customers
              </label>
              <p className="text-xs md:text-sm text-gray-500">Get notified when a new customer registers</p>
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
