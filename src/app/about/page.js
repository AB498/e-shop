'use client';

import React from 'react';
import Topbar from '@/components/layout/Topbar';
import Navigation from '@/components/layout/Navigation';
import Footer from '@/components/layout/Footer';
import Copyright from '@/components/layout/Copyright';
import AboutHeader from '@/components/about/AboutHeader';
import AboutIntro from '@/components/about/AboutIntro';
import AboutCEO from '@/components/about/AboutCEO';
import AboutQuote from '@/components/about/AboutQuote';
import NewsletterSection from '@/components/contact/NewsletterSection';

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5]">
      <Topbar />
      <Navigation />

      {/* Header with Breadcrumb */}
      <div className="container mx-auto py-8">
        <AboutHeader />
      </div>

      {/* Additional Content Section */}
      <section className="mt-10">
        <div className="container mx-auto px-4">
          <div className="max-w-[1095px] mx-auto">
            <div className="text-[14px] leading-[1.7] text-[#202435] space-y-6">
              <p>
                In nec purus eget neque accumsan finibus. Duis condimentum elit ut libero commodo iaculis. Donec augue diam, tristique et ultricies nec, consectetur quis enim. Nullam id rutrum ex. Aliquam a lectus id lacus rhoncus dapibus non ac justo. Vivamus lacinia vestibulum metus in dapibus. Vestibulum sit amet sollicitudin enim. Ut id interdum turpis.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-[1200px] mx-auto relative">
        {/* Intro Section */}
        <AboutIntro />

        {/* CEO Section */}
        <AboutCEO />

        {/* Quote Section */}
        <AboutQuote />

        {/* Additional Content Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-[1095px] mx-auto">
              <div className="text-[14px] leading-[1.7] text-[#202435] space-y-6">
                <p>
                  In nec purus eget neque accumsan finibus. Duis condimentum elit ut libero commodo iaculis. Donec augue diam, tristique et ultricies nec, consectetur quis enim. Nullam id rutrum ex. Aliquam a lectus id lacus rhoncus dapibus non ac justo. Vivamus lacinia vestibulum metus in dapibus. Vestibulum sit amet sollicitudin enim. Ut id interdum turpis.
                </p>
                <p>
                  Curabitur porta auctor quam, pretium facilisis nisl. Pellentesque efficitur elit ante, vel vulputate tortor blandit nec.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer with Newsletter */}
      <Footer />
      <Copyright />
    </div>
  );
}
