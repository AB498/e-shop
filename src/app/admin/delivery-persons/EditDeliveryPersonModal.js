'use client';

import { useState, useEffect } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

export default function EditDeliveryPersonModal({ deliveryPerson, onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    area: '',
    status: 'active',
    notes: '',
  });

  // Initialize form data with delivery person data
  useEffect(() => {
    if (deliveryPerson) {
      setFormData(prevFormData => ({
        ...prevFormData,
        name: deliveryPerson.name || '',
        phone: deliveryPerson.phone || '',
        email: deliveryPerson.email || '',
        address: deliveryPerson.address || '',
        city: deliveryPerson.city || '',
        area: deliveryPerson.area || '',
        status: deliveryPerson.status || 'active',
        notes: deliveryPerson.notes || '',
      }));
    }
  }, [deliveryPerson]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>

        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="flex justify-between items-center pb-3 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Edit Delivery Person</h3>
              <button
                onClick={onClose}
                className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="col-span-2">
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border border-gray-300 bg-gray-50 shadow-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:bg-white sm:text-sm px-3 py-2 transition-colors"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                    Phone *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    id="phone"
                    required
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border border-gray-300 bg-gray-50 shadow-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:bg-white sm:text-sm px-3 py-2 transition-colors"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border border-gray-300 bg-gray-50 shadow-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:bg-white sm:text-sm px-3 py-2 transition-colors"
                  />
                </div>

                <div className="col-span-2">
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                    Address
                  </label>
                  <input
                    type="text"
                    name="address"
                    id="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border border-gray-300 bg-gray-50 shadow-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:bg-white sm:text-sm px-3 py-2 transition-colors"
                  />
                </div>

                <div>
                  <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                    City
                  </label>
                  <input
                    type="text"
                    name="city"
                    id="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border border-gray-300 bg-gray-50 shadow-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:bg-white sm:text-sm px-3 py-2 transition-colors"
                  />
                </div>

                <div>
                  <label htmlFor="area" className="block text-sm font-medium text-gray-700">
                    Area
                  </label>
                  <input
                    type="text"
                    name="area"
                    id="area"
                    value={formData.area}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border border-gray-300 bg-gray-50 shadow-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:bg-white sm:text-sm px-3 py-2 transition-colors"
                  />
                </div>

                <div>
                  <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                    Status
                  </label>
                  <select
                    name="status"
                    id="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border border-gray-300 bg-gray-50 shadow-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:bg-white sm:text-sm px-3 py-2 transition-colors"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="on_delivery">On Delivery</option>
                  </select>
                </div>

                <div className="col-span-2">
                  <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
                    Notes
                  </label>
                  <textarea
                    name="notes"
                    id="notes"
                    rows="3"
                    value={formData.notes}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border border-gray-300 bg-gray-50 shadow-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:bg-white sm:text-sm px-3 py-2 transition-colors"
                  ></textarea>
                </div>
              </div>

              <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                <button
                  type="submit"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-emerald-600 text-base font-medium text-white hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 sm:col-start-2 sm:text-sm"
                >
                  Update
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 sm:mt-0 sm:col-start-1 sm:text-sm"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
