'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import {
  ArrowPathIcon,
  PlusIcon,
  TruckIcon,
} from '@heroicons/react/24/outline';
import AddCourierModal from './AddCourierModal';
import CouriersTable from './CouriersTable';

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
    fetchCouriers();
  }, []);

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

          <CouriersTable
            couriers={couriers}
            isLoading={loading}
            onToggleStatus={(courierId) => {
              const courier = couriers.find(c => c.id === courierId);
              if (courier) {
                handleToggleCourierStatus(courier);
              }
            }}
          />
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
