'use client';

import { useState } from 'react';
import {
  UserIcon,
  BellIcon,
  ShieldCheckIcon,
  CubeIcon,
  CreditCardIcon
} from '@heroicons/react/24/outline';
import CourierSettings from './CourierSettings';
import AccountSettings from './AccountSettings';
import NotificationSettings from './NotificationSettings';
import SecuritySettings from './SecuritySettings';
import PaymentSettings from './PaymentSettings';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('courier');

  const tabs = [
    { id: 'courier', name: 'Courier Settings', icon: CubeIcon },
    { id: 'payment', name: 'Payment Settings', icon: CreditCardIcon },
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
          {activeTab === 'courier' && (
            <CourierSettings />
          )}

          {activeTab === 'payment' && (
            <PaymentSettings />
          )}

          {activeTab === 'account' && (
            <AccountSettings />
          )}

          {activeTab === 'notifications' && (
            <NotificationSettings />
          )}

          {activeTab === 'security' && (
            <SecuritySettings />
          )}
        </div>
      </div>
    </div>
  );
}
