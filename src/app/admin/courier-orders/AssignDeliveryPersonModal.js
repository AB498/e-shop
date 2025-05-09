'use client';

import { useState, useEffect } from 'react';
import { XMarkIcon, ArrowPathIcon } from '@heroicons/react/24/outline';

export default function AssignDeliveryPersonModal({ order, onClose, onAssign }) {
  const [deliveryPersons, setDeliveryPersons] = useState([]);
  const [selectedPersonId, setSelectedPersonId] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Fetch delivery persons
  useEffect(() => {
    const fetchDeliveryPersons = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch('/api/admin/delivery-persons');
        if (!response.ok) {
          throw new Error('Failed to fetch delivery persons');
        }

        const data = await response.json();
        
        // Filter to only show active delivery persons
        const activePersons = data.filter(person => person.status === 'active');
        setDeliveryPersons(activePersons);
        
        // If there's at least one delivery person, select the first one by default
        if (activePersons.length > 0) {
          setSelectedPersonId(activePersons[0].id.toString());
        }
      } catch (err) {
        console.error('Error fetching delivery persons:', err);
        setError(err.message || 'Failed to fetch delivery persons');
      } finally {
        setLoading(false);
      }
    };

    fetchDeliveryPersons();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedPersonId) {
      setError('Please select a delivery person');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      const response = await fetch('/api/admin/courier-orders/assign-delivery-person', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderId: order.id,
          deliveryPersonId: parseInt(selectedPersonId),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to assign delivery person');
      }

      // Call the onAssign callback
      onAssign();
    } catch (err) {
      console.error('Error assigning delivery person:', err);
      setError(err.message || 'Failed to assign delivery person');
    } finally {
      setSubmitting(false);
    }
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
              <h3 className="text-lg font-medium text-gray-900">Assign Delivery Person</h3>
              <button
                onClick={onClose}
                className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            <div className="mt-4">
              <p className="text-sm text-gray-500 mb-4">
                Assign a delivery person to order #{order.id}
              </p>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-md mb-4">
                  <p>{error}</p>
                </div>
              )}

              {loading ? (
                <div className="flex justify-center items-center py-8">
                  <ArrowPathIcon className="h-8 w-8 text-indigo-500 animate-spin" />
                  <span className="ml-2 text-gray-600">Loading delivery persons...</span>
                </div>
              ) : deliveryPersons.length === 0 ? (
                <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-md mb-4">
                  <p>No active delivery persons available. Please add delivery persons first.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div className="mb-4">
                    <label htmlFor="deliveryPerson" className="block text-sm font-medium text-gray-700">
                      Select Delivery Person
                    </label>
                    <select
                      id="deliveryPerson"
                      name="deliveryPerson"
                      value={selectedPersonId}
                      onChange={(e) => setSelectedPersonId(e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    >
                      {deliveryPersons.map((person) => (
                        <option key={person.id} value={person.id}>
                          {person.name} - {person.phone} ({person.current_orders} current orders)
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                    <button
                      type="submit"
                      disabled={submitting || deliveryPersons.length === 0}
                      className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:col-start-2 sm:text-sm disabled:bg-gray-300 disabled:cursor-not-allowed"
                    >
                      {submitting ? (
                        <>
                          <ArrowPathIcon className="animate-spin -ml-1 mr-2 h-5 w-5" />
                          Assigning...
                        </>
                      ) : (
                        'Assign'
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={onClose}
                      className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:col-start-1 sm:text-sm"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
