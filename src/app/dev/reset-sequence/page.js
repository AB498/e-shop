'use client'
import React, { useState } from 'react';
import Link from 'next/link';

export default function ResetSequencePage() {
  const [table, setTable] = useState('users');
  const [value, setValue] = useState('');
  const [status, setStatus] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [advancedMode, setAdvancedMode] = useState(false);

  const handleReset = async () => {
    setIsLoading(true);
    setStatus('');

    try {
      // Prepare request body
      const requestBody = { table };

      // If in advanced mode and a value is provided, include it
      if (advancedMode && value.trim() !== '') {
        const numValue = parseInt(value, 10);
        if (!isNaN(numValue) && numValue > 0) {
          requestBody.value = numValue;
        } else {
          setStatus('Error: Value must be a positive number');
          setIsLoading(false);
          return;
        }
      }

      const response = await fetch('/api/dev/reset-sequence', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus(`Success: ${data.message}`);
      } else {
        setStatus(`Error: ${data.error}`);
      }
    } catch (error) {
      setStatus(`Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Reset Database Sequence</h1>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="mb-4">
          <label htmlFor="table" className="block text-gray-700 mb-2">
            Table Name
          </label>
          <input
            type="text"
            id="table"
            value={table}
            onChange={(e) => setTable(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>

        <div className="mb-4">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="advancedMode"
              checked={advancedMode}
              onChange={(e) => setAdvancedMode(e.target.checked)}
              className="mr-2"
            />
            <label htmlFor="advancedMode" className="text-gray-700">
              Advanced Mode
            </label>
          </div>
        </div>

        {advancedMode && (
          <div className="mb-4">
            <label htmlFor="value" className="block text-gray-700 mb-2">
              Sequence Value (optional)
            </label>
            <input
              type="number"
              id="value"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
              placeholder="Leave empty to auto-calculate"
              min="1"
            />
            <p className="text-xs text-gray-500 mt-1">
              Manually set the next sequence value. Use with caution!
            </p>
          </div>
        )}

        <button
          onClick={handleReset}
          disabled={isLoading}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {isLoading ? 'Resetting...' : 'Reset Sequence'}
        </button>

        {status && (
          <div className={`mt-4 p-3 rounded ${status.startsWith('Success') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {status}
          </div>
        )}
      </div>

      <div className="bg-gray-100 p-4 rounded-lg">
        <h2 className="text-lg font-semibold mb-2">What does this do?</h2>
        <p className="mb-2">
          This utility resets the auto-increment sequence for a database table. This is useful when you encounter
          primary key constraint violations during inserts.
        </p>
        <p className="mb-2">
          By default, the sequence will be reset to the maximum ID value + 1, ensuring that new inserts will use unique IDs.
        </p>
        <p className="mb-2">
          In advanced mode, you can manually specify the next sequence value. This should only be used if the automatic
          calculation doesn't resolve your issue.
        </p>
        <p className="mb-4">
          <strong>Common tables to reset:</strong>
        </p>
        <ul className="list-disc pl-5 mb-4 text-sm">
          <li><code>users</code> - User accounts</li>
          <li><code>orders</code> - Customer orders</li>
          <li><code>order_items</code> - Items within orders</li>
          <li><code>products</code> - Product catalog</li>
          <li><code>categories</code> - Product categories</li>
          <li><code>files</code> - Uploaded files</li>
        </ul>
        <p>
          <Link href="/dev" className="text-blue-500 hover:underline">
            Back to Developer Tools
          </Link>
        </p>
      </div>
    </div>
  );
}
