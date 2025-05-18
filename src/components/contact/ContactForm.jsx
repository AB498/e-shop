'use client';

import React, { useState } from 'react';
import ResponsiveContainer from '@/components/ui/ResponsiveContainer';
import ResponsiveText from '@/components/ui/ResponsiveText';

const ContactForm = ({ orderId }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

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
    const requiredFields = ['name', 'email', 'message'];

    requiredFields.forEach(field => {
      if (!formData[field]) {
        newErrors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
      }
    });

    // Email validation
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
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

    try {
      // Submit form data to API
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send message');
      }

      // Reset form on success
      setFormData({
        name: '',
        email: '',
        phone: '',
        message: '',
      });

      setSubmitSuccess(true);

      // Reset success message after 5 seconds
      setTimeout(() => {
        setSubmitSuccess(false);
      }, 5000);
    } catch (error) {
      console.error('Error submitting contact form:', error);
      setErrors(prev => ({
        ...prev,
        form: error.message || 'Failed to send message. Please try again later.'
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-8 md:py-10 lg:py-12">
      <ResponsiveContainer>
        <div className="bg-white border border-[#EDEEF5] rounded-[7px] shadow-[0px_0px_40px_0px_rgba(0,0,0,0.06)] py-6 sm:py-7 md:py-8 lg:py-[60px] px-4 sm:px-5 md:px-8 lg:px-[120px]">
          <div className="border-b border-[#EDEEF5] pb-6 sm:pb-7 md:pb-8 lg:pb-10 mb-6 sm:mb-7 md:mb-8 lg:mb-10">
            <ResponsiveText
              as="h2"
              className="text-2xl md:text-3xl lg:text-[36px] font-normal text-[#202435] mb-2 text-center leading-[1.2]"
            >
              Send Us
            </ResponsiveText>
            <p className="text-sm md:text-[14px] leading-[1.7] text-[#202435] text-center max-w-[680px] mx-auto">
              Contact us for all your questions and opinions, or you can solve your problems in a shorter time with our contact offices.
            </p>
          </div>

          {submitSuccess && (
            <div className="bg-green-50 text-green-700 p-4 rounded-md mb-6">
              Your message has been sent successfully. We'll get back to you soon!
            </div>
          )}

          {errors.form && (
            <div className="bg-red-50 text-red-700 p-4 rounded-md mb-6">
              {errors.form}
            </div>
          )}

          <form onSubmit={handleSubmit} className="max-w-[760px] mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              {/* Name */}
              <div className="mb-4">
                <label htmlFor="name" className="block text-xs md:text-[13px] text-[#202435] mb-2 font-normal leading-[1.5]">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full py-3 md:py-[13.5px] px-3 md:px-4 bg-[#F3F4F7] rounded-[4px] focus:outline-none text-sm ${errors.name ? 'border border-red-500' : ''}`}
                />
                {errors.name && (
                  <p className="text-red-500 text-xs md:text-sm mt-1">{errors.name}</p>
                )}
              </div>

              {/* Email */}
              <div className="mb-4">
                <label htmlFor="email" className="block text-xs md:text-[13px] text-[#202435] mb-2 font-normal leading-[1.5]">
                  Email *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full py-3 md:py-[13.5px] px-3 md:px-4 bg-[#F3F4F7] rounded-[4px] focus:outline-none text-sm ${errors.email ? 'border border-red-500' : ''}`}
                />
                {errors.email && (
                  <p className="text-red-500 text-xs md:text-sm mt-1">{errors.email}</p>
                )}
              </div>
            </div>

            {/* Phone */}
            <div className="mb-4">
              <label htmlFor="phone" className="block text-xs md:text-[13px] text-[#202435] mb-2 font-normal leading-[1.5]">
                Phone number
              </label>
              <input
                type="text"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full py-3 md:py-[13.5px] px-3 md:px-4 bg-[#F3F4F7] rounded-[4px] focus:outline-none text-sm"
              />
            </div>

            {/* Message */}
            <div className="mb-6">
              <label htmlFor="message" className="block text-xs md:text-[13px] text-[#202435] mb-2 font-normal leading-[1.5]">
                Your message
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={6}
                className={`w-full py-3 md:py-4 px-3 md:px-4 bg-[#F3F4F7] rounded-[4px] focus:outline-none text-sm ${errors.message ? 'border border-red-500' : ''}`}
              ></textarea>
              {errors.message && (
                <p className="text-red-500 text-xs md:text-sm mt-1">{errors.message}</p>
              )}
            </div>

            <div className="text-center">
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-[#006B51] text-white font-medium text-xs md:text-[13px] py-3 md:py-[13px] px-6 md:px-9 rounded-[50px] hover:bg-[#005541] transition-colors"
              >
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </button>
            </div>
          </form>
        </div>
      </ResponsiveContainer>
    </section>
  );
};

export default ContactForm;
