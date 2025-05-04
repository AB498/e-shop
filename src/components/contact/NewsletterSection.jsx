'use client';

import React, { useState } from 'react';

const NewsletterSection = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!email) {
      setError('Email is required');
      return;
    }
    
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email address');
      return;
    }
    
    setError('');
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitSuccess(true);
      setEmail('');
      
      // Reset success message after 5 seconds
      setTimeout(() => {
        setSubmitSuccess(false);
      }, 5000);
    }, 1500);
  };

  return (
    <div className="bg-[#115343] rounded-[20px] p-6 mb-8">
      <h3 className="text-[15px] font-bold text-white uppercase mb-2">newsletter sign in</h3>
      <p className="text-[14px] text-white mb-4">
        Stay connected with Thai Bangla Store and never miss an update!
      </p>
      
      {submitSuccess && (
        <div className="bg-green-50 text-green-700 p-2 rounded-md mb-4 text-sm">
          Thank you for subscribing to our newsletter!
        </div>
      )}
      
      {error && (
        <div className="bg-red-50 text-red-700 p-2 rounded-md mb-4 text-sm">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
        <div className="flex-grow">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your email here..."
            className="w-full h-10 px-4 rounded-[20px] bg-[#115343] text-[#25AA8A] border border-[#115343] focus:outline-none"
          />
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-[#BC0000] text-white font-bold py-2 px-6 rounded-[20px] hover:bg-[#a00000] transition-colors"
        >
          {isSubmitting ? 'SUBSCRIBING...' : 'SUBSCRIBE'}
        </button>
      </form>
    </div>
  );
};

export default NewsletterSection;
