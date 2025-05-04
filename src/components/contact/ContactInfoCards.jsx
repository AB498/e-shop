'use client';

import React from 'react';
import ContactInfoCard from './ContactInfoCard';

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
    <section className="py-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {contactInfo.map((info, index) => (
            <ContactInfoCard
              key={index}
              icon={info.icon}
              title={info.title}
              description={info.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ContactInfoCards;
