'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useSession } from 'next-auth/react';
import Topbar from '@/components/layout/Topbar';
import Navigation from '@/components/layout/Navigation';
import Footer from '@/components/layout/Footer';
import Copyright from '@/components/layout/Copyright';
import Image from 'next/image';
import Link from 'next/link';

export default function CheckoutPage() {
  const { cart, cartTotal, clearCart } = useCart();
  const { data: session } = useSession();
  const router = useRouter();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postCode: '',
    country: 'Bangladesh',
    area: '',
    landmark: '',
    specialInstructions: '',
    paymentMethod: 'sslcommerz',
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
    if (session?.user) {
      setFormData(prevData => ({
        ...prevData,
        firstName: session.user.firstName || '',
        lastName: session.user.lastName || '',
        email: session.user.email || '',
      }));
    }
  }, [session]);

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
      'address', 'city', 'postCode', 'country', 'area'
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

    // Area/Zone validation - must be at least 10 characters
    if (formData.area && formData.area.length < 10) {
      newErrors.area = 'Area/Zone must be at least 10 characters long';
    }

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
          area: formData.area,
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
        // Show more detailed error information
        if (data.details) {
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
      <Topbar />
      <Navigation />

      {/* Breadcrumb */}
      <div className="container mx-auto px-4 py-4 border-b border-[#ECECEC]">
        <div className="flex items-center space-x-2">
          <Link href="/" className="text-[#3BB77E] font-semibold text-sm uppercase flex items-center">
            <Image src="/images/breadcrumb/home-icon.svg" alt="Home" width={14} height={14} className="mr-1" />
            Home
          </Link>
          <Image src="/images/breadcrumb/arrow-icon.svg" alt=">" width={3} height={6} className="mx-2" />
          <Link href="/cart" className="text-[#3BB77E] font-semibold text-sm uppercase">
            Cart
          </Link>
          <Image src="/images/breadcrumb/arrow-icon.svg" alt=">" width={3} height={6} className="mx-2" />
          <span className="text-[#7E7E7E] font-semibold text-sm uppercase">Checkout</span>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-[#253D4E] mb-8">Checkout</h1>

        {errors.submit && (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6">
            {errors.submit}
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Checkout Form */}
          <div className="flex-1">
            <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm p-6 border border-[rgba(0,0,0,0.1)]">
              <h2 className="text-xl font-semibold text-[#253D4E] mb-6">Shipping Information</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* First Name */}
                <div>
                  <label htmlFor="firstName" className="block text-[#444444] mb-2">
                    First Name*
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder="Enter Your First Name"
                    className={`w-full p-3 border ${errors.firstName ? 'border-red-500' : 'border-[#E9E9E9]'} rounded-md focus:outline-none focus:ring-2 focus:ring-[#3BB77E]`}
                  />
                  {errors.firstName && (
                    <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>
                  )}
                </div>

                {/* Last Name */}
                <div>
                  <label htmlFor="lastName" className="block text-[#444444] mb-2">
                    Last Name*
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder="Enter Your Last Name"
                    className={`w-full p-3 border ${errors.lastName ? 'border-red-500' : 'border-[#E9E9E9]'} rounded-md focus:outline-none focus:ring-2 focus:ring-[#3BB77E]`}
                  />
                  {errors.lastName && (
                    <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-[#444444] mb-2">
                    Email*
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter Your Email"
                    className={`w-full p-3 border ${errors.email ? 'border-red-500' : 'border-[#E9E9E9]'} rounded-md focus:outline-none focus:ring-2 focus:ring-[#3BB77E]`}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                  )}
                </div>

                {/* Phone */}
                <div>
                  <label htmlFor="phone" className="block text-[#444444] mb-2">
                    Phone*
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Enter Your Phone Number (e.g., 01712345678)"
                    className={`w-full p-3 border ${errors.phone ? 'border-red-500' : 'border-[#E9E9E9]'} rounded-md focus:outline-none focus:ring-2 focus:ring-[#3BB77E]`}
                  />
                  {errors.phone && (
                    <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                  )}
                  {formData.country === 'Bangladesh' && (
                    <p className="text-gray-500 text-xs mt-1">For Bangladesh, please enter a number starting with 01 (e.g., 01712345678)</p>
                  )}
                </div>

                {/* Address */}
                <div className="md:col-span-2">
                  <label htmlFor="address" className="block text-[#444444] mb-2">
                    Address*
                  </label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Enter Your Address"
                    className={`w-full p-3 border ${errors.address ? 'border-red-500' : 'border-[#E9E9E9]'} rounded-md focus:outline-none focus:ring-2 focus:ring-[#3BB77E]`}
                  />
                  {errors.address && (
                    <p className="text-red-500 text-sm mt-1">{errors.address}</p>
                  )}
                </div>

                {/* City */}
                <div>
                  <label htmlFor="city" className="block text-[#444444] mb-2">
                    City*
                  </label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="Enter Your City"
                    className={`w-full p-3 border ${errors.city ? 'border-red-500' : 'border-[#E9E9E9]'} rounded-md focus:outline-none focus:ring-2 focus:ring-[#3BB77E]`}
                  />
                  {errors.city && (
                    <p className="text-red-500 text-sm mt-1">{errors.city}</p>
                  )}
                </div>

                {/* Post Code */}
                <div>
                  <label htmlFor="postCode" className="block text-[#444444] mb-2">
                    Post Code*
                  </label>
                  <input
                    type="text"
                    id="postCode"
                    name="postCode"
                    value={formData.postCode}
                    onChange={handleChange}
                    placeholder="Enter Your Post Code"
                    className={`w-full p-3 border ${errors.postCode ? 'border-red-500' : 'border-[#E9E9E9]'} rounded-md focus:outline-none focus:ring-2 focus:ring-[#3BB77E]`}
                  />
                  {errors.postCode && (
                    <p className="text-red-500 text-sm mt-1">{errors.postCode}</p>
                  )}
                </div>

                {/* Country */}
                <div>
                  <label htmlFor="country" className="block text-[#444444] mb-2">
                    Country*
                  </label>
                  <select
                    id="country"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    className={`w-full p-3 border ${errors.country ? 'border-red-500' : 'border-[#E9E9E9]'} rounded-md focus:outline-none focus:ring-2 focus:ring-[#3BB77E]`}
                  >
                    <option value="Bangladesh">Bangladesh</option>
                    <option value="Thailand">Thailand</option>
                    <option value="India">India</option>
                    <option value="Other">Other</option>
                  </select>
                  {errors.country && (
                    <p className="text-red-500 text-sm mt-1">{errors.country}</p>
                  )}
                </div>

                {/* Area */}
                <div>
                  <label htmlFor="area" className="block text-[#444444] mb-2">
                    Area/Zone*
                  </label>
                  <input
                    type="text"
                    id="area"
                    name="area"
                    value={formData.area}
                    onChange={handleChange}
                    placeholder="Enter Your Area or Zone (min 10 characters)"
                    className={`w-full p-3 border ${errors.area ? 'border-red-500' : 'border-[#E9E9E9]'} rounded-md focus:outline-none focus:ring-2 focus:ring-[#3BB77E]`}
                  />
                  {errors.area && (
                    <p className="text-red-500 text-sm mt-1">{errors.area}</p>
                  )}
                  <p className="text-gray-500 text-xs mt-1">Please provide a detailed area description with at least 10 characters for accurate delivery.</p>
                </div>

                {/* Landmark */}
                <div>
                  <label htmlFor="landmark" className="block text-[#444444] mb-2">
                    Landmark (Optional)
                  </label>
                  <input
                    type="text"
                    id="landmark"
                    name="landmark"
                    value={formData.landmark}
                    onChange={handleChange}
                    placeholder="Nearby landmark for easier delivery"
                    className="w-full p-3 border border-[#E9E9E9] rounded-md focus:outline-none focus:ring-2 focus:ring-[#3BB77E]"
                  />
                </div>

                {/* Special Instructions */}
                <div className="md:col-span-2">
                  <label htmlFor="specialInstructions" className="block text-[#444444] mb-2">
                    Special Instructions (Optional)
                  </label>
                  <textarea
                    id="specialInstructions"
                    name="specialInstructions"
                    value={formData.specialInstructions}
                    onChange={handleChange}
                    placeholder="Any special instructions for delivery"
                    rows="3"
                    className="w-full p-3 border border-[#E9E9E9] rounded-md focus:outline-none focus:ring-2 focus:ring-[#3BB77E]"
                  ></textarea>
                </div>
              </div>

              <div className="mt-8">
                <h2 className="text-xl font-semibold text-[#253D4E] mb-6">Payment Method</h2>

                <div className="space-y-4">
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="sslcommerz"
                      name="paymentMethod"
                      value="sslcommerz"
                      checked={formData.paymentMethod === 'sslcommerz'}
                      onChange={handleChange}
                      className="h-5 w-5 text-[#3BB77E] focus:ring-[#3BB77E]"
                    />
                    <label htmlFor="sslcommerz" className="ml-3 block text-[#444444]">
                      <div className="flex items-center">
                        <span className="font-medium">SSL Commerz</span>
                        <div className="ml-4 flex space-x-2">
                          <img src="/images/footer/payment-1.png" alt="Visa" className="h-6" />
                          <img src="/images/footer/payment-2.png" alt="Mastercard" className="h-6" />
                          <img src="/images/footer/payment-3.png" alt="American Express" className="h-6" />
                          <img src="/images/footer/payment-4.png" alt="Other Cards" className="h-6" />
                        </div>
                      </div>
                      <p className="text-sm text-[#7E7E7E] mt-1">
                        Pay securely with credit/debit card, mobile banking, or internet banking through SSL Commerz.
                      </p>
                    </label>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full bg-[#006B51] text-white font-semibold py-4 rounded-full flex items-center justify-center ${isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:bg-[#005541] transition-colors'}`}
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </>
                  ) : (
                    <>
                      Place Order & Pay
                      <Image
                        src="/images/cart/arrow-right-icon.svg"
                        alt="Checkout"
                        width={16}
                        height={16}
                        className="ml-2"
                      />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:w-1/3">
            <div className="bg-white rounded-lg shadow-sm p-6 border border-[rgba(0,0,0,0.1)]">
              <h2 className="text-xl font-semibold text-[#253D4E] mb-6">Order Summary</h2>

              <div className="space-y-4 mb-6">
                {cart.map((item) => (
                  <div key={item.id} className="flex items-start gap-3">
                    <div className="w-16 h-16 bg-[#F0EEED] rounded-lg flex items-center justify-center flex-shrink-0">
                      <Image
                        src={item.image || "/images/product-image.png"}
                        alt={item.name}
                        width={50}
                        height={50}
                        className="object-contain"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-[#253D4E] font-medium">{item.name}</h3>
                      <p className="text-[#7E7E7E] text-sm">{item.quantity} × ৳{parseFloat(item.price).toFixed(2)}</p>
                    </div>
                    <div className="text-[#3BB77E] font-semibold">
                      ৳{(parseFloat(item.price) * item.quantity).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-[#ECECEC] pt-4 space-y-3">
                <div className="flex justify-between">
                  <span className="text-[#7E7E7E]">Subtotal</span>
                  <span className="text-[#253D4E] font-semibold">৳{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#7E7E7E]">Discount (20%)</span>
                  <span className="text-[#3BB77E] font-semibold">-৳{discountAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#7E7E7E]">Delivery Fee</span>
                  <span className="text-[#253D4E] font-semibold">৳{deliveryFee.toFixed(2)}</span>
                </div>
              </div>

              <div className="border-t border-[#ECECEC] mt-4 pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-[#253D4E] font-semibold">Total</span>
                  <span className="text-[#3BB77E] font-bold text-xl">৳{total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
      <Copyright />
    </div>
  );
}
