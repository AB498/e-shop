'use client';

import { useState } from 'react';
import { Line, Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState('30days');

  // Sample data for revenue chart
  const revenueChartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'Revenue',
        data: [12000, 19000, 15000, 22000, 18000, 24000, 25000, 27000, 23000, 25000, 28000, 30000],
        borderColor: 'rgb(16, 185, 129)',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        tension: 0.4,
        fill: true,
      }
    ],
  };

  const revenueChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Monthly Revenue',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  // Sample data for orders chart
  const ordersChartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'Orders',
        data: [120, 190, 150, 220, 180, 240, 250, 270, 230, 250, 280, 300],
        backgroundColor: 'rgba(59, 130, 246, 0.7)',
      }
    ],
  };

  const ordersChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Monthly Orders',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  // Sample data for customer acquisition chart
  const customerChartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'New Customers',
        data: [65, 85, 70, 95, 80, 110, 120, 130, 115, 125, 135, 145],
        borderColor: 'rgb(139, 92, 246)',
        backgroundColor: 'rgba(139, 92, 246, 0.1)',
        tension: 0.4,
        fill: true,
      }
    ],
  };

  const customerChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'New Customer Acquisition',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  // Sample data for sales by category
  const categoryChartData = {
    labels: ['Electronics', 'Clothing', 'Home & Kitchen', 'Beauty', 'Books', 'Toys'],
    datasets: [
      {
        label: 'Sales by Category',
        data: [35, 25, 20, 10, 5, 5],
        backgroundColor: [
          'rgba(16, 185, 129, 0.7)',
          'rgba(59, 130, 246, 0.7)',
          'rgba(139, 92, 246, 0.7)',
          'rgba(245, 158, 11, 0.7)',
          'rgba(239, 68, 68, 0.7)',
          'rgba(75, 85, 99, 0.7)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const categoryChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'right',
      },
      title: {
        display: true,
        text: 'Sales by Category (%)',
      },
    },
  };

  return (
    <div className="space-y-6">
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Analytics</h1>
          <p className="mt-2 text-sm text-gray-700">
            Detailed insights into your store's performance
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm rounded-md"
          >
            <option value="7days">Last 7 Days</option>
            <option value="30days">Last 30 Days</option>
            <option value="90days">Last 90 Days</option>
            <option value="year">Last Year</option>
            <option value="all">All Time</option>
          </select>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <dt className="text-sm font-medium text-gray-500 truncate">Total Revenue</dt>
            <dd className="mt-1 text-3xl font-semibold text-gray-900">৳268,500</dd>
          </div>
          <div className="bg-gray-50 px-4 py-2">
            <div className="text-sm text-green-600">
              +12.5% from previous period
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <dt className="text-sm font-medium text-gray-500 truncate">Total Orders</dt>
            <dd className="mt-1 text-3xl font-semibold text-gray-900">2,450</dd>
          </div>
          <div className="bg-gray-50 px-4 py-2">
            <div className="text-sm text-green-600">
              +8.2% from previous period
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <dt className="text-sm font-medium text-gray-500 truncate">Average Order Value</dt>
            <dd className="mt-1 text-3xl font-semibold text-gray-900">৳109.59</dd>
          </div>
          <div className="bg-gray-50 px-4 py-2">
            <div className="text-sm text-green-600">
              +3.7% from previous period
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <dt className="text-sm font-medium text-gray-500 truncate">Conversion Rate</dt>
            <dd className="mt-1 text-3xl font-semibold text-gray-900">3.2%</dd>
          </div>
          <div className="bg-gray-50 px-4 py-2">
            <div className="text-sm text-red-600">
              -0.4% from previous period
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <div className="bg-white shadow rounded-lg p-6">
          <div className="h-80">
            <Line options={revenueChartOptions} data={revenueChartData} />
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <div className="h-80">
            <Bar options={ordersChartOptions} data={ordersChartData} />
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <div className="h-80">
            <Line options={customerChartOptions} data={customerChartData} />
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <div className="h-80">
            <Pie options={categoryChartOptions} data={categoryChartData} />
          </div>
        </div>
      </div>
    </div>
  );
}
