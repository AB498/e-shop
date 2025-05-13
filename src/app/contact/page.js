'use client';

import React from 'react';
import Footer from '@/components/layout/Footer';
import Copyright from '@/components/layout/Copyright';
import ContactHeader from '@/components/contact/ContactHeader';
import ContactIntro from '@/components/contact/ContactIntro';
import ContactInfoCards from '@/components/contact/ContactInfoCards';
import ContactForm from '@/components/contact/ContactForm';
import ResponsiveContainer from '@/components/ui/ResponsiveContainer';

export default function ContactPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5]">
      {/* Header with Breadcrumb */}
      <div className="container mx-auto py-4 sm:py-5 md:py-6 px-4 sm:px-5 md:px-6">
        <ContactHeader />
      </div>

      {/* Main Content */}
      <main className="w-full max-w-5xl mx-auto px-4 sm:px-5 md:px-6">
        {/* Intro Section */}
        <ContactIntro />

        {/* Contact Info Cards */}
        <ContactInfoCards />

        {/* Contact Form */}
        <ContactForm />
      </main>
    </div>
  );
}
