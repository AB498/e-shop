'use client';

import { ArrowUpIcon, ArrowDownIcon } from '@heroicons/react/24/outline';
import CountUp from 'react-countup';
import { FiTrendingUp, FiTrendingDown } from 'react-icons/fi';

export default function StatCard({ title, value, change, trend, icon: Icon, color, isLoading }) {
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

  const gradientClass = gradientColors[color] || gradientColors.blue;
  const textClass = textColors[color] || textColors.blue;
  const iconBgClass = iconBgColors[color] || iconBgColors.blue;

  // Format the value for display
  const isNumeric = !isNaN(parseFloat(value)) && isFinite(value);
  const formattedValue = isNumeric
    ? parseFloat(value).toLocaleString('en-US', { maximumFractionDigits: 2 })
    : value;

  // Determine if the value is a currency
  const isCurrency = typeof value === 'string' && value.startsWith('$');
  const numericValue = isCurrency ? parseFloat(value.substring(1)) : parseFloat(value);

  return (
    <div className="relative overflow-hidden rounded-xl bg-white shadow-md transition-all duration-300 hover:shadow-lg">
      {/* Gradient overlay at the top */}
      <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${gradientClass}`}></div>

      <div className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <div className="mt-2 flex items-baseline">
              {isLoading ? (
                <div className="h-8 w-24 animate-pulse rounded bg-gray-200"></div>
              ) : (
                <h3 className="text-2xl font-bold tracking-tight text-gray-900">
                  {isCurrency && '$'}
                  <CountUp
                    end={isCurrency ? numericValue : numericValue}
                    duration={2.5}
                    separator=","
                    decimal="."
                    decimals={isCurrency ? 2 : 0}
                  />
                </h3>
              )}
            </div>
          </div>

          <div className={`rounded-full ${iconBgClass} p-3`}>
            <Icon className={`h-6 w-6 ${textClass}`} aria-hidden="true" />
          </div>
        </div>

        {/* Change indicator */}
        {change && (
          <div className="mt-4 flex items-center">
            {trend === 'up' ? (
              <FiTrendingUp className="mr-1 h-4 w-4 text-green-500" />
            ) : (
              <FiTrendingDown className="mr-1 h-4 w-4 text-red-500" />
            )}
            <span
              className={`text-sm font-medium ${
                trend === 'up' ? 'text-green-600' : 'text-red-600'
              }`}
            >
              {change}
            </span>
            <span className="ml-1 text-xs text-gray-500">vs last month</span>
          </div>
        )}
      </div>
    </div>
  );
}
