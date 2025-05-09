'use client';

import Image from 'next/image';
import { TrashIcon, ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline';
import Table from '@/components/ui/table';

export default function FilesTable({ files, onDelete, isLoading }) {
  // Format date to a readable format
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Check if file is an image based on URL
  const isImage = (url) => {
    if (!url) return false;
    return /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(url);
  };

  // Get file name from key or URL
  const getFileName = (file) => {
    if (file.key) {
      const parts = file.key.split('/');
      return parts[parts.length - 1];
    }
    if (file.url) {
      const url = new URL(file.url);
      const parts = url.pathname.split('/');
      return parts[parts.length - 1];
    }
    return 'Unknown';
  };

  // Define table columns
  const columns = [
    {
      key: 'preview',
      label: 'Preview',
      render: (file) => (
        <div className="flex-shrink-0 h-10 w-10 relative">
          {isImage(file.url) ? (
            <Image
              src={file.url}
              alt={getFileName(file)}
              width={40}
              height={40}
              className="rounded-md object-cover"
            />
          ) : (
            <div className="h-10 w-10 rounded-md bg-gray-200 flex items-center justify-center text-gray-500">
              File
            </div>
          )}
        </div>
      )
    },
    {
      key: 'fileName',
      label: 'File Name',
      sortable: true,
      render: (file) => (
        <div className="text-sm font-medium text-gray-900">{getFileName(file)}</div>
      )
    },
    {
      key: 'url',
      label: 'URL',
      responsive: 'md',
      render: (file) => (
        <div className="text-sm text-gray-500 max-w-xs truncate">
          {file.url}
        </div>
      )
    },
    {
      key: 'created_at',
      label: 'Uploaded',
      sortable: true,
      render: (file) => (
        <div className="text-sm text-gray-500">
          {formatDate(file.created_at)}
        </div>
      )
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (file) => (
        <div className="flex space-x-3">
          <a
            href={file.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-emerald-600 hover:text-emerald-900"
            title="Open File"
          >
            <ArrowTopRightOnSquareIcon className="h-5 w-5" />
          </a>
          <button
            onClick={() => onDelete(file)}
            className="text-red-600 hover:text-red-900"
            title="Delete File"
            disabled={isLoading}
          >
            <TrashIcon className="h-5 w-5" />
          </button>
        </div>
      )
    }
  ];

  return (
    <Table
      data={files}
      columns={columns}
      title="Files"
      isLoading={isLoading}
      emptyMessage="No files found"
      enableSorting={true}
      enablePagination={true}
      pageSizeOptions={[10, 25, 50, 100]}
      initialState={{
        pageSize: 10,
        sortBy: 'created_at',
        sortDirection: 'desc',
      }}
    />
  );
}
