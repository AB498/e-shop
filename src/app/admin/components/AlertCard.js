'use client';

import { BellAlertIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import ProgressBar from './ProgressBar';

export default function AlertCard({
  title,
  items = [],
  icon: Icon = BellAlertIcon,
  color = 'red',
  footerLink,
  footerText,
  maxItems = 5
}) {
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

  const gradientClass = gradientColors[color] || gradientColors.red;
  const textClass = textColors[color] || textColors.red;

  // Limit the number of items to display
  const displayItems = items.slice(0, maxItems);

  return (
    <div className="relative overflow-hidden rounded-xl bg-white shadow-md">
      {/* Gradient overlay at the top */}
      <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${gradientClass}`}></div>

      <div className="p-6">
        <div className="mb-4 flex items-center">
          <Icon className={`mr-2 h-5 w-5 ${textClass}`} />
          <h3 className="text-lg font-medium text-gray-900">{title}</h3>
        </div>

        <div className="space-y-4">
          {displayItems.length > 0 ? (
            displayItems.map((item, index) => (
              <div key={index} className="rounded-lg bg-gray-50 p-4">
                <div className="mb-2 flex items-center justify-between">
                  <div className="font-medium text-gray-800">{item.name}</div>
                  <div className={`rounded-full px-2 py-1 text-xs font-semibold ${textClass} bg-opacity-10 bg-red-100`}>
                    {item.value}
                  </div>
                </div>

                <ProgressBar
                  value={item.value}
                  max={item.max || 100}
                  color={`${color}-gradient`}
                  size="md"
                  showLabel={false}
                />

                <div className="mt-2 text-xs text-gray-500">
                  Threshold: {item.threshold}
                </div>
              </div>
            ))
          ) : (
            <div className="rounded-lg bg-gray-50 p-4 text-center text-gray-500">
              No alerts at this time
            </div>
          )}
        </div>

        {footerLink && (
          <div className="mt-4 text-center">
            <Link
              href={footerLink}
              className={`inline-block rounded-md px-4 py-2 text-sm font-medium ${textClass} hover:underline`}
            >
              {footerText || 'View all'}
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
