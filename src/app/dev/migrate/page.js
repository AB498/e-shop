'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function MigratePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isRunning, setIsRunning] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  // Check authentication and redirect if not admin
  if (status === 'loading') {
    return <div className="p-8">Loading...</div>;
  }

  if (status === 'unauthenticated' || (session && session.user.role !== 'admin')) {
    router.push('/login');
    return null;
  }

  const runMigration = async () => {
    setIsRunning(true);
    setResult(null);
    setError(null);

    try {
      const response = await fetch('/api/dev/run-migration', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to run migration');
      }

      setResult(data.message);
    } catch (err) {
      console.error('Error running migration:', err);
      setError(err.message || 'An error occurred while running the migration');
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-6">
        <Link href="/dev" className="text-blue-600 hover:underline">
          &larr; Back to Dev Dashboard
        </Link>
      </div>

      <h1 className="text-2xl font-bold mb-6">Database Migration</h1>

      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Run Courier Fields Migration</h2>
        <p className="mb-4">
          This will add the following fields to the database:
        </p>
        <ul className="list-disc pl-6 mb-6 space-y-1">
          <li><code>shipping_area</code> to the orders table</li>
          <li><code>shipping_landmark</code> to the orders table</li>
          <li><code>shipping_instructions</code> to the orders table</li>
          <li><code>weight</code> to the products table</li>
        </ul>

        <button
          onClick={runMigration}
          disabled={isRunning}
          className={`px-4 py-2 rounded-md ${
            isRunning
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          {isRunning ? 'Running Migration...' : 'Run Migration'}
        </button>
      </div>

      {result && (
        <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-md mb-6">
          <p className="font-medium">Success!</p>
          <p>{result}</p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-md mb-6">
          <p className="font-medium">Error:</p>
          <p>{error}</p>
        </div>
      )}
    </div>
  );
}
