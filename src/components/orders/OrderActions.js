'use client';

import React from 'react';
import Link from 'next/link';

export default function OrderActions({ order }) {
  return (
    <div className="bg-gray-50 p-3 rounded-md mb-4">
      {order.status === 'Pending' && (
        <p className="text-xs text-gray-600 mb-3">
          Your order is pending payment. Please complete the payment to process your order.
        </p>
      )}
      {order.status === 'Processing' && (
        <p className="text-xs text-gray-600 mb-3">
          Your order is being processed. We'll update you when it ships.
        </p>
      )}
      {order.status === 'Shipped' && (
        <p className="text-xs text-gray-600 mb-3">
          Your order has been shipped and is on its way to you.
        </p>
      )}
      {order.status === 'Delivered' && (
        <p className="text-xs text-gray-600 mb-3">
          Your order has been delivered. Thank you for shopping with us!
        </p>
      )}
      {order.status === 'Cancelled' && (
        <p className="text-xs text-gray-600 mb-3">
          This order has been cancelled.
        </p>
      )}

      <div className="flex flex-wrap gap-2">
        {order.status === 'Pending' && (
          <Link
            href={`/profile/orders/${order.id}/pay`}
            className="bg-[#006B51] text-white text-xs font-medium py-1.5 px-3 rounded-md hover:bg-[#005541] transition-colors"
          >
            Continue Payment
          </Link>
        )}

        <Link
          href="/products"
          className={`${order.status === 'Pending' ? 'bg-white text-[#006B51] border border-[#006B51]' : 'bg-[#006B51] text-white'} text-xs font-medium py-1.5 px-3 rounded-md hover:bg-[#005541] hover:text-white transition-colors`}
        >
          Continue Shopping
        </Link>

        {order.status !== 'Cancelled' && (
          <Link
            href="/contact"
            className="bg-white text-[#006B51] border border-[#006B51] text-xs font-medium py-1.5 px-3 rounded-md hover:bg-[#f9f9f9] transition-colors"
          >
            Contact Support
          </Link>
        )}
      </div>
    </div>
  );
}
