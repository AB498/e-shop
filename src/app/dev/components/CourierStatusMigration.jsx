'use client';

import { useState } from 'react';
import { ArrowPathIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

export default function CourierStatusMigration() {
  const [migrationStatus, setMigrationStatus] = useState('idle'); // idle, loading, success, error
  const [migrationMessage, setMigrationMessage] = useState('');

  const handleRunMigration = async () => {
    try {
      setMigrationStatus('loading');
      setMigrationMessage('Converting courier_status from enum to text...');

      const response = await fetch('/api/dev/convert-courier-status', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to run migration');
      }

      setMigrationStatus('success');
      setMigrationMessage(data.message);
    } catch (error) {
      console.error('Error running migration:', error);
      setMigrationStatus('error');
      setMigrationMessage(error.message || 'An error occurred while running the migration');
    }
  };

  return (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">
          Convert Courier Status Type
        </h3>
        <div className="mt-2 max-w-xl text-sm text-gray-500">
          <p>
            This will convert the courier_status field from an enum type to a text type in the database.
            This allows for more flexible status values from the courier API.
          </p>
        </div>
        <div className="mt-5">
          <button
            type="button"
            onClick={handleRunMigration}
            disabled={migrationStatus === 'loading'}
            className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white
              ${migrationStatus === 'loading'
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
              }`}
          >
            {migrationStatus === 'loading' ? (
              <>
                <ArrowPathIcon className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" />
                Running Migration...
              </>
            ) : (
              <>
                <CheckCircleIcon className="-ml-1 mr-2 h-5 w-5" />
                Convert Courier Status Type
              </>
            )}
          </button>
        </div>

        {migrationStatus === 'success' && (
          <div className="mt-3 text-sm text-green-600">
            <p className="font-medium">Success!</p>
            <p>{migrationMessage}</p>
          </div>
        )}

        {migrationStatus === 'error' && (
          <div className="mt-3 text-sm text-red-600">
            <p className="font-medium">Error:</p>
            <p>{migrationMessage}</p>
          </div>
        )}
      </div>
    </div>
  );
}
