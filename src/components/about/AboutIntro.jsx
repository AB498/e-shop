'use client';

import React from 'react';
import ResponsiveContainer from '@/components/ui/ResponsiveContainer';
import ResponsiveText from '@/components/ui/ResponsiveText';

const AboutIntro = () => {
  return (
    <section className="py-8 md:py-12 lg:py-16">
      <ResponsiveContainer>
        <div className="max-w-[1095px] mx-auto">
          <ResponsiveText
            as="h2"
            className="text-2xl md:text-3xl lg:text-[32px] font-semibold text-[#202435] mb-4 md:mb-6 lg:mb-8 leading-[1.2]"
          >
            Quisque erat urna, congue et libero in eleifend euismod velit.
          </ResponsiveText>
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
  );
};

export default AboutIntro;
