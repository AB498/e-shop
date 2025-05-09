'use client';

import { 
  CurrencyDollarIcon, 
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
      icon: CurrencyDollarIcon,
      color: 'bg-emerald-500',
      prefix: 'BDT ',
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-6">
        {[...Array(5)].map((_, index) => (
          <div key={index} className="bg-white rounded-lg shadow p-6 animate-pulse">
            <div className="flex items-center">
              <div className="h-10 w-10 rounded-full bg-gray-200"></div>
              <div className="ml-4 flex-1">
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-6 bg-gray-200 rounded w-3/4"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Render stat cards
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-6">
      {statCards.map((card, index) => (
        <div key={index} className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-5">
            <div className="flex items-center">
              <div className={`flex-shrink-0 rounded-md p-3 ${card.color} bg-opacity-10`}>
                <card.icon className={`h-6 w-6 ${card.color.replace('bg-', 'text-')}`} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500 truncate">
                  {card.title}
                </p>
                <div className="mt-1 text-xl font-semibold text-gray-900">
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
          <div className={`px-5 py-2 ${card.color} bg-opacity-10`}>
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
