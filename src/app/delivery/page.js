'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  CheckCircleIcon,
  XCircleIcon,
  ExclamationCircleIcon,
  ClipboardDocumentCheckIcon
} from '@heroicons/react/24/outline';

export default function DeliveryPage() {
  const [formData, setFormData] = useState({
    orderId: '',
    otp: '',
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [verificationResult, setVerificationResult] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Get orderId from URL query parameter
  useEffect(() => {
    // Get orderId from URL query parameter
    const params = new URLSearchParams(window.location.search);
    const orderIdParam = params.get('orderId');

    if (orderIdParam) {
      setFormData(prev => ({ ...prev, orderId: orderIdParam }));
    }
  }, []);

  // Search for orders when orderId changes
  useEffect(() => {
    const searchOrders = async () => {
      if (!formData.orderId || formData.orderId.length < 1) {
        setSuggestions([]);
        return;
      }

      try {
        setIsSearching(true);
        const response = await fetch(`/api/delivery/search-orders?query=${formData.orderId}&limit=5`);

        if (!response.ok) {
          throw new Error('Failed to search orders');
        }

        const data = await response.json();
        console.log('Search orders response:', data);
        setSuggestions(data.orders || []);
        setShowSuggestions(true);
      } catch (error) {
        console.error('Error searching orders:', error);
        setSuggestions([]);
      } finally {
        setIsSearching(false);
      }
    };

    // Debounce the search to avoid too many requests
    const debounceTimeout = setTimeout(searchOrders, 300);

    return () => clearTimeout(debounceTimeout);
  }, [formData.orderId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSelectSuggestion = (orderId) => {
    setFormData((prev) => ({ ...prev, orderId: orderId.toString() }));
    setShowSuggestions(false);
  };

  const handleBlur = () => {
    // Delay hiding suggestions to allow for clicks
    setTimeout(() => {
      setShowSuggestions(false);
    }, 200);
  };

  const handleFocus = () => {
    if (suggestions.length > 0) {
      setShowSuggestions(true);
    }
  };

  const validateForm = (data) => {
    const errors = {};
    if (!data.orderId.trim()) {
      errors.orderId = 'Order ID is required';
    } else if (!/^\d+$/.test(data.orderId)) {
      errors.orderId = 'Order ID must be a number';
    }

    if (!data.otp.trim()) {
      errors.otp = 'OTP is required';
    } else if (!/^\d{6}$/.test(data.otp)) {
      errors.otp = 'OTP must be a 6-digit number';
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Reset verification result
    setVerificationResult(null);

    // Validate form
    const validation = validateForm(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setIsSubmitting(true);

    try {
      // Call API to verify OTP
      const response = await fetch('/api/delivery/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderId: parseInt(formData.orderId, 10),
          otp: formData.otp,
        }),
      });

      const data = await response.json();

      setVerificationResult({
        success: response.ok,
        message: data.message || (response.ok ? 'Delivery verified successfully!' : 'Verification failed'),
      });

      // Clear form if successful
      if (response.ok) {
        setFormData(prevFormData => ({
          ...prevFormData,
          orderId: '',
          otp: '',
        }));
      }
    } catch (error) {
      setVerificationResult({
        success: false,
        message: 'An error occurred during verification. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="flex justify-center">
            <ClipboardDocumentCheckIcon className="h-16 w-16 text-indigo-600" />
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Delivery Verification
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Enter the order ID and OTP provided by the customer to verify delivery
          </p>
        </div>

        {verificationResult && (
          <div className={`rounded-md p-4 ${verificationResult.success ? 'bg-green-50' : 'bg-red-50'}`}>
            <div className="flex">
              <div className="flex-shrink-0">
                {verificationResult.success ? (
                  <CheckCircleIcon className="h-5 w-5 text-green-400" aria-hidden="true" />
                ) : (
                  <XCircleIcon className="h-5 w-5 text-red-400" aria-hidden="true" />
                )}
              </div>
              <div className="ml-3">
                <p className={`text-sm font-medium ${verificationResult.success ? 'text-green-800' : 'text-red-800'}`}>
                  {verificationResult.message}
                </p>
              </div>
            </div>
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div className="mb-4">
              <label htmlFor="orderId" className="block text-sm font-medium text-gray-700 mb-1">
                Order ID
              </label>
              <div className="relative">
                <input
                  id="orderId"
                  name="orderId"
                  type="text"
                  value={formData.orderId}
                  onChange={handleChange}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                  className={`appearance-none relative block w-full px-3 py-2 border ${
                    errors.orderId ? 'border-red-300' : 'border-gray-300'
                  } placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm`}
                  placeholder="Enter order ID"
                  autoComplete="off"
                />
                {isSearching && (
                  <div className="absolute right-3 top-2">
                    <svg className="animate-spin h-5 w-5 text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  </div>
                )}

                {showSuggestions && suggestions.length > 0 && (
                  <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md border border-gray-300 max-h-60 overflow-auto">
                    <ul className="py-1">
                      {suggestions.map((order) => (
                        <li
                          key={order.id}
                          className="px-4 py-2 hover:bg-indigo-50 cursor-pointer text-sm"
                          onClick={() => handleSelectSuggestion(order.id)}
                        >
                          <div className="flex justify-between items-center">
                            <div>
                              <span className="font-medium">Order #{order.id}</span>
                              <div className="text-xs text-gray-500">
                                Delivery Person: {order.delivery_person_name || 'Unknown'}
                              </div>
                            </div>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              order.courier_status === 'delivered' ? 'bg-green-100 text-green-800' :
                              order.courier_status === 'in_transit' ? 'bg-blue-100 text-blue-800' :
                              'bg-yellow-100 text-yellow-800'
                            }`}>
                              {order.courier_status || order.status}
                            </span>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
              {errors.orderId && (
                <p className="mt-1 text-sm text-red-600">{errors.orderId}</p>
              )}
            </div>

            <div>
              <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-1">
                OTP Code
              </label>
              <input
                id="otp"
                name="otp"
                type="text"
                value={formData.otp}
                onChange={handleChange}
                className={`appearance-none relative block w-full px-3 py-2 border ${
                  errors.otp ? 'border-red-300' : 'border-gray-300'
                } placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm`}
                placeholder="Enter 6-digit OTP"
              />
              {errors.otp && (
                <p className="mt-1 text-sm text-red-600">{errors.otp}</p>
              )}
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Verifying...' : 'Verify Delivery'}
            </button>
          </div>

          <div className="text-center text-sm">
            <Link href="/" className="text-indigo-600 hover:text-indigo-500">
              Back to Home
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
