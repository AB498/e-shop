'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { ArrowPathIcon, TrashIcon, DownloadIcon } from '@heroicons/react/24/outline';
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

  // Multiple selection state
  const [selectedFiles, setSelectedFiles] = useState(new Set());
  const [selectAll, setSelectAll] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);

  // Bulk operations state
  const [isBulkDeleting, setIsBulkDeleting] = useState(false);

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
    // Clear selections when navigating
    setSelectedFiles(new Set());
    setSelectAll(false);
    setCurrentPage(1);
  };

  // Handle file selection
  const handleFileSelect = (fileKey, isSelected) => {
    setSelectedFiles(prevSelected => {
      const newSelected = new Set(prevSelected);
      if (isSelected) {
        newSelected.add(fileKey);
      } else {
        newSelected.delete(fileKey);
      }
      return newSelected;
    });
  };

  // Handle select all
  const handleSelectAll = (isSelected) => {
    setSelectAll(isSelected);
    if (isSelected) {
      const allFileKeys = new Set(filteredFiles.map(file => file.name));
      setSelectedFiles(allFileKeys);
    } else {
      setSelectedFiles(new Set());
    }
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

  // Handle bulk delete
  const handleBulkDelete = async () => {
    if (selectedFiles.size === 0) {
      alert('Please select files to delete');
      return;
    }

    if (!confirm(`Are you sure you want to delete ${selectedFiles.size} selected file(s)? This action cannot be undone.`)) {
      return;
    }

    try {
      setIsBulkDeleting(true);
      setError(null);

      const deletePromises = Array.from(selectedFiles).map(async (fileKey) => {
        const response = await fetch(`/api/admin/s3-delete`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ key: fileKey }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(`Failed to delete ${fileKey}: ${errorData.error}`);
        }

        return fileKey;
      });

      await Promise.all(deletePromises);

      // Clear selections and refresh
      setSelectedFiles(new Set());
      setSelectAll(false);
      await fetchDirectoryStructure(currentPath);

      alert(`Successfully deleted ${selectedFiles.size} file(s)`);
    } catch (err) {
      console.error('Error during bulk delete:', err);
      setError(err.message || 'Failed to delete some files');
    } finally {
      setIsBulkDeleting(false);
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

  // Pagination calculations
  const totalFiles = filteredFiles.length;
  const totalPages = Math.ceil(totalFiles / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedFiles = filteredFiles.slice(startIndex, endIndex);

  // Update select all when filtered files change
  useEffect(() => {
    if (filteredFiles.length > 0) {
      const allSelected = filteredFiles.every(file => selectedFiles.has(file.name));
      setSelectAll(allSelected);
    } else {
      setSelectAll(false);
    }
  }, [filteredFiles, selectedFiles]);

  // Reset to first page when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

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

      {/* Search and Actions */}
      <div className="flex flex-wrap gap-4 mb-6">
        <div className="w-full sm:w-auto sm:flex-1">
          <SearchBar
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
          />
        </div>
        <div className="flex gap-2">
          {selectedFiles.size > 0 && (
            <button
              onClick={handleBulkDelete}
              disabled={isBulkDeleting}
              className="inline-flex items-center px-3 py-2 border border-red-300 rounded-md shadow-sm text-sm font-medium text-red-700 bg-red-50 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
            >
              <TrashIcon className={`-ml-1 mr-2 h-5 w-5 ${isBulkDeleting ? 'animate-pulse' : ''}`} />
              {isBulkDeleting ? 'Deleting...' : `Delete ${selectedFiles.size} file(s)`}
            </button>
          )}
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

      {/* Selection Info */}
      {selectedFiles.size > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-md p-3 mb-4">
          <p className="text-sm text-blue-800">
            {selectedFiles.size} file(s) selected
            <button
              onClick={() => {
                setSelectedFiles(new Set());
                setSelectAll(false);
              }}
              className="ml-2 text-blue-600 hover:text-blue-800 underline"
            >
              Clear selection
            </button>
          </p>
        </div>
      )}

      {/* Directory Structure View */}
      <DirectoryView
        directories={searchTerm ? filteredDirectories : (directoryData.directories || [])}
        files={paginatedFiles}
        path={directoryData.path || ''}
        breadcrumbs={directoryData.breadcrumbs || [{ name: 'Root', path: '' }]}
        onNavigate={handleNavigate}
        onDelete={handleDeleteS3File}
        isLoading={isLoading}
        // Multiple selection props
        selectedFiles={selectedFiles}
        selectAll={selectAll}
        onFileSelect={handleFileSelect}
        onSelectAll={handleSelectAll}
        showCheckboxes={true}
      />

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6 mt-6 rounded-lg shadow">
          <div className="flex-1 flex justify-between sm:hidden">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">{startIndex + 1}</span> to{' '}
                <span className="font-medium">{Math.min(endIndex, totalFiles)}</span> of{' '}
                <span className="font-medium">{totalFiles}</span> files
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <label htmlFor="itemsPerPage" className="text-sm text-gray-700">
                Items per page:
              </label>
              <select
                id="itemsPerPage"
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="border border-gray-300 rounded-md text-sm px-2 py-1"
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }

                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                        currentPage === pageNum
                          ? 'z-10 bg-emerald-50 border-emerald-500 text-emerald-600'
                          : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
