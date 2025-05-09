'use client';

import { ShoppingBagIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

export default function RecentOrdersCard({
  title = 'Recent Orders',
  orders = [],
  isLoading = false,
  footerLink,
  footerText = 'View all orders'
}) {
  // Function to determine status badge color
  const getStatusBadgeClass = (status) => {
    const statusMap = {
      'Delivered': 'bg-green-100 text-green-800',
      'Shipped': 'bg-blue-100 text-blue-800',
      'Processing': 'bg-amber-100 text-amber-800',
      'Cancelled': 'bg-red-100 text-red-800',
      'Pending': 'bg-gray-100 text-gray-800',
    };

    return statusMap[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="relative overflow-hidden rounded-xl bg-white shadow-md">
      {/* Gradient overlay at the top */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#006B51] to-[#008B6A]"></div>

      <div className="px-4 py-5 sm:px-6 bg-white border-b border-gray-100">
        <div className="flex items-center">
          <ShoppingBagIcon className="mr-2 h-5 w-5 text-[#006B51]" />
          <h3 className="text-lg font-medium leading-6 text-gray-900 ">{title}</h3>
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
                Amount
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {isLoading ? (
              // Loading skeleton
              Array.from({ length: 5 }).map((_, index) => (
                <tr key={`loading-${index}`}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div>
                  </td>
                </tr>
              ))
            ) : orders && orders.length > 0 ? (
              // Actual data
              orders.map((order) => (
                <tr key={order?.id || 'unknown'} className="hover:bg-gray-50 transition-colors duration-150">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                    <Link href={`/admin/orders/${order?.id || 0}`}>
                      #{order?.id || 'N/A'}
                    </Link>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {order?.customer || 'Unknown'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {order?.date || 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(order?.status)}`}>
                      {order?.status || 'Pending'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {order?.amount || '$0.00'}
                  </td>
                </tr>
              ))
            ) : (
              // Empty state
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-sm text-gray-500">
                  No recent orders
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {footerLink && (
        <div className="px-4 py-3 bg-white border-t border-gray-100 sm:px-6">
          <div className="text-sm">
            <Link
              href={footerLink}
              className="font-medium text-[#006B51] hover:text-[#008B6A] transition-colors duration-150 "
            >
              {footerText}
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
