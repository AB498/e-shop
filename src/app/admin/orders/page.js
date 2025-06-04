'use client';

import { useState, useEffect } from 'react';
import {
  MagnifyingGlassIcon,
  ArrowPathIcon,
  ClipboardDocumentCheckIcon,
  TruckIcon,
  UserGroupIcon,
  CreditCardIcon
} from '@heroicons/react/24/outline';
import { initializePaymentForAdmin } from '@/lib/actions/payment';
import { isInternalCourierActive } from '@/lib/actions/admin';
import { getDefaultCourierProvider, getSetting } from '@/lib/actions/settings';
import AssignDeliveryPersonModal from './AssignDeliveryPersonModal';
import OrdersTable from './OrdersTable';
import { createAutomaticCourierOrder } from '@/lib/services/auto-courier';

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
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [orderToAssign, setOrderToAssign] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentOrderId, setPaymentOrderId] = useState(null);
  const [internalCourierEnabled, setInternalCourierEnabled] = useState(true);
  const [steadfastEnabled, setSteadfastEnabled] = useState(true);

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

  // Check if Steadfast courier is enabled
  useEffect(() => {
    async function checkSteadfastEnabled() {
      try {
        // Check if Steadfast is enabled by looking for a courier with name 'Steadfast'
        const response = await fetch('/api/admin/couriers');
        if (response.ok) {
          const couriers = await response.json();
          const steadfastCourier = couriers.find(courier =>
            courier.name.toLowerCase() === 'steadfast' && courier.is_active
          );
          setSteadfastEnabled(!!steadfastCourier);
        }
      } catch (err) {
        console.error('Error checking Steadfast courier status:', err);
        // Default to true in case of error to avoid breaking functionality
        setSteadfastEnabled(true);
      }
    }

    checkSteadfastEnabled();
  }, []);

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
      (order.customer && order.customer.toLowerCase().includes(searchTerm.toLowerCase()));

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

      // Get the default courier provider
      const defaultCourierProvider = await getDefaultCourierProvider();
      console.log(`Using default courier provider: ${defaultCourierProvider}`);

      // Get the default courier ID from settings
      const { getSetting } = await import('@/lib/actions/settings');
      const defaultCourierId = await getSetting('default_courier_id');
      console.log(`Default courier ID from settings: ${defaultCourierId}`);

      // Create the courier order with the default provider
      console.log(`Creating courier order with provider: ${defaultCourierProvider}`);
      const data = await createAutomaticCourierOrder(orderId, true, defaultCourierProvider);

      console.log('Courier order created successfully:', JSON.stringify(data, null, 2));

      // Show success message with additional info if available
      if (defaultCourierProvider === 'pathao' && data.data && data.data.pathao_response) {
        const pathaoData = data.data.pathao_response;
        alert(`Pathao order created successfully:
Consignment ID: ${pathaoData.consignment_id}
Order Status: ${pathaoData.order_status}
Delivery Fee: ${pathaoData.delivery_fee || 'N/A'}
Merchant Order ID: ${pathaoData.merchant_order_id || 'N/A'}`);
      } else if (defaultCourierProvider === 'steadfast' && data.data && data.data.steadfast_response) {
        const steadfastData = data.data.steadfast_response;
        alert(`Steadfast order created successfully:
Consignment ID: ${steadfastData.consignment_id}
Tracking Code: ${steadfastData.tracking_code}
Invoice: ${steadfastData.invoice}
Status: ${steadfastData.status}`);
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

  // Handle opening the assign delivery person modal
  const handleAssignDeliveryPerson = (order) => {
    setOrderToAssign(order);
    setShowAssignModal(true);
  };

  // Handle successful assignment
  const handleAssignmentComplete = () => {
    setShowAssignModal(false);
    setOrderToAssign(null);
    // Refresh the orders list
    setUpdatedOrderId(Date.now()); // Use timestamp to force refresh
  };

  // Handle showing payment page
  const handleShowPaymentPage = async (orderId) => {
    try {
      setPaymentOrderId(orderId);
      setShowPaymentModal(true);
    } catch (err) {
      console.error('Error preparing payment page:', err);
      setError(err.message);
    }
  };

  // Handle payment initialization
  const handleInitializePayment = async () => {
    if (!paymentOrderId) return;

    try {
      setError(null);
      console.log('Initializing payment for order ID:', paymentOrderId);

      // Use the server action to initialize payment
      const result = await initializePaymentForAdmin(paymentOrderId);
      console.log('Payment initialization result:', result);

      if (result.error) {
        throw new Error(result.error);
      }

      // Redirect to payment gateway
      if (result.redirectUrl) {
        console.log('Redirecting to payment gateway:', result.redirectUrl);
        window.open(result.redirectUrl, '_blank');
        setShowPaymentModal(false);
      } else {
        throw new Error('No redirect URL received from payment gateway');
      }
    } catch (err) {
      console.error('Payment initialization error:', err);
      setError(err.message);
      alert(`Payment initialization failed: ${err.message}`);
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
        <div className="p-4 sm:p-6 border-b border-gray-200">
          <div className="flex flex-wrap gap-3">
            <div className="relative w-full sm:flex-1 sm:max-w-lg">
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
            <div className="w-full sm:w-auto">
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

        <OrdersTable
          orders={filteredOrders}
          isLoading={isLoading}
          onViewOrder={handleViewOrder}
          onCreateCourierOrder={handleCreateCourierOrder}
          onAssignDeliveryPerson={handleAssignDeliveryPerson}
          onShowPaymentPage={handleShowPaymentPage}
          internalCourierEnabled={internalCourierEnabled}
          steadfastEnabled={steadfastEnabled}
        />
      </div>

      {/* Order Details Modal */}
      {showOrderDetails && selectedOrder && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75" onClick={() => setShowOrderDetails(false)}></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-3xl sm:w-full">
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
                        <div className="sm:col-span-1">
                          <dt className="text-sm font-medium text-gray-500">Payment Method</dt>
                          <dd className="mt-1 text-sm text-gray-900">
                            {selectedOrder.payment_method === 'cod' ? 'Cash on Delivery' : 'Online Payment'}
                          </dd>
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

                        {/* Order Items Section */}
                        <div className="sm:col-span-2">
                          <dt className="text-sm font-medium text-gray-500 mb-2">Order Items</dt>
                          <dd className="mt-1 text-sm text-gray-900">
                            <div className="overflow-x-auto -mx-4 sm:-mx-6">
                              <div className="inline-block min-w-full py-2 align-middle px-4 sm:px-6">
                                <table className="min-w-full divide-y divide-gray-200">
                                  <thead className="bg-gray-50">
                                    <tr>
                                      <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Product
                                      </th>
                                      <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Price
                                      </th>
                                      <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Qty
                                      </th>
                                      <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Total
                                      </th>
                                    </tr>
                                  </thead>
                                  <tbody className="bg-white divide-y divide-gray-200">
                                    {selectedOrder.items && selectedOrder.items.map((item) => (
                                      <tr key={item.id}>
                                        <td className="px-3 py-2 whitespace-nowrap">
                                          <div className="flex items-center">
                                            <div className="flex-shrink-0 h-8 w-8 bg-gray-100 rounded-md overflow-hidden">
                                              {item.product_image ? (
                                                <img
                                                  src={item.product_image}
                                                  alt={item.product_name}
                                                  className="h-full w-full object-cover"
                                                />
                                              ) : (
                                                <div className="h-full w-full flex items-center justify-center text-gray-400">
                                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                  </svg>
                                                </div>
                                              )}
                                            </div>
                                            <div className="ml-3">
                                              <div className="text-xs font-medium text-gray-900 line-clamp-2">{item.product_name}</div>
                                              <div className="text-xs text-gray-500">ID: {item.product_id}</div>
                                            </div>
                                          </div>
                                        </td>
                                        <td className="px-3 py-2 whitespace-nowrap text-xs">
                                          {item.discount_price && parseFloat(item.discount_price) < parseFloat(item.price) ? (
                                            <div className="flex flex-col">
                                              <span className="text-emerald-600 font-medium">৳{item.discount_price}</span>
                                              <span className="text-red-500 line-through text-[10px]">৳{item.price}</span>
                                              <span className="bg-emerald-100 text-emerald-800 text-[9px] px-1 py-0.5 rounded-sm inline-block w-fit mt-0.5">
                                                -{Math.round((1 - (parseFloat(item.discount_price) / parseFloat(item.price))) * 100)}%
                                              </span>
                                            </div>
                                          ) : (
                                            <span className="text-gray-900">৳{item.price}</span>
                                          )}
                                        </td>
                                        <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">{item.quantity}</td>
                                        <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">{item.total}</td>
                                      </tr>
                                    ))}
                                    {(!selectedOrder.items || selectedOrder.items.length === 0) && (
                                      <tr>
                                        <td colSpan="4" className="px-3 py-2 text-center text-xs text-gray-500">
                                          No items found for this order
                                        </td>
                                      </tr>
                                    )}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          </dd>
                        </div>

                        {selectedOrder.courier_id && (
                          <div className="sm:col-span-2">
                            <dt className="text-sm font-medium text-gray-500">Courier Information</dt>
                            <dd className="mt-1 text-sm text-gray-900">
                              <div className="flex flex-col space-y-2">
                                <div className="flex flex-wrap gap-2">
                                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
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
                                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                                    ${selectedOrder.courier_type === 'internal' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'}`}>
                                    Type: {selectedOrder.courier_type === 'internal' ? 'Internal' : 'External'}
                                  </span>
                                </div>

                                {selectedOrder.courier_name && (
                                  <span className="text-sm">Courier: {selectedOrder.courier_name}</span>
                                )}

                                {selectedOrder.courier_type === 'internal' && selectedOrder.delivery_person_name && (
                                  <div>
                                    <span className="text-sm font-medium">Delivery Person:</span>
                                    <div className="ml-2">
                                      <div className="text-sm">{selectedOrder.delivery_person_name}</div>
                                      {selectedOrder.delivery_person_phone && (
                                        <div className="text-sm">Phone: {selectedOrder.delivery_person_phone}</div>
                                      )}
                                    </div>
                                  </div>
                                )}

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

                      {/* OTP Verification Link */}
                      {selectedOrder.delivery_person_id && selectedOrder.courier_type === 'internal' && !selectedOrder.delivery_otp_verified && (
                        <div className="mt-6">
                          <h4 className="text-sm font-medium text-gray-500">Delivery Verification</h4>
                          <div className="mt-2">
                            <p className="text-sm text-gray-600 mb-2">
                              Share this link with the delivery person to verify the delivery using OTP:
                            </p>
                            <a
                              href={`/delivery?orderId=${selectedOrder.id}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                              <ClipboardDocumentCheckIcon className="-ml-1 mr-2 h-4 w-4" />
                              Open OTP Verification Page
                            </a>
                          </div>
                        </div>
                      )}

                      {/* Create Courier Order */}
                      {selectedOrder.status !== 'delivered' && selectedOrder.status !== 'cancelled' && !selectedOrder.courier_id && (
                        <div className="mt-6">
                          <h4 className="text-sm font-medium text-gray-500">Courier Service</h4>
                          <div className="mt-2">
                            <div className="flex space-x-2">
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
                                    Auto-Order External Courier
                                  </>
                                )}
                              </button>
                              {/* Only show the Assign Internal Delivery button if internal courier is enabled */}
                              {internalCourierEnabled && (
                                <button
                                  onClick={() => {
                                    handleAssignDeliveryPerson(selectedOrder);
                                    setShowOrderDetails(false);
                                  }}
                                  className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                                >
                                  <UserGroupIcon className="-ml-1 mr-2 h-4 w-4" />
                                  Assign Internal Delivery
                                </button>
                              )}
                              {/* Steadfast manual order link */}
                              {steadfastEnabled && (
                                <a
                                  href="https://steadfast.com.bd/user/add-parcel/regular"
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" className="-ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                  </svg>
                                  Create Manual Order on Steadfast
                                </a>
                              )}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Payment Option */}
                      {selectedOrder.status.toLowerCase() === 'pending' && (
                        <div className="mt-6">
                          <h4 className="text-sm font-medium text-gray-500">Payment</h4>
                          <div className="mt-2">
                            <button
                              onClick={() => {
                                handleShowPaymentPage(selectedOrder.id);
                                setShowOrderDetails(false);
                              }}
                              className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                              <CreditCardIcon className="-ml-1 mr-2 h-4 w-4" />
                              Show Payment Page
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

      {/* Assign Delivery Person Modal */}
      {showAssignModal && orderToAssign && (
        <AssignDeliveryPersonModal
          order={orderToAssign}
          onClose={() => setShowAssignModal(false)}
          onAssign={handleAssignmentComplete}
        />
      )}

      {/* Payment Modal */}
      {showPaymentModal && paymentOrderId && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75" onClick={() => setShowPaymentModal(false)}></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
                    <CreditCardIcon className="h-6 w-6 text-blue-600" aria-hidden="true" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Process Payment for Order #{paymentOrderId}
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        This will open the payment gateway in a new tab. The customer can use this page to complete their payment.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={handleInitializePayment}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Open Payment Page
                </button>
                <button
                  type="button"
                  onClick={() => setShowPaymentModal(false)}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
