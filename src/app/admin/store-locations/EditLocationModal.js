'use client';

import { useState, useEffect } from 'react';

export default function EditLocationModal({
  isOpen,
  onClose,
  onSubmit,
  location,
  cities,
  zones,
  areas,
  onCityChange,
  onZoneChange,
  loadingCities,
  loadingZones,
  loadingAreas
}) {
  const [formData, setFormData] = useState({
    name: '',
    contact_name: '',
    contact_number: '',
    secondary_contact: '',
    address: '',
    city_id: '',
    zone_id: '',
    area_id: '',
    is_default: false,
    is_active: true
  });

  // Initialize form data when location changes
  useEffect(() => {
    if (location) {
      setFormData({
        name: location.name || '',
        contact_name: location.contact_name || '',
        contact_number: location.contact_number || '',
        secondary_contact: location.secondary_contact || '',
        address: location.address || '',
        city_id: location.city_id ? location.city_id.toString() : '',
        zone_id: location.zone_id ? location.zone_id.toString() : '',
        area_id: location.area_id ? location.area_id.toString() : '',
        is_default: location.is_default || false,
        is_active: location.is_active !== undefined ? location.is_active : true
      });
    }
  }, [location]);

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Handle city and zone changes to update dependent dropdowns
    if (name === 'city_id') {
      onCityChange(value);
      setFormData(prev => ({
        ...prev,
        zone_id: '',
        area_id: ''
      }));
    } else if (name === 'zone_id') {
      onZoneChange(value);
      setFormData(prev => ({
        ...prev,
        area_id: ''
      }));
    }
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    // Convert string IDs to numbers
    const submissionData = {
      ...formData,
      city_id: parseInt(formData.city_id),
      zone_id: parseInt(formData.zone_id),
      area_id: parseInt(formData.area_id)
    };

    onSubmit(location.id, submissionData);
  };

  if (!isOpen || !location) return null;

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Edit Store Location</h3>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Store Name */}
            <div className="mb-4">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">Store Name</label>
              <input
                type="text"
                name="name"
                id="name"
                required
                value={formData.name}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>

            {/* Contact Name */}
            <div className="mb-4">
              <label htmlFor="contact_name" className="block text-sm font-medium text-gray-700">Contact Person</label>
              <input
                type="text"
                name="contact_name"
                id="contact_name"
                required
                value={formData.contact_name}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>

            {/* Contact Number */}
            <div className="mb-4">
              <label htmlFor="contact_number" className="block text-sm font-medium text-gray-700">Contact Number</label>
              <input
                type="text"
                name="contact_number"
                id="contact_number"
                required
                value={formData.contact_number}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>

            {/* Secondary Contact */}
            <div className="mb-4">
              <label htmlFor="secondary_contact" className="block text-sm font-medium text-gray-700">Secondary Contact (Optional)</label>
              <input
                type="text"
                name="secondary_contact"
                id="secondary_contact"
                value={formData.secondary_contact}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>

            {/* Address */}
            <div className="mb-4 md:col-span-2">
              <label htmlFor="address" className="block text-sm font-medium text-gray-700">Address</label>
              <textarea
                name="address"
                id="address"
                rows={3}
                required
                value={formData.address}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              ></textarea>
            </div>

            {/* City */}
            <div className="mb-4">
              <label htmlFor="city_id" className="block text-sm font-medium text-gray-700">
                City {loadingCities && <span className="ml-2 inline-block animate-pulse text-indigo-600">Loading...</span>}
              </label>
              <select
                name="city_id"
                id="city_id"
                required
                value={formData.city_id}
                onChange={handleInputChange}
                className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${loadingCities ? 'bg-gray-100' : ''}`}
                disabled={loadingCities}
              >
                <option value="">
                  {loadingCities ? 'Loading cities...' : 'Select a city'}
                </option>
                {Array.isArray(cities) && cities.length > 0 ? cities.map((city) => (
                  <option key={city.city_id} value={city.city_id.toString()}>
                    {city.city_name}
                  </option>
                )) : !loadingCities && (
                  <option value="" disabled>No cities available</option>
                )}
              </select>
              {Array.isArray(cities) && cities.length === 0 && !loadingCities && (
                <p className="mt-1 text-sm text-red-500">No cities available. Please check your Pathao API configuration.</p>
              )}
            </div>

            {/* Zone */}
            <div className="mb-4">
              <label htmlFor="zone_id" className="block text-sm font-medium text-gray-700">
                Zone {loadingZones && <span className="ml-2 inline-block animate-pulse text-indigo-600">Loading...</span>}
              </label>
              <select
                name="zone_id"
                id="zone_id"
                required
                value={formData.zone_id}
                onChange={handleInputChange}
                disabled={!formData.city_id || loadingZones}
                className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${loadingZones ? 'bg-gray-100' : ''}`}
              >
                <option value="">
                  {!formData.city_id ? 'Select a city first' :
                   loadingZones ? 'Loading zones...' : 'Select a zone'}
                </option>
                {formData.city_id && Array.isArray(zones) && zones.length > 0 ? zones.map((zone) => (
                  <option key={zone.zone_id} value={zone.zone_id.toString()}>
                    {zone.zone_name}
                  </option>
                )) : formData.city_id && !loadingZones && (
                  <option value="" disabled>No zones available</option>
                )}
              </select>
              {formData.city_id && Array.isArray(zones) && zones.length === 0 && !loadingZones && (
                <p className="mt-1 text-sm text-red-500">No zones available for the selected city.</p>
              )}
            </div>

            {/* Area */}
            <div className="mb-4">
              <label htmlFor="area_id" className="block text-sm font-medium text-gray-700">
                Area {loadingAreas && <span className="ml-2 inline-block animate-pulse text-indigo-600">Loading...</span>}
              </label>
              <select
                name="area_id"
                id="area_id"
                required
                value={formData.area_id}
                onChange={handleInputChange}
                disabled={!formData.zone_id || loadingAreas}
                className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${loadingAreas ? 'bg-gray-100' : ''}`}
              >
                <option value="">
                  {!formData.zone_id ? 'Select a zone first' :
                   loadingAreas ? 'Loading areas...' : 'Select an area'}
                </option>
                {formData.zone_id && Array.isArray(areas) && areas.length > 0 ? areas.map((area) => (
                  <option key={area.area_id} value={area.area_id.toString()}>
                    {area.area_name}
                  </option>
                )) : formData.zone_id && !loadingAreas && (
                  <option value="" disabled>No areas available</option>
                )}
              </select>
              {formData.zone_id && Array.isArray(areas) && areas.length === 0 && !loadingAreas && (
                <p className="mt-1 text-sm text-red-500">No areas available for the selected zone.</p>
              )}
            </div>

            {/* Pathao Store ID (read-only) */}
            {location.pathao_store_id && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Pathao Store ID</label>
                <div className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-gray-100 rounded-md text-sm text-gray-700">
                  {location.pathao_store_id}
                </div>
              </div>
            )}

            {/* Checkboxes */}
            <div className="mb-4 flex items-center">
              <input
                type="checkbox"
                name="is_default"
                id="is_default"
                checked={formData.is_default}
                onChange={handleInputChange}
                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <label htmlFor="is_default" className="ml-2 block text-sm text-gray-900">
                Set as default store
              </label>
            </div>

            <div className="mb-4 flex items-center">
              <input
                type="checkbox"
                name="is_active"
                id="is_active"
                checked={formData.is_active}
                onChange={handleInputChange}
                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <label htmlFor="is_active" className="ml-2 block text-sm text-gray-900">
                Active
              </label>
            </div>
          </div>

          <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
            <button
              type="submit"
              className="inline-flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:col-start-2 sm:text-sm"
            >
              Save
            </button>
            <button
              type="button"
              onClick={onClose}
              className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:mt-0 sm:col-start-1 sm:text-sm"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
