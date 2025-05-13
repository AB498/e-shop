'use client';

import React from 'react';
import ResponsiveContainer from '@/components/ui/ResponsiveContainer';

const AboutQuote = () => {
  return (
    <section className="mt-0 md:-mt-6 lg:-mt-10 relative z-10 px-4 md:px-6">
      <div className="mx-auto max-w-3xl">
        <div className="max-w-[980px] mx-auto bg-white rounded-[7px] py-6 sm:py-7 md:py-8 lg:py-[40px] px-6 sm:px-7 md:px-8 lg:pl-[60px] lg:pr-[40px] shadow-sm">
          <div className="text-sm md:text-[14px] leading-[1.7] text-[#202435] space-y-4 md:space-y-4">
            <p>
              In nec purus eget neque accumsan finibus. Duis condimentum elit ut libero commodo iaculis. Donec augue diam, tristique et ultricies nec, consectetur quis enim. Nullam id rutrum ex. Aliquam a lectus id lacus rhoncus dapibus non ac justo. Vivamus lacinia vestibulum metus in dapibus. Vestibulum sit amet sollicitudin enim. Ut id interdum turpis. Curabitur porta auctor quam, pretium facilisis nisl. Pellentesque efficitur elit ante, vel vulputate tortor blandit nec.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutQuote;
