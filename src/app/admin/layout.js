import React from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getDashboardStats, isInternalCourierActive } from "@/lib/actions/admin";
import AdminLayoutClient from "./AdminLayoutClient";
import { redirect } from "next/navigation";

export default async function AdminLayout({ children }) {
  // Fetch user session data
  const session = await getServerSession(authOptions);

  // Check if user is authenticated and has admin role
  if (!session || session.user.role !== 'admin') {
    // Redirect to home page with query parameter for notification
    redirect('/?adminRedirect=true');
  }

  // Fetch notification count and other dashboard stats
  const dashboardStats = await getDashboardStats();

  // Check if internal courier system is active
  const internalCourierEnabled = await isInternalCourierActive();

  // Get pending orders count for notifications
  const pendingOrdersCount = dashboardStats?.pendingOrdersCount || 0;

  // Get user data
  const userData = {
    name: session?.user?.name || "Admin User",
    email: session?.user?.email || "admin@example.com",
    image: session?.user?.image || null,
    role: session?.user?.role || "admin"
  };

  // Define navigation items with serializable data only
  const navigationItems = [
    {
      name: 'Dashboard',
      href: '/admin',
      iconName: 'ChartBarIcon',
      customIconName: 'FiShoppingCart'
    },
    {
      name: 'Products',
      href: '/admin/products',
      iconName: 'ArchiveBoxIcon',
      customIconName: 'FiPackage'
    },
    {
      name: 'Categories',
      href: '/admin/categories',
      iconName: 'TagIcon'
    },
    {
      name: 'Orders',
      href: '/admin/orders',
      iconName: 'ShoppingBagIcon',
      customIconName: 'FiShoppingCart'
    },
    {
      name: 'Courier Management',
      href: '/admin/couriers',
      iconName: 'TruckIcon',
      customIconName: 'FiTruck'
    },
    // Only show Delivery Persons navigation item if internal courier is active
    ...(internalCourierEnabled ? [{
      name: 'Delivery Persons',
      href: '/admin/delivery-persons',
      iconName: 'UserGroupIcon',
      customIconName: 'FiUsers'
    }] : []),
    {
      name: 'Courier Orders',
      href: '/admin/courier-orders',
      iconName: 'TruckIcon',
      customIconName: 'FiTruck'
    },
    // Store Locations removed as they are now created from external provider pages
    {
      name: 'Customers',
      href: '/admin/customers',
      iconName: 'UserGroupIcon',
      customIconName: 'FiUsers'
    },
    {
      name: 'Contact Messages',
      href: '/admin/contact-messages',
      iconName: 'EnvelopeIcon',
      customIconName: 'FiMail'
    },
    {
      name: 'Admin Users',
      href: '/admin/users',
      iconName: 'UserIcon',
      customIconName: 'FiUser'
    },
    {
      name: 'Files',
      href: '/admin/files',
      iconName: 'PhotoIcon'
    },
    {
      name: 'Promotions',
      href: '/admin/promotions',
      iconName: 'SparklesIcon'
    },
    {
      name: 'Reviews',
      href: '/admin/reviews',
      iconName: 'StarIcon'
    },
    {
      name: 'Payments',
      href: '/admin/payments',
      iconName: 'CurrencyDollarIcon',
      customIconName: 'FiDollarSign'
    },
    {
      name: 'Settings',
      href: '/admin/settings',
      iconName: 'CogIcon',
      customIconName: 'FiSettings'
    },
    {
      name: 'Database Backups',
      href: '/admin/backups',
      iconName: 'CloudArrowDownIcon',
      customIconName: 'FiDatabase'
    },
  ];

  // Return the AdminLayoutClient component with the server-fetched data
  return (
    <AdminLayoutClient
      navigationItems={navigationItems}
      userData={userData}
      pendingOrdersCount={pendingOrdersCount}
    >
      {children}
    </AdminLayoutClient>
  );
}