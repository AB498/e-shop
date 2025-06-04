'use client';

import {
  BanknotesIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import CountUp from 'react-countup';

export default function PaymentStatsCards({ stats, isLoading }) {
  // Format currency for display
  const formatCurrency = (amount) => {
    return parseFloat(amount).toFixed(2);
  };

  // Calculate success rate
  const successRate = stats.totalTransactions > 0
    ? ((stats.successfulTransactions / stats.totalTransactions) * 100).toFixed(1)
    : 0;

  // Define stat cards
  const statCards = [
    {
      title: 'Total Transactions',
      value: stats.totalTransactions,
      icon: ClockIcon,
      color: 'bg-blue-500',
      prefix: '',
      suffix: '',
    },
    {
      title: 'Successful Payments',
      value: stats.successfulTransactions,
      icon: CheckCircleIcon,
      color: 'bg-green-500',
      prefix: '',
      suffix: '',
    },
    {
      title: 'Failed Payments',
      value: stats.failedTransactions,
      icon: XCircleIcon,
      color: 'bg-red-500',
      prefix: '',
      suffix: '',
    },
    {
      title: 'Total Revenue',
      value: formatCurrency(stats.totalAmount),
      icon: BanknotesIcon,
      color: 'bg-emerald-500',
      prefix: '৳',
      suffix: '',
    },
    {
      title: 'Success Rate',
      value: successRate,
      icon: CheckCircleIcon,
      color: 'bg-purple-500',
      prefix: '',
      suffix: '%',
    },
  ];

  // Render loading skeleton
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3 mb-4">
        {[...Array(5)].map((_, index) => (
          <div key={index} className="bg-white rounded-md shadow p-3 animate-pulse">
            <div className="flex items-center">
              <div className="h-8 w-8 rounded-full bg-gray-200"></div>
              <div className="ml-3 flex-1">
                <div className="h-3 bg-gray-200 rounded w-1/2 mb-1"></div>
                <div className="h-5 bg-gray-200 rounded w-3/4"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Render stat cards
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3 mb-4">
      {statCards.map((card, index) => (
        <div key={index} className="bg-white rounded-md shadow overflow-hidden">
          <div className="p-3">
            <div className="flex items-center">
              <div className={`flex-shrink-0 rounded-md p-2 ${card.color} bg-opacity-10`}>
                <card.icon className={`h-5 w-5 ${card.color.replace('bg-', 'text-')}`} />
              </div>
              <div className="ml-3">
                <p className="text-xs font-medium text-gray-500 truncate">
                  {card.title}
                </p>
                <div className="text-lg font-semibold text-gray-900">
                  {card.prefix}
                  <CountUp
                    end={parseFloat(card.value)}
                    duration={2}
                    separator=","
                    decimal="."
                    decimals={card.title === 'Total Revenue' || card.title === 'Success Rate' ? 2 : 0}
                  />
                  {card.suffix}
                </div>
              </div>
            </div>
          </div>
          <div className={`px-3 py-1 ${card.color} bg-opacity-10`}>
            <div className="text-xs font-medium text-right">
              <span className={card.color.replace('bg-', 'text-')}>
                {card.title === 'Success Rate' ? 'Based on all transactions' : 'Total to date'}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
