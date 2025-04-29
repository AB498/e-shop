'use client';

import { useState } from 'react';
import {
  ArrowUpIcon,
  ArrowDownIcon,
  CurrencyDollarIcon,
  ShoppingBagIcon,
  UserGroupIcon,
  ShoppingCartIcon
} from '@heroicons/react/24/outline';
import { Bar, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
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
  Title,
  Tooltip,
  Legend
);

export default function AdminDashboard() {
  // Sample data for demonstration
  const stats = [
    {
      name: 'Total Revenue',
      value: '$24,567.89',
      change: '+12.5%',
      trend: 'up',
      icon: CurrencyDollarIcon,
      bgColor: 'bg-emerald-100',
      iconColor: 'text-emerald-600'
    },
    {
      name: 'Orders',
      value: '356',
      change: '+8.2%',
      trend: 'up',
      icon: ShoppingBagIcon,
      bgColor: 'bg-blue-100',
      iconColor: 'text-blue-600'
    },
    {
      name: 'Customers',
      value: '1,245',
      change: '+5.7%',
      trend: 'up',
      icon: UserGroupIcon,
      bgColor: 'bg-purple-100',
      iconColor: 'text-purple-600'
    },
    {
      name: 'Conversion Rate',
      value: '3.2%',
      change: '-0.4%',
      trend: 'down',
      icon: ShoppingCartIcon,
      bgColor: 'bg-amber-100',
      iconColor: 'text-amber-600'
    },
  ];

  // Sample data for sales chart
  const salesChartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'Sales 2023',
        data: [12000, 19000, 15000, 22000, 18000, 24000, 25000, 27000, 23000, 25000, 28000, 30000],
        borderColor: 'rgb(16, 185, 129)',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        tension: 0.4,
        fill: true,
      },
      {
        label: 'Sales 2022',
        data: [10000, 15000, 12000, 18000, 15000, 20000, 22000, 24000, 20000, 22000, 24000, 26000],
        borderColor: 'rgb(107, 114, 128)',
        backgroundColor: 'rgba(107, 114, 128, 0.1)',
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const salesChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Monthly Sales',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          display: true,
          color: 'rgba(0, 0, 0, 0.05)',
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  };

  // Sample data for product categories chart
  const categoryChartData = {
    labels: ['Electronics', 'Clothing', 'Home & Kitchen', 'Beauty', 'Books', 'Toys'],
    datasets: [
      {
        label: 'Sales by Category',
        data: [35000, 28000, 22000, 18000, 12000, 8000],
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
        position: 'top',
      },
      title: {
        display: true,
        text: 'Sales by Category',
      },
    },
  };

  // Sample recent orders data
  const recentOrders = [
    { id: 'ORD-1234', customer: 'John Doe', date: '2023-06-15', status: 'Delivered', amount: '$125.99' },
    { id: 'ORD-1235', customer: 'Jane Smith', date: '2023-06-15', status: 'Processing', amount: '$89.50' },
    { id: 'ORD-1236', customer: 'Robert Johnson', date: '2023-06-14', status: 'Shipped', amount: '$245.75' },
    { id: 'ORD-1237', customer: 'Emily Davis', date: '2023-06-14', status: 'Delivered', amount: '$78.25' },
    { id: 'ORD-1238', customer: 'Michael Brown', date: '2023-06-13', status: 'Processing', amount: '$156.80' },
  ];

  // Sample low stock products
  const lowStockProducts = [
    { id: 'PRD-567', name: 'Wireless Headphones', stock: 5, threshold: 10 },
    { id: 'PRD-612', name: 'Smart Watch', stock: 3, threshold: 8 },
    { id: 'PRD-498', name: 'Bluetooth Speaker', stock: 2, threshold: 10 },
    { id: 'PRD-735', name: 'USB-C Cable', stock: 7, threshold: 15 },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.name}
            className="relative overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:px-6 sm:py-6"
          >
            <dt>
              <div className={`absolute rounded-md ${stat.bgColor} p-3`}>
                <stat.icon className={`h-6 w-6 ${stat.iconColor}`} aria-hidden="true" />
              </div>
              <p className="ml-16 truncate text-sm font-medium text-gray-500">{stat.name}</p>
            </dt>
            <dd className="ml-16 flex items-baseline">
              <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
              <p
                className={`ml-2 flex items-baseline text-sm font-semibold ${
                  stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {stat.trend === 'up' ? (
                  <ArrowUpIcon className="h-5 w-5 flex-shrink-0 self-center text-green-500" aria-hidden="true" />
                ) : (
                  <ArrowDownIcon className="h-5 w-5 flex-shrink-0 self-center text-red-500" aria-hidden="true" />
                )}
                <span className="sr-only">{stat.trend === 'up' ? 'Increased' : 'Decreased'} by</span>
                {stat.change}
              </p>
            </dd>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        {/* Sales Chart */}
        <div className="rounded-lg bg-white shadow p-6">
          <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">Sales Trends</h3>
          <div className="h-80">
            <Line options={salesChartOptions} data={salesChartData} />
          </div>
        </div>

        {/* Category Chart */}
        <div className="rounded-lg bg-white shadow p-6">
          <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">Sales by Category</h3>
          <div className="h-80">
            <Bar options={categoryChartOptions} data={categoryChartData} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        {/* Recent Orders */}
        <div className="rounded-lg bg-white shadow overflow-hidden">
          <div className="px-4 py-5 sm:px-6 bg-gray-50 border-b border-gray-200">
            <h3 className="text-lg font-medium leading-6 text-gray-900">Recent Orders</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order ID
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentOrders.map((order) => (
                  <tr key={order.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">{order.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{order.customer}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.date}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                        ${order.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                          order.status === 'Shipped' ? 'bg-blue-100 text-blue-800' :
                          'bg-yellow-100 text-yellow-800'}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{order.amount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 sm:px-6">
            <div className="text-sm">
              <a href="/admin/orders" className="font-medium text-emerald-600 hover:text-emerald-500">
                View all orders
              </a>
            </div>
          </div>
        </div>

        {/* Low Stock Alert */}
        <div className="rounded-lg bg-white shadow overflow-hidden">
          <div className="px-4 py-5 sm:px-6 bg-gray-50 border-b border-gray-200">
            <h3 className="text-lg font-medium leading-6 text-gray-900">Low Stock Alert</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product ID
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product Name
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Current Stock
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Threshold
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {lowStockProducts.map((product) => (
                  <tr key={product.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">{product.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{product.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                        {product.stock}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.threshold}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 sm:px-6">
            <div className="text-sm">
              <a href="/admin/inventory" className="font-medium text-emerald-600 hover:text-emerald-500">
                Manage inventory
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
