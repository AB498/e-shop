import React from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getDashboardStats } from "@/lib/actions/admin";
import AdminLayoutClient from "./AdminLayoutClient";

export default async function AdminLayout({ children }) {
  // Fetch user session data
  const session = await getServerSession(authOptions);

  // Fetch notification count and other dashboard stats
  const dashboardStats = await getDashboardStats();

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
    {
      name: 'Delivery Persons',
      href: '/admin/delivery-persons',
      iconName: 'UserGroupIcon',
      customIconName: 'FiUsers'
    },
    {
      name: 'Courier Orders',
      href: '/admin/courier-orders',
      iconName: 'TruckIcon',
      customIconName: 'FiTruck'
    },
    {
      name: 'Store Locations',
      href: '/admin/store-locations',
      iconName: 'MapPinIcon'
    },
    {
      name: 'Customers',
      href: '/admin/customers',
      iconName: 'UserGroupIcon',
      customIconName: 'FiUsers'
    },
    {
      name: 'Files',
      href: '/admin/files',
      iconName: 'PhotoIcon'
    },
    {
      name: 'Analytics',
      href: '/admin/analytics',
      iconName: 'ChartBarIcon'
    },
    {
      name: 'Settings',
      href: '/admin/settings',
      iconName: 'CogIcon',
      customIconName: 'FiSettings'
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