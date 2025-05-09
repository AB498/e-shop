'use client';

import { ChartBarIcon } from '@heroicons/react/24/outline';
import { FiRefreshCw } from 'react-icons/fi';

export default function DashboardHeader({ onRefresh }) {
  return (
    <div className="mb-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
        <div className="mb-4 sm:mb-0">
          <div className="flex items-center">
            <div className="mr-3 p-2 rounded-md bg-emerald-100">
              <ChartBarIcon className="h-6 w-6 text-emerald-600" aria-hidden="true" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          </div>
          <p className="mt-2 text-sm text-gray-600">
            Welcome to your admin dashboard. Here's an overview of your store's performance.
          </p>
        </div>
        
        <div className="flex flex-wrap gap-3 justify-end">
          <button
            type="button"
            onClick={onRefresh}
            className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-colors duration-200"
          >
            <FiRefreshCw className="mr-2 h-4 w-4" />
            Refresh Data
          </button>
        </div>
      </div>
      
      <div className="mt-4 p-4 bg-gradient-to-r from-[#006B51]/10 to-[#008B6A]/10 rounded-lg border border-emerald-100">
        <div className="flex flex-col sm:flex-row items-start sm:items-center">
          <div className="flex-shrink-0 mb-3 sm:mb-0 sm:mr-4">
            <div className="p-2 bg-white rounded-full shadow-sm">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <div>
            <h3 className="text-sm font-medium text-emerald-800">Info</h3>
            <p className="mt-1 text-xs text-emerald-700">
              You can view the latest performance metrics below.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
