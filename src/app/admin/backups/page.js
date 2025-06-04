import { Suspense } from 'react';
import BackupsClient from './BackupsClient';

export const metadata = {
  title: 'Database Backups - Admin Panel',
  description: 'Manage database backups and restore points',
};

export default function BackupsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Database Backups</h1>
        <p className="mt-1 text-sm text-gray-600">
          Manage database backups, create restore points, and perform rollbacks.
        </p>
      </div>

      <Suspense fallback={
        <div className="bg-white shadow rounded-lg p-6">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              <div className="h-4 bg-gray-200 rounded w-4/6"></div>
            </div>
          </div>
        </div>
      }>
        <BackupsClient />
      </Suspense>
    </div>
  );
}
