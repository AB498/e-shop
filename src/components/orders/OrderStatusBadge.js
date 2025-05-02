'use client';

import React from 'react';

export default function OrderStatusBadge({ status }) {
  return (
    <span className={`px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full
      ${status === 'Processing' ? 'bg-blue-100 text-blue-800' :
        status === 'Shipped' ? 'bg-yellow-100 text-yellow-800' :
        status === 'Delivered' ? 'bg-green-100 text-green-800' :
        status === 'Cancelled' ? 'bg-red-100 text-red-800' :
        'bg-gray-100 text-gray-800'}`}>
      {status}
    </span>
  );
}
