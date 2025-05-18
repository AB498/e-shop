'use client';

import { useState, useEffect } from 'react';
import { ArrowPathIcon, TruckIcon } from '@heroicons/react/24/outline';
import { updateSettingAction } from './actions';

export default function DefaultCourierSettings() {
  const [settings, setSettings] = useState([]);
  const [defaultCourierId, setDefaultCourierId] = useState('1'); // Default to Pathao (ID: 1)
  const [couriers, setCouriers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Fetch settings and couriers on component mount
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        
        // Fetch settings
        const settingsResponse = await fetch('/api/admin/settings');
        if (!settingsResponse.ok) {
          throw new Error('Failed to fetch settings');
        }
        const settingsData = await settingsResponse.json();
        setSettings(settingsData);

        // Find default_courier_id setting
        const defaultCourierSetting = settingsData.find(setting => setting.key === 'default_courier_id');
        if (defaultCourierSetting) {
          setDefaultCourierId(defaultCourierSetting.value);
        }
        
        // Fetch couriers
        const couriersResponse = await fetch('/api/admin/couriers');
        if (!couriersResponse.ok) {
          throw new Error('Failed to fetch couriers');
        }
        const couriersData = await couriersResponse.json();
        
        // Filter to only include external couriers
        const externalCouriers = couriersData.filter(courier => 
          courier.courier_type === 'external' && courier.is_active
        );
        
        setCouriers(externalCouriers);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to load settings. Please try again.');
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  // Handle courier selection change
  const handleCourierChange = async (e) => {
    try {
      setSaving(true);
      setError(null);
      const newCourierId = e.target.value;

      // Call the server action directly
      const result = await updateSettingAction('default_courier_id', newCourierId);

      if (!result.success) {
        throw new Error(result.error || 'Failed to update setting');
      }

      setDefaultCourierId(newCourierId);
      setSuccess('Default courier updated successfully');

      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccess(null);
      }, 3000);
    } catch (error) {
      console.error('Error updating default courier:', error);
      setError('Failed to update default courier. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="px-3 py-4 md:px-4 md:py-5 border-b border-gray-200 sm:px-6">
        <h3 className="text-base md:text-lg font-medium leading-6 text-gray-900 flex items-center">
          <TruckIcon className="h-4 w-4 md:h-5 md:w-5 mr-1 md:mr-2 text-gray-500" />
          Default Courier Provider
        </h3>
        <p className="mt-1 text-xs md:text-sm text-gray-500">
          Select which courier provider to use by default for auto-courier orders
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

            <div className="flex flex-col space-y-2">
              <label htmlFor="default-courier" className="block text-sm font-medium text-gray-700">
                Default Courier Provider
              </label>
              <select
                id="default-courier"
                name="default-courier"
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm rounded-md"
                value={defaultCourierId}
                onChange={handleCourierChange}
                disabled={saving || couriers.length === 0}
              >
                {couriers.length === 0 ? (
                  <option value="">No couriers available</option>
                ) : (
                  couriers.map((courier) => (
                    <option key={courier.id} value={courier.id.toString()}>
                      {courier.name}
                    </option>
                  ))
                )}
              </select>
            </div>

            <div className="pt-2 text-xs text-gray-500">
              <p>
                This courier will be used when creating orders via the auto-courier button in the admin panel.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
