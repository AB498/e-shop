'use client';

import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { format } from 'date-fns';

export default function PaymentDetailsModal({ transaction, onClose }) {
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
  const formatCurrency = (amount, currency = 'BDT') => {
    if (amount === null || amount === undefined) return 'N/A';
    return `${currency} ${parseFloat(amount).toFixed(2)}`;
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

  // Extract data from transaction
  const { transaction: txn, order, user } = transaction;

  return (
    <Transition.Root show={true} as={Fragment}>
      <Dialog as="div" className="fixed z-10 inset-0 overflow-y-auto" onClose={onClose}>
        <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          {/* This element is to trick the browser into centering the modal contents. */}
          <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
            &#8203;
          </span>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enterTo="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <div className="inline-block align-bottom bg-white rounded-md px-3 pt-4 pb-3 text-left overflow-hidden shadow-xl transform transition-all sm:my-6 sm:align-middle sm:max-w-3xl sm:w-full sm:p-5">
              <div className="absolute top-0 right-0 pt-3 pr-3">
                <button
                  type="button"
                  className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-emerald-500"
                  onClick={onClose}
                >
                  <span className="sr-only">Close</span>
                  <XMarkIcon className="h-5 w-5" aria-hidden="true" />
                </button>
              </div>
              <div className="sm:flex sm:items-start">
                <div className="mt-2 text-center sm:mt-0 sm:text-left w-full">
                  <Dialog.Title as="h3" className="text-base leading-6 font-medium text-gray-900">
                    Payment Transaction Details
                  </Dialog.Title>

                  <div className="mt-3 border-t border-gray-200 pt-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {/* Transaction Information */}
                      <div className="bg-gray-50 p-3 rounded-md">
                        <h4 className="text-sm font-medium text-gray-900 mb-2">Transaction Information</h4>
                        <dl className="grid grid-cols-1 gap-x-3 gap-y-1 sm:grid-cols-2">
                          <div className="sm:col-span-1">
                            <dt className="text-xs font-medium text-gray-500">Transaction ID</dt>
                            <dd className="mt-0.5 text-xs text-gray-900">{txn.transaction_id || 'N/A'}</dd>
                          </div>
                          <div className="sm:col-span-1">
                            <dt className="text-xs font-medium text-gray-500">Validation ID</dt>
                            <dd className="mt-0.5 text-xs text-gray-900">{txn.val_id || 'N/A'}</dd>
                          </div>
                          <div className="sm:col-span-1">
                            <dt className="text-xs font-medium text-gray-500">Amount</dt>
                            <dd className="mt-0.5 text-xs text-gray-900">{formatCurrency(txn.amount, txn.currency)}</dd>
                          </div>
                          <div className="sm:col-span-1">
                            <dt className="text-xs font-medium text-gray-500">Status</dt>
                            <dd className="mt-0.5 text-xs">
                              <span className={`px-1.5 py-0.5 inline-flex text-xs leading-4 font-semibold rounded-full ${getStatusBadgeColor(txn.status)}`}>
                                {txn.status || 'Unknown'}
                              </span>
                            </dd>
                          </div>
                          <div className="sm:col-span-1">
                            <dt className="text-xs font-medium text-gray-500">Payment Method</dt>
                            <dd className="mt-0.5 text-xs text-gray-900">{txn.payment_method || 'N/A'}</dd>
                          </div>
                          <div className="sm:col-span-1">
                            <dt className="text-xs font-medium text-gray-500">Transaction Date</dt>
                            <dd className="mt-0.5 text-xs text-gray-900">{formatDate(txn.tran_date || txn.created_at)}</dd>
                          </div>
                          <div className="sm:col-span-1">
                            <dt className="text-xs font-medium text-gray-500">Bank Transaction ID</dt>
                            <dd className="mt-0.5 text-xs text-gray-900">{txn.bank_tran_id || 'N/A'}</dd>
                          </div>
                          <div className="sm:col-span-1">
                            <dt className="text-xs font-medium text-gray-500">Store Amount</dt>
                            <dd className="mt-0.5 text-xs text-gray-900">{formatCurrency(txn.store_amount, txn.currency)}</dd>
                          </div>
                        </dl>
                      </div>

                      {/* Card Information */}
                      <div className="bg-gray-50 p-3 rounded-md">
                        <h4 className="text-sm font-medium text-gray-900 mb-2">Payment Details</h4>
                        <dl className="grid grid-cols-1 gap-x-3 gap-y-1 sm:grid-cols-2">
                          <div className="sm:col-span-1">
                            <dt className="text-xs font-medium text-gray-500">Card Type</dt>
                            <dd className="mt-0.5 text-xs text-gray-900">{txn.card_type || 'N/A'}</dd>
                          </div>
                          <div className="sm:col-span-1">
                            <dt className="text-xs font-medium text-gray-500">Card Number</dt>
                            <dd className="mt-0.5 text-xs text-gray-900">{txn.card_no || 'N/A'}</dd>
                          </div>
                          <div className="sm:col-span-1">
                            <dt className="text-xs font-medium text-gray-500">Card Brand</dt>
                            <dd className="mt-0.5 text-xs text-gray-900">{txn.card_brand || 'N/A'}</dd>
                          </div>
                          <div className="sm:col-span-1">
                            <dt className="text-xs font-medium text-gray-500">Card Issuer</dt>
                            <dd className="mt-0.5 text-xs text-gray-900">{txn.card_issuer || 'N/A'}</dd>
                          </div>
                          <div className="sm:col-span-1">
                            <dt className="text-xs font-medium text-gray-500">Issuer Country</dt>
                            <dd className="mt-0.5 text-xs text-gray-900">{txn.card_issuer_country || 'N/A'}</dd>
                          </div>
                          <div className="sm:col-span-1">
                            <dt className="text-xs font-medium text-gray-500">Risk Level</dt>
                            <dd className="mt-0.5 text-xs text-gray-900">{txn.risk_level || 'N/A'}</dd>
                          </div>
                        </dl>
                      </div>
                    </div>

                    {/* Order Information */}
                    {order && (
                      <div className="mt-3 bg-gray-50 p-3 rounded-md">
                        <h4 className="text-sm font-medium text-gray-900 mb-2">Order Information</h4>
                        <dl className="grid grid-cols-1 gap-x-3 gap-y-1 sm:grid-cols-3">
                          <div className="sm:col-span-1">
                            <dt className="text-xs font-medium text-gray-500">Order ID</dt>
                            <dd className="mt-0.5 text-xs text-gray-900">{order.id}</dd>
                          </div>
                          <div className="sm:col-span-1">
                            <dt className="text-xs font-medium text-gray-500">Order Status</dt>
                            <dd className="mt-0.5 text-xs">
                              <span className={`px-1.5 py-0.5 inline-flex text-xs leading-4 font-semibold rounded-full ${getStatusBadgeColor(order.status)}`}>
                                {order.status}
                              </span>
                            </dd>
                          </div>
                          <div className="sm:col-span-1">
                            <dt className="text-xs font-medium text-gray-500">Order Total</dt>
                            <dd className="mt-0.5 text-xs text-gray-900">{formatCurrency(order.total)}</dd>
                          </div>
                          <div className="sm:col-span-1">
                            <dt className="text-xs font-medium text-gray-500">Order Date</dt>
                            <dd className="mt-0.5 text-xs text-gray-900">{formatDate(order.created_at)}</dd>
                          </div>
                          <div className="sm:col-span-2">
                            <dt className="text-xs font-medium text-gray-500">Shipping Address</dt>
                            <dd className="mt-0.5 text-xs text-gray-900 line-clamp-2">
                              {order.shipping_address}, {order.shipping_area}, {order.shipping_city}, {order.shipping_post_code}
                            </dd>
                          </div>
                        </dl>
                      </div>
                    )}

                    {/* Customer Information */}
                    {user && (
                      <div className="mt-3 bg-gray-50 p-3 rounded-md">
                        <h4 className="text-sm font-medium text-gray-900 mb-2">Customer Information</h4>
                        <dl className="grid grid-cols-1 gap-x-3 gap-y-1 sm:grid-cols-3">
                          <div className="sm:col-span-1">
                            <dt className="text-xs font-medium text-gray-500">Customer ID</dt>
                            <dd className="mt-0.5 text-xs text-gray-900">{user.id}</dd>
                          </div>
                          <div className="sm:col-span-1">
                            <dt className="text-xs font-medium text-gray-500">Name</dt>
                            <dd className="mt-0.5 text-xs text-gray-900">{`${user.firstName} ${user.lastName}`}</dd>
                          </div>
                          <div className="sm:col-span-1">
                            <dt className="text-xs font-medium text-gray-500">Email</dt>
                            <dd className="mt-0.5 text-xs text-gray-900 truncate">{user.email}</dd>
                          </div>
                          <div className="sm:col-span-1">
                            <dt className="text-xs font-medium text-gray-500">Phone</dt>
                            <dd className="mt-0.5 text-xs text-gray-900">{user.phone || 'N/A'}</dd>
                          </div>
                        </dl>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="mt-4 sm:mt-3 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="mt-2 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-3 py-1.5 bg-white text-xs font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-emerald-500 sm:mt-0 sm:w-auto"
                  onClick={onClose}
                >
                  Close
                </button>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
