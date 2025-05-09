'use client';

import { useState } from 'react';
import { 
  FolderIcon, 
  DocumentIcon, 
  PhotoIcon, 
  FilmIcon, 
  MusicalNoteIcon, 
  ArrowTopRightOnSquareIcon, 
  TrashIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline';
import Image from 'next/image';

export default function DirectoryView({ 
  directories, 
  files, 
  path, 
  breadcrumbs, 
  onNavigate, 
  onDelete, 
  isLoading 
}) {
  const [previewFile, setPreviewFile] = useState(null);

  // Get file icon based on file type
  const getFileIcon = (fileType) => {
    switch (fileType) {
      case 'image':
        return <PhotoIcon className="h-6 w-6 text-blue-500" />;
      case 'document':
        return <DocumentIcon className="h-6 w-6 text-emerald-500" />;
      case 'video':
        return <FilmIcon className="h-6 w-6 text-purple-500" />;
      case 'audio':
        return <MusicalNoteIcon className="h-6 w-6 text-yellow-500" />;
      default:
        return <DocumentIcon className="h-6 w-6 text-gray-500" />;
    }
  };

  // Format file size to human-readable format
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

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

  // Handle file preview
  const handlePreview = (file) => {
    setPreviewFile(file);
  };

  // Close preview modal
  const closePreview = () => {
    setPreviewFile(null);
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      {/* Breadcrumbs */}
      <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
        <nav className="flex" aria-label="Breadcrumb">
          <ol className="inline-flex items-center space-x-1 md:space-x-3">
            {breadcrumbs.map((crumb, index) => (
              <li key={index} className="inline-flex items-center">
                {index > 0 && (
                  <ChevronRightIcon className="w-4 h-4 text-gray-400 mx-1" />
                )}
                <button
                  onClick={() => onNavigate(crumb.path)}
                  className={`inline-flex items-center text-sm font-medium ${
                    index === breadcrumbs.length - 1
                      ? 'text-emerald-600'
                      : 'text-gray-700 hover:text-emerald-600'
                  }`}
                >
                  {crumb.name}
                </button>
              </li>
            ))}
          </ol>
        </nav>
      </div>

      {/* Directory content */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Size
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Last Modified
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {isLoading ? (
              <tr>
                <td colSpan="4" className="px-6 py-4 text-center text-sm text-gray-500">
                  Loading...
                </td>
              </tr>
            ) : directories.length === 0 && files.length === 0 ? (
              <tr>
                <td colSpan="4" className="px-6 py-4 text-center text-sm text-gray-500">
                  This directory is empty
                </td>
              </tr>
            ) : (
              <>
                {/* Directories */}
                {directories.map((directory, index) => (
                  <tr key={`dir-${index}`} className="hover:bg-gray-50 cursor-pointer" onClick={() => onNavigate(directory.name)}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <FolderIcon className="h-6 w-6 text-yellow-500 mr-3" />
                        <span className="text-sm font-medium text-gray-900">{directory.displayName}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      -
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      -
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onNavigate(directory.name);
                        }}
                        className="text-emerald-600 hover:text-emerald-900 mr-3"
                        title="Open Directory"
                      >
                        <ArrowTopRightOnSquareIcon className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))}

                {/* Files */}
                {files.map((file, index) => (
                  <tr key={`file-${index}`} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {file.fileType === 'image' && file.url ? (
                          <div className="h-8 w-8 mr-3 relative rounded overflow-hidden">
                            <Image
                              src={file.url}
                              alt={file.fileName}
                              width={32}
                              height={32}
                              className="object-cover"
                            />
                          </div>
                        ) : (
                          <div className="mr-3">{getFileIcon(file.fileType)}</div>
                        )}
                        <span className="text-sm font-medium text-gray-900">{file.fileName}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatFileSize(file.size)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(file.lastModified)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-3">
                        {file.fileType === 'image' && (
                          <button
                            onClick={() => handlePreview(file)}
                            className="text-blue-600 hover:text-blue-900"
                            title="Preview Image"
                          >
                            <PhotoIcon className="h-5 w-5" />
                          </button>
                        )}
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
                        >
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </>
            )}
          </tbody>
        </table>
      </div>

      {/* Image Preview Modal */}
      {previewFile && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={closePreview}>
          <div className="bg-white p-4 rounded-lg max-w-4xl max-h-[90vh] overflow-auto" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">{previewFile.fileName}</h3>
              <button onClick={closePreview} className="text-gray-500 hover:text-gray-700">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="relative">
              <Image
                src={previewFile.url}
                alt={previewFile.fileName}
                width={800}
                height={600}
                className="max-w-full h-auto"
                style={{ objectFit: 'contain' }}
              />
            </div>
            <div className="mt-4 text-sm text-gray-500">
              <p>Size: {formatFileSize(previewFile.size)}</p>
              <p>Last Modified: {formatDate(previewFile.lastModified)}</p>
              <p className="mt-2 break-all">Path: {previewFile.name}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
