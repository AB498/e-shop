'use client'

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import Navigation from '@/components/layout/Navigation';
import Footer from '@/components/layout/Footer';
import Copyright from '@/components/layout/Copyright';

export default function CheckoutClient({ sslcommerzEnabled }) {
  const { cart, cartTotal, clearCart } = useCart();
  const { data: session } = useSession();
  const router = useRouter();
  console.log('SSLCommerz Enabled in client component:', sslcommerzEnabled);

  // Initialize state with the server-provided value
  const [sslcommerzEnabledState, setSslcommerzEnabled] = useState(sslcommerzEnabled);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postCode: '',
    country: 'Bangladesh',
    landmark: '',
    specialInstructions: '',
    paymentMethod: sslcommerzEnabled ? 'sslcommerz' : 'cod', // Set default payment method based on SSLCommerz availability
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Calculate summary values
  const subtotal = cartTotal;
  const discountRate = 0.2; // 20% discount
  const discountAmount = subtotal * discountRate;
  const deliveryFee = 15;
  const total = subtotal - discountAmount + deliveryFee;

  // Populate form with user data if logged in
  useEffect(() => {
    const fetchUserData = async () => {
      if (session?.user?.id) {
        try {
          // Fetch complete user data including address information
          const response = await fetch(`/api/user/profile`);
          if (response.ok) {
            const userData = await response.json();
            setFormData(prevData => ({
              ...prevData,
              firstName: userData.firstName || session.user.firstName || '',
              lastName: userData.lastName || session.user.lastName || '',
              email: userData.email || session.user.email || '',
              phone: userData.phone || '',
              address: userData.address || '',
              city: userData.city || '',
              postCode: userData.postCode || '',
              country: userData.country || 'Bangladesh',
            }));
          } else {
            // Fallback to session data if API fails
            setFormData(prevData => ({
              ...prevData,
              firstName: session.user.firstName || '',
              lastName: session.user.lastName || '',
              email: session.user.email || '',
            }));
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
          // Fallback to session data if API fails
          setFormData(prevData => ({
            ...prevData,
            firstName: session.user.firstName || '',
            lastName: session.user.lastName || '',
            email: session.user.email || '',
          }));
        }
      }
    };

    fetchUserData();
  }, [session]);

  // No need to fetch SSLCommerz setting as it's provided by the server
  // Just update payment method if SSLCommerz is disabled
  useEffect(() => {
    if (!sslcommerzEnabled && formData.paymentMethod === 'sslcommerz') {
      setFormData(prev => ({
        ...prev,
        paymentMethod: 'cod'
      }));
    }
  }, [sslcommerzEnabled, formData.paymentMethod]);

  // Redirect if cart is empty
  useEffect(() => {
    // Only redirect if cart is empty and we're not in the middle of processing
    if (cart.length === 0 && !isProcessing) {
      // Add a small delay to avoid potential race conditions
      const redirectTimer = setTimeout(() => {
        router.push('/cart');
      }, 100);

      return () => clearTimeout(redirectTimer);
    }
  }, [cart.length, router, isProcessing]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Required fields
    const requiredFields = [
      'firstName', 'lastName', 'email', 'phone',
      'address', 'city', 'postCode', 'country'
    ];

    requiredFields.forEach(field => {
      if (!formData[field]) {
        newErrors[field] = `${field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, ' $1')} is required`;
      }
    });

    // Email validation
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Phone validation for Bangladesh format (01XXXXXXXXX)
    const phoneDigits = formData.phone.replace(/[^0-9]/g, '');
    if (formData.phone) {
      // For Bangladesh, phone should start with 01 and be 11 digits
      if (formData.country === 'Bangladesh' && (!/^01\d{9}$/.test(phoneDigits) && !/^8801\d{9}$/.test(phoneDigits) && !/^\+8801\d{9}$/.test(formData.phone))) {
        newErrors.phone = 'Please enter a valid Bangladesh phone number (e.g., 01XXXXXXXXX)';
      } else if (!/^\d{10,15}$/.test(phoneDigits)) {
        newErrors.phone = 'Please enter a valid phone number';
      }
    }

    // Address validation - must be at least 10 characters for delivery purposes
    if (formData.address && formData.address.length < 10) {
      newErrors.address = 'Address must be at least 10 characters long for accurate delivery';
    }

    // Set area field to match address for zone information
    formData.area = formData.address;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setIsProcessing(true);

    try {
      // Ensure area is set to address value
      formData.area = formData.address;

      // Prepare order data
      const orderData = {
        customer: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          postCode: formData.postCode,
          country: formData.country,
          area: formData.address, // Use address as area/zone
          landmark: formData.landmark,
          specialInstructions: formData.specialInstructions,
        },
        items: cart.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
        })),
        payment: {
          subtotal,
          discount: discountAmount,
          deliveryFee,
          total,
          method: formData.paymentMethod,
        }
      };

      // Initialize payment
      console.log('Initializing payment with order data:', orderData);

      const response = await fetch('/api/payment/initialize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      const data = await response.json();
      console.log('Payment initialization response:', data);

      if (!response.ok) {
        // Check if this is a SSLCommerz disabled error
        if (data.code === 'SSLCOMMERZ_DISABLED') {
          console.error('SSLCommerz is disabled:', data.error);
          // Update the UI to show only COD option
          setSslcommerzEnabled(false);
          setFormData(prev => ({
            ...prev,
            paymentMethod: 'cod'
          }));
          // Resubmit the form with COD payment method
          setTimeout(() => {
            handleSubmit(new Event('submit'));
          }, 100);
          throw new Error('Online payment is currently unavailable. Switching to Cash on Delivery.');
        }
        // Show more detailed error information
        else if (data.details) {
          console.error('Payment initialization error details:', data.details);
          throw new Error(`${data.error}: ${data.details}`);
        } else {
          throw new Error(data.error || 'Failed to initialize payment');
        }
      }

      // Clear the cart immediately after successful order creation
      console.log('Order created successfully, clearing cart');
      clearCart();

      // Redirect to payment gateway
      if (data.redirectUrl) {
        console.log('Redirecting to payment gateway:', data.redirectUrl);

        // Add a small delay before redirecting to ensure logs are sent
        setTimeout(() => {
          window.location.href = data.redirectUrl;
        }, 500);
      } else {
        throw new Error('No redirect URL received from payment gateway');
      }

    } catch (error) {
      console.error('Payment initialization error:', error);

      // Show a more user-friendly error message
      let errorMessage = error.message || 'Failed to process payment. Please try again.';

      // Check for specific error types and provide more helpful messages
      if (errorMessage.includes('duplicate key') || errorMessage.includes('sequence issue')) {
        errorMessage = 'There was a technical issue with your order. Please try again in a few moments.';
      } else if (errorMessage.includes('validation')) {
        errorMessage = 'Your payment information could not be validated. Please check your details and try again.';
      }

      setErrors(prev => ({
        ...prev,
        submit: errorMessage
      }));

      setIsProcessing(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (cart.length === 0 && !isProcessing) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen flex flex-col">

      {/* Breadcrumb */}
      <div className="container mx-auto px-3 py-2 border-b border-[#ECECEC]">
        <div className="flex items-center space-x-1">
          <Link href="/" className="text-[#3BB77E] font-semibold text-xs uppercase flex items-center">
            <Image src="/images/breadcrumb/home-icon.svg" alt="Home" width={12} height={12} className="mr-1" />
            Home
          </Link>
          <Image src="/images/breadcrumb/arrow-icon.svg" alt=">" width={3} height={6} className="mx-1" />
          <Link href="/cart" className="text-[#3BB77E] font-semibold text-xs uppercase">
            Cart
          </Link>
          <Image src="/images/breadcrumb/arrow-icon.svg" alt=">" width={3} height={6} className="mx-1" />
          <span className="text-[#7E7E7E] font-semibold text-xs uppercase">Checkout</span>
        </div>
      </div>

      <div className="container mx-auto px-3 py-5">
        <h1 className="text-2xl font-bold text-[#253D4E] mb-4">Checkout</h1>

        {errors.submit && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm">
            {errors.submit}
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-4">
          {/* Checkout Form */}
          <div className="flex-1">
            <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm p-4 border border-[rgba(0,0,0,0.1)]">
              <h2 className="text-lg font-semibold text-[#253D4E] mb-3">Shipping Information</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* First Name */}
                <div>
                  <label htmlFor="firstName" className="block text-[#444444] text-sm mb-1">
                    First Name*
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder="Enter Your First Name"
                    className={`w-full p-2 text-sm border ${errors.firstName ? 'border-red-500' : 'border-[#E9E9E9]'} rounded-md focus:outline-none focus:ring-1 focus:ring-[#3BB77E]`}
                  />
                  {errors.firstName && (
                    <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>
                  )}
                </div>

                {/* Last Name */}
                <div>
                  <label htmlFor="lastName" className="block text-[#444444] text-sm mb-1">
                    Last Name*
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder="Enter Your Last Name"
                    className={`w-full p-2 text-sm border ${errors.lastName ? 'border-red-500' : 'border-[#E9E9E9]'} rounded-md focus:outline-none focus:ring-1 focus:ring-[#3BB77E]`}
                  />
                  {errors.lastName && (
                    <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-[#444444] text-sm mb-1">
                    Email*
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter Your Email"
                    className={`w-full p-2 text-sm border ${errors.email ? 'border-red-500' : 'border-[#E9E9E9]'} rounded-md focus:outline-none focus:ring-1 focus:ring-[#3BB77E]`}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                  )}
                </div>

                {/* Phone */}
                <div>
                  <label htmlFor="phone" className="block text-[#444444] text-sm mb-1">
                    Phone*
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Enter Your Phone Number (e.g., 01712345678)"
                    className={`w-full p-2 text-sm border ${errors.phone ? 'border-red-500' : 'border-[#E9E9E9]'} rounded-md focus:outline-none focus:ring-1 focus:ring-[#3BB77E]`}
                  />
                  {errors.phone && (
                    <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
                  )}
                  {formData.country === 'Bangladesh' && (
                    <p className="text-gray-500 text-xs mt-1">For Bangladesh, please enter a number starting with 01 (e.g., 01712345678)</p>
                  )}
                </div>

                {/* Address */}
                <div className="md:col-span-2">
                  <label htmlFor="address" className="block text-[#444444] text-sm mb-1">
                    Address* (Will be used as delivery zone)
                  </label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Enter Your Full Address (min 10 characters)"
                    className={`w-full p-2 text-sm border ${errors.address ? 'border-red-500' : 'border-[#E9E9E9]'} rounded-md focus:outline-none focus:ring-1 focus:ring-[#3BB77E]`}
                  />
                  {errors.address && (
                    <p className="text-red-500 text-xs mt-1">{errors.address}</p>
                  )}
                  <p className="text-gray-500 text-xs mt-1">Please provide a detailed address with at least 10 characters for accurate delivery. This will also be used as your delivery zone.</p>
                </div>

                {/* City */}
                <div>
                  <label htmlFor="city" className="block text-[#444444] text-sm mb-1">
                    City*
                  </label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="Enter Your City"
                    className={`w-full p-2 text-sm border ${errors.city ? 'border-red-500' : 'border-[#E9E9E9]'} rounded-md focus:outline-none focus:ring-1 focus:ring-[#3BB77E]`}
                  />
                  {errors.city && (
                    <p className="text-red-500 text-xs mt-1">{errors.city}</p>
                  )}
                </div>

                {/* Post Code */}
                <div>
                  <label htmlFor="postCode" className="block text-[#444444] text-sm mb-1">
                    Post Code*
                  </label>
                  <input
                    type="text"
                    id="postCode"
                    name="postCode"
                    value={formData.postCode}
                    onChange={handleChange}
                    placeholder="Enter Your Post Code"
                    className={`w-full p-2 text-sm border ${errors.postCode ? 'border-red-500' : 'border-[#E9E9E9]'} rounded-md focus:outline-none focus:ring-1 focus:ring-[#3BB77E]`}
                  />
                  {errors.postCode && (
                    <p className="text-red-500 text-xs mt-1">{errors.postCode}</p>
                  )}
                </div>

                {/* Country */}
                <div>
                  <label htmlFor="country" className="block text-[#444444] text-sm mb-1">
                    Country*
                  </label>
                  <select
                    id="country"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    className={`w-full p-2 text-sm border ${errors.country ? 'border-red-500' : 'border-[#E9E9E9]'} rounded-md focus:outline-none focus:ring-1 focus:ring-[#3BB77E]`}
                  >
                    <option value="Bangladesh">Bangladesh</option>
                    <option value="Thailand">Thailand</option>
                    <option value="India">India</option>
                    <option value="Other">Other</option>
                  </select>
                  {errors.country && (
                    <p className="text-red-500 text-xs mt-1">{errors.country}</p>
                  )}
                </div>



                {/* Landmark */}
                <div>
                  <label htmlFor="landmark" className="block text-[#444444] text-sm mb-1">
                    Landmark (Optional)
                  </label>
                  <input
                    type="text"
                    id="landmark"
                    name="landmark"
                    value={formData.landmark}
                    onChange={handleChange}
                    placeholder="Nearby landmark for easier delivery"
                    className="w-full p-2 text-sm border border-[#E9E9E9] rounded-md focus:outline-none focus:ring-1 focus:ring-[#3BB77E]"
                  />
                </div>

                {/* Special Instructions */}
                <div className="md:col-span-2">
                  <label htmlFor="specialInstructions" className="block text-[#444444] text-sm mb-1">
                    Special Instructions (Optional)
                  </label>
                  <textarea
                    id="specialInstructions"
                    name="specialInstructions"
                    value={formData.specialInstructions}
                    onChange={handleChange}
                    placeholder="Any special instructions for delivery"
                    rows="2"
                    className="w-full p-2 text-sm border border-[#E9E9E9] rounded-md focus:outline-none focus:ring-1 focus:ring-[#3BB77E]"
                  ></textarea>
                </div>
              </div>

              <div className="mt-5">
                <h2 className="text-lg font-semibold text-[#253D4E] mb-3">Payment Method</h2>

                <div className="space-y-3">
                  {sslcommerzEnabledState && (
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="sslcommerz"
                        name="paymentMethod"
                        value="sslcommerz"
                        checked={formData.paymentMethod === 'sslcommerz'}
                        onChange={handleChange}
                        className="h-4 w-4 text-[#3BB77E] focus:ring-[#3BB77E]"
                      />
                      <label htmlFor="sslcommerz" className="ml-2 block text-[#444444]">
                        <div className="flex items-center">
                          <span className="font-medium text-sm">SSL Commerz</span>
                          <div className="ml-3 flex space-x-1">
                            <img src="/images/footer/payment-1.png" alt="Visa" className="h-5" />
                            <img src="/images/footer/payment-2.png" alt="Mastercard" className="h-5" />
                            <img src="/images/footer/payment-3.png" alt="American Express" className="h-5" />
                            <img src="/images/footer/payment-4.png" alt="Other Cards" className="h-5" />
                          </div>
                        </div>
                        <p className="text-xs text-[#7E7E7E] mt-1">
                          Pay securely with credit/debit card, mobile banking, or internet banking through SSL Commerz.
                        </p>
                      </label>
                    </div>
                  )}

                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="cod"
                      name="paymentMethod"
                      value="cod"
                      checked={formData.paymentMethod === 'cod'}
                      onChange={handleChange}
                      className="h-4 w-4 text-[#3BB77E] focus:ring-[#3BB77E]"
                    />
                    <label htmlFor="cod" className="ml-2 block text-[#444444]">
                      <div className="flex items-center">
                        <span className="font-medium text-sm">Cash on Delivery</span>
                        <div className="ml-3 flex space-x-1">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#3BB77E]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2z" />
                          </svg>
                        </div>
                      </div>
                      <p className="text-xs text-[#7E7E7E] mt-1">
                        Pay with cash when your order is delivered. Available for all areas served by our delivery partners.
                      </p>
                    </label>
                  </div>
                </div>
              </div>

              <div className="mt-5 flex flex-col items-start ">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`px-6 py-2 bg-[#006B51] text-white font-medium py-3 text-sm rounded-full flex items-center justify-center ${isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:bg-[#005541] transition-colors'}`}
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </>
                  ) : (
                    <>
                      {formData.paymentMethod === 'cod' ? 'Place Order' : 'Place Order & Pay'}
                      <Image
                        src="/images/cart/arrow-right-icon.svg"
                        alt="Checkout"
                        width={14}
                        height={14}
                        className="ml-2"
                      />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:w-1/4">
            <div className="bg-white rounded-lg shadow-sm p-3 border border-[rgba(0,0,0,0.1)]">
              <h2 className="text-base font-semibold text-[#253D4E] mb-2">Order Summary</h2>

              <div className="space-y-2 mb-3">
                {cart.map((item) => (
                  <div key={item.id} className="flex items-center gap-1.5">
                    <div className="relative overflow-hidden w-10 h-10 bg-[#F0EEED] rounded flex items-center justify-center flex-shrink-0">
                      <Image
                        src={item.image || "/images/product-image.png"}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-[#253D4E] font-medium text-xs truncate">{item.name}</h3>
                      <p className="text-[#7E7E7E] text-xs">{item.quantity} × ৳{parseFloat(item.price).toFixed(2)}</p>
                    </div>
                    <div className="text-[#3BB77E] font-medium text-xs whitespace-nowrap">
                      ৳{(parseFloat(item.price) * item.quantity).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-[#ECECEC] pt-2 space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-[#7E7E7E] text-xs">Subtotal</span>
                  <span className="text-[#253D4E] font-medium text-xs">৳{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#7E7E7E] text-xs">Discount (20%)</span>
                  <span className="text-[#3BB77E] font-medium text-xs">-৳{discountAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#7E7E7E] text-xs">Delivery Fee</span>
                  <span className="text-[#253D4E] font-medium text-xs">৳{deliveryFee.toFixed(2)}</span>
                </div>
              </div>

              <div className="border-t border-[#ECECEC] mt-2 pt-2">
                <div className="flex justify-between items-center">
                  <span className="text-[#253D4E] font-medium text-xs">Total</span>
                  <span className="text-[#3BB77E] font-bold text-base">৳{total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
