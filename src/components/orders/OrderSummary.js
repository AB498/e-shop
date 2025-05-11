'use client';

import React from 'react';

export default function OrderSummary({ total, payment_method }) {
  return (
    <div className="bg-gray-50 p-4 rounded-md">
      <div className="flex justify-between py-2">
        <span className="text-[#7E7E7E]">Subtotal</span>
        <span className="font-medium">৳{parseFloat(total).toFixed(2)}</span>
      </div>
      <div className="flex justify-between py-2">
        <span className="text-[#7E7E7E]">Shipping</span>
        <span className="font-medium">৳0.00</span>
      </div>
      <div className="flex justify-between py-2 border-t border-gray-200 mt-2 pt-2">
        <span className="font-semibold">Total</span>
        <span className="font-bold text-[#006B51]">৳{parseFloat(total).toFixed(2)}</span>
      </div>

      {payment_method && (
        <div className="flex justify-between py-2 border-t border-gray-200 mt-2 pt-2">
          <span className="text-[#7E7E7E]">Payment Method</span>
          <span className="font-medium">
            {payment_method === 'cod' ? 'Cash on Delivery' : 'Online Payment'}
          </span>
        </div>
      )}
    </div>
  );
}
