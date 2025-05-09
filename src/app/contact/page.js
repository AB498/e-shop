'use client';

import React from 'react';

import Navigation from '@/components/layout/Navigation';
import Footer from '@/components/layout/Footer';
import Copyright from '@/components/layout/Copyright';
import ContactHeader from '@/components/contact/ContactHeader';
import ContactIntro from '@/components/contact/ContactIntro';
import ContactInfoCards from '@/components/contact/ContactInfoCards';
import ContactForm from '@/components/contact/ContactForm';
import NewsletterSection from '@/components/contact/NewsletterSection';

export default function ContactPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5]">
      <Navigation />

      {/* Header with Breadcrumb */}
      <div className="container mx-auto py-16">
        <ContactHeader />
      </div>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto">
        {/* Intro Section */}
        <ContactIntro />

        {/* Contact Info Cards */}
        <ContactInfoCards />

        {/* Contact Form */}
        <ContactForm />
      </main>

      {/* Footer with Newsletter */}
      <div className="bg-[url('/images/footer/footer-bg.png')] bg-cover bg-center py-12">
        <div className="container mx-auto px-4">
          <NewsletterSection />
          <Footer />
        </div>
        <Copyright />
      </div>
    </div>
  );
}
