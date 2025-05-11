'use client';

import { useState, useEffect } from 'react';
import { TruckIcon, ArrowPathIcon } from '@heroicons/react/24/outline';

export default function CourierSettings() {
  const [settings, setSettings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [autoCreatePathaoOrder, setAutoCreatePathaoOrder] = useState(true);

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

        // Find auto_create_pathao_order setting
        const autoCreateSetting = data.find(setting => setting.key === 'auto_create_pathao_order');
        if (autoCreateSetting) {
          setAutoCreatePathaoOrder(autoCreateSetting.value === 'true');
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
      const newValue = !autoCreatePathaoOrder;

      const response = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          key: 'auto_create_pathao_order',
          value: newValue.toString()
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update setting');
      }

      setAutoCreatePathaoOrder(newValue);
    } catch (error) {
      console.error('Error updating setting:', error);
      setError('Failed to update setting. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-24 md:h-32">
        <ArrowPathIcon className="h-6 w-6 md:h-8 md:w-8 text-gray-400 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 p-3 md:p-4 rounded-md">
        <p className="text-xs md:text-sm text-red-700">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 md:space-y-6">
      <h3 className="text-base md:text-lg font-medium leading-6 text-gray-900">Courier Settings</h3>

      <div className="bg-white shadow overflow-hidden rounded-lg">
        <div className="px-3 py-3 md:px-4 md:py-5 sm:px-6 bg-gray-50">
          <h3 className="text-sm md:text-lg leading-6 font-medium text-gray-900 flex items-center">
            <TruckIcon className="h-4 w-4 md:h-5 md:w-5 mr-1 md:mr-2 text-gray-500" />
            Pathao Courier Settings
          </h3>
          <p className="mt-1 max-w-2xl text-xs md:text-sm text-gray-500">
            Configure automatic courier order creation with Pathao
          </p>
        </div>

        <div className="border-t border-gray-200 px-3 py-4 md:px-4 md:py-5 sm:p-6">
          <div className="space-y-4 md:space-y-6">
            <div className="flex flex-row items-center justify-between gap-3">
              <div>
                <h4 className="text-sm md:text-base font-medium text-gray-900">Automatic Order Creation</h4>
                <p className="text-xs md:text-sm text-gray-500">
                  Automatically create Pathao courier orders when a new order is placed
                </p>
              </div>
              <div className="ml-4 flex-shrink-0">
                <button
                  type="button"
                  onClick={handleToggleChange}
                  disabled={saving}
                  className={`${
                    autoCreatePathaoOrder ? 'bg-emerald-600' : 'bg-gray-200'
                  } relative inline-flex flex-shrink-0 h-5 md:h-6 w-10 md:w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500`}
                  role="switch"
                  aria-checked={autoCreatePathaoOrder}
                >
                  <span
                    aria-hidden="true"
                    className={`${
                      autoCreatePathaoOrder ? 'translate-x-5' : 'translate-x-0'
                    } pointer-events-none inline-block h-4 md:h-5 w-4 md:w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200`}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
