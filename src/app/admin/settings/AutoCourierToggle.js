'use client';

import { useState, useEffect } from 'react';
import { TruckIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import { updateSettingAction } from './actions';

export default function AutoCourierToggle() {
  const [settings, setSettings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [autoCourierEnabled, setAutoCourierEnabled] = useState(false);

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

        // Find auto_create_courier_order setting
        const autoCreateSetting = data.find(setting => setting.key === 'auto_create_courier_order');
        if (autoCreateSetting) {
          setAutoCourierEnabled(autoCreateSetting.value === 'true');
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
      setError(null);
      const newValue = !autoCourierEnabled;

      // Call the server action directly
      const result = await updateSettingAction('auto_create_courier_order', newValue.toString());

      if (!result.success) {
        throw new Error(result.error || 'Failed to update setting');
      }

      setAutoCourierEnabled(newValue);
      setSuccess('Auto courier setting updated successfully');

      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccess(null);
      }, 3000);
    } catch (error) {
      console.error('Error updating auto courier setting:', error);
      setError('Failed to update auto courier setting. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="px-3 py-4 md:px-4 md:py-5 border-b border-gray-200 sm:px-6">
        <h3 className="text-base md:text-lg font-medium leading-6 text-gray-900 flex items-center">
          <TruckIcon className="h-4 w-4 md:h-5 md:w-5 mr-1 md:mr-2 text-gray-500" />
          Automatic Courier Orders
        </h3>
        <p className="mt-1 text-xs md:text-sm text-gray-500">
          Enable or disable automatic courier order creation
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
                <h4 className="text-sm md:text-base font-medium text-gray-900">Enable Automatic Courier Orders</h4>
                <p className="text-xs md:text-sm text-gray-500">
                  When enabled, courier orders will be automatically created for new orders using the default courier provider
                </p>
              </div>
              <div className="ml-4 flex-shrink-0">
                <button
                  type="button"
                  onClick={handleToggleChange}
                  disabled={saving}
                  className={`${
                    autoCourierEnabled ? 'bg-emerald-600' : 'bg-gray-200'
                  } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2`}
                >
                  <span className="sr-only">Toggle Auto Courier</span>
                  <span
                    aria-hidden="true"
                    className={`${
                      autoCourierEnabled ? 'translate-x-5' : 'translate-x-0'
                    } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
                  />
                </button>
              </div>
            </div>

            <div className="pt-2 text-xs text-gray-500">
              <p>
                {autoCourierEnabled
                  ? 'Automatic courier orders are enabled. Orders will be created automatically using the default courier provider.'
                  : 'Automatic courier orders are disabled. You will need to manually create courier orders.'}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
