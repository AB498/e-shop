'use client';

import { useState } from 'react';
import { ChartBarIcon } from '@heroicons/react/24/outline';

export default function ChartCard({ title, children, color = 'blue', icon: Icon = ChartBarIcon }) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Define gradient colors based on the provided color
  const gradientColors = {
    blue: 'from-[#006B51] to-[#008B6A]',
    green: 'from-[#006B51] to-[#008B6A]',
    purple: 'from-[#006B51] to-[#008B6A]',
    amber: 'from-[#006B51] to-[#008B6A]',
    red: 'from-red-500 to-red-400',
    primary: 'from-[#006B51] to-[#008B6A]',
  };

  // Define text colors based on the provided color
  const textColors = {
    blue: 'text-[#006B51]',
    green: 'text-[#006B51]',
    purple: 'text-[#006B51]',
    amber: 'text-[#006B51]',
    red: 'text-red-600',
    primary: 'text-[#006B51]',
  };

  const gradientClass = gradientColors[color] || gradientColors.blue;
  const textClass = textColors[color] || textColors.blue;

  return (
    <div className={`relative overflow-hidden rounded-xl bg-white shadow-md transition-all duration-300 hover:shadow-lg ${isExpanded ? 'col-span-2' : ''}`}>
      {/* Gradient overlay at the top */}
      <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${gradientClass}`}></div>

      <div className="p-6">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center">
            <Icon className={`mr-2 h-5 w-5 ${textClass}`} />
            <h3 className="text-lg font-medium text-gray-900">{title}</h3>
          </div>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="rounded-md p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-500"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              {isExpanded ? (
                <path fillRule="evenodd" d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z" clipRule="evenodd" />
              ) : (
                <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
              )}
            </svg>
          </button>
        </div>

        <div className={`transition-all duration-300 ${isExpanded ? 'h-96' : 'h-80'}`}>
          {children}
        </div>
      </div>
    </div>
  );
}
