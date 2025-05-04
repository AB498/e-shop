'use client';

import React from 'react';
import Image from 'next/image';

const ContactInfoCard = ({ icon, title, description }) => {
  return (
    <div className="w-full bg-[#F3F3F6] border border-[#EDEEF5] rounded-[7px] flex flex-col items-center">
      <div className="py-9 mb-5">
        <div className="w-9 h-9 flex items-center justify-center">
          <Image
            src={icon}
            alt={title}
            width={36}
            height={36}
            className="text-[#006B51]"
          />
        </div>
      </div>
      <h3 className="text-[15px] font-medium text-[#202435] mb-2 text-center leading-[1.2] px-4 whitespace-pre-line">{title}</h3>
      <p className="text-[13px] text-[#202435] text-center mb-4 leading-[1.85] px-4">{description}</p>
    </div>
  );
};

export default ContactInfoCard;
