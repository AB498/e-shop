'use client';

import React from 'react';
import Image from 'next/image';
import ResponsiveContainer from '@/components/ui/ResponsiveContainer';
import ResponsiveText from '@/components/ui/ResponsiveText';

const AboutCEO = () => {
  return (
    <section className="py-8 md:py-10 lg:py-12">
      <ResponsiveContainer>
        <div className="flex flex-col md:flex-row gap-6 md:gap-6 lg:gap-8 items-start max-w-[980px] mx-auto">
          {/* Image container - stacks on top for mobile */}
          <div className="w-full md:w-1/2 md:pr-4 mb-6 md:mb-0">
            <div className="pt-4 md:pt-5 lg:pt-6">
              <div className="rounded-[7px] aspect-[3/4] w-full bg-gray-200 animate-pulse"></div>
            </div>
          </div>

          {/* Text content - stacks below image on mobile */}
          <div className="w-full md:w-1/2 md:pl-4 flex flex-col">
            <div className="overflow-auto">
              <ResponsiveText
                as="p"
                className="text-sm md:text-base lg:text-[15px] text-[#202435] mb-2 md:mb-2 lg:mb-3 font-normal"
              >
                Rachel Leonard - Thai Bangla CEO
              </ResponsiveText>

              <ResponsiveText
                as="h3"
                className="text-xl md:text-2xl lg:text-[26px] font-semibold text-[#202435] mb-3 md:mb-3 lg:mb-4 leading-[1.2]"
              >
                Duis convallis luctus pretium. Pellentesque habitant morbi
              </ResponsiveText>

              <div className="text-sm md:text-[14px] leading-[1.7] text-[#202435] space-y-4 md:space-y-4">
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Quis ipsum suspendisse ultrices gravida. Risus commodo viverra maecenas accumsan lacus vel facilisis.
                </p>
                <p>
                  In fermentum mi ut sapien semper, a sagittis lorem vulputate. Integer gravida, dui eget aliquet tempus, turpis orci vehicula ipsum, eget porttitor sapien tortor at neque. Cras id pulvinar lacus, ac volutpat neque. Ut at magna id justo bibendum lobortis. Integer tortor nulla, ultricies et nisi sit amet, interdum dictum felis. In semper laoreet dui vitae pharetra. Etiam sit amet molestie nulla, eu efficitur orci. Praesent rutrum ante justo, eget malesuada ante ornare ac. Ut dignissim blandit urna, eget euismod leo rhoncus nec. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Quisque lobortis libero ante. Nullam in feugiat erat. Aenean sed justo dapibus, sodales nisi ut, fringilla lorem. Vestibulum in orci ac nisl condimentum fermentum at et sem. Curabitur fermentum dolor eu lacus consectetur varius.
                </p>
              </div>
            </div>
          </div>
        </div>
      </ResponsiveContainer>
    </section>
  );
};

export default AboutCEO;
