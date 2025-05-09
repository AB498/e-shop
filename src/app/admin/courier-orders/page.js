'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { ArrowPathIcon } from '@heroicons/react/24/outline';
import { isInternalCourierActive } from '@/lib/actions/admin';
import AssignDeliveryPersonModal from './AssignDeliveryPersonModal';
import UpdateDeliveryStatusModal from './UpdateDeliveryStatusModal';
import CourierOrdersTable from './CourierOrdersTable';

export default function CourierOrdersPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [filterType, setFilterType] = useState('all'); // 'all', 'internal', 'external'
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [currentOrder, setCurrentOrder] = useState(null);
  const [internalCourierEnabled, setInternalCourierEnabled] = useState(true);

  // Fetch courier orders
  const fetchCourierOrders = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/admin/courier-orders');
      if (!response.ok) {
        throw new Error('Failed to fetch courier orders');
      }

      const data = await response.json();
      setOrders(data || []);
    } catch (err) {
      console.error('Error fetching courier orders:', err);
      setError(err.message || 'Failed to fetch courier orders');
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  // Refresh tracking for a specific order without altering tracking history
  const refreshTracking = async (orderId) => {
    try {
      setRefreshing(true);

      // Use the view-tracking endpoint that doesn't alter tracking history
      const response = await fetch(`/api/admin/courier-orders/${orderId}/view-tracking`, {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Failed to refresh tracking');
      }

      // Refetch all orders to get updated tracking
      await fetchCourierOrders();

    } catch (err) {
      console.error('Error refreshing tracking:', err);
      setError(err.message || 'Failed to refresh tracking');
    } finally {
      setRefreshing(false);
    }
  };

  // Check if internal courier system is active
  useEffect(() => {
    async function checkInternalCourier() {
      try {
        const isActive = await isInternalCourierActive();
        setInternalCourierEnabled(isActive);
      } catch (err) {
        console.error('Error checking internal courier status:', err);
        // Default to true in case of error to avoid breaking functionality
        setInternalCourierEnabled(true);
      }
    }

    checkInternalCourier();
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchCourierOrders();
  }, []);



  if (status === 'loading') {
    return <div className="p-8">Loading...</div>;
  }

  if (status === 'unauthenticated' || (session && session.user.role !== 'admin')) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Courier Orders</h1>
        <div className="flex items-center space-x-4">
          <div className="flex rounded-md shadow-sm">
            <button
              onClick={() => setFilterType('all')}
              className={`px-4 py-2 text-sm font-medium rounded-l-md ${filterType === 'all'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
                } border border-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
            >
              All
            </button>
            <button
              onClick={() => internalCourierEnabled && setFilterType('internal')}
              className={`px-4 py-2 text-sm font-medium ${filterType === 'internal'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
                } border-t border-b border-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${!internalCourierEnabled ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={!internalCourierEnabled}
              title={!internalCourierEnabled ? 'Internal courier system is disabled' : 'Show internal courier orders'}
            >
              Internal
            </button>
            <button
              onClick={() => setFilterType('external')}
              className={`px-4 py-2 text-sm font-medium rounded-r-md ${filterType === 'external'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
                } border border-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
            >
              External
            </button>
          </div>
          <button
            onClick={fetchCourierOrders}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <ArrowPathIcon className={`-ml-1 mr-2 h-5 w-5 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-md mb-6">
          <p className="font-medium">Error:</p>
          <p>{error}</p>
        </div>
      )}

      <CourierOrdersTable
        orders={orders}
        isLoading={loading}
        refreshing={refreshing}
        filterType={filterType}
        onRefreshTracking={refreshTracking}
        onAssignDeliveryPerson={(order) => {
          setCurrentOrder(order);
          setShowAssignModal(true);
        }}
        onUpdateStatus={(order) => {
          setCurrentOrder(order);
          setShowStatusModal(true);
        }}
        internalCourierEnabled={internalCourierEnabled}
      />

      {/* Modals */}
      {showAssignModal && currentOrder && (
        <AssignDeliveryPersonModal
          order={currentOrder}
          onClose={() => setShowAssignModal(false)}
          onAssign={() => {
            setShowAssignModal(false);
            fetchCourierOrders();
          }}
        />
      )}

      {showStatusModal && currentOrder && (
        <UpdateDeliveryStatusModal
          order={currentOrder}
          onClose={() => setShowStatusModal(false)}
          onUpdate={() => {
            setShowStatusModal(false);
            fetchCourierOrders();
          }}
        />
      )}
    </div>
  );
}
