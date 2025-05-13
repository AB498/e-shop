'use client';

import React from 'react';
import Footer from '@/components/layout/Footer';
import Copyright from '@/components/layout/Copyright';
import AboutHeader from '@/components/about/AboutHeader';
import AboutIntro from '@/components/about/AboutIntro';
import AboutCEO from '@/components/about/AboutCEO';
import AboutQuote from '@/components/about/AboutQuote';
import ResponsiveContainer from '@/components/ui/ResponsiveContainer';

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5]">
      {/* Header with Breadcrumb */}
      <div className="container mx-auto py-4 sm:py-6 md:py-8 px-4 sm:px-6 md:px-8">
        <AboutHeader />
      </div>

      {/* Additional Content Section */}
      <section className="mt-4 sm:mt-6 md:mt-10">
        <ResponsiveContainer>
          <div className="max-w-[1095px] mx-auto">
            <div className="text-sm md:text-[14px] leading-[1.7] text-[#202435] space-y-4 md:space-y-6">
              <p>
                In nec purus eget neque accumsan finibus. Duis condimentum elit ut libero commodo iaculis. Donec augue diam, tristique et ultricies nec, consectetur quis enim. Nullam id rutrum ex. Aliquam a lectus id lacus rhoncus dapibus non ac justo. Vivamus lacinia vestibulum metus in dapibus. Vestibulum sit amet sollicitudin enim. Ut id interdum turpis.
              </p>
            </div>
          </div>
        </ResponsiveContainer>
      </section>

      {/* Main Content */}
      <main className="w-full max-w-[1200px] mx-auto relative px-4 sm:px-6 md:px-8">
        {/* Intro Section */}
        <AboutIntro />

        {/* CEO Section */}
        <AboutCEO />

        {/* Quote Section */}
        <AboutQuote />

        {/* Additional Content Section */}
        <section className="py-8 md:py-12 lg:py-16">
          <ResponsiveContainer>
            <div className="max-w-[1095px] mx-auto">
              <div className="text-sm md:text-[14px] leading-[1.7] text-[#202435] space-y-4 md:space-y-6">
                <p>
                  In nec purus eget neque accumsan finibus. Duis condimentum elit ut libero commodo iaculis. Donec augue diam, tristique et ultricies nec, consectetur quis enim. Nullam id rutrum ex. Aliquam a lectus id lacus rhoncus dapibus non ac justo. Vivamus lacinia vestibulum metus in dapibus. Vestibulum sit amet sollicitudin enim. Ut id interdum turpis.
                </p>
                <p>
                  Curabitur porta auctor quam, pretium facilisis nisl. Pellentesque efficitur elit ante, vel vulputate tortor blandit nec.
                </p>
              </div>
            </div>
          </ResponsiveContainer>
        </section>
      </main>

      {/* Footer with Newsletter */}
      
    </div>
  );
}
