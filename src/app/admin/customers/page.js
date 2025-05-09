'use client';

import { useState, useEffect } from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import CustomersTable from './CustomersTable';

export default function CustomersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showCustomerDetails, setShowCustomerDetails] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [customers, setCustomers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [customerDetails, setCustomerDetails] = useState(null);

  // Fetch customers data
  useEffect(() => {
    async function fetchCustomers() {
      try {
        setIsLoading(true);
        const response = await fetch('/api/admin/customers');

        if (!response.ok) {
          throw new Error('Failed to fetch customers');
        }

        const data = await response.json();

        // Process the data to add derived fields
        const processedData = data.map(customer => ({
          ...customer,
          name: customer.fullName,
          // These fields will be populated when viewing details
          orders: '...',
          totalSpent: '...',
          lastOrder: '...',
          status: 'Active' // Default status
        }));

        setCustomers(processedData);
        setIsLoading(false);
      } catch (err) {
        console.error('Error fetching customers:', err);
        setError(err.message);
        setIsLoading(false);
      }
    }

    fetchCustomers();
  }, []);

  // Filter customers based on search term
  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle view customer details
  const handleViewCustomer = async (customer) => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/admin/customers/${customer.id}`);

      if (!response.ok) {
        throw new Error('Failed to fetch customer details');
      }

      const data = await response.json();

      // Calculate total spent from orders
      let totalSpent = 0;
      let lastOrderDate = '';

      if (data.orders && data.orders.length > 0) {
        data.orders.forEach(order => {
          totalSpent += parseFloat(order.total.replace('$', ''));
        });

        // Get the most recent order date
        lastOrderDate = data.orders[0].createdAt;
      }

      const customerWithDetails = {
        ...data,
        name: data.fullName,
        orders: data.orders ? data.orders.length : 0,
        totalSpent: `$${totalSpent.toFixed(2)}`,
        lastOrder: lastOrderDate || 'No orders',
        status: 'Active' // Default status
      };

      setSelectedCustomer(customerWithDetails);
      setCustomerDetails(data);
      setShowCustomerDetails(true);
      setIsLoading(false);
    } catch (err) {
      console.error('Error fetching customer details:', err);
      setError(err.message);
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Customers</h1>
          <p className="mt-2 text-sm text-gray-700">
            Manage your customer base and view their purchase history
          </p>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-4">
          <h3 className="text-lg font-medium">Error loading customers</h3>
          <p>{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-2 px-4 py-2 bg-red-100 hover:bg-red-200 text-red-800 rounded-md"
          >
            Retry
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
                placeholder="Search customers..."
                disabled={isLoading}
              />
            </div>
          </div>
        </div>

        <CustomersTable
          customers={filteredCustomers}
          isLoading={isLoading}
          onViewCustomer={handleViewCustomer}
        />
      </div>

      {/* Customer Details Modal */}
      {showCustomerDetails && selectedCustomer && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75" onClick={() => setShowCustomerDetails(false)}></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Customer Details</h3>
                    <div className="mt-4">
                      <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                        <div className="sm:col-span-1">
                          <dt className="text-sm font-medium text-gray-500">Name</dt>
                          <dd className="mt-1 text-sm text-gray-900">{selectedCustomer.name}</dd>
                        </div>
                        <div className="sm:col-span-1">
                          <dt className="text-sm font-medium text-gray-500">Email</dt>
                          <dd className="mt-1 text-sm text-gray-900">{selectedCustomer.email}</dd>
                        </div>
                        <div className="sm:col-span-1">
                          <dt className="text-sm font-medium text-gray-500">Phone</dt>
                          <dd className="mt-1 text-sm text-gray-900">{selectedCustomer.phone || 'Not provided'}</dd>
                        </div>
                        <div className="sm:col-span-1">
                          <dt className="text-sm font-medium text-gray-500">Joined</dt>
                          <dd className="mt-1 text-sm text-gray-900">{selectedCustomer.createdAt}</dd>
                        </div>
                        <div className="sm:col-span-2">
                          <dt className="text-sm font-medium text-gray-500">Address</dt>
                          <dd className="mt-1 text-sm text-gray-900">
                            {selectedCustomer.address ? (
                              <>
                                {selectedCustomer.address}<br />
                                {selectedCustomer.city}, {selectedCustomer.postCode}<br />
                                {selectedCustomer.region}, {selectedCustomer.country}
                              </>
                            ) : (
                              'Not provided'
                            )}
                          </dd>
                        </div>
                        <div className="sm:col-span-1">
                          <dt className="text-sm font-medium text-gray-500">Total Orders</dt>
                          <dd className="mt-1 text-sm text-gray-900">{selectedCustomer.orders}</dd>
                        </div>
                        <div className="sm:col-span-1">
                          <dt className="text-sm font-medium text-gray-500">Total Spent</dt>
                          <dd className="mt-1 text-sm text-gray-900">{selectedCustomer.totalSpent}</dd>
                        </div>
                      </dl>

                      {/* Recent Orders */}
                      {customerDetails && customerDetails.orders && customerDetails.orders.length > 0 && (
                        <div className="mt-6">
                          <h4 className="text-md font-medium text-gray-900">Recent Orders</h4>
                          <div className="mt-2 overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                              <thead className="bg-gray-50">
                                <tr>
                                  <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Order ID
                                  </th>
                                  <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Date
                                  </th>
                                  <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status
                                  </th>
                                  <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Total
                                  </th>
                                </tr>
                              </thead>
                              <tbody className="bg-white divide-y divide-gray-200">
                                {customerDetails.orders.map((order) => (
                                  <tr key={order.id}>
                                    <td className="px-4 py-2 whitespace-nowrap text-xs font-medium text-blue-600">#{order.id}</td>
                                    <td className="px-4 py-2 whitespace-nowrap text-xs text-gray-500">{order.createdAt}</td>
                                    <td className="px-4 py-2 whitespace-nowrap">
                                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                                        ${order.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                                          order.status === 'Shipped' ? 'bg-blue-100 text-blue-800' :
                                          order.status === 'Cancelled' ? 'bg-red-100 text-red-800' :
                                          'bg-yellow-100 text-yellow-800'}`}>
                                        {order.status}
                                      </span>
                                    </td>
                                    <td className="px-4 py-2 whitespace-nowrap text-xs text-gray-900">{order.total}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
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
                  onClick={() => setShowCustomerDetails(false)}
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
