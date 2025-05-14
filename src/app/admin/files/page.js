'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { ArrowPathIcon } from '@heroicons/react/24/outline';
import PageHeader from './PageHeader';
import SearchBar from './SearchBar';
import DirectoryView from './DirectoryView';

export default function FilesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPath, setCurrentPath] = useState('');
  const [directoryData, setDirectoryData] = useState({
    directories: [],
    files: [],
    path: '',
    breadcrumbs: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch files on component mount if authenticated
  useEffect(() => {
    if (status === 'authenticated') {
      fetchDirectoryStructure();
    }
  }, []);

  // Fetch directory structure from API
  const fetchDirectoryStructure = async (path = '') => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(`/api/admin/s3-directory?prefix=${encodeURIComponent(path)}`);
      if (!response.ok) {
        throw new Error('Failed to fetch directory structure');
      }

      const data = await response.json();
      if (data.success) {
        setDirectoryData(data);
        setCurrentPath(path);
      } else {
        throw new Error(data.error || 'Failed to fetch directory structure');
      }
    } catch (err) {
      console.error('Error fetching directory structure:', err);
      setError(err.message || 'Failed to fetch directory structure');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle navigating to a directory
  const handleNavigate = (path) => {
    fetchDirectoryStructure(path);
  };

  // Handle deleting a file from S3
  const handleDeleteS3File = async (file) => {
    if (!confirm(`Are you sure you want to delete this file? This action cannot be undone.`)) {
      return;
    }

    try {
      setIsLoading(true);

      // Delete the file directly from S3
      const response = await fetch(`/api/admin/s3-delete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ key: file.name }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete file');
      }

      // Refresh the view
      await fetchDirectoryStructure(currentPath);
    } catch (err) {
      console.error('Error deleting file:', err);
      setError(err.message || 'Failed to delete file');
    } finally {
      setIsLoading(false);
    }
  };

  // Filter files based on search term
  const filteredFiles = directoryData.files?.filter(file => {
    const fileName = file.fileName || '';
    return fileName.toLowerCase().includes(searchTerm.toLowerCase());
  }) || [];

  // Filter directories based on search term
  const filteredDirectories = directoryData.directories?.filter(dir => {
    const dirName = dir.displayName || '';
    return dirName.toLowerCase().includes(searchTerm.toLowerCase());
  }) || [];

  if (status === 'loading') {
    return <div className="p-8">Loading...</div>;
  }

  if (status === 'unauthenticated' || (session && session.user.role !== 'admin')) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="space-y-6">
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
      <div className="flex flex-wrap gap-4 mb-6">
        <div className="w-full sm:w-auto sm:flex-1">
          <SearchBar
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
          />
        </div>
        <div>
          <button
            onClick={() => fetchDirectoryStructure(currentPath)}
            disabled={isLoading}
            className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
          >
            <ArrowPathIcon className={`-ml-1 mr-2 h-5 w-5 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      {/* Directory Structure View */}
      <DirectoryView
        directories={searchTerm ? filteredDirectories : (directoryData.directories || [])}
        files={searchTerm ? filteredFiles : (directoryData.files || [])}
        path={directoryData.path || ''}
        breadcrumbs={directoryData.breadcrumbs || [{ name: 'Root', path: '' }]}
        onNavigate={handleNavigate}
        onDelete={handleDeleteS3File}
        isLoading={isLoading}
      />
    </div>
  );
}
