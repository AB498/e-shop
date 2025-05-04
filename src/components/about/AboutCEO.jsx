'use client';

import React from 'react';
import Image from 'next/image';

const AboutCEO = () => {
  return (
    <section className="">
      <div className="container mx-auto px-4">
        <div className="relative flex flex-col md:flex-row gap-12 items-start max-w-[1185px] mx-auto">
          <div className="md:w-1/2 md:pr-4">
            <div className="pt-10">
              <div className="rounded-[7px] aspect-[3/4] w-full bg-gray-200 animate-pulse"></div>
            </div>
          </div>
          <div className="md:w-1/2 md:pl-4 h-full absolute right-0   flex flex-col">
            <div className=" grow my-32 overflow-auto">
              <p className="text-[16px] text-[#202435] mb-4 font-normal">
                Rachel Leonard - Thai Bangla CEO
              </p>
              <h3 className="text-[28px] font-semibold text-[#202435] mb-6 leading-[1.2]">
                Duis convallis luctus pretium. Pellentesque habitant morbi
              </h3>
              <div className="text-[14px] leading-[1.7] text-[#202435] space-y-6">
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
      </div>
    </section>
  );
};

export default AboutCEO;
