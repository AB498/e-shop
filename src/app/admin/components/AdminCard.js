'use client';

import Link from 'next/link';

export default function AdminCard({
  title,
  children,
  icon: Icon,
  color = 'primary',
  footerLink,
  footerText,
  actions = [],
  className = '',
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

  // Define icon background colors
  const iconBgColors = {
    blue: 'bg-[#E6F2EF]',
    green: 'bg-[#E6F2EF]',
    purple: 'bg-[#E6F2EF]',
    amber: 'bg-[#E6F2EF]',
    red: 'bg-red-100',
    primary: 'bg-[#E6F2EF]',
  };

  const gradientClass = gradientColors[color] || gradientColors.primary;
  const textClass = textColors[color] || textColors.primary;
  const iconBgClass = iconBgColors[color] || iconBgColors.primary;

  return (
    <div className={`relative overflow-hidden rounded-xl bg-white shadow-md ${className}`}>
      {/* Gradient overlay at the top */}
      <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${gradientClass}`}></div>

      {/* Card Header */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            {Icon && (
              <div className={`mr-3 p-2 rounded-md ${iconBgClass}`}>
                <Icon className={`h-5 w-5 ${textClass}`} aria-hidden="true" />
              </div>
            )}
            <h3 className="text-lg font-medium text-gray-900">{title}</h3>
          </div>
          
          {actions.length > 0 && (
            <div className="flex space-x-2">
              {actions.map((action, index) => (
                <button
                  key={index}
                  onClick={action.onClick}
                  className="p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none"
                  title={action.title}
                >
                  <action.icon className="h-5 w-5" aria-hidden="true" />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Card Content */}
      <div className="p-4">
        {children}
      </div>

      {/* Card Footer */}
      {footerLink && footerText && (
        <div className="border-t border-gray-100 p-4">
          <Link
            href={footerLink}
            className={`flex items-center justify-center text-sm font-medium ${textClass} hover:underline`}
          >
            {footerText}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="ml-1 h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </Link>
        </div>
      )}
    </div>
  );
}
