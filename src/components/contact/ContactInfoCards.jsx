'use client';

import React from 'react';
import ContactInfoCard from './ContactInfoCard';
import ResponsiveContainer from '@/components/ui/ResponsiveContainer';

const ContactInfoCards = () => {
  const contactInfo = [
    {
      icon: '/images/contact/location-icon.svg',
      title: 'House: 06, Road: 3/B, Sector: 09, Uttara\nDhaka, Bangladesh',
      description: 'Lorem ipsum dolar site amet discont',
    },
    {
      icon: '/images/contact/phone-icon.svg',
      title: '+880 1407-016740',
      description: 'Lorem ipsum dolar site amet discont',
    },
    {
      icon: '/images/contact/email-icon.svg',
      title: 'info@example.com',
      description: 'Lorem ipsum dolar site amet discont',
    }
  ];

  return (
    <section className="py-4 sm:py-5 md:py-6">
      <ResponsiveContainer>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          {contactInfo.map((info, index) => (
            <ContactInfoCard
              key={index}
              icon={info.icon}
              title={info.title}
              description={info.description}
            />
          ))}
        </div>
      </ResponsiveContainer>
    </section>
  );
};

export default ContactInfoCards;
