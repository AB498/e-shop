'use client';

import { useState } from 'react';
import {
  ArrowPathIcon,
  ShoppingCartIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  InformationCircleIcon,
} from '@heroicons/react/24/outline';

export default function OrderTester() {
  // State for order test flow
  const [orderTestStatus, setOrderTestStatus] = useState('idle'); // idle, loading, success, error
  const [orderTestMessage, setOrderTestMessage] = useState('');
  const [orderTestResults, setOrderTestResults] = useState(null);
  const [orderTestStep, setOrderTestStep] = useState(0);
  const [orderTestProgress, setOrderTestProgress] = useState(0);

  // Define order test steps
  const orderTestSteps = [
    { name: 'Preparing', description: 'Preparing to create test order...' },
    { name: 'Adding Products', description: 'Adding products to cart...' },
    { name: 'Creating Order', description: 'Creating order with cart items...' },
    { name: 'Processing Payment', description: 'Simulating payment process...' },
    { name: 'Complete', description: 'Order test completed successfully!' }
  ];

  // Function to test order creation
  const handleTestOrder = async () => {
    try {
      // Reset states
      setOrderTestStatus('loading');
      setOrderTestMessage('Initializing order test process...');
      setOrderTestResults(null);
      setOrderTestStep(0);
      setOrderTestProgress(0);

      // Step 1: Preparing
      await new Promise(resolve => setTimeout(resolve, 500));
      setOrderTestStep(1);
      setOrderTestProgress(20);
      setOrderTestMessage('Adding products to cart...');

      // Make the API call to test order creation
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 60000); // 60 second timeout

      const response = await fetch('/api/dev/test-order', {
        method: 'POST',
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      // Simulate step progress during API call
      setOrderTestStep(2);
      setOrderTestProgress(50);
      setOrderTestMessage('Creating order with cart items...');
      await new Promise(resolve => setTimeout(resolve, 800));

      setOrderTestStep(3);
      setOrderTestProgress(80);
      setOrderTestMessage('Processing payment...');
      await new Promise(resolve => setTimeout(resolve, 800));

      const data = await response.json();

      if (response.ok) {
        setOrderTestStep(4);
        setOrderTestProgress(100);
        setOrderTestStatus('success');
        setOrderTestMessage(data.message || 'Order test completed successfully!');
        if (data.results) {
          setOrderTestResults(data.results);
        }
      } else {
        throw new Error(data.error || 'Failed to complete the order test');
      }
    } catch (error) {
      setOrderTestStatus('error');
      setOrderTestMessage(error.name === 'AbortError'
        ? 'Order test timed out. The operation took too long to complete.'
        : error.message);
      setOrderTestResults(null);
      console.error('Error in order test process:', error);
    }
  };

  return (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <div className="flex items-center">
          <div className="flex-shrink-0 bg-amber-100 rounded-md p-3">
            <ShoppingCartIcon className="h-6 w-6 text-amber-600" aria-hidden="true" />
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">Order Testing</dt>
              <dd>
                <div className="text-lg font-medium text-gray-900">Create Test Order</div>
              </dd>
            </dl>
          </div>
        </div>

        <div className="mt-5">
          <p className="text-sm text-gray-500 mb-4">
            Create a test order using existing products and APIs. This simulates the exact user experience
            of adding products to cart, checking out, and processing payment.
          </p>

          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={handleTestOrder}
              disabled={orderTestStatus === 'loading'}
              className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white
                ${orderTestStatus === 'loading'
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-amber-600 hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500'
                }`}
            >
              {orderTestStatus === 'loading' ? (
                <>
                  <ArrowPathIcon className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" />
                  Processing...
                </>
              ) : (
                <>
                  <ShoppingCartIcon className="-ml-1 mr-2 h-5 w-5" />
                  Create Test Order
                </>
              )}
            </button>

            {/* Progress indicator for loading state */}
            {orderTestStatus === 'loading' && (
              <div className="mt-4 w-full">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-blue-600">{orderTestSteps[orderTestStep].name}</span>
                  <span className="text-sm font-medium text-blue-600">{orderTestProgress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-blue-600 h-2.5 rounded-full transition-all duration-300 ease-in-out"
                    style={{ width: `${orderTestProgress}%` }}
                  ></div>
                </div>
                <p className="mt-1 text-xs text-gray-500">{orderTestMessage}</p>

                {/* Steps indicator */}
                <div className="mt-4">
                  <ol className="flex items-center w-full">
                    {orderTestSteps.map((_, index) => (
                      <li key={index} className={`flex items-center ${index < orderTestSteps.length - 1 ? 'w-full' : ''}`}>
                        <span className={`flex items-center justify-center w-6 h-6 rounded-full shrink-0 text-xs
                          ${index < orderTestStep ? 'bg-blue-600 text-white' :
                            index === orderTestStep ? 'bg-blue-100 text-blue-800 border border-blue-600' :
                            'bg-gray-100 text-gray-500 border border-gray-300'}`}>
                          {index + 1}
                        </span>
                        {index < orderTestSteps.length - 1 && (
                          <div className={`flex-1 h-0.5 mx-2 ${index < orderTestStep ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
                        )}
                      </li>
                    ))}
                  </ol>
                  <div className="mt-2 text-xs text-gray-500">
                    {orderTestSteps[orderTestStep].description}
                  </div>
                </div>
              </div>
            )}

            {orderTestStatus === 'success' && (
              <div>
                <div className="flex items-center text-sm text-green-600">
                  <CheckCircleIcon className="h-5 w-5 mr-1.5" />
                  {orderTestMessage}
                </div>

                {orderTestResults && (
                  <div className="mt-3 bg-green-50 p-3 rounded-md">
                    <h4 className="text-sm font-medium text-green-800 flex items-center">
                      <InformationCircleIcon className="h-5 w-5 mr-1.5" />
                      Order Test Results
                    </h4>
                    <div className="mt-2 text-xs text-green-700">
                      <div className="mb-2">
                        <p className="font-medium">Order Details:</p>
                        <p>Order ID: {orderTestResults.order?.id}</p>
                        <p>Total: ${orderTestResults.order?.total}</p>
                        <p>Status: {orderTestResults.order?.status}</p>
                      </div>

                      {orderTestResults.items && orderTestResults.items.length > 0 && (
                        <div className="mb-2">
                          <p className="font-medium">Order Items:</p>
                          <ul className="list-disc pl-5 mt-1">
                            {orderTestResults.items.map((item, index) => (
                              <li key={index}>
                                {item.quantity} x {item.name} (${item.price})
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {orderTestResults.user && (
                        <div className="mb-2">
                          <p className="font-medium">Customer:</p>
                          <p>{orderTestResults.user.first_name} {orderTestResults.user.last_name}</p>
                          <p>{orderTestResults.user.email}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {orderTestStatus === 'error' && (
              <div>
                <div className="flex items-center text-sm text-red-600">
                  <ExclamationCircleIcon className="h-5 w-5 mr-1.5" />
                  {orderTestMessage}
                </div>
                <p className="mt-2 text-xs text-gray-500">
                  Try again or check the console for more details.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
