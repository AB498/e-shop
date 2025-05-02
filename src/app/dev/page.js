'use client';

import DatabaseSeeder from './components/DatabaseSeeder';
import OrderTester from './components/OrderTester';
import PathaoWebhookTester from './components/PathaoWebhookTester';

export default function DevPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Development Tools</h1>
          <div className='grow'></div>
          <a
            href="/admin"
            className="mr-2 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
          >
            Admin Panel
          </a>
          <a
            href="/"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
          >
            Back to Site
          </a>
        </div>

        <div className="mt-8">
          {/* Database Seeder Component */}
          <DatabaseSeeder />

          {/* Main Development Tools Grid */}
          <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2">
            {/* Order Test Component */}
            <OrderTester />

            {/* Pathao Webhook Tester Component */}
            <PathaoWebhookTester />
          </div>

          {/* Webhook Information */}
          <div className="mt-8 bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h2 className="text-lg font-medium text-gray-900">Pathao Webhook Integration</h2>
              <div className="mt-3">
                <p className="text-sm text-gray-500">
                  The Pathao webhook endpoint is available at:
                </p>
                <div className="mt-2 bg-gray-100 p-3 rounded-md">
                  <code className="text-sm text-indigo-600">
                    {process.env.NODE_ENV === 'production'
                      ? 'https://thai-bangla-store.vercel.app/api/webhooks/pathao/status-update'
                      : 'http://localhost:3000/api/webhooks/pathao/status-update'}
                  </code>
                </div>
                <p className="mt-3 text-sm text-gray-500">
                  Configure this URL in the Pathao merchant dashboard to receive real-time status updates.
                  The webhook secret is configured in the .env file.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
