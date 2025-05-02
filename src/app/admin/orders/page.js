'use client';

import { useState, useEffect } from 'react';
import { MagnifyingGlassIcon, FunnelIcon, EyeIcon, TruckIcon, ArrowPathIcon } from '@heroicons/react/24/outline';

export default function OrdersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [showOrderDetails, setShowOrderDetails] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [courierError, setCourierError] = useState(null);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [isCreatingCourier, setIsCreatingCourier] = useState(false);
  const [updatedOrderId, setUpdatedOrderId] = useState(null);

  // Fetch orders data
  useEffect(() => {
    async function fetchOrders() {
      try {
        setIsLoading(true);
        const response = await fetch('/api/admin/orders');

        if (!response.ok) {
          throw new Error('Failed to fetch orders');
        }

        const data = await response.json();

        // Process orders to ensure we don't have duplicates
        // Use a Map to store orders by ID, with the most recent version
        const ordersMap = new Map();
        data.forEach(order => {
          // If the order already exists in the map, only replace it if this one has courier info
          if (ordersMap.has(order.id)) {
            const existingOrder = ordersMap.get(order.id);
            // If the new order has courier info and the existing one doesn't, or if the new one is more recent
            if ((order.courier_id && !existingOrder.courier_id) ||
                (new Date(order.updated_at) > new Date(existingOrder.updated_at))) {
              ordersMap.set(order.id, order);
            }
          } else {
            ordersMap.set(order.id, order);
          }
        });

        // Convert the Map back to an array and sort by ID (descending)
        const uniqueOrders = Array.from(ordersMap.values()).sort((a, b) => b.id - a.id);
        setOrders(uniqueOrders);
        setIsLoading(false);
      } catch (err) {
        console.error('Error fetching orders:', err);
        setError(err.message);
        setIsLoading(false);
      }
    }

    fetchOrders();
  }, [updatedOrderId]);

  // Filter orders based on search term and status
  const filteredOrders = orders.filter(order => {
    const matchesSearch =
      order.id.toString().includes(searchTerm.toLowerCase()) ||
      order.customer.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = filterStatus === 'All' || order.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  // Handle view order details
  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setShowOrderDetails(true);
  };

  // Handle update order status
  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      setIsUpdatingStatus(true);
      const response = await fetch('/api/admin/orders/update-status', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderId,
          status: newStatus.toLowerCase()
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update order status');
      }

      // Close the modal and refresh the orders
      setShowOrderDetails(false);
      setUpdatedOrderId(orderId);
      setIsUpdatingStatus(false);
    } catch (err) {
      console.error('Error updating order status:', err);
      setError(err.message);
      setIsUpdatingStatus(false);
    }
  };

  // Handle auto-courier order creation
  const handleCreateCourierOrder = async (orderId) => {
    try {
      setIsCreatingCourier(true);
      setCourierError(null); // Clear previous errors

      // Find the order in the current list to show in the UI
      const orderToUpdate = orders.find(order => order.id === orderId);
      if (orderToUpdate) {
        orderToUpdate.isProcessingCourier = true;
      }

      const response = await fetch('/api/dev/test-courier-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ orderId }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create courier order');
      }

      // Log the full response data for debugging
      console.log('Courier order created successfully:', JSON.stringify(data, null, 2));

      // Show success message with additional info if available
      if (data.data && data.data.pathao_response) {
        const pathaoData = data.data.pathao_response;
        alert(`Pathao order created successfully:
Consignment ID: ${pathaoData.consignment_id}
Order Status: ${pathaoData.order_status}
Delivery Fee: ${pathaoData.delivery_fee || 'N/A'}
Merchant Order ID: ${pathaoData.merchant_order_id || 'N/A'}`);
      }

      // Refresh the orders list
      setUpdatedOrderId(orderId);
      setIsCreatingCourier(false);
    } catch (err) {
      console.error('Error creating courier order:', err);
      setCourierError(err.message);
      setIsCreatingCourier(false);

      // Reset the processing state for the order
      const orderToUpdate = orders.find(order => order.id === orderId);
      if (orderToUpdate) {
        orderToUpdate.isProcessingCourier = false;
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Orders</h1>
          <p className="mt-2 text-sm text-gray-700">
            Manage and track all customer orders
          </p>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-4">
          <h3 className="text-lg font-medium">Error loading orders</h3>
          <p>{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-2 px-4 py-2 bg-red-100 hover:bg-red-200 text-red-800 rounded-md"
          >
            Retry
          </button>
        </div>
      )}

      {courierError && (
        <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-4">
          <h3 className="text-lg font-medium">Error creating courier order</h3>
          <p>{courierError}</p>
          <button
            onClick={() => setCourierError(null)}
            className="mt-2 px-4 py-2 bg-red-100 hover:bg-red-200 text-red-800 rounded-md"
          >
            Dismiss
          </button>
        </div>
      )}

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row justify-between space-y-3 sm:space-y-0 sm:space-x-4">
            <div className="relative flex-grow max-w-lg">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                placeholder="Search orders..."
                disabled={isLoading}
              />
            </div>
            <div className="flex space-x-2">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm rounded-md"
                disabled={isLoading}
              >
                <option value="All">All Orders</option>
                <option value="Pending">Pending</option>
                <option value="Processing">Processing</option>
                <option value="Shipped">Shipped</option>
                <option value="Delivered">Delivered</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order ID
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Items
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Courier
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {isLoading ? (
                // Loading skeleton
                [...Array(5)].map((_, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="h-4 bg-gray-200 rounded w-32 animate-pulse"></div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="h-4 bg-gray-200 rounded w-8 animate-pulse"></div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex space-x-3">
                        <div className="h-5 bg-gray-200 rounded-full w-5 animate-pulse"></div>
                        <div className="h-5 bg-gray-200 rounded-full w-5 animate-pulse"></div>
                      </div>
                    </td>
                  </tr>
                ))
              ) : filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan="8" className="px-6 py-4 text-center text-sm text-gray-500">
                    No orders found
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">#{order.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{order.customer}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.date}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                        ${order.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                          order.status === 'Shipped' ? 'bg-blue-100 text-blue-800' :
                          order.status === 'Cancelled' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{order.total}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{order.itemsCount}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {order.courier_id ? (
                        <div>
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                            ${order.courier_status === 'delivered' ? 'bg-green-100 text-green-800' :
                              order.courier_status === 'in_transit' ? 'bg-blue-100 text-blue-800' :
                              order.courier_status === 'cancelled' || order.courier_status === 'returned' ? 'bg-red-100 text-red-800' :
                              'bg-yellow-100 text-yellow-800'}`}>
                            {order.courier_status ?
                              (typeof order.courier_status === 'string' ?
                                order.courier_status.replace('_', ' ').charAt(0).toUpperCase() +
                                order.courier_status.replace('_', ' ').slice(1) :
                                'Pending') :
                              'Pending'}
                          </span>
                          {order.courier_tracking_id && (
                            <div className="text-xs text-gray-500 mt-1">
                              ID: {order.courier_tracking_id}
                            </div>
                          )}
                        </div>
                      ) : (
                        <span className="text-gray-500 text-xs">Not assigned</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-3">
                        <button
                          onClick={() => handleViewOrder(order)}
                          className="text-emerald-600 hover:text-emerald-900"
                          title="View Order"
                          disabled={isLoading}
                        >
                          <EyeIcon className="h-5 w-5" />
                        </button>
                        {order.status !== 'delivered' && order.status !== 'cancelled' && !order.courier_id && (
                          <button
                            onClick={() => handleCreateCourierOrder(order.id)}
                            className="text-blue-600 hover:text-blue-900"
                            title="Auto-Order Courier"
                            disabled={order.isProcessingCourier || isLoading}
                          >
                            {order.isProcessingCourier ? (
                              <ArrowPathIcon className="h-5 w-5 animate-spin" />
                            ) : (
                              <TruckIcon className="h-5 w-5" />
                            )}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Details Modal */}
      {showOrderDetails && selectedOrder && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75" onClick={() => setShowOrderDetails(false)}></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Order Details: #{selectedOrder.id}</h3>
                    <div className="mt-4">
                      <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                        <div className="sm:col-span-1">
                          <dt className="text-sm font-medium text-gray-500">Customer</dt>
                          <dd className="mt-1 text-sm text-gray-900">{selectedOrder.customer}</dd>
                        </div>
                        <div className="sm:col-span-1">
                          <dt className="text-sm font-medium text-gray-500">Date</dt>
                          <dd className="mt-1 text-sm text-gray-900">{selectedOrder.date}</dd>
                        </div>
                        <div className="sm:col-span-1">
                          <dt className="text-sm font-medium text-gray-500">Status</dt>
                          <dd className="mt-1 text-sm text-gray-900">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                              ${selectedOrder.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                                selectedOrder.status === 'Shipped' ? 'bg-blue-100 text-blue-800' :
                                selectedOrder.status === 'Cancelled' ? 'bg-red-100 text-red-800' :
                                'bg-yellow-100 text-yellow-800'}`}>
                              {selectedOrder.status}
                            </span>
                          </dd>
                        </div>
                        <div className="sm:col-span-1">
                          <dt className="text-sm font-medium text-gray-500">Total</dt>
                          <dd className="mt-1 text-sm text-gray-900">{selectedOrder.total}</dd>
                        </div>
                        <div className="sm:col-span-2">
                          <dt className="text-sm font-medium text-gray-500">Shipping Address</dt>
                          <dd className="mt-1 text-sm text-gray-900">
                            {selectedOrder.shippingAddress ? (
                              <>
                                {selectedOrder.shippingAddress}<br />
                                {selectedOrder.shippingCity}, {selectedOrder.shippingPostCode}<br />
                                Phone: {selectedOrder.shippingPhone}
                              </>
                            ) : (
                              'Not provided'
                            )}
                          </dd>
                        </div>
                        {selectedOrder.courier_id && (
                          <div className="sm:col-span-2">
                            <dt className="text-sm font-medium text-gray-500">Courier Information</dt>
                            <dd className="mt-1 text-sm text-gray-900">
                              <div className="flex flex-col space-y-2">
                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full w-fit
                                  ${selectedOrder.courier_status === 'delivered' ? 'bg-green-100 text-green-800' :
                                    selectedOrder.courier_status === 'in_transit' ? 'bg-blue-100 text-blue-800' :
                                    selectedOrder.courier_status === 'cancelled' || selectedOrder.courier_status === 'returned' ? 'bg-red-100 text-red-800' :
                                    'bg-yellow-100 text-yellow-800'}`}>
                                  Status: {selectedOrder.courier_status ?
                                    (typeof selectedOrder.courier_status === 'string' ?
                                      selectedOrder.courier_status.replace('_', ' ').charAt(0).toUpperCase() +
                                      selectedOrder.courier_status.replace('_', ' ').slice(1) :
                                      'Pending') :
                                    'Pending'}
                                </span>
                                {selectedOrder.courier_tracking_id && (
                                  <span className="text-sm">Tracking ID: {selectedOrder.courier_tracking_id}</span>
                                )}
                                {selectedOrder.courier_order_id && selectedOrder.courier_order_id !== selectedOrder.courier_tracking_id && (
                                  <span className="text-sm">Order ID: {selectedOrder.courier_order_id}</span>
                                )}
                                {/* Display delivery fee if available in shipping_instructions */}
                                {selectedOrder.shippingInstructions && selectedOrder.shippingInstructions.includes('Delivery Fee:') && (
                                  <span className="text-sm">{selectedOrder.shippingInstructions}</span>
                                )}
                              </div>
                            </dd>
                          </div>
                        )}
                      </dl>

                      {/* Update Status */}
                      {selectedOrder.status !== 'delivered' && selectedOrder.status !== 'cancelled' && (
                        <div className="mt-6">
                          <h4 className="text-sm font-medium text-gray-500">Update Status</h4>
                          <div className="mt-2 flex flex-wrap gap-2">
                            {selectedOrder.status !== 'processing' && (
                              <button
                                onClick={() => handleUpdateStatus(selectedOrder.id, 'processing')}
                                disabled={isUpdatingStatus}
                                className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                              >
                                {isUpdatingStatus ? <ArrowPathIcon className="animate-spin -ml-1 mr-2 h-4 w-4" /> : null}
                                Processing
                              </button>
                            )}
                            {selectedOrder.status !== 'shipped' && (
                              <button
                                onClick={() => handleUpdateStatus(selectedOrder.id, 'shipped')}
                                disabled={isUpdatingStatus}
                                className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                              >
                                {isUpdatingStatus ? <ArrowPathIcon className="animate-spin -ml-1 mr-2 h-4 w-4" /> : null}
                                Shipped
                              </button>
                            )}
                            {selectedOrder.status !== 'delivered' && (
                              <button
                                onClick={() => handleUpdateStatus(selectedOrder.id, 'delivered')}
                                disabled={isUpdatingStatus}
                                className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                              >
                                {isUpdatingStatus ? <ArrowPathIcon className="animate-spin -ml-1 mr-2 h-4 w-4" /> : null}
                                Delivered
                              </button>
                            )}
                            {selectedOrder.status !== 'cancelled' && (
                              <button
                                onClick={() => handleUpdateStatus(selectedOrder.id, 'cancelled')}
                                disabled={isUpdatingStatus}
                                className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                              >
                                {isUpdatingStatus ? <ArrowPathIcon className="animate-spin -ml-1 mr-2 h-4 w-4" /> : null}
                                Cancelled
                              </button>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Create Courier Order */}
                      {selectedOrder.status !== 'delivered' && selectedOrder.status !== 'cancelled' && !selectedOrder.courier_id && (
                        <div className="mt-6">
                          <h4 className="text-sm font-medium text-gray-500">Courier Service</h4>
                          <div className="mt-2">
                            <button
                              onClick={() => {
                                handleCreateCourierOrder(selectedOrder.id);
                                setShowOrderDetails(false);
                              }}
                              disabled={isCreatingCourier}
                              className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-white bg-amber-600 hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
                            >
                              {isCreatingCourier ? (
                                <>
                                  <ArrowPathIcon className="animate-spin -ml-1 mr-2 h-4 w-4" />
                                  Creating Courier Order...
                                </>
                              ) : (
                                <>
                                  <TruckIcon className="-ml-1 mr-2 h-4 w-4" />
                                  Auto-Order Courier
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={() => setShowOrderDetails(false)}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 sm:mt-0 sm:w-auto sm:text-sm"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
