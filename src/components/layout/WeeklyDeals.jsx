'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { getActivePromotions } from '@/lib/actions/promotions';

export default function WeeklyDeals({ initialDeals = [] }) {
  const [deals, setDeals] = useState(initialDeals);
  const [loading, setLoading] = useState(initialDeals.length === 0);

  // Fetch deals if none were provided
  useEffect(() => {
    const fetchDeals = async () => {
      try {
        // Check if we have initial deals
        if (initialDeals && initialDeals.length > 0) {
          console.log('Using server-provided deals:', initialDeals);
          setDeals(initialDeals);
          return;
        }

        // If no initial deals, fetch from client side
        console.log('No initial deals, fetching from client side');
        setLoading(true);

        const promotions = await getActivePromotions('deal', 'home', 4);

        if (promotions && promotions.length > 0) {
          console.log('Fetched deals from client side:', promotions);
          setDeals(promotions);
        } else {
          console.log('No deals found, using default deals');
          // Fallback to default deals if no promotions found
          setDeals([
            {
              id: 1,
              title: 'Special Discount',
              description: 'Get 20% off on selected items',
              image_url: '/images/banners/promo-bg.png',
              link_url: '/products?discount=true',
            }
          ]);
        }
      } catch (error) {
        console.error('Error fetching deals:', error);
        // Fallback to default deals on error
        setDeals([
          {
            id: 1,
            title: 'Special Discount',
            description: 'Get 20% off on selected items',
            image_url: '/images/banners/promo-bg.png',
            link_url: '/products?discount=true',
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchDeals();
  }, [initialDeals]);

  if (loading) {
    return (
      <div className="my-8">
        <h2 className="text-2xl font-bold mb-4">Weekly Deals</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, index) => (
            <div key={index} className="bg-gray-100 rounded-lg overflow-hidden h-64 animate-pulse">
              <div className="w-full h-full bg-gray-200"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!deals || deals.length === 0) {
    return null;
  }

  return (
    <div className="my-8">
      <h2 className="text-2xl font-bold mb-4">Weekly Deals</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {deals.map((deal) => (
          <Link
            href={deal.link_url || '#'}
            key={deal.id}
            className="group block bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300"
          >
            <div className="relative h-48 w-full">
              <Image
                src={deal.image_url}
                alt={deal.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
              />
              {/* Overlay with discount percentage */}
              {deal.discount && (
                <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full text-sm font-bold">
                  {deal.discount}% OFF
                </div>
              )}
            </div>
            <div className="p-4">
              <h3 className="font-bold text-lg">{deal.title}</h3>
              {deal.description && (
                <p className="text-gray-600 mt-1 text-sm">{deal.description}</p>
              )}
              <div className="mt-2 text-emerald-600 font-medium text-sm flex items-center">
                Shop Now
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
