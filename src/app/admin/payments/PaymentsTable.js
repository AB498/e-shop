'use client';

import { EyeIcon } from '@heroicons/react/24/outline';
import { format } from 'date-fns';

export default function PaymentsTable({ transactions, isLoading, onViewDetails }) {
  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return format(date, 'MMM dd, yyyy HH:mm:ss');
    } catch (error) {
      return dateString;
    }
  };

  // Format currency for display
  const formatCurrency = (amount, currency = '৳') => {
    if (amount === null || amount === undefined) return 'N/A';
    return `${currency}${parseFloat(amount).toFixed(2)}`;
  };

  // Get status badge color
  const getStatusBadgeColor = (status) => {
    switch (status?.toUpperCase()) {
      case 'VALID':
      case 'VALIDATED':
        return 'bg-green-100 text-green-800';
      case 'FAILED':
        return 'bg-red-100 text-red-800';
      case 'CANCELLED':
        return 'bg-orange-100 text-orange-800';
      case 'PENDING':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Render loading skeleton
  if (isLoading) {
    return (
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Transaction ID</th>
              <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
              <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
              <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment Method</th>
              <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {[...Array(5)].map((_, index) => (
              <tr key={index}>
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="h-3 bg-gray-200 rounded w-20 animate-pulse"></div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="h-3 bg-gray-200 rounded w-10 animate-pulse"></div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="h-3 bg-gray-200 rounded w-16 animate-pulse"></div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="h-3 bg-gray-200 rounded w-14 animate-pulse"></div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="h-3 bg-gray-200 rounded w-20 animate-pulse"></div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="h-3 bg-gray-200 rounded w-24 animate-pulse"></div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="h-3 bg-gray-200 rounded w-12 animate-pulse"></div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  // Render empty state
  if (!transactions || transactions.length === 0) {
    return (
      <div className="text-center py-8">
        <svg
          className="mx-auto h-10 w-10 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
        <h3 className="mt-2 text-xs font-medium text-gray-900">No transactions found</h3>
        <p className="mt-1 text-xs text-gray-500">
          No payment transactions match your current filters.
        </p>
      </div>
    );
  }

  // Render transactions table
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Transaction ID</th>
            <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
            <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
            <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment Method</th>
            <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
            <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {transactions.map((transaction) => (
            <tr key={transaction.id} className="hover:bg-gray-50">
              <td className="px-4 py-3 whitespace-nowrap text-xs font-medium text-gray-900 max-w-[120px] truncate">
                {transaction.transaction_id || 'N/A'}
              </td>
              <td className="px-4 py-3 whitespace-nowrap text-xs text-gray-500">
                {transaction.order_id || 'N/A'}
              </td>
              <td className="px-4 py-3 whitespace-nowrap text-xs text-gray-500">
                {formatCurrency(transaction.amount, transaction.currency)}
              </td>
              <td className="px-4 py-3 whitespace-nowrap">
                <span className={`px-2 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeColor(transaction.status)}`}>
                  {transaction.status || 'Unknown'}
                </span>
              </td>
              <td className="px-4 py-3 whitespace-nowrap text-xs text-gray-500">
                {transaction.payment_method || 'N/A'}
              </td>
              <td className="px-4 py-3 whitespace-nowrap text-xs text-gray-500">
                {formatDate(transaction.created_at)}
              </td>
              <td className="px-4 py-3 whitespace-nowrap text-xs font-medium">
                <button
                  onClick={() => onViewDetails(transaction)}
                  className="text-emerald-600 hover:text-emerald-900 inline-flex items-center"
                >
                  <EyeIcon className="h-3.5 w-3.5 mr-1" />
                  View
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
