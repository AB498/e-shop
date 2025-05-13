'use client';

import React from 'react';

export default function OrderSummary({ total, payment_method }) {
  return (
    <div className="bg-gray-50 p-3 rounded-md text-sm">
      <div className="flex justify-between py-1.5">
        <span className="text-[#7E7E7E] text-xs">Subtotal</span>
        <span className="font-medium text-xs">৳{parseFloat(total).toFixed(2)}</span>
      </div>
      <div className="flex justify-between py-1.5">
        <span className="text-[#7E7E7E] text-xs">Shipping</span>
        <span className="font-medium text-xs">৳0.00</span>
      </div>
      <div className="flex justify-between py-1.5 border-t border-gray-200 mt-1.5 pt-1.5">
        <span className="font-semibold text-xs">Total</span>
        <span className="font-bold text-[#006B51] text-xs">৳{parseFloat(total).toFixed(2)}</span>
      </div>

      {payment_method && (
        <div className="flex justify-between py-1.5 border-t border-gray-200 mt-1.5 pt-1.5">
          <span className="text-[#7E7E7E] text-xs">Payment Method</span>
          <span className="font-medium text-xs">
            {payment_method === 'cod' ? 'Cash on Delivery' : 'Online Payment'}
          </span>
        </div>
      )}
    </div>
  );
}
