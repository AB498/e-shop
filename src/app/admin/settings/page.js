'use client';

import { useState } from 'react';
import {
  UserIcon,
  BellIcon,
  ShieldCheckIcon,
  CubeIcon,
  KeyIcon
} from '@heroicons/react/24/outline';
import CourierSettings from './CourierSettings';
import SecretsSettings from './SecretsSettings';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('courier');

  const tabs = [
    { id: 'courier', name: 'Courier Settings', icon: CubeIcon },
    { id: 'secrets', name: 'API Secrets', icon: KeyIcon },
    { id: 'account', name: 'Account Settings', icon: UserIcon },
    { id: 'notifications', name: 'Notifications', icon: BellIcon },
    { id: 'security', name: 'Security', icon: ShieldCheckIcon },
  ];

  return (
    <div className="space-y-4 md:space-y-6">
      <div>
        <h1 className="text-xl md:text-2xl font-semibold text-gray-900">Settings</h1>
        <p className="mt-1 md:mt-2 text-xs md:text-sm text-gray-700">
          Manage your store settings and preferences
        </p>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="sm:hidden">
          <label htmlFor="tabs" className="sr-only">
            Select a tab
          </label>
          <select
            id="tabs"
            name="tabs"
            className="block w-full pl-3 pr-10 py-2.5 text-sm border-gray-300 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 rounded-md"
            value={activeTab}
            onChange={(e) => setActiveTab(e.target.value)}
          >
            {tabs.map((tab) => (
              <option key={tab.id} value={tab.id}>
                {tab.name}
              </option>
            ))}
          </select>
        </div>
        <div className="hidden sm:block overflow-hidden">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-2 md:space-x-8 px-4 md:px-6 overflow-x-auto scrollbar-hide" aria-label="Tabs">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    ${activeTab === tab.id
                      ? 'border-emerald-500 text-emerald-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }
                    whitespace-nowrap py-3 md:py-4 px-1 border-b-2 font-medium text-xs md:text-sm flex items-center
                  `}
                >
                  <tab.icon
                    className={`
                      ${activeTab === tab.id ? 'text-emerald-500' : 'text-gray-400'}
                      -ml-0.5 mr-1 md:mr-2 h-4 w-4 md:h-5 md:w-5
                    `}
                    aria-hidden="true"
                  />
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>
        </div>

        <div className="p-3 md:p-6">
          {activeTab === 'secrets' && (
            <SecretsSettings />
          )}

          {activeTab === 'courier' && (
            <CourierSettings />
          )}

          {activeTab === 'account' && (
            <div className="space-y-4 md:space-y-6">
              <h3 className="text-base md:text-lg font-medium leading-6 text-gray-900">Account Settings</h3>
              <div className="grid grid-cols-1 gap-y-4 md:gap-y-6 gap-x-3 md:gap-x-4 xs:grid-cols-2 sm:grid-cols-6">
                <div className="xs:col-span-1 sm:col-span-3">
                  <label htmlFor="first-name" className="block text-xs md:text-sm font-medium text-gray-700">
                    First name
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      name="first-name"
                      id="first-name"
                      defaultValue="Admin"
                      className="shadow-sm focus:ring-emerald-500 focus:border-emerald-500 block w-full text-xs md:text-sm border-gray-300 rounded-md h-9 md:h-10"
                    />
                  </div>
                </div>

                <div className="xs:col-span-1 sm:col-span-3">
                  <label htmlFor="last-name" className="block text-xs md:text-sm font-medium text-gray-700">
                    Last name
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      name="last-name"
                      id="last-name"
                      defaultValue="User"
                      className="shadow-sm focus:ring-emerald-500 focus:border-emerald-500 block w-full text-xs md:text-sm border-gray-300 rounded-md h-9 md:h-10"
                    />
                  </div>
                </div>

                <div className="xs:col-span-2 sm:col-span-4">
                  <label htmlFor="email" className="block text-xs md:text-sm font-medium text-gray-700">
                    Email address
                  </label>
                  <div className="mt-1">
                    <input
                      id="email"
                      name="email"
                      type="email"
                      defaultValue="admin@eshop.com"
                      className="shadow-sm focus:ring-emerald-500 focus:border-emerald-500 block w-full text-xs md:text-sm border-gray-300 rounded-md h-9 md:h-10"
                    />
                  </div>
                </div>
              </div>
              <div className="flex flex-row justify-end gap-2 mt-4">
                <button
                  type="button"
                  className="w-auto bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-xs md:text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="w-auto ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-xs md:text-sm font-medium rounded-md text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                >
                  Save
                </button>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="space-y-4 md:space-y-6">
              <h3 className="text-base md:text-lg font-medium leading-6 text-gray-900">Notification Preferences</h3>
              <div className="space-y-3 md:space-y-4">
                <div className="relative flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="notify-orders"
                      name="notify-orders"
                      type="checkbox"
                      defaultChecked
                      className="focus:ring-emerald-500 h-4 w-4 text-emerald-600 border-gray-300 rounded"
                    />
                  </div>
                  <div className="ml-3">
                    <label htmlFor="notify-orders" className="font-medium text-xs md:text-sm text-gray-700">
                      New Orders
                    </label>
                    <p className="text-xs md:text-sm text-gray-500">Get notified when a new order is placed</p>
                  </div>
                </div>
                <div className="relative flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="notify-stock"
                      name="notify-stock"
                      type="checkbox"
                      defaultChecked
                      className="focus:ring-emerald-500 h-4 w-4 text-emerald-600 border-gray-300 rounded"
                    />
                  </div>
                  <div className="ml-3">
                    <label htmlFor="notify-stock" className="font-medium text-xs md:text-sm text-gray-700">
                      Low Stock Alerts
                    </label>
                    <p className="text-xs md:text-sm text-gray-500">Get notified when products are running low</p>
                  </div>
                </div>
                <div className="relative flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="notify-customers"
                      name="notify-customers"
                      type="checkbox"
                      className="focus:ring-emerald-500 h-4 w-4 text-emerald-600 border-gray-300 rounded"
                    />
                  </div>
                  <div className="ml-3">
                    <label htmlFor="notify-customers" className="font-medium text-xs md:text-sm text-gray-700">
                      New Customers
                    </label>
                    <p className="text-xs md:text-sm text-gray-500">Get notified when a new customer registers</p>
                  </div>
                </div>
              </div>
              <div className="flex flex-row justify-end gap-2 mt-4">
                <button
                  type="button"
                  className="w-auto bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-xs md:text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="w-auto ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-xs md:text-sm font-medium rounded-md text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                >
                  Save
                </button>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-4 md:space-y-6">
              <h3 className="text-base md:text-lg font-medium leading-6 text-gray-900">Security Settings</h3>
              <div className="space-y-4 md:space-y-6">
                <div>
                  <h4 className="text-xs md:text-sm font-medium text-gray-900">Change Password</h4>
                  <div className="mt-2 grid grid-cols-1 gap-y-4 md:gap-y-6 gap-x-3 md:gap-x-4 xs:grid-cols-2 sm:grid-cols-6">
                    <div className="xs:col-span-2 sm:col-span-4">
                      <label htmlFor="current-password" className="block text-xs md:text-sm font-medium text-gray-700">
                        Current Password
                      </label>
                      <div className="mt-1">
                        <input
                          type="password"
                          name="current-password"
                          id="current-password"
                          className="shadow-sm focus:ring-emerald-500 focus:border-emerald-500 block w-full text-xs md:text-sm border-gray-300 rounded-md h-9 md:h-10"
                        />
                      </div>
                    </div>
                    <div className="xs:col-span-2 sm:col-span-4">
                      <label htmlFor="new-password" className="block text-xs md:text-sm font-medium text-gray-700">
                        New Password
                      </label>
                      <div className="mt-1">
                        <input
                          type="password"
                          name="new-password"
                          id="new-password"
                          className="shadow-sm focus:ring-emerald-500 focus:border-emerald-500 block w-full text-xs md:text-sm border-gray-300 rounded-md h-9 md:h-10"
                        />
                      </div>
                    </div>
                    <div className="xs:col-span-2 sm:col-span-4">
                      <label htmlFor="confirm-password" className="block text-xs md:text-sm font-medium text-gray-700">
                        Confirm New Password
                      </label>
                      <div className="mt-1">
                        <input
                          type="password"
                          name="confirm-password"
                          id="confirm-password"
                          className="shadow-sm focus:ring-emerald-500 focus:border-emerald-500 block w-full text-xs md:text-sm border-gray-300 rounded-md h-9 md:h-10"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="text-xs md:text-sm font-medium text-gray-900">Two-Factor Authentication</h4>
                  <div className="mt-2">
                    <button
                      type="button"
                      className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-xs md:text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 h-9 md:h-10"
                    >
                      Enable Two-Factor Authentication
                    </button>
                  </div>
                </div>
              </div>
              <div className="flex flex-row justify-end gap-2 mt-4">
                <button
                  type="button"
                  className="w-auto bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-xs md:text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="w-auto ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-xs md:text-sm font-medium rounded-md text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                >
                  Save
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
