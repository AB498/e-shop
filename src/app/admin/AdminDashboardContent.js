'use client';

import { useState, useEffect } from 'react';
import {
  ArrowUpIcon,
  ArrowDownIcon,
  CurrencyDollarIcon,
  ShoppingBagIcon,
  UserGroupIcon,
  ShoppingCartIcon,
  BellAlertIcon,
  ChartBarIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';
import { Bar, Line, Doughnut } from 'react-chartjs-2';
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
  Filler
} from 'chart.js';
import Link from 'next/link';
import CountUp from 'react-countup';
import { FiTrendingUp, FiTrendingDown, FiAlertCircle, FiCheckCircle, FiShoppingBag } from 'react-icons/fi';
import { BsGraphUp, BsGraphDown, BsCalendarCheck, BsBoxSeam } from 'react-icons/bs';

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
  Legend,
  Filler
);

// Import components
import StatCard from './components/StatCard';
import ChartCard from './components/ChartCard';
import RecentOrdersCard from './components/RecentOrdersCard';
import AlertCard from './components/AlertCard';
import DonutChart from './components/DonutChart';
import AdminCard from './components/AdminCard';
import DashboardHeader from './components/DashboardHeader';

export default function AdminDashboardContent() {
  const [dashboardData, setDashboardData] = useState({
    stats: [],
    salesChartData: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      datasets: [
        {
          label: `Sales ${new Date().getFullYear()}`,
          data: Array(12).fill(0),
          borderColor: 'rgb(16, 185, 129)',
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          tension: 0.4,
          fill: true,
        },
        {
          label: `Sales ${new Date().getFullYear() - 1}`,
          data: Array(12).fill(0),
          borderColor: 'rgb(107, 114, 128)',
          backgroundColor: 'rgba(107, 114, 128, 0.1)',
          tension: 0.4,
          fill: true,
        },
      ],
    },
    categoryChartData: {
      labels: ['Loading...'],
      datasets: [
        {
          label: 'Sales by Category',
          data: [0],
          backgroundColor: ['rgba(75, 85, 99, 0.7)'],
          borderWidth: 1,
        },
      ],
    },
    recentOrders: [],
    lowStockProducts: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        setIsLoading(true);

        // Fetch dashboard stats
        const statsResponse = await fetch('/api/admin/dashboard-stats');
        if (!statsResponse.ok) throw new Error('Failed to fetch dashboard stats');
        const statsData = await statsResponse.json();

        // Fetch monthly sales data
        const salesResponse = await fetch('/api/admin/monthly-sales');
        if (!salesResponse.ok) throw new Error('Failed to fetch monthly sales data');
        const salesData = await salesResponse.json();

        // Fetch category sales data
        const categoryResponse = await fetch('/api/admin/category-sales');
        if (!categoryResponse.ok) throw new Error('Failed to fetch category sales data');
        const categoryData = await categoryResponse.json();

        // Fetch recent orders
        const ordersResponse = await fetch('/api/admin/recent-orders');
        if (!ordersResponse.ok) throw new Error('Failed to fetch recent orders');
        const ordersData = await ordersResponse.json();

        // Fetch low stock products
        const productsResponse = await fetch('/api/admin/low-stock-products');
        if (!productsResponse.ok) throw new Error('Failed to fetch low stock products');
        const productsData = await productsResponse.json();

        // Format stats data with null checks
        const stats = [
          {
            name: 'Total Revenue',
            value: `৳${parseFloat(statsData.totalRevenue || 0).toFixed(2)}`,
            change: `${(statsData.revenueGrowth || 0) > 0 ? '+' : ''}${(statsData.revenueGrowth || 0).toFixed(1)}%`,
            trend: (statsData.revenueGrowth || 0) >= 0 ? 'up' : 'down',
            icon: CurrencyDollarIcon,
            color: 'primary'
          },
          {
            name: 'Orders',
            value: (statsData.totalOrders || 0).toString(),
            change: `${(statsData.ordersGrowth || 0) > 0 ? '+' : ''}${(statsData.ordersGrowth || 0).toFixed(1)}%`,
            trend: (statsData.ordersGrowth || 0) >= 0 ? 'up' : 'down',
            icon: ShoppingBagIcon,
            color: 'primary'
          },
          {
            name: 'Customers',
            value: (statsData.totalCustomers || 0).toString(),
            change: `${(statsData.customersGrowth || 0) > 0 ? '+' : ''}${(statsData.customersGrowth || 0).toFixed(1)}%`,
            trend: (statsData.customersGrowth || 0) >= 0 ? 'up' : 'down',
            icon: UserGroupIcon,
            color: 'primary'
          },
          {
            name: 'Conversion Rate',
            value: `${(statsData.conversionRate || 0).toFixed(1)}%`,
            change: '0.0%', // Mock data as we don't have historical conversion rate
            trend: 'up',
            icon: ShoppingCartIcon,
            color: 'primary'
          },
        ];

        // Format sales chart data with null checks
        const currentYear = new Date().getFullYear();
        const salesChartData = {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
          datasets: [
            {
              label: `Sales ${currentYear}`,
              data: (salesData.currentYearSales || Array(12).fill(0)).map(value => parseFloat(value) || 0),
              borderColor: '#006B51',
              backgroundColor: 'rgba(0, 107, 81, 0.1)',
              tension: 0.4,
              fill: true,
            },
            {
              label: `Sales ${currentYear - 1}`,
              data: (salesData.previousYearSales || Array(12).fill(0)).map(value => parseFloat(value) || 0),
              borderColor: 'rgb(107, 114, 128)',
              backgroundColor: 'rgba(107, 114, 128, 0.1)',
              tension: 0.4,
              fill: true,
            },
          ],
        };

        // Format category chart data for donut chart
        const categoryDonutData = {
          labels: (categoryData || []).map(item => item?.categoryName || 'Unknown'),
          datasets: [
            {
              data: (categoryData || []).map(item => parseFloat(item?.total || 0) || 0),
              backgroundColor: [
                'rgba(0, 107, 81, 0.9)',
                'rgba(0, 107, 81, 0.8)',
                'rgba(0, 107, 81, 0.7)',
                'rgba(0, 107, 81, 0.6)',
                'rgba(0, 107, 81, 0.5)',
                'rgba(0, 107, 81, 0.4)',
                'rgba(0, 139, 106, 0.9)',
                'rgba(0, 139, 106, 0.8)',
                'rgba(0, 139, 106, 0.7)',
                'rgba(0, 139, 106, 0.6)',
              ],
              borderWidth: 1,
              hoverOffset: 4
            },
          ],
        };

        // Format low stock products for AlertCard
        const lowStockItems = (productsData || []).map(product => ({
          name: product.name || 'Unknown Product',
          value: product.stock || 0,
          max: 100, // Assuming max stock is 100
          threshold: product.threshold || 10
        }));

        setDashboardData({
          stats,
          salesChartData,
          categoryChartData: categoryDonutData,
          recentOrders: ordersData || [],
          lowStockProducts: lowStockItems
        });

        setIsLoading(false);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError(err?.message || 'An error occurred while loading dashboard data');
        setIsLoading(false);

        // Set default empty data to prevent rendering errors
        setDashboardData({
          stats: [],
          salesChartData: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            datasets: [
              {
                label: `Sales ${new Date().getFullYear()}`,
                data: Array(12).fill(0),
                borderColor: 'rgb(16, 185, 129)',
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                tension: 0.4,
                fill: true,
              },
              {
                label: `Sales ${new Date().getFullYear() - 1}`,
                data: Array(12).fill(0),
                borderColor: 'rgb(107, 114, 128)',
                backgroundColor: 'rgba(107, 114, 128, 0.1)',
                tension: 0.4,
                fill: true,
              },
            ],
          },
          categoryChartData: {
            labels: ['No Data'],
            datasets: [
              {
                data: [0],
                backgroundColor: ['rgba(75, 85, 99, 0.7)'],
                borderWidth: 1,
              },
            ],
          },
          recentOrders: [],
          lowStockProducts: []
        });
      }
    }

    fetchDashboardData();
  }, []);

  const salesChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: false,
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

  const categoryChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            size: 12
          }
        }
      },
      title: {
        display: false,
      },
    },
  };

  if (error) {
    return (
      <div className="relative overflow-hidden rounded-xl bg-red-50 border border-red-200 p-6 my-4 shadow-md">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 to-red-400"></div>
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-6 w-6 text-red-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-lg font-medium text-red-800">Error loading dashboard data</h3>
            <div className="mt-2 text-sm text-red-700">
              <p>{error}</p>
            </div>
            <div className="mt-4">
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="rounded-md bg-red-100 px-4 py-2 text-sm font-medium text-red-800 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2 transition-colors duration-150"
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-4 sm:py-5 bg-gray-50 min-h-screen">
      <div className="mx-auto max-w-7xl px-3 sm:px-4 lg:px-6">
        {/* Dashboard Header */}
        <DashboardHeader onRefresh={() => {
          setIsLoading(true);
          // Re-fetch dashboard data
          const fetchData = async () => {
            try {
              // Fetch dashboard stats
              const statsResponse = await fetch('/api/admin/dashboard-stats');
              if (!statsResponse.ok) throw new Error('Failed to fetch dashboard stats');
              const statsData = await statsResponse.json();

              // Update state with new data
              // ... (similar to the useEffect code)
              setIsLoading(false);
            } catch (err) {
              console.error('Error refreshing dashboard data:', err);
              setError(err?.message || 'An error occurred while refreshing dashboard data');
              setIsLoading(false);
            }
          };

          fetchData();
        }} />

        {/* Stats Cards */}
        <div className="grid grid-cols-1 gap-4 sm:gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {dashboardData.stats.map((stat, index) => (
            <StatCard
              key={index}
              title={stat.name}
              value={stat.value}
              change={stat.change}
              trend={stat.trend}
              icon={stat.icon}
              color={stat.color}
              isLoading={isLoading}
            />
          ))}
        </div>

        {/* Charts Section */}
        <div className="mt-6 sm:mt-7 grid grid-cols-1 gap-4 sm:gap-5 lg:grid-cols-2">
          <AdminCard
            title="Sales Overview"
            color="primary"
            icon={BsGraphUp}
            className="h-full"
          >
            {dashboardData.salesChartData && dashboardData.salesChartData.datasets && dashboardData.salesChartData.datasets.length > 0 ? (
              <div className="h-64 sm:h-72 lg:h-80">
                <Line options={salesChartOptions} data={dashboardData.salesChartData} />
              </div>
            ) : (
              <div className="flex items-center justify-center h-80">
                <p className="text-gray-500">No sales data available</p>
              </div>
            )}
          </AdminCard>

          <AdminCard
            title="Category Sales"
            color="primary"
            icon={ChartBarIcon}
            className="h-full"
          >
            {dashboardData.categoryChartData && dashboardData.categoryChartData.datasets && dashboardData.categoryChartData.datasets.length > 0 ? (
              <div className="h-64 sm:h-72 lg:h-80">
                <DonutChart data={dashboardData.categoryChartData} options={categoryChartOptions} />
              </div>
            ) : (
              <div className="flex items-center justify-center h-80">
                <p className="text-gray-500">No category data available</p>
              </div>
            )}
          </AdminCard>
        </div>

        {/* Orders and Inventory Section */}
        <div className="mt-6 sm:mt-7 grid grid-cols-1 gap-4 sm:gap-5 lg:grid-cols-2">
          {/* Recent Orders */}
          <AdminCard
            title="Recent Orders"
            icon={ShoppingBagIcon}
            color="primary"
            footerLink="/admin/orders"
            footerText="View all orders"
          >
            {dashboardData.recentOrders && dashboardData.recentOrders.length > 0 ? (
              <div className="overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-3 py-2 sm:px-4 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order</th>
                      <th scope="col" className="px-3 py-2 sm:px-4 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                      <th scope="col" className="px-3 py-2 sm:px-4 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th scope="col" className="px-3 py-2 sm:px-4 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {dashboardData.recentOrders.slice(0, 5).map((order) => (
                      <tr key={order.id} className="hover:bg-gray-50">
                        <td className="px-3 py-2 sm:px-4 sm:py-3 whitespace-nowrap text-xs sm:text-sm font-medium text-emerald-600">#{order.id}</td>
                        <td className="px-3 py-2 sm:px-4 sm:py-3 whitespace-nowrap text-xs sm:text-sm text-gray-900">{order.customer}</td>
                        <td className="px-3 py-2 sm:px-4 sm:py-3 whitespace-nowrap text-xs sm:text-sm">
                          <span className={`px-1.5 py-0.5 sm:px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                            ${order.status === 'Completed' ? 'bg-green-100 text-green-800' :
                              order.status === 'Processing' ? 'bg-blue-100 text-blue-800' :
                              order.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-gray-100 text-gray-800'}`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="px-3 py-2 sm:px-4 sm:py-3 whitespace-nowrap text-xs sm:text-sm text-gray-900">${order.total}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="py-8 text-center text-gray-500">No recent orders</div>
            )}
          </AdminCard>

          {/* Low Stock Products */}
          <AdminCard
            title="Low Stock Products"
            icon={BellAlertIcon}
            color="red"
            footerLink="/admin/products"
            footerText="View all products"
          >
            {dashboardData.lowStockProducts && dashboardData.lowStockProducts.length > 0 ? (
              <div className="space-y-4">
                {dashboardData.lowStockProducts.slice(0, 5).map((item, index) => (
                  <div key={index} className="rounded-lg bg-gray-50 p-3 sm:p-4">
                    <div className="mb-1.5 sm:mb-2 flex items-center justify-between">
                      <div className="font-medium text-gray-800 text-xs sm:text-sm">{item.name}</div>
                      <div className="rounded-full px-1.5 py-0.5 sm:px-2 sm:py-1 text-xs font-semibold text-red-600 bg-red-100">
                        {item.value}
                      </div>
                    </div>
                    <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${item.value <= item.threshold ? 'bg-red-500' : 'bg-yellow-500'}`}
                        style={{ width: `${Math.min(100, (item.value / item.max) * 100)}%` }}
                      ></div>
                    </div>
                    <div className="mt-2 text-xs text-gray-500">
                      Threshold: {item.threshold}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center text-gray-500">No low stock products</div>
            )}
          </AdminCard>
        </div>

        {/* Additional Metrics Section */}
        <div className="mt-8 mb-8">
          <AdminCard
            title="Performance Metrics"
            icon={SparklesIcon}
            color="primary"
          >
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Customer Satisfaction</span>
                    <span className="text-sm font-medium text-[#006B51]">92%</span>
                  </div>
                  <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-[#006B51] to-[#008B6A] rounded-full" style={{ width: '92%' }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Order Fulfillment</span>
                    <span className="text-sm font-medium text-[#006B51]">87%</span>
                  </div>
                  <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-[#006B51] to-[#008B6A] rounded-full" style={{ width: '87%' }}></div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Website Traffic</span>
                    <span className="text-sm font-medium text-[#006B51]">78%</span>
                  </div>
                  <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-[#006B51] to-[#008B6A] rounded-full" style={{ width: '78%' }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Inventory Turnover</span>
                    <span className="text-sm font-medium text-[#006B51]">65%</span>
                  </div>
                  <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-[#006B51] to-[#008B6A] rounded-full" style={{ width: '65%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </AdminCard>
        </div>
      </div>
    </div>
  );
}
