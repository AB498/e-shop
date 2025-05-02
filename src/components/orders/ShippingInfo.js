'use client';

import React from 'react';

export default function ShippingInfo({ order }) {
  if (!order.shipping_address) {
    return null;
  }

  return (
    <div className="mt-6">
      <h2 className="text-lg font-semibold text-[#253D4E] mb-4">Shipping Information</h2>
      <div className="bg-gray-50 p-4 rounded-md">
        <div className="mb-4">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Shipping Address</h3>
          <p className="text-sm">{order.shipping_address}</p>
          {order.shipping_city && <p className="text-sm">{order.shipping_city}</p>}
          {order.shipping_post_code && <p className="text-sm">Postal Code: {order.shipping_post_code}</p>}
          {order.shipping_phone && <p className="text-sm">Phone: {order.shipping_phone}</p>}
        </div>

        {order.courier && (
          <div className="mb-4">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Courier Service</h3>
            <p className="text-sm font-medium">{order.courier.name}</p>
          </div>
        )}
      </div>
    </div>
  );
}
