'use client'
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { validateRegistrationForm } from '@/lib/validation';

const RegisterForm = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phone: '',
    address: '',
    city: 'City',
    postCode: '',
    country: 'Country',
    region: 'Region/State',
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form
    const validation = validateRegistrationForm(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setIsSubmitting(true);
    setServerError('');

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        // Create a more detailed error message
        const errorMessage = data.error || 'Registration failed';
        throw new Error(errorMessage);
      }

      // Redirect to login page on success
      router.push('/auth/login?registered=true');
    } catch (error) {
      setServerError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-[20px] shadow-md border border-[#ECECEC] p-8">
      <h2 className="text-center text-3xl font-bold mb-8">Register</h2>

      {serverError && (
        <div className="bg-red-50 text-red-500 p-4 rounded-md mb-6">
          <p className="font-semibold">Registration Error:</p>
          <p>{serverError}</p>
          <p className="text-sm mt-2">
            Please check your information and try again. If the problem persists, contact support.
          </p>

          {/* Special handling for duplicate key errors */}
          {serverError.includes('duplicate key') && (
            <div className="mt-4 border-t border-red-200 pt-4">
              <p className="font-semibold">Technical Issue:</p>
              <p className="text-sm">
                There appears to be a database sequence issue. Please try one of these solutions:
              </p>
              <ul className="list-disc list-inside text-sm mt-2">
                <li>Try registering with a different email address</li>
                <li>
                  <button
                    onClick={async () => {
                      try {
                        const response = await fetch('/api/dev/reset-sequence', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ table: 'users' }),
                        });
                        if (response.ok) {
                          setServerError('Sequence reset successful. Please try registering again.');
                        }
                      } catch (error) {
                        console.error('Error resetting sequence:', error);
                      }
                    }}
                    className="text-blue-600 underline"
                  >
                    Click here to fix the database sequence
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>
      )}

      <form onSubmit={handleSubmit}>
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
              placeholder="Enter Your email"
              className={`w-full p-3 border ${errors.email ? 'border-red-500' : 'border-[#E9E9E9]'} rounded-md focus:outline-none focus:ring-2 focus:ring-[#3BB77E]`}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-[#444444] mb-2">
              Password*
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter Your password"
              className={`w-full p-3 border ${errors.password ? 'border-red-500' : 'border-[#E9E9E9]'} rounded-md focus:outline-none focus:ring-2 focus:ring-[#3BB77E]`}
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password}</p>
            )}
          </div>

          {/* Phone Number */}
          <div>
            <label htmlFor="phone" className="block text-[#444444] mb-2">
              Phone Number
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Enter Your phone number"
              className={`w-full p-3 border ${errors.phone ? 'border-red-500' : 'border-[#E9E9E9]'} rounded-md focus:outline-none focus:ring-2 focus:ring-[#3BB77E]`}
            />
            {errors.phone && (
              <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
            )}
          </div>

          {/* Address */}
          <div>
            <label htmlFor="address" className="block text-[#444444] mb-2">
              Address
            </label>
            <input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Address"
              className={`w-full p-3 border ${errors.address ? 'border-red-500' : 'border-[#E9E9E9]'} rounded-md focus:outline-none focus:ring-2 focus:ring-[#3BB77E]`}
            />
            {errors.address && (
              <p className="text-red-500 text-sm mt-1">{errors.address}</p>
            )}
          </div>

          {/* City */}
          <div>
            <label htmlFor="city" className="block text-[#444444] mb-2">
              City
            </label>
            <select
              id="city"
              name="city"
              value={formData.city}
              onChange={handleChange}
              className={`w-full p-3 border ${errors.city ? 'border-red-500' : 'border-[#E9E9E9]'} rounded-md focus:outline-none focus:ring-2 focus:ring-[#3BB77E] bg-[#EFEFEF] text-[#777777]`}
            >
              <option value="City" disabled>City</option>
              <option value="Dhaka">Dhaka</option>
              <option value="Chittagong">Chittagong</option>
              <option value="Khulna">Khulna</option>
              <option value="Rajshahi">Rajshahi</option>
              <option value="Sylhet">Sylhet</option>
            </select>
            {errors.city && (
              <p className="text-red-500 text-sm mt-1">{errors.city}</p>
            )}
          </div>

          {/* Post Code */}
          <div>
            <label htmlFor="postCode" className="block text-[#444444] mb-2">
              Post Code
            </label>
            <input
              type="text"
              id="postCode"
              name="postCode"
              value={formData.postCode}
              onChange={handleChange}
              placeholder="Post Code"
              className={`w-full p-3 border ${errors.postCode ? 'border-red-500' : 'border-[#E9E9E9]'} rounded-md focus:outline-none focus:ring-2 focus:ring-[#3BB77E]`}
            />
            {errors.postCode && (
              <p className="text-red-500 text-sm mt-1">{errors.postCode}</p>
            )}
          </div>

          {/* Country */}
          <div>
            <label htmlFor="country" className="block text-[#444444] mb-2">
              Country
            </label>
            <select
              id="country"
              name="country"
              value={formData.country}
              onChange={handleChange}
              className={`w-full p-3 border ${errors.country ? 'border-red-500' : 'border-[#E9E9E9]'} rounded-md focus:outline-none focus:ring-2 focus:ring-[#3BB77E] bg-[#EFEFEF] text-[#777777]`}
            >
              <option value="Country" disabled>Country</option>
              <option value="Bangladesh">Bangladesh</option>
              <option value="Thailand">Thailand</option>
              <option value="India">India</option>
              <option value="Pakistan">Pakistan</option>
              <option value="Nepal">Nepal</option>
            </select>
            {errors.country && (
              <p className="text-red-500 text-sm mt-1">{errors.country}</p>
            )}
          </div>

          {/* Region/State */}
          <div>
            <label htmlFor="region" className="block text-[#444444] mb-2">
              Region/State
            </label>
            <select
              id="region"
              name="region"
              value={formData.region}
              onChange={handleChange}
              className={`w-full p-3 border ${errors.region ? 'border-red-500' : 'border-[#E9E9E9]'} rounded-md focus:outline-none focus:ring-2 focus:ring-[#3BB77E] bg-[#EFEFEF] text-[#777777]`}
            >
              <option value="Region/State" disabled>Region/State</option>
              <option value="Dhaka Division">Dhaka Division</option>
              <option value="Chittagong Division">Chittagong Division</option>
              <option value="Khulna Division">Khulna Division</option>
              <option value="Rajshahi Division">Rajshahi Division</option>
              <option value="Sylhet Division">Sylhet Division</option>
            </select>
            {errors.region && (
              <p className="text-red-500 text-sm mt-1">{errors.region}</p>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <div className="mt-8">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#006B51] text-white font-bold py-3 px-4 rounded-md hover:bg-[#005541] transition-colors disabled:opacity-70"
          >
            {isSubmitting ? 'Signing Up...' : 'Signup'}
          </button>
        </div>

        {/* Login Link */}
        <div className="mt-4 text-center">
          <p className="text-[#777777]">
            Have an account?{' '}
            <Link href="/auth/login" className="text-[#006B51] font-semibold hover:underline">
              Login
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default RegisterForm;
