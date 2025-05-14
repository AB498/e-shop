'use client';

import { useState, useEffect } from 'react';
import { ArrowPathIcon } from '@heroicons/react/24/outline';
import { updateSettingAction } from './actions';

export default function PaymentSettings() {
  const [settings, setSettings] = useState([]);
  const [sslcommerzEnabled, setSslcommerzEnabled] = useState(true);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Fetch settings on component mount
  useEffect(() => {
    async function fetchSettings() {
      try {
        setLoading(true);
        const response = await fetch('/api/admin/settings');

        if (!response.ok) {
          throw new Error('Failed to fetch settings');
        }

        const data = await response.json();
        setSettings(data);

        // Find sslcommerz_enabled setting
        const sslcommerzSetting = data.find(setting => setting.key === 'sslcommerz_enabled');
        if (sslcommerzSetting) {
          setSslcommerzEnabled(sslcommerzSetting.value === 'true');
        } else {
          // If the setting doesn't exist, create it with default value 'true'
          console.log('SSLCommerz setting not found, initializing...');
          const result = await updateSettingAction('sslcommerz_enabled', 'true');
          if (result.success) {
            console.log('Successfully initialized SSLCommerz setting');
            setSslcommerzEnabled(true);
          } else {
            console.error('Failed to initialize SSLCommerz setting:', result.error);
          }
        }
      } catch (error) {
        console.error('Error fetching settings:', error);
        setError('Failed to load settings. Please try again.');
      } finally {
        setLoading(false);
      }
    }

    fetchSettings();
  }, []);

  // Handle toggle change
  const handleToggleChange = async () => {
    try {
      setSaving(true);
      const newValue = !sslcommerzEnabled;

      // Call the server action directly
      const result = await updateSettingAction('sslcommerz_enabled', newValue.toString());

      if (!result.success) {
        throw new Error(result.error || 'Failed to update setting');
      }

      setSslcommerzEnabled(newValue);
      setSuccess('Payment settings updated successfully');

      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccess(null);
      }, 3000);
    } catch (error) {
      console.error('Error updating setting:', error);
      setError('Failed to update setting. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="px-3 py-4 md:px-4 md:py-5 border-b border-gray-200 sm:px-6">
        <h3 className="text-base md:text-lg font-medium leading-6 text-gray-900">Payment Settings</h3>
        <p className="mt-1 text-xs md:text-sm text-gray-500">
          Configure payment gateway settings
        </p>
      </div>

      {loading ? (
        <div className="px-3 py-4 md:px-4 md:py-5 sm:p-6 flex justify-center">
          <ArrowPathIcon className="h-5 w-5 text-gray-400 animate-spin" />
        </div>
      ) : (
        <div className="border-t border-gray-200 px-3 py-4 md:px-4 md:py-5 sm:p-6">
          <div className="space-y-4 md:space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-md text-xs md:text-sm">
                {error}
              </div>
            )}

            {success && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-3 py-2 rounded-md text-xs md:text-sm">
                {success}
              </div>
            )}

            <div className="flex flex-row items-center justify-between gap-3">
              <div>
                <h4 className="text-sm md:text-base font-medium text-gray-900">SSLCommerz Payment Gateway</h4>
                <p className="text-xs md:text-sm text-gray-500">
                  Enable or disable SSLCommerz payment gateway for online payments
                </p>
              </div>
              <div className="ml-4 flex-shrink-0">
                <button
                  type="button"
                  onClick={handleToggleChange}
                  disabled={saving}
                  className={`${
                    sslcommerzEnabled ? 'bg-emerald-600' : 'bg-gray-200'
                  } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2`}
                >
                  <span className="sr-only">Toggle SSLCommerz</span>
                  <span
                    aria-hidden="true"
                    className={`${
                      sslcommerzEnabled ? 'translate-x-5' : 'translate-x-0'
                    } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
                  />
                </button>
              </div>
            </div>

            <div className="pt-2 text-xs text-gray-500">
              <p>
                {sslcommerzEnabled
                  ? 'SSLCommerz is currently enabled. Customers can make online payments.'
                  : 'SSLCommerz is currently disabled. Only Cash on Delivery will be available.'}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
