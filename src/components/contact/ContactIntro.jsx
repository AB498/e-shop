'use client';

import React from 'react';
import ResponsiveContainer from '@/components/ui/ResponsiveContainer';
import ResponsiveText from '@/components/ui/ResponsiveText';

const ContactIntro = () => {
  return (
    <section className="py-8 md:py-12 lg:py-16">
      <ResponsiveContainer>
        <div className="flex flex-col items-center">
          <ResponsiveText
            as="h2"
            className="text-2xl md:text-3xl lg:text-[40px] font-normal text-[#202435] mb-4 md:mb-6 lg:mb-8 text-center leading-[1.2]"
          >
            Get In Touch
          </ResponsiveText>
          <div className="max-w-[460px] text-center px-4">
            <p className="text-sm md:text-[14px] leading-[1.7] text-[#202435]">
              Lorem, ipsum dolor sit amet consectetur adipisicing elit. Expedita
              quaerat unde quam dolor culpa veritatis inventore, aut commodi eum
              veniam vel.
            </p>
          </div>
        </div>
      </ResponsiveContainer>
    </section>
  );
};

export default ContactIntro;
