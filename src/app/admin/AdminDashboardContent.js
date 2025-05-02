'use client';

import { useState, useEffect } from 'react';
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
import Link from 'next/link';

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

export default function AdminDashboardContent() {
  const [dashboardData, setDashboardData] = useState({
    stats: [],
    salesChartData: null,
    categoryChartData: null,
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
        
        // Format stats data
        const stats = [
          {
            name: 'Total Revenue',
            value: `$${parseFloat(statsData.totalRevenue).toFixed(2)}`,
            change: `${statsData.revenueGrowth > 0 ? '+' : ''}${statsData.revenueGrowth.toFixed(1)}%`,
            trend: statsData.revenueGrowth >= 0 ? 'up' : 'down',
            icon: CurrencyDollarIcon,
            bgColor: 'bg-emerald-100',
            iconColor: 'text-emerald-600'
          },
          {
            name: 'Orders',
            value: statsData.totalOrders.toString(),
            change: `${statsData.ordersGrowth > 0 ? '+' : ''}${statsData.ordersGrowth.toFixed(1)}%`,
            trend: statsData.ordersGrowth >= 0 ? 'up' : 'down',
            icon: ShoppingBagIcon,
            bgColor: 'bg-blue-100',
            iconColor: 'text-blue-600'
          },
          {
            name: 'Customers',
            value: statsData.totalCustomers.toString(),
            change: `${statsData.customersGrowth > 0 ? '+' : ''}${statsData.customersGrowth.toFixed(1)}%`,
            trend: statsData.customersGrowth >= 0 ? 'up' : 'down',
            icon: UserGroupIcon,
            bgColor: 'bg-purple-100',
            iconColor: 'text-purple-600'
          },
          {
            name: 'Conversion Rate',
            value: `${statsData.conversionRate.toFixed(1)}%`,
            change: '0.0%', // Mock data as we don't have historical conversion rate
            trend: 'up',
            icon: ShoppingCartIcon,
            bgColor: 'bg-amber-100',
            iconColor: 'text-amber-600'
          },
        ];
        
        // Format sales chart data
        const currentYear = new Date().getFullYear();
        const salesChartData = {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
          datasets: [
            {
              label: `Sales ${currentYear}`,
              data: salesData.currentYearSales.map(value => parseFloat(value) || 0),
              borderColor: 'rgb(16, 185, 129)',
              backgroundColor: 'rgba(16, 185, 129, 0.1)',
              tension: 0.4,
              fill: true,
            },
            {
              label: `Sales ${currentYear - 1}`,
              data: salesData.previousYearSales.map(value => parseFloat(value) || 0),
              borderColor: 'rgb(107, 114, 128)',
              backgroundColor: 'rgba(107, 114, 128, 0.1)',
              tension: 0.4,
              fill: true,
            },
          ],
        };
        
        // Format category chart data
        const categoryChartData = {
          labels: categoryData.map(item => item.categoryName),
          datasets: [
            {
              label: 'Sales by Category',
              data: categoryData.map(item => parseFloat(item.total) || 0),
              backgroundColor: [
                'rgba(16, 185, 129, 0.7)',
                'rgba(59, 130, 246, 0.7)',
                'rgba(139, 92, 246, 0.7)',
                'rgba(245, 158, 11, 0.7)',
                'rgba(239, 68, 68, 0.7)',
                'rgba(75, 85, 99, 0.7)',
                'rgba(16, 185, 129, 0.5)',
                'rgba(59, 130, 246, 0.5)',
                'rgba(139, 92, 246, 0.5)',
                'rgba(245, 158, 11, 0.5)',
              ],
              borderWidth: 1,
            },
          ],
        };
        
        setDashboardData({
          stats,
          salesChartData,
          categoryChartData,
          recentOrders: ordersData,
          lowStockProducts: productsData
        });
        
        setIsLoading(false);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError(err.message);
        setIsLoading(false);
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

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-4 my-4">
        <h3 className="text-lg font-medium">Error loading dashboard data</h3>
        <p>{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="mt-2 px-4 py-2 bg-red-100 hover:bg-red-200 text-red-800 rounded-md"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {dashboardData.stats.map((stat) => (
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
            {dashboardData.salesChartData && (
              <Line options={salesChartOptions} data={dashboardData.salesChartData} />
            )}
          </div>
        </div>

        {/* Category Chart */}
        <div className="rounded-lg bg-white shadow p-6">
          <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">Sales by Category</h3>
          <div className="h-80">
            {dashboardData.categoryChartData && (
              <Bar options={categoryChartOptions} data={dashboardData.categoryChartData} />
            )}
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
                {dashboardData.recentOrders.map((order) => (
                  <tr key={order.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                      <Link href={`/admin/orders/${order.id}`}>
                        #{order.id}
                      </Link>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{order.customer}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.date}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                        ${order.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                          order.status === 'Shipped' ? 'bg-blue-100 text-blue-800' :
                          order.status === 'Cancelled' ? 'bg-red-100 text-red-800' :
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
              <Link href="/admin/orders" className="font-medium text-emerald-600 hover:text-emerald-500">
                View all orders
              </Link>
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
                {dashboardData.lowStockProducts.map((product) => (
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
              <Link href="/admin/inventory" className="font-medium text-emerald-600 hover:text-emerald-500">
                Manage inventory
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
