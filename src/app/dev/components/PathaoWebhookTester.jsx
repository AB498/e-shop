'use client';

import { useState } from 'react';
import {
  ArrowPathIcon,
  TruckIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
} from '@heroicons/react/24/outline';

export default function PathaoWebhookTester() {
  const [orderId, setOrderId] = useState('');
  const [eventType, setEventType] = useState('order.pickup');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  // List of Pathao webhook event types
  const eventTypes = [
    { value: 'order.created', label: 'Order Created' },
    { value: 'order.pickup_requested', label: 'Pickup Requested' },
    { value: 'order.assigned_for_pickup', label: 'Assigned For Pickup' },
    { value: 'order.pickup', label: 'Pickup' },
    { value: 'order.pickup_failed', label: 'Pickup Failed' },
    { value: 'order.pickup_cancelled', label: 'Pickup Cancelled' },
    { value: 'order.at_sorting_hub', label: 'At the Sorting Hub' },
    { value: 'order.in_transit', label: 'In Transit' },
    { value: 'order.received_at_last_mile_hub', label: 'Received at Last Mile Hub' },
    { value: 'order.assigned_for_delivery', label: 'Assigned for Delivery' },
    { value: 'order.delivered', label: 'Delivered' },
    { value: 'order.partial_delivery', label: 'Partial Delivery' },
    { value: 'order.return', label: 'Return' },
    { value: 'order.delivery_failed', label: 'Delivery Failed' },
    { value: 'order.on_hold', label: 'On Hold' },
  ];

  const handleTestWebhook = async () => {
    if (!orderId) {
      setError('Please enter an order ID');
      return;
    }

    setIsLoading(true);
    setResult(null);
    setError(null);

    try {
      const response = await fetch('/api/dev/test-pathao-webhook', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderId: parseInt(orderId),
          event: eventType,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to test webhook');
      }

      setResult(data);
    } catch (err) {
      console.error('Error testing webhook:', err);
      setError(err.message || 'An error occurred while testing the webhook');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <div className="flex items-center">
          <div className="flex-shrink-0 bg-indigo-100 rounded-md p-3">
            <TruckIcon className="h-6 w-6 text-indigo-600" aria-hidden="true" />
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">Pathao Webhook</dt>
              <dd>
                <div className="text-lg font-medium text-gray-900">Test Status Updates</div>
              </dd>
            </dl>
          </div>
        </div>

        <div className="mt-5">
          <p className="text-sm text-gray-500 mb-4">
            Test Pathao webhook status updates by simulating events for an existing order.
            This will update the order status and create tracking entries in the database.
          </p>

          <div className="space-y-4">
            <div>
              <label htmlFor="orderId" className="block text-sm font-medium text-gray-700">
                Order ID
              </label>
              <div className="mt-1">
                <input
                  type="number"
                  id="orderId"
                  value={orderId}
                  onChange={(e) => setOrderId(e.target.value)}
                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  placeholder="Enter order ID"
                />
              </div>
            </div>

            <div>
              <label htmlFor="eventType" className="block text-sm font-medium text-gray-700">
                Event Type
              </label>
              <div className="mt-1">
                <select
                  id="eventType"
                  value={eventType}
                  onChange={(e) => setEventType(e.target.value)}
                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                >
                  {eventTypes.map((event) => (
                    <option key={event.value} value={event.value}>
                      {event.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <button
                type="button"
                onClick={handleTestWebhook}
                disabled={isLoading}
                className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white
                  ${isLoading
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
                  }`}
              >
                {isLoading ? (
                  <>
                    <ArrowPathIcon className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" />
                    Processing...
                  </>
                ) : (
                  <>
                    <TruckIcon className="-ml-1 mr-2 h-5 w-5" />
                    Test Webhook
                  </>
                )}
              </button>
            </div>

            {error && (
              <div className="rounded-md bg-red-50 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <ExclamationCircleIcon className="h-5 w-5 text-red-400" aria-hidden="true" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">Error</h3>
                    <div className="mt-2 text-sm text-red-700">
                      <p>{error}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {result && (
              <div className="rounded-md bg-green-50 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <CheckCircleIcon className="h-5 w-5 text-green-400" aria-hidden="true" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-green-800">Success</h3>
                    <div className="mt-2 text-sm text-green-700">
                      <p>{result.message}</p>
                    </div>
                    <div className="mt-4">
                      <div className="-mx-2 -my-1.5 flex">
                        <button
                          type="button"
                          onClick={() => console.log(result)}
                          className="bg-green-50 px-2 py-1.5 rounded-md text-sm font-medium text-green-800 hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                        >
                          View Details in Console
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
