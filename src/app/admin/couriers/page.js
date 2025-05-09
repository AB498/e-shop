'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import {
  ArrowPathIcon,
  PlusIcon,
  TruckIcon,
  ArrowsUpDownIcon,
} from '@heroicons/react/24/outline';
import AddCourierModal from './AddCourierModal';

export default function CouriersPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [couriers, setCouriers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [initializing, setInitializing] = useState(false);

  // Check authentication and redirect if not admin
  useEffect(() => {
    if (status === 'unauthenticated' || (session && session.user.role !== 'admin')) {
      router.push('/login');
    }
  }, [session, status, router]);

  // Fetch couriers
  const fetchCouriers = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/admin/couriers');
      if (!response.ok) {
        throw new Error('Failed to fetch couriers');
      }

      const data = await response.json();
      setCouriers(data);
    } catch (err) {
      console.error('Error fetching couriers:', err);
      setError(err.message || 'Failed to fetch couriers');
    } finally {
      setLoading(false);
    }
  };

  // Initialize courier systems
  const initializeCouriers = async () => {
    try {
      setInitializing(true);
      setError(null);

      const response = await fetch('/api/couriers/initialize', {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Failed to initialize courier systems');
      }

      // Refetch couriers after initialization
      await fetchCouriers();
    } catch (err) {
      console.error('Error initializing courier systems:', err);
      setError(err.message || 'Failed to initialize courier systems');
    } finally {
      setInitializing(false);
    }
  };

  // Handle add courier
  const handleAddCourier = async (courierData) => {
    try {
      const response = await fetch('/api/admin/couriers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(courierData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to add courier');
      }

      // Refresh couriers list
      fetchCouriers();
      setShowAddModal(false);
    } catch (err) {
      console.error('Error adding courier:', err);
      setError(err.message || 'Failed to add courier');
    }
  };

  // Handle toggle courier status
  const handleToggleCourierStatus = async (courier) => {
    try {
      const response = await fetch(`/api/admin/couriers/${courier.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...courier,
          is_active: !courier.is_active
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update courier status');
      }

      // Refresh couriers list
      fetchCouriers();
    } catch (err) {
      console.error('Error toggling courier status:', err);
      setError(err.message || 'Failed to toggle courier status');
    }
  };

  // Initial fetch
  useEffect(() => {
    if (session?.user?.role === 'admin') {
      fetchCouriers();
    }
  }, [session]);

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Courier Management</h1>
        <div className="flex space-x-2">
          <button
            onClick={initializeCouriers}
            disabled={initializing}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
          >
            <ArrowPathIcon className={`-ml-1 mr-2 h-5 w-5 ${initializing ? 'animate-spin' : ''}`} />
            Initialize Couriers
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
            Add Courier
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-md mb-6">
          <p className="font-medium">Error:</p>
          <p>{error}</p>
        </div>
      )}

      <div className="mb-6">
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6 bg-gray-50">
            <h2 className="text-lg font-medium text-gray-900 flex items-center">
              <TruckIcon className="h-5 w-5 mr-2 text-gray-500" />
              Courier Systems
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              All available courier services for order delivery
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <ArrowPathIcon className="h-8 w-8 text-indigo-500 animate-spin" />
              <span className="ml-2 text-gray-600">Loading couriers...</span>
            </div>
          ) : couriers.length === 0 ? (
            <div className="p-6 text-center">
              <p className="text-gray-500">No couriers found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Description
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {couriers.map(courier => (
                    <tr key={courier.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{courier.name}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-500">{courier.description}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          courier.courier_type === 'internal'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-purple-100 text-purple-800'
                        }`}>
                          {courier.courier_type === 'internal' ? 'Internal' : 'External'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          courier.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {courier.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end">
                          <button
                            onClick={() => handleToggleCourierStatus(courier)}
                            className={`inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white ${
                              courier.is_active
                                ? 'bg-red-600 hover:bg-red-700'
                                : 'bg-green-600 hover:bg-green-700'
                            } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
                          >
                            <ArrowsUpDownIcon className="-ml-0.5 mr-1 h-4 w-4" />
                            {courier.is_active ? 'Deactivate' : 'Activate'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      {showAddModal && (
        <AddCourierModal
          onClose={() => setShowAddModal(false)}
          onSubmit={handleAddCourier}
        />
      )}
    </div>
  );
}
