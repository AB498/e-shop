'use client';

import { useState, useEffect } from 'react';

export default function AddLocationModal({
  isOpen,
  onClose,
  onSubmit,
  cities,
  zones,
  areas,
  selectedCityId,
  selectedZoneId,
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
    // create_in_pathao is now always true and not configurable
  });

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setFormData({
        name: '',
        contact_name: '',
        contact_number: '',
        secondary_contact: '',
        address: '',
        city_id: selectedCityId || '',
        zone_id: selectedZoneId || '',
        area_id: '',
        is_default: false,
        is_active: true
        // create_in_pathao is now always true and not configurable
      });
    }
  }, [isOpen, selectedCityId, selectedZoneId]);

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

    onSubmit(submissionData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 !mt-0 flex items-center justify-center z-50 p-3 sm:p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-4 sm:p-6">
        <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-3 sm:mb-4">Add Store Location</h3>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {/* Store Name */}
            <div className="mb-3 sm:mb-4">
              <label htmlFor="name" className="block text-xs sm:text-sm font-medium text-gray-700">Store Name</label>
              <input
                type="text"
                name="name"
                id="name"
                required
                value={formData.name}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-xs sm:text-sm py-1.5"
              />
            </div>

            {/* Contact Name */}
            <div className="mb-3 sm:mb-4">
              <label htmlFor="contact_name" className="block text-xs sm:text-sm font-medium text-gray-700">Contact Person</label>
              <input
                type="text"
                name="contact_name"
                id="contact_name"
                required
                value={formData.contact_name}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-xs sm:text-sm py-1.5"
              />
            </div>

            {/* Contact Number */}
            <div className="mb-3 sm:mb-4">
              <label htmlFor="contact_number" className="block text-xs sm:text-sm font-medium text-gray-700">Contact Number</label>
              <input
                type="text"
                name="contact_number"
                id="contact_number"
                required
                value={formData.contact_number}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-xs sm:text-sm py-1.5"
              />
            </div>

            {/* Secondary Contact */}
            <div className="mb-3 sm:mb-4">
              <label htmlFor="secondary_contact" className="block text-xs sm:text-sm font-medium text-gray-700">Secondary Contact (Optional)</label>
              <input
                type="text"
                name="secondary_contact"
                id="secondary_contact"
                value={formData.secondary_contact}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-xs sm:text-sm py-1.5"
              />
            </div>

            {/* Address */}
            <div className="mb-3 sm:mb-4 col-span-1 sm:col-span-2">
              <label htmlFor="address" className="block text-xs sm:text-sm font-medium text-gray-700">Address</label>
              <textarea
                name="address"
                id="address"
                rows={3}
                required
                value={formData.address}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-xs sm:text-sm py-1.5"
              ></textarea>
            </div>

            {/* City */}
            <div className="mb-3 sm:mb-4">
              <label htmlFor="city_id" className="block text-xs sm:text-sm font-medium text-gray-700">
                City {loadingCities && <span className="ml-2 inline-block animate-pulse text-indigo-600 text-xs sm:text-sm">Loading...</span>}
              </label>
              <select
                name="city_id"
                id="city_id"
                required
                value={formData.city_id}
                onChange={handleInputChange}
                className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-xs sm:text-sm py-1.5 ${loadingCities ? 'bg-gray-100' : ''}`}
                disabled={loadingCities}
              >
                <option value="">
                  {loadingCities ? 'Loading cities...' : 'Select a city'}
                </option>
                {Array.isArray(cities) && cities.length > 0 ? cities.map((city) => (
                  <option key={city.city_id} value={city.city_id}>
                    {city.city_name}
                  </option>
                )) : !loadingCities && (
                  <option value="" disabled>No cities available</option>
                )}
              </select>
              {Array.isArray(cities) && cities.length === 0 && !loadingCities && (
                <p className="mt-1 text-xs sm:text-sm text-red-500">No cities available. Please check your Pathao API configuration.</p>
              )}
            </div>

            {/* Zone */}
            <div className="mb-3 sm:mb-4">
              <label htmlFor="zone_id" className="block text-xs sm:text-sm font-medium text-gray-700">
                Zone {loadingZones && <span className="ml-2 inline-block animate-pulse text-indigo-600 text-xs sm:text-sm">Loading...</span>}
              </label>
              <select
                name="zone_id"
                id="zone_id"
                required
                value={formData.zone_id}
                onChange={handleInputChange}
                disabled={!formData.city_id || loadingZones}
                className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-xs sm:text-sm py-1.5 ${loadingZones ? 'bg-gray-100' : ''}`}
              >
                <option value="">
                  {!formData.city_id ? 'Select a city first' :
                   loadingZones ? 'Loading zones...' : 'Select a zone'}
                </option>
                {formData.city_id && Array.isArray(zones) && zones.length > 0 ? zones.map((zone) => (
                  <option key={zone.zone_id} value={zone.zone_id}>
                    {zone.zone_name}
                  </option>
                )) : formData.city_id && !loadingZones && (
                  <option value="" disabled>No zones available</option>
                )}
              </select>
              {formData.city_id && Array.isArray(zones) && zones.length === 0 && !loadingZones && (
                <p className="mt-1 text-xs sm:text-sm text-red-500">No zones available for the selected city.</p>
              )}
            </div>

            {/* Area */}
            <div className="mb-3 sm:mb-4">
              <label htmlFor="area_id" className="block text-xs sm:text-sm font-medium text-gray-700">
                Area {loadingAreas && <span className="ml-2 inline-block animate-pulse text-indigo-600 text-xs sm:text-sm">Loading...</span>}
              </label>
              <select
                name="area_id"
                id="area_id"
                required
                value={formData.area_id}
                onChange={handleInputChange}
                disabled={!formData.zone_id || loadingAreas}
                className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-xs sm:text-sm py-1.5 ${loadingAreas ? 'bg-gray-100' : ''}`}
              >
                <option value="">
                  {!formData.zone_id ? 'Select a zone first' :
                   loadingAreas ? 'Loading areas...' : 'Select an area'}
                </option>
                {formData.zone_id && Array.isArray(areas) && areas.length > 0 ? areas.map((area) => (
                  <option key={area.area_id} value={area.area_id}>
                    {area.area_name}
                  </option>
                )) : formData.zone_id && !loadingAreas && (
                  <option value="" disabled>No areas available</option>
                )}
              </select>
              {formData.zone_id && Array.isArray(areas) && areas.length === 0 && !loadingAreas && (
                <p className="mt-1 text-xs sm:text-sm text-red-500">No areas available for the selected zone.</p>
              )}
            </div>

            {/* Checkboxes */}
            <div className="mb-3 sm:mb-4 flex items-center">
              <input
                type="checkbox"
                name="is_default"
                id="is_default"
                checked={formData.is_default}
                onChange={handleInputChange}
                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <label htmlFor="is_default" className="ml-2 block text-xs sm:text-sm text-gray-900">
                Set as default store
              </label>
            </div>

            <div className="mb-3 sm:mb-4 flex items-center">
              <input
                type="checkbox"
                name="is_active"
                id="is_active"
                checked={formData.is_active}
                onChange={handleInputChange}
                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <label htmlFor="is_active" className="ml-2 block text-xs sm:text-sm text-gray-900">
                Active
              </label>
            </div>

            {/* Create in Pathao checkbox removed - now always true */}
            <div className="mb-3 sm:mb-4 flex items-center">
              <div className="flex items-center">
                <span className="h-4 w-4 rounded border-gray-300 bg-indigo-600 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </span>
                <span className="ml-2 block text-xs sm:text-sm text-gray-900">
                  Will be created in Pathao
                </span>
              </div>
            </div>
          </div>

          <div className="mt-4 sm:mt-6 flex flex-col sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
            <button
              type="submit"
              className="inline-flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-3 sm:px-4 py-1.5 sm:py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:col-start-2 order-2 sm:order-none"
            >
              Add
            </button>
            <button
              type="button"
              onClick={onClose}
              className="mt-3 sm:mt-0 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-3 sm:px-4 py-1.5 sm:py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:col-start-1 order-1 sm:order-none mb-2 sm:mb-0"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
