'use client';

import { useState } from 'react';
import {
  ArrowPathIcon,
  CodeBracketIcon,
  ServerIcon,
  ServerStackIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  InformationCircleIcon,
  TrashIcon,
  PlusIcon,
  Cog6ToothIcon,
  EyeIcon,
  PlayIcon,
  BeakerIcon
} from '@heroicons/react/24/outline';

export default function DevPage() {
  const [seedingStatus, setSeedingStatus] = useState('idle'); // idle, loading, success, error
  const [seedingMessage, setSeedingMessage] = useState('');
  const [seedingStats, setSeedingStats] = useState(null);
  const [seedingStep, setSeedingStep] = useState(0);
  const [seedingProgress, setSeedingProgress] = useState(0);

  // Define seeding steps
  const seedingSteps = [
    { name: 'Preparing', description: 'Preparing to seed database...' },
    { name: 'Dropping Tables', description: 'Dropping existing tables...' },
    { name: 'Creating Schema', description: 'Creating database schema...' },
    { name: 'Inserting Data', description: 'Inserting seed data...' },
    { name: 'Finalizing', description: 'Finalizing database setup...' },
    { name: 'Complete', description: 'Database seeding completed!' }
  ];

  const handleSeedDatabase = async () => {
    try {
      // Reset states
      setSeedingStatus('loading');
      setSeedingMessage('Initializing database seeding process...');
      setSeedingStats(null);
      setSeedingStep(0);
      setSeedingProgress(0);

      // Simulate step 1 progress (preparing)
      await new Promise(resolve => setTimeout(resolve, 500));
      setSeedingStep(1);
      setSeedingProgress(10);
      setSeedingMessage('Dropping existing tables...');

      // Make the API call
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 60000); // 60 second timeout

      const response = await fetch('/api/dev/seed', {
        method: 'POST',
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      // Simulate step progress during API call
      // Since we can't get real-time updates from the server,
      // we'll simulate progress for better UX
      setSeedingStep(2);
      setSeedingProgress(30);
      setSeedingMessage('Creating database schema...');
      await new Promise(resolve => setTimeout(resolve, 1000));

      setSeedingStep(3);
      setSeedingProgress(60);
      setSeedingMessage('Inserting seed data...');
      await new Promise(resolve => setTimeout(resolve, 1000));

      setSeedingStep(4);
      setSeedingProgress(90);
      setSeedingMessage('Finalizing database setup...');
      await new Promise(resolve => setTimeout(resolve, 500));

      const data = await response.json();

      if (response.ok) {
        setSeedingStep(5);
        setSeedingProgress(100);
        setSeedingStatus('success');
        setSeedingMessage(data.message || 'Database seeded successfully!');
        if (data.stats) {
          setSeedingStats(data.stats);
        }
      } else {
        throw new Error(data.error || 'Failed to seed database');
      }
    } catch (error) {
      setSeedingStatus('error');
      setSeedingMessage(error.name === 'AbortError'
        ? 'Seeding timed out. The operation took too long to complete.'
        : error.message);
      setSeedingStats(null);
      console.error('Error seeding database:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Development Tools</h1>
          <a
            href="/"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
          >
            Back to Site
          </a>
        </div>

        <div className="mt-8">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-emerald-100 rounded-md p-3">
                  <ServerStackIcon className="h-6 w-6 text-emerald-600" aria-hidden="true" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Database Tools</dt>
                    <dd>
                      <div className="text-lg font-medium text-gray-900">Seed Database</div>
                    </dd>
                  </dl>
                </div>
              </div>

              <div className="mt-5">
                <p className="text-sm text-gray-500 mb-4">
                  Populate the database with sample data for testing and development purposes.
                  This will create database tables and insert sample products, categories, users, orders, and files.
                  <span className="font-medium text-amber-600 block mt-1">Warning: This will drop existing tables and recreate them.</span>
                </p>

                <div className="flex items-center justify-between">
                  <button
                    type="button"
                    onClick={handleSeedDatabase}
                    disabled={seedingStatus === 'loading'}
                    className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white
                      ${seedingStatus === 'loading'
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500'
                      }`}
                  >
                    {seedingStatus === 'loading' ? (
                      <>
                        <ArrowPathIcon className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" />
                        Seeding...
                      </>
                    ) : (
                      <>
                        <ServerStackIcon className="-ml-1 mr-2 h-5 w-5" />
                        Seed Database
                      </>
                    )}
                  </button>

                  {/* Progress indicator for loading state */}
                  {seedingStatus === 'loading' && (
                    <div className="mt-4 w-full">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-blue-600">{seedingSteps[seedingStep].name}</span>
                        <span className="text-sm font-medium text-blue-600">{seedingProgress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div
                          className="bg-blue-600 h-2.5 rounded-full transition-all duration-300 ease-in-out"
                          style={{ width: `${seedingProgress}%` }}
                        ></div>
                      </div>
                      <p className="mt-1 text-xs text-gray-500">{seedingMessage}</p>

                      {/* Steps indicator */}
                      <div className="mt-4">
                        <ol className="flex items-center w-full">
                          {seedingSteps.map((_, index) => (
                            <li key={index} className={`flex items-center ${index < seedingSteps.length - 1 ? 'w-full' : ''}`}>
                              <span className={`flex items-center justify-center w-6 h-6 rounded-full shrink-0 text-xs
                                ${index < seedingStep ? 'bg-blue-600 text-white' :
                                  index === seedingStep ? 'bg-blue-100 text-blue-800 border border-blue-600' :
                                  'bg-gray-100 text-gray-500 border border-gray-300'}`}>
                                {index + 1}
                              </span>
                              {index < seedingSteps.length - 1 && (
                                <div className={`flex-1 h-0.5 mx-2 ${index < seedingStep ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
                              )}
                            </li>
                          ))}
                        </ol>
                        <div className="mt-2 text-xs text-gray-500">
                          {seedingSteps[seedingStep].description}
                        </div>
                      </div>
                    </div>
                  )}

                  {seedingStatus === 'success' && (
                    <div>
                      <div className="flex items-center text-sm text-green-600">
                        <CheckCircleIcon className="h-5 w-5 mr-1.5" />
                        {seedingMessage}
                      </div>

                      {seedingStats && (
                        <div className="mt-3 bg-green-50 p-3 rounded-md">
                          <h4 className="text-sm font-medium text-green-800 flex items-center">
                            <InformationCircleIcon className="h-5 w-5 mr-1.5" />
                            Seeding Statistics
                          </h4>
                          <ul className="mt-2 text-xs text-green-700 grid grid-cols-2 gap-x-4 gap-y-1">
                            <li className="flex justify-between">
                              <span>Products:</span>
                              <span className="font-medium">{seedingStats.products}</span>
                            </li>
                            <li className="flex justify-between">
                              <span>Categories:</span>
                              <span className="font-medium">{seedingStats.categories}</span>
                            </li>
                            <li className="flex justify-between">
                              <span>Users:</span>
                              <span className="font-medium">{seedingStats.users}</span>
                            </li>
                            <li className="flex justify-between">
                              <span>Orders:</span>
                              <span className="font-medium">{seedingStats.orders}</span>
                            </li>
                            <li className="flex justify-between">
                              <span>Order Items:</span>
                              <span className="font-medium">{seedingStats.orderItems}</span>
                            </li>
                            <li className="flex justify-between">
                              <span>Files:</span>
                              <span className="font-medium">{seedingStats.files}</span>
                            </li>
                          </ul>
                          <div className="mt-3 text-xs text-green-700">
                            <p className="font-medium">Admin User Credentials:</p>
                            <p>Email: admin@example.com</p>
                            <p>Password: password123</p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {seedingStatus === 'error' && (
                    <div>
                      <div className="flex items-center text-sm text-red-600">
                        <ExclamationCircleIcon className="h-5 w-5 mr-1.5" />
                        {seedingMessage}
                      </div>
                      <p className="mt-2 text-xs text-gray-500">
                        Try again or check the console for more details.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Additional development tools */}
          <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-blue-100 rounded-md p-3">
                    <ServerIcon className="h-6 w-6 text-blue-600" aria-hidden="true" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">API Testing</dt>
                      <dd>
                        <div className="text-lg font-medium text-gray-900">API Endpoints</div>
                      </dd>
                    </dl>
                  </div>
                </div>

                <div className="mt-5">
                  <p className="text-sm text-gray-500 mb-4">
                    Test and explore API endpoints. This tool will be implemented in future updates.
                  </p>

                  <button
                    type="button"
                    disabled
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gray-400 cursor-not-allowed"
                  >
                    <CodeBracketIcon className="-ml-1 mr-2 h-5 w-5" />
                    Coming Soon
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-purple-100 rounded-md p-3">
                    <ArrowPathIcon className="h-6 w-6 text-purple-600" aria-hidden="true" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">System Maintenance</dt>
                      <dd>
                        <div className="text-lg font-medium text-gray-900">Clear Cache</div>
                      </dd>
                    </dl>
                  </div>
                </div>

                <div className="mt-5">
                  <p className="text-sm text-gray-500 mb-4">
                    Clear application cache and temporary files. This tool will be implemented in future updates.
                  </p>

                  <button
                    type="button"
                    disabled
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gray-400 cursor-not-allowed"
                  >
                    <ArrowPathIcon className="-ml-1 mr-2 h-5 w-5" />
                    Coming Soon
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-amber-100 rounded-md p-3">
                    <ServerStackIcon className="h-6 w-6 text-amber-600" aria-hidden="true" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Database</dt>
                      <dd>
                        <div className="text-lg font-medium text-gray-900">Reset Database</div>
                      </dd>
                    </dl>
                  </div>
                </div>

                <div className="mt-5">
                  <p className="text-sm text-gray-500 mb-4">
                    Reset the database to its initial state. This will remove all data. Use with caution.
                  </p>

                  <button
                    type="button"
                    disabled
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gray-400 cursor-not-allowed"
                  >
                    <TrashIcon className="-ml-1 mr-2 h-5 w-5" />
                    Coming Soon
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-green-100 rounded-md p-3">
                    <BeakerIcon className="h-6 w-6 text-green-600" aria-hidden="true" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Content</dt>
                      <dd>
                        <div className="text-lg font-medium text-gray-900">Generate Demo Content</div>
                      </dd>
                    </dl>
                  </div>
                </div>

                <div className="mt-5">
                  <p className="text-sm text-gray-500 mb-4">
                    Generate additional demo content including products, users, and orders.
                  </p>

                  <button
                    type="button"
                    disabled
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gray-400 cursor-not-allowed"
                  >
                    <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
                    Coming Soon
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-indigo-100 rounded-md p-3">
                    <Cog6ToothIcon className="h-6 w-6 text-indigo-600" aria-hidden="true" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Configuration</dt>
                      <dd>
                        <div className="text-lg font-medium text-gray-900">Environment Variables</div>
                      </dd>
                    </dl>
                  </div>
                </div>

                <div className="mt-5">
                  <p className="text-sm text-gray-500 mb-4">
                    View and manage environment variables for development.
                  </p>

                  <button
                    type="button"
                    disabled
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gray-400 cursor-not-allowed"
                  >
                    <EyeIcon className="-ml-1 mr-2 h-5 w-5" />
                    Coming Soon
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-rose-100 rounded-md p-3">
                    <BeakerIcon className="h-6 w-6 text-rose-600" aria-hidden="true" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Testing</dt>
                      <dd>
                        <div className="text-lg font-medium text-gray-900">Run Tests</div>
                      </dd>
                    </dl>
                  </div>
                </div>

                <div className="mt-5">
                  <p className="text-sm text-gray-500 mb-4">
                    Run automated tests to verify application functionality.
                  </p>

                  <button
                    type="button"
                    disabled
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gray-400 cursor-not-allowed"
                  >
                    <PlayIcon className="-ml-1 mr-2 h-5 w-5" />
                    Coming Soon
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
