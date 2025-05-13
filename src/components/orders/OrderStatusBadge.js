'use client';

import React from 'react';

export default function OrderStatusBadge({ status }) {
  return (
    <span className={`px-2 py-0.5 inline-flex text-xs leading-4 font-medium rounded-full
      ${status === 'Processing' ? 'bg-blue-100 text-blue-800' :
        status === 'Shipped' ? 'bg-yellow-100 text-yellow-800' :
        status === 'Delivered' ? 'bg-green-100 text-green-800' :
        status === 'Cancelled' ? 'bg-red-100 text-red-800' :
        'bg-gray-100 text-gray-800'}`}>
      {status}
    </span>
  );
}
