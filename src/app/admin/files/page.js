'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { ArrowPathIcon } from '@heroicons/react/24/outline';
import PageHeader from './PageHeader';
import SearchBar from './SearchBar';
import FilesTable from './FilesTable';

export default function FilesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [files, setFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check authentication and redirect if not admin
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    } else if (status === 'authenticated' && session.user.role !== 'admin') {
      router.push('/');
    }
  }, [status, session, router]);

  // Fetch files on component mount if authenticated
  useEffect(() => {
    if (status === 'authenticated') {
      fetchFiles();
    }
  }, [status]);

  // Fetch files from API
  const fetchFiles = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch('/api/admin/files');
      if (!response.ok) {
        throw new Error('Failed to fetch files');
      }

      const data = await response.json();
      setFiles(data);
    } catch (err) {
      console.error('Error fetching files:', err);
      setError(err.message || 'Failed to fetch files');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle deleting a file
  const handleDeleteFile = async (file) => {
    if (!confirm(`Are you sure you want to delete this file? This action cannot be undone.`)) {
      return;
    }

    try {
      setIsLoading(true);

      const response = await fetch(`/api/admin/files/${file.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete file');
      }

      // Refresh files list
      await fetchFiles();
    } catch (err) {
      console.error('Error deleting file:', err);
      setError(err.message || 'Failed to delete file');
    } finally {
      setIsLoading(false);
    }
  };

  // Filter files based on search term
  const filteredFiles = files.filter(file => {
    const fileName = file.key ? file.key.split('/').pop() : '';
    return (
      fileName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (file.url && file.url.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  });

  if (status === 'loading') {
    return <div className="p-8">Loading...</div>;
  }

  if (status === 'unauthenticated' || (session && session.user.role !== 'admin')) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="p-8">
      {/* Page Header */}
      <PageHeader title="Files" />

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-md mb-6">
          <p className="font-medium">Error:</p>
          <p>{error}</p>
        </div>
      )}

      {/* Search and Refresh */}
      <div className="flex justify-between items-center mb-6">
        <SearchBar 
          searchTerm={searchTerm} 
          setSearchTerm={setSearchTerm} 
        />
        <button
          onClick={fetchFiles}
          disabled={isLoading}
          className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
        >
          <ArrowPathIcon className={`-ml-1 mr-2 h-5 w-5 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Files Table */}
      <FilesTable 
        files={filteredFiles}
        onDelete={handleDeleteFile}
        isLoading={isLoading}
      />
    </div>
  );
}
