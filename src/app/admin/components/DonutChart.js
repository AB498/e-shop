'use client';

import { Doughnut } from 'react-chartjs-2';

export default function DonutChart({ data, options }) {
  // Default options for donut chart
  const defaultOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '70%',
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            size: 12
          }
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.raw || 0;
            const total = context.chart.data.datasets[0].data.reduce((a, b) => a + b, 0);
            const percentage = Math.round((value / total) * 100);
            return `${label}: ${value} (${percentage}%)`;
          }
        }
      }
    }
  };

  // Merge default options with provided options
  const mergedOptions = { ...defaultOptions, ...options };

  return (
    <div className="relative h-full w-full">
      {data && data.datasets && data.datasets.length > 0 ? (
        <Doughnut data={data} options={mergedOptions} />
      ) : (
        <div className="flex h-full w-full items-center justify-center">
          <p className="text-gray-500">No data available</p>
        </div>
      )}
    </div>
  );
}
