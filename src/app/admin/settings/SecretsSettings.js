'use client';

import { useState, useEffect } from 'react';
import { KeyIcon, EyeIcon, EyeSlashIcon, ArrowPathIcon } from '@heroicons/react/24/outline';

export default function SecretsSettings() {
  // We'll use this to store settings from the database if needed in the future
  const [, setSettings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [showSecrets, setShowSecrets] = useState({});
  const [formValues, setFormValues] = useState({
    pathao_api_key: '',
    pathao_api_secret: '',
    sslcommerz_store_id: '',
    sslcommerz_store_password: '',
    s3_access_key: '',
    s3_secret_key: '',
    s3_bucket_name: '',
    s3_region: ''
  });

  // Fetch settings on component mount
  useEffect(() => {
    async function fetchSettings() {
      try {
        setLoading(true);

        // Fetch environment variables
        const envResponse = await fetch('/api/admin/env-variables');

        if (!envResponse.ok) {
          throw new Error('Failed to fetch environment variables');
        }

        const envData = await envResponse.json();

        // Fetch database settings
        const settingsResponse = await fetch('/api/admin/settings');

        if (!settingsResponse.ok) {
          throw new Error('Failed to fetch settings');
        }

        const settingsData = await settingsResponse.json();
        setSettings(settingsData);

        // Initialize form values from settings and env variables
        const newFormValues = { ...formValues };

        // First set values from database settings
        settingsData.forEach(setting => {
          if (formValues.hasOwnProperty(setting.key)) {
            newFormValues[setting.key] = setting.value || '';
          }
        });

        // Then override with environment variables if they exist
        if (envData.PATHAO_API_KEY) {
          newFormValues.pathao_api_key = envData.PATHAO_API_KEY;
        }

        if (envData.PATHAO_API_SECRET) {
          newFormValues.pathao_api_secret = envData.PATHAO_API_SECRET;
        }

        if (envData.SSLCOMMERZ_STORE_ID) {
          newFormValues.sslcommerz_store_id = envData.SSLCOMMERZ_STORE_ID;
        }

        if (envData.SSLCOMMERZ_STORE_PASSWORD) {
          newFormValues.sslcommerz_store_password = envData.SSLCOMMERZ_STORE_PASSWORD;
        }

        if (envData.S3_ACCESS_KEY) {
          newFormValues.s3_access_key = envData.S3_ACCESS_KEY;
        }

        if (envData.S3_SECRET_KEY) {
          newFormValues.s3_secret_key = envData.S3_SECRET_KEY;
        }

        if (envData.S3_BUCKET_NAME) {
          newFormValues.s3_bucket_name = envData.S3_BUCKET_NAME;
        }

        if (envData.S3_REGION) {
          newFormValues.s3_region = envData.S3_REGION;
        }

        setFormValues(newFormValues);
      } catch (error) {
        console.error('Error fetching settings:', error);
        setError('Failed to load settings. Please try again.');
      } finally {
        setLoading(false);
      }
    }

    fetchSettings();
  }, []);

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value
    });
  };

  // Toggle secret visibility
  const toggleSecretVisibility = (key) => {
    setShowSecrets({
      ...showSecrets,
      [key]: !showSecrets[key]
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      // Save each setting
      const updatePromises = Object.entries(formValues).map(async ([key, value]) => {
        const response = await fetch('/api/admin/settings', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            key,
            value
          }),
        });

        if (!response.ok) {
          throw new Error(`Failed to update ${key}`);
        }
      });

      await Promise.all(updatePromises);
      alert('API secrets updated successfully');
    } catch (error) {
      console.error('Error updating settings:', error);
      setError('Failed to update settings. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4 md:space-y-6">
      <h3 className="text-base md:text-lg font-medium leading-6 text-gray-900">API Secrets</h3>

      {error && (
        <div className="mb-3 bg-red-50 border border-red-200 text-red-800 px-3 py-2 rounded-md text-xs sm:text-sm">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-6">
          <ArrowPathIcon className="h-5 w-5 text-emerald-500 animate-spin mr-2" />
          <span className="text-sm text-gray-500">Loading settings...</span>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 md:space-y-6">
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3 md:p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <KeyIcon className="h-5 w-5 text-yellow-400" aria-hidden="true" />
                </div>
                <div className="ml-3">
                  <p className="text-xs md:text-sm text-yellow-700">
                    These API keys and secrets are used to connect to external services. Keep them secure and never share them publicly.
                  </p>
                  <p className="text-xs md:text-sm text-yellow-700 mt-1">
                    <strong>Note:</strong> Pathao API and SSLCommerz credentials are read-only and display values from your environment variables (.env file).
                    To modify these values, you need to update your environment configuration.
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-2">Pathao API Credentials (Read-only)</h4>
              <div className="grid grid-cols-1 gap-y-4 md:gap-y-6 gap-x-3 md:gap-x-4 xs:grid-cols-2">
                <div className="xs:col-span-1">
                  <label htmlFor="pathao_api_key" className="block text-xs md:text-sm font-medium text-gray-700">
                    Pathao API Key
                    <span className="ml-1 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                      ENV
                    </span>
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <input
                      type={showSecrets.pathao_api_key ? 'text' : 'password'}
                      name="pathao_api_key"
                      id="pathao_api_key"
                      value={formValues.pathao_api_key}
                      readOnly
                      className="shadow-sm bg-gray-50 focus:ring-emerald-500 focus:border-emerald-500 block w-full text-xs md:text-sm border-gray-300 rounded-md h-9 md:h-10 pr-10 cursor-not-allowed"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => toggleSecretVisibility('pathao_api_key')}
                    >
                      {showSecrets.pathao_api_key ? (
                        <EyeSlashIcon className="h-4 w-4 text-gray-400" />
                      ) : (
                        <EyeIcon className="h-4 w-4 text-gray-400" />
                      )}
                    </button>
                  </div>
                </div>
                <div className="xs:col-span-1">
                  <label htmlFor="pathao_api_secret" className="block text-xs md:text-sm font-medium text-gray-700">
                    Pathao API Secret
                    <span className="ml-1 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                      ENV
                    </span>
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <input
                      type={showSecrets.pathao_api_secret ? 'text' : 'password'}
                      name="pathao_api_secret"
                      id="pathao_api_secret"
                      value={formValues.pathao_api_secret}
                      readOnly
                      className="shadow-sm bg-gray-50 focus:ring-emerald-500 focus:border-emerald-500 block w-full text-xs md:text-sm border-gray-300 rounded-md h-9 md:h-10 pr-10 cursor-not-allowed"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => toggleSecretVisibility('pathao_api_secret')}
                    >
                      {showSecrets.pathao_api_secret ? (
                        <EyeSlashIcon className="h-4 w-4 text-gray-400" />
                      ) : (
                        <EyeIcon className="h-4 w-4 text-gray-400" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-2">SSLCommerz Credentials (Read-only)</h4>
              <div className="grid grid-cols-1 gap-y-4 md:gap-y-6 gap-x-3 md:gap-x-4 xs:grid-cols-2">
                <div className="xs:col-span-1">
                  <label htmlFor="sslcommerz_store_id" className="block text-xs md:text-sm font-medium text-gray-700">
                    Store ID
                    <span className="ml-1 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                      ENV
                    </span>
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <input
                      type={showSecrets.sslcommerz_store_id ? 'text' : 'password'}
                      name="sslcommerz_store_id"
                      id="sslcommerz_store_id"
                      value={formValues.sslcommerz_store_id}
                      readOnly
                      className="shadow-sm bg-gray-50 focus:ring-emerald-500 focus:border-emerald-500 block w-full text-xs md:text-sm border-gray-300 rounded-md h-9 md:h-10 pr-10 cursor-not-allowed"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => toggleSecretVisibility('sslcommerz_store_id')}
                    >
                      {showSecrets.sslcommerz_store_id ? (
                        <EyeSlashIcon className="h-4 w-4 text-gray-400" />
                      ) : (
                        <EyeIcon className="h-4 w-4 text-gray-400" />
                      )}
                    </button>
                  </div>
                </div>
                <div className="xs:col-span-1">
                  <label htmlFor="sslcommerz_store_password" className="block text-xs md:text-sm font-medium text-gray-700">
                    Store Password
                    <span className="ml-1 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                      ENV
                    </span>
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <input
                      type={showSecrets.sslcommerz_store_password ? 'text' : 'password'}
                      name="sslcommerz_store_password"
                      id="sslcommerz_store_password"
                      value={formValues.sslcommerz_store_password}
                      readOnly
                      className="shadow-sm bg-gray-50 focus:ring-emerald-500 focus:border-emerald-500 block w-full text-xs md:text-sm border-gray-300 rounded-md h-9 md:h-10 pr-10 cursor-not-allowed"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => toggleSecretVisibility('sslcommerz_store_password')}
                    >
                      {showSecrets.sslcommerz_store_password ? (
                        <EyeSlashIcon className="h-4 w-4 text-gray-400" />
                      ) : (
                        <EyeIcon className="h-4 w-4 text-gray-400" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-row justify-end gap-2 mt-6">
            <button
              type="button"
              className="w-auto bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-xs md:text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
              onClick={() => window.location.reload()}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="w-auto ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-xs md:text-sm font-medium rounded-md text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:bg-emerald-400"
            >
              {saving ? (
                <>
                  <ArrowPathIcon className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" />
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
