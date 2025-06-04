'use client';

import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import {
  CloudArrowDownIcon,
  CloudArrowUpIcon,
  TrashIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ArrowPathIcon,
  ArrowDownTrayIcon
} from '@heroicons/react/24/outline';
import ConfirmationModal from '@/components/ConfirmationModal';

export default function BackupsClient() {
  const [backups, setBackups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [restoring, setRestoring] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [cleaning, setCleaning] = useState(false);
  const [downloading, setDownloading] = useState(null);

  // Modal states
  const [restoreModal, setRestoreModal] = useState({ isOpen: false, backup: null });
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, backup: null });

  // Fetch backups
  const fetchBackups = async () => {
    try {
      const response = await fetch('/api/admin/backups');
      const data = await response.json();

      if (data.success) {
        setBackups(data.backups);
      } else {
        toast.error(data.error || 'Failed to fetch backups');
      }
    } catch (error) {
      console.error('Error fetching backups:', error);
      toast.error('Failed to fetch backups');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBackups();
  }, []);

  // Create new backup
  const createBackup = async () => {
    setCreating(true);
    try {
      const response = await fetch('/api/admin/backups', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action: 'create' }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success(data.message);
        fetchBackups(); // Refresh the list
      } else {
        toast.error(data.error || 'Failed to create backup');
      }
    } catch (error) {
      console.error('Error creating backup:', error);
      toast.error('Failed to create backup');
    } finally {
      setCreating(false);
    }
  };

  // Open restore modal
  const openRestoreModal = (backup) => {
    setRestoreModal({ isOpen: true, backup });
  };

  // Handle restore confirmation
  const handleRestoreConfirm = async () => {
    const backup = restoreModal.backup;
    if (!backup) return;

    setRestoring(backup.id);
    try {
      const response = await fetch(`/api/admin/backups/${backup.id}/restore`, {
        method: 'POST',
      });

      const data = await response.json();

      if (data.success) {
        toast.success(data.message);
      } else {
        toast.error(data.error || 'Failed to restore backup');
      }
    } catch (error) {
      console.error('Error restoring backup:', error);
      toast.error('Failed to restore backup');
    } finally {
      setRestoring(null);
    }
  };

  // Open delete modal
  const openDeleteModal = (backup) => {
    setDeleteModal({ isOpen: true, backup });
  };

  // Handle delete confirmation
  const handleDeleteConfirm = async () => {
    const backup = deleteModal.backup;
    if (!backup) return;

    setDeleting(backup.id);
    try {
      const response = await fetch(`/api/admin/backups?id=${backup.id}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        toast.success(data.message);
        fetchBackups(); // Refresh the list
      } else {
        toast.error(data.error || 'Failed to delete backup');
      }
    } catch (error) {
      console.error('Error deleting backup:', error);
      toast.error('Failed to delete backup');
    } finally {
      setDeleting(null);
    }
  };

  // Download backup
  const downloadBackup = async (backupId, filename) => {
    setDownloading(backupId);
    try {
      const response = await fetch(`/api/admin/backups/${backupId}/download`);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to download backup');
      }

      // Get the blob from response
      const blob = await response.blob();

      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();

      // Cleanup
      window.URL.revokeObjectURL(url);
      document.body.removeChild(link);

      toast.success(`Downloaded ${filename}`);
    } catch (error) {
      console.error('Error downloading backup:', error);
      toast.error(error.message || 'Failed to download backup');
    } finally {
      setDownloading(null);
    }
  };

  // Cleanup old backups
  const cleanupBackups = async () => {
    if (!confirm('Are you sure you want to clean up old backups (older than 7 days)?')) {
      return;
    }

    setCleaning(true);
    try {
      const response = await fetch('/api/admin/backups', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action: 'cleanup' }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success(data.message);
        fetchBackups(); // Refresh the list
      } else {
        toast.error(data.error || 'Failed to cleanup backups');
      }
    } catch (error) {
      console.error('Error cleaning up backups:', error);
      toast.error('Failed to cleanup backups');
    } finally {
      setCleaning(false);
    }
  };

  // Format file size
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  // Get status badge
  const getStatusBadge = (status) => {
    const badges = {
      completed: { color: 'bg-green-100 text-green-800', icon: CheckCircleIcon, text: 'Completed' },
      in_progress: { color: 'bg-yellow-100 text-yellow-800', icon: ClockIcon, text: 'In Progress' },
      failed: { color: 'bg-red-100 text-red-800', icon: ExclamationTriangleIcon, text: 'Failed' }
    };

    const badge = badges[status] || badges.failed;
    const Icon = badge.icon;

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${badge.color}`}>
        <Icon className="w-3 h-3 mr-1" />
        {badge.text}
      </span>
    );
  };

  if (loading) {
    return (
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
    );
  }

  return (
    <div className="space-y-6">
      {/* Safety Warning Banner */}
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <ExclamationTriangleIcon className="h-5 w-5 text-yellow-400" aria-hidden="true" />
          </div>
          <div className="ml-3">
            <p className="text-sm text-yellow-700">
              <strong className="inline-flex items-center">
                CAUTION:
              </strong> Backup operations can permanently affect your data.
              <strong className="text-red-600"> Restore operations will replace ALL current data</strong> and
              <strong className="text-red-600"> Delete operations cannot be undone</strong>.
              Always download backups before performing destructive operations.
            </p>
          </div>
        </div>
      </div>



      {/* Actions */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={createBackup}
            disabled={creating}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {creating ? (
              <ArrowPathIcon className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <CloudArrowUpIcon className="w-4 h-4 mr-2" />
            )}
            {creating ? 'Creating...' : 'Create Backup'}
          </button>

          <button
            onClick={cleanupBackups}
            disabled={cleaning}
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {cleaning ? (
              <ArrowPathIcon className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <TrashIcon className="w-4 h-4 mr-2" />
            )}
            {cleaning ? 'Cleaning...' : 'Cleanup Old Backups'}
          </button>

          <button
            onClick={fetchBackups}
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <ArrowPathIcon className="w-4 h-4 mr-2" />
            Refresh
          </button>
        </div>
      </div>

      {/* Backups List */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Database Backups</h3>
          <p className="mt-1 text-sm text-gray-600">
            {backups.length} backup{backups.length !== 1 ? 's' : ''} available
          </p>
        </div>

        {backups.length === 0 ? (
          <div className="p-6 text-center">
            <CloudArrowDownIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No backups</h3>
            <p className="mt-1 text-sm text-gray-500">Get started by creating your first backup.</p>
          </div>
        ) : (
          <div className="overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Backup
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Size
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {backups.map((backup) => (
                  <tr key={backup.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {backup.filename}
                        </div>
                        <div className="text-sm text-gray-500">
                          Created by {backup.created_by}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(backup.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatFileSize(backup.file_size)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDate(backup.created_at)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-3">
                        {backup.status === 'completed' && (
                          <>
                            <button
                              onClick={() => downloadBackup(backup.id, backup.filename)}
                              disabled={downloading === backup.id}
                              className="inline-flex items-center text-green-600 hover:text-green-900 disabled:opacity-50 disabled:cursor-not-allowed"
                              title="Download backup file"
                            >
                              {downloading === backup.id ? (
                                <ArrowPathIcon className="w-4 h-4 mr-1 animate-spin" />
                              ) : (
                                <ArrowDownTrayIcon className="w-4 h-4 mr-1" />
                              )}
                              {downloading === backup.id ? 'Downloading...' : 'Download'}
                            </button>
                            <button
                              onClick={() => openRestoreModal(backup)}
                              disabled={restoring === backup.id}
                              className="inline-flex items-center px-2 py-1 text-xs font-medium rounded border border-orange-300 text-orange-700 bg-orange-50 hover:bg-orange-100 hover:text-orange-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                              title="DANGER: This will replace ALL current data!"
                            >
                              {restoring === backup.id ? (
                                <>
                                  <ArrowPathIcon className="w-3 h-3 mr-1 animate-spin" />
                                  Restoring...
                                </>
                              ) : (
                                <>
                                  <ExclamationTriangleIcon className="w-3 h-3 mr-1" />
                                  Restore
                                </>
                              )}
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => openDeleteModal(backup)}
                          disabled={deleting === backup.id}
                          className="inline-flex items-center px-2 py-1 text-xs font-medium rounded border border-red-300 text-red-700 bg-red-50 hover:bg-red-100 hover:text-red-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          title="DANGER: This will permanently delete the backup!"
                        >
                          {deleting === backup.id ? (
                            <>
                              <ArrowPathIcon className="w-3 h-3 mr-1 animate-spin" />
                              Deleting...
                            </>
                          ) : (
                            <>
                              <TrashIcon className="w-3 h-3 mr-1" />
                              Delete
                            </>
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Restore Confirmation Modal */}
      <ConfirmationModal
        isOpen={restoreModal.isOpen}
        onClose={() => setRestoreModal({ isOpen: false, backup: null })}
        onConfirm={handleRestoreConfirm}
        type="danger"
        steps={[
          {
            title: "DANGER: Database Restore Operation",
            message: `You are about to restore from backup: "${restoreModal.backup?.filename}"\n\nThis will PERMANENTLY REPLACE ALL current data in your database!\n\nAre you absolutely sure you want to continue?`,
            confirmText: "Continue"
          },
          {
            title: "FINAL WARNING: This action CANNOT be undone!",
            message: `Restoring will:\n• DELETE all current data\n• REPLACE with backup data from: ${restoreModal.backup?.filename}\n• AFFECT all users and orders\n• CANNOT be reversed\n\nTo proceed, type exactly: RESTORE DATABASE`,
            requiresTyping: true,
            typingConfirmation: "RESTORE DATABASE",
            confirmText: "Continue"
          },
          {
            title: "LAST CHANCE TO CANCEL!",
            message: `You typed the confirmation correctly.\nThis is your FINAL opportunity to cancel.\n\nClick "RESTORE DATABASE" to PERMANENTLY RESTORE the database.\nClick "Cancel" to abort this operation.`,
            confirmText: "RESTORE DATABASE"
          }
        ]}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, backup: null })}
        onConfirm={handleDeleteConfirm}
        type="danger"
        steps={[
          {
            title: "WARNING: Delete Backup",
            message: `You are about to PERMANENTLY DELETE backup: "${deleteModal.backup?.filename}"\n\nThis backup will be removed from:\n• Your database records\n• S3 storage (cannot be recovered)\n\nAre you sure you want to continue?`,
            confirmText: "Continue"
          },
          {
            title: "PERMANENT DELETION WARNING!",
            message: `Deleting backup: ${deleteModal.backup?.filename}\n\nThis will:\n• PERMANENTLY remove the backup file\n• DELETE it from S3 storage\n• CANNOT be recovered or undone\n• Remove your ability to restore from this backup\n\nTo proceed, type exactly: DELETE BACKUP`,
            requiresTyping: true,
            typingConfirmation: "DELETE BACKUP",
            confirmText: "Continue"
          },
          {
            title: "FINAL CONFIRMATION",
            message: `You are about to PERMANENTLY DELETE:\n"${deleteModal.backup?.filename}"\n\nThis action is IRREVERSIBLE!\n\nClick "DELETE BACKUP" to delete the backup forever.\nClick "Cancel" to keep the backup.`,
            confirmText: "DELETE BACKUP"
          }
        ]}
      />
    </div>
  );
}
