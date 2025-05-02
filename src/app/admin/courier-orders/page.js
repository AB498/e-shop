'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowPathIcon,
  TruckIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  EyeIcon,
} from '@heroicons/react/24/outline';

export default function CourierOrdersPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  // Check authentication and redirect if not admin
  useEffect(() => {
    if (status === 'unauthenticated' || (session && session.user.role !== 'admin')) {
      router.push('/login');
    }
  }, [session, status, router]);

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
      setOrders(data);
    } catch (err) {
      console.error('Error fetching courier orders:', err);
      setError(err.message || 'Failed to fetch courier orders');
    } finally {
      setLoading(false);
    }
  };

  // Refresh tracking for a specific order
  const refreshTracking = async (orderId) => {
    try {
      setRefreshing(true);

      const response = await fetch(`/api/admin/courier-orders/${orderId}/refresh-tracking`, {
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

  // Initial fetch
  useEffect(() => {
    if (session?.user?.role === 'admin') {
      fetchCourierOrders();
    }
  }, [session]);

  // Status badge component
  const StatusBadge = ({ status }) => {
    const statusConfig = {
      pending: { color: 'bg-yellow-100 text-yellow-800', icon: ClockIcon, text: 'Pending' },
      picked: { color: 'bg-blue-100 text-blue-800', icon: TruckIcon, text: 'Picked' },
      in_transit: { color: 'bg-indigo-100 text-indigo-800', icon: TruckIcon, text: 'In Transit' },
      delivered: { color: 'bg-green-100 text-green-800', icon: CheckCircleIcon, text: 'Delivered' },
      returned: { color: 'bg-red-100 text-red-800', icon: XCircleIcon, text: 'Returned' },
      cancelled: { color: 'bg-gray-100 text-gray-800', icon: XCircleIcon, text: 'Cancelled' },
    };

    const config = statusConfig[status] || statusConfig.pending;
    const Icon = config.icon;

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        <Icon className="-ml-0.5 mr-1.5 h-3 w-3" />
        {config.text}
      </span>
    );
  };

  if (status === 'loading') {
    return <div className="p-8">Loading...</div>;
  }

  if (status === 'unauthenticated' || (session && session.user.role !== 'admin')) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Pathao Courier Orders</h1>
        <button
          onClick={fetchCourierOrders}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <ArrowPathIcon className={`-ml-1 mr-2 h-5 w-5 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-md mb-6">
          <p className="font-medium">Error:</p>
          <p>{error}</p>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <ArrowPathIcon className="h-8 w-8 text-indigo-500 animate-spin" />
          <span className="ml-2 text-gray-600">Loading courier orders...</span>
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-white shadow overflow-hidden sm:rounded-md p-6 text-center">
          <TruckIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900">No courier orders found</h3>
          <p className="mt-1 text-sm text-gray-500">
            There are no Pathao courier orders in the system yet.
          </p>
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {orders.map((order) => (
              <li key={order.id}>
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <p className="text-sm font-medium text-indigo-600 truncate">
                        Order #{order.id}
                      </p>
                      <p className="ml-2 text-sm text-gray-500 truncate">
                        (ID: {order.courier_order_id})
                      </p>
                    </div>
                    <div className="ml-2 flex-shrink-0 flex">
                      <StatusBadge status={order.courier_status} />
                    </div>
                  </div>
                  <div className="mt-2 sm:flex sm:justify-between">
                    <div className="sm:flex">
                      <p className="flex items-center text-sm text-gray-500">
                        <TruckIcon className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                        {order.shipping_address}, {order.shipping_city}
                      </p>
                    </div>
                    <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                      <p>
                        Created: {new Date(order.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="mt-2 flex justify-between">
                    <div>
                      <p className="text-sm text-gray-500">
                        <span className="font-medium">Customer:</span> {order.customer_name}
                      </p>
                      <p className="text-sm text-gray-500">
                        <span className="font-medium">Phone:</span> {order.shipping_phone}
                      </p>
                      {order.courier_tracking_id && (
                        <p className="text-sm text-gray-500">
                          <span className="font-medium">Tracking ID:</span> {order.courier_tracking_id}
                        </p>
                      )}
                      {order.shipping_instructions && order.shipping_instructions.includes('Delivery Fee:') && (
                        <p className="text-sm text-gray-500">
                          <span className="font-medium">{order.shipping_instructions}</span>
                        </p>
                      )}
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => refreshTracking(order.id)}
                        disabled={refreshing}
                        className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        <ArrowPathIcon className={`-ml-0.5 mr-1 h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
                        Update
                      </button>
                      <Link
                        href={`/admin/orders/tracking/${order.id}`}
                        className="inline-flex items-center px-3 py-1 border border-gray-300 text-xs font-medium rounded shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        <EyeIcon className="-ml-0.5 mr-1 h-4 w-4" />
                        Details
                      </Link>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
