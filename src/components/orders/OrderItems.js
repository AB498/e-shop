'use client';

import React from 'react';
import Image from 'next/image';

export default function OrderItems({ items }) {
  return (
    <div className="overflow-x-auto -mx-3 md:-mx-4">
      <table className="min-w-full divide-y divide-gray-200 text-xs">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Product
            </th>
            <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Price
            </th>
            <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Qty
            </th>
            <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Total
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {items.map((item) => {
            // Check if there's a discount
            const hasDiscount = item.discount_price && parseFloat(item.discount_price) < parseFloat(item.price);
            const discountPrice = hasDiscount ? parseFloat(item.discount_price) : parseFloat(item.price);
            const originalPrice = parseFloat(item.price);
            const discountPercentage = hasDiscount
              ? Math.round((1 - (discountPrice / originalPrice)) * 100)
              : 0;

            // Calculate the item total based on the appropriate price
            const itemTotal = hasDiscount
              ? discountPrice * item.quantity
              : originalPrice * item.quantity;

            return (
              <tr key={item.id}>
                <td className="px-3 py-2 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-8 w-8 flex-shrink-0 mr-2">
                      {item.product_image ? (
                        <Image
                          src={item.product_image}
                          alt={item.product_name}
                          width={32}
                          height={32}
                          className="h-8 w-8 rounded-md object-cover"
                        />
                      ) : (
                        <div className="h-8 w-8 rounded-md bg-gray-200 flex items-center justify-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="text-xs font-medium text-gray-900">{item.product_name}</div>
                      <div className="text-xs text-gray-500">ID: {item.product_id}</div>
                    </div>
                  </div>
                </td>
                <td className="px-3 py-2 whitespace-nowrap text-xs">
                  {hasDiscount ? (
                    <div className="flex flex-col">
                      <span className="text-emerald-600 font-medium">৳{discountPrice.toFixed(2)}</span>
                      <span className="text-red-500 line-through text-[10px]">৳{originalPrice.toFixed(2)}</span>
                      <span className="bg-emerald-100 text-emerald-800 text-[9px] px-1 py-0.5 rounded-sm inline-block w-fit mt-0.5">
                        -{discountPercentage}%
                      </span>
                    </div>
                  ) : (
                    <span className="text-gray-900">৳{originalPrice.toFixed(2)}</span>
                  )}
                </td>
                <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">{item.quantity}</td>
                <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">৳{itemTotal.toFixed(2)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
