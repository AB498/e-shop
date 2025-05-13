'use client';

import React from 'react';
import Image from 'next/image';

const ContactInfoCard = ({ icon, title, description }) => {
  return (
    <div className="w-full bg-[#F3F3F6] border border-[#EDEEF5] rounded-[7px] flex flex-col items-center">
      <div className="py-6 md:py-7 lg:py-8 mb-3 md:mb-3 lg:mb-4">
        <div className="w-8 h-8 md:w-8 md:h-8 flex items-center justify-center">
          <Image
            src={icon}
            alt={title}
            width={32}
            height={32}
            className="text-[#006B51] w-6 h-6 md:w-7 md:h-7 lg:w-8 lg:h-8"
          />
        </div>
      </div>
      <h3 className="text-sm md:text-[14px] font-medium text-[#202435] mb-2 text-center leading-[1.2] px-4 whitespace-pre-line">{title}</h3>
      <p className="text-xs md:text-[12px] text-[#202435] text-center mb-4 leading-[1.85] px-4">{description}</p>
    </div>
  );
};

export default ContactInfoCard;
