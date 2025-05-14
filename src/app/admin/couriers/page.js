'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { TruckIcon } from '@heroicons/react/24/outline';
import CouriersTable from './CouriersTable';

export default function CouriersPage() {
  const { data: session, status } = useSession();
  const [couriers, setCouriers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Redirect if not authenticated or not admin
  useEffect(() => {
    if (status === 'unauthenticated' || (session && session.user.role !== 'admin')) {
      window.location.href = '/';
    }
  }, [session, status]);

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

  // Show loading state while checking authentication
  if (status === 'loading') {
    return <div className="p-8">Loading...</div>;
  }

  // Don't render anything if not authenticated
  if (status === 'unauthenticated' || (session && session.user.role !== 'admin')) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Courier Management</h1>
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
    </div>
  );
}
