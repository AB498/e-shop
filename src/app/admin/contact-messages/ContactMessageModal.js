'use client';

import React, { useState } from 'react';
import { Dialog } from '@headlessui/react';
import { format } from 'date-fns';
import { 
  XMarkIcon, 
  CheckCircleIcon, 
  XCircleIcon,
  ChatBubbleLeftRightIcon,
  ArchiveBoxIcon
} from '@heroicons/react/24/outline';

export default function ContactMessageModal({ 
  message, 
  isOpen, 
  onClose, 
  onUpdateStatus,
  onDelete
}) {
  const [adminNotes, setAdminNotes] = useState(message.admin_notes || '');
  const [isSaving, setIsSaving] = useState(false);

  // Handle admin notes update
  const handleSaveNotes = async () => {
    try {
      setIsSaving(true);
      
      const response = await fetch(`/api/admin/contact-messages/${message.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ admin_notes: adminNotes }),
      });

      if (!response.ok) {
        throw new Error('Failed to update admin notes');
      }

      // Success notification
      alert('Notes saved successfully');
    } catch (err) {
      console.error('Error updating admin notes:', err);
      alert(err.message || 'An error occurred while updating admin notes');
    } finally {
      setIsSaving(false);
    }
  };

  // Status badge color mapping
  const statusColors = {
    new: 'bg-blue-100 text-blue-800',
    read: 'bg-green-100 text-green-800',
    replied: 'bg-purple-100 text-purple-800',
    archived: 'bg-gray-100 text-gray-800'
  };

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      className="relative z-50"
    >
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

      {/* Full-screen container for centering */}
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto max-w-2xl w-full rounded-lg bg-white shadow-xl">
          {/* Header */}
          <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between">
            <Dialog.Title className="text-lg font-medium text-gray-900">
              Message Details
            </Dialog.Title>
            <button
              type="button"
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          {/* Content */}
          <div className="px-6 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <h3 className="text-sm font-medium text-gray-500">From</h3>
                <p className="mt-1 text-sm text-gray-900">{message.name}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Email</h3>
                <p className="mt-1 text-sm text-gray-900">{message.email}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Phone</h3>
                <p className="mt-1 text-sm text-gray-900">{message.phone || 'Not provided'}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Date</h3>
                <p className="mt-1 text-sm text-gray-900">
                  {format(new Date(message.created_at), 'PPpp')}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Status</h3>
                <span className={`mt-1 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[message.status]}`}>
                  {message.status.charAt(0).toUpperCase() + message.status.slice(1)}
                </span>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-500 mb-2">Message</h3>
              <div className="mt-1 p-4 bg-gray-50 rounded-md text-sm text-gray-900 whitespace-pre-wrap">
                {message.message}
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-500 mb-2">Admin Notes</h3>
              <textarea
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                rows={4}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm"
                placeholder="Add notes about this message or how it was handled..."
              />
              <div className="mt-2 flex justify-end">
                <button
                  type="button"
                  onClick={handleSaveNotes}
                  disabled={isSaving}
                  className="inline-flex items-center rounded-md border border-transparent bg-emerald-600 px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
                >
                  {isSaving ? 'Saving...' : 'Save Notes'}
                </button>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-gray-200 px-6 py-4 flex items-center justify-between">
            <div className="flex space-x-2">
              {message.status === 'new' && (
                <button
                  type="button"
                  onClick={() => onUpdateStatus(message.id, 'read')}
                  className="inline-flex items-center rounded-md border border-transparent bg-green-100 px-3 py-2 text-sm font-medium text-green-700 hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                >
                  <CheckCircleIcon className="h-4 w-4 mr-1" />
                  Mark as Read
                </button>
              )}
              {message.status !== 'replied' && message.status !== 'archived' && (
                <button
                  type="button"
                  onClick={() => onUpdateStatus(message.id, 'replied')}
                  className="inline-flex items-center rounded-md border border-transparent bg-purple-100 px-3 py-2 text-sm font-medium text-purple-700 hover:bg-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                >
                  <ChatBubbleLeftRightIcon className="h-4 w-4 mr-1" />
                  Mark as Replied
                </button>
              )}
              {message.status !== 'archived' && (
                <button
                  type="button"
                  onClick={() => onUpdateStatus(message.id, 'archived')}
                  className="inline-flex items-center rounded-md border border-transparent bg-gray-100 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                >
                  <ArchiveBoxIcon className="h-4 w-4 mr-1" />
                  Archive
                </button>
              )}
            </div>
            <button
              type="button"
              onClick={() => onDelete(message.id)}
              className="inline-flex items-center rounded-md border border-transparent bg-red-100 px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            >
              <XCircleIcon className="h-4 w-4 mr-1" />
              Delete
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
