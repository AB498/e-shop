'use client';

import { useState } from 'react';
import { TruckIcon } from '@heroicons/react/24/outline';
import DefaultCourierSettings from './DefaultCourierSettings';
import AutoCourierToggle from './AutoCourierToggle';

export default function CourierSettings() {

  return (
    <div className="space-y-4 md:space-y-6">
      <h3 className="text-base md:text-lg font-medium leading-6 text-gray-900">Courier Settings</h3>

      {/* Auto Courier Toggle */}
      <AutoCourierToggle />

      {/* Default Courier Provider Settings */}
      <DefaultCourierSettings />

      {/* Courier Provider Information */}
      <div className="bg-white shadow overflow-hidden rounded-lg">
        <div className="px-3 py-3 md:px-4 md:py-5 sm:px-6 bg-gray-50">
          <h3 className="text-sm md:text-lg leading-6 font-medium text-gray-900 flex items-center">
            <TruckIcon className="h-4 w-4 md:h-5 md:w-5 mr-1 md:mr-2 text-gray-500" />
            Courier Providers
          </h3>
          <p className="mt-1 max-w-2xl text-xs md:text-sm text-gray-500">
            Information about available courier providers
          </p>
        </div>

        <div className="border-t border-gray-200 px-3 py-4 md:px-4 md:py-5 sm:p-6">
          <div className="space-y-4 md:space-y-6">
            <p className="text-sm text-gray-600">
              The system supports multiple courier providers. You can select the default provider above,
              and enable or disable automatic courier order creation for all providers.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border border-gray-200 rounded-md p-3">
                <h4 className="font-medium text-gray-900">Pathao</h4>
                <p className="text-xs text-gray-500 mt-1">
                  Pathao is a popular courier service in Bangladesh with extensive coverage.
                </p>
              </div>
              <div className="border border-gray-200 rounded-md p-3">
                <h4 className="font-medium text-gray-900">Steadfast</h4>
                <p className="text-xs text-gray-500 mt-1">
                  Steadfast offers reliable courier services with competitive rates.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
