'use client';

import React from 'react';

export default function ShippingInfo({ order }) {
  if (!order.shipping_address) {
    return null;
  }

  return (
    <div className="mt-4">
      <h2 className="text-base font-semibold text-[#253D4E] mb-2 md:mb-3">Shipping Information</h2>
      <div className="bg-gray-50 p-3 rounded-md">
        <div className="mb-3">
          <h3 className="text-xs font-medium text-gray-500 mb-1">Shipping Address</h3>
          <p className="text-xs">{order.shipping_address}</p>
          {order.shipping_city && <p className="text-xs">{order.shipping_city}</p>}
          {order.shipping_post_code && <p className="text-xs">Postal Code: {order.shipping_post_code}</p>}
          {order.shipping_phone && <p className="text-xs">Phone: {order.shipping_phone}</p>}
        </div>

        {order.courier && (
          <div className="mb-2">
            <h3 className="text-xs font-medium text-gray-500 mb-1">Courier Service</h3>
            <p className="text-xs font-medium">{order.courier.name}</p>
          </div>
        )}
      </div>
    </div>
  );
}
