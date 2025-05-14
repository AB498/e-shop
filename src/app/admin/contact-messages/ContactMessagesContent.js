'use client';

import React, { useState, useEffect } from 'react';
import {
  EnvelopeIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArrowPathIcon,
  ChatBubbleLeftRightIcon,
  ArchiveBoxIcon
} from '@heroicons/react/24/outline';
import { format } from 'date-fns';
import Table from '@/components/ui/table';
import ContactMessageModal from './ContactMessageModal';

export default function ContactMessagesContent() {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');

  // Fetch messages
  const fetchMessages = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const url = statusFilter === 'all'
        ? '/api/admin/contact-messages'
        : `/api/admin/contact-messages?status=${statusFilter}`;

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error('Failed to fetch contact messages');
      }

      const data = await response.json();
      setMessages(data);
    } catch (err) {
      console.error('Error fetching contact messages:', err);
      setError(err.message || 'An error occurred while fetching contact messages');
    } finally {
      setIsLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchMessages();
  }, [statusFilter]);

  // Handle message selection
  const handleViewMessage = (message) => {
    setSelectedMessage(message);
    setIsModalOpen(true);
  };

  // Handle message status update
  const handleUpdateStatus = async (id, status) => {
    try {
      const response = await fetch(`/api/admin/contact-messages/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        throw new Error('Failed to update message status');
      }

      // Refresh messages
      fetchMessages();

      // Update selected message if modal is open
      if (selectedMessage && selectedMessage.id === id) {
        const updatedMessage = await response.json();
        setSelectedMessage(updatedMessage);
      }
    } catch (err) {
      console.error('Error updating message status:', err);
      alert(err.message || 'An error occurred while updating message status');
    }
  };

  // Handle message deletion
  const handleDeleteMessage = async (id) => {
    if (!confirm('Are you sure you want to delete this message? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/contact-messages/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete message');
      }

      // Close modal if open
      if (selectedMessage && selectedMessage.id === id) {
        setIsModalOpen(false);
        setSelectedMessage(null);
      }

      // Refresh messages
      fetchMessages();
    } catch (err) {
      console.error('Error deleting message:', err);
      alert(err.message || 'An error occurred while deleting message');
    }
  };

  // Status badge color mapping
  const statusColors = {
    new: 'blue',
    read: 'green',
    replied: 'purple',
    archived: 'gray'
  };

  // Table columns
  const columns = [
    {
      key: 'id',
      label: 'ID',
      sortable: true,
      noWrap: true,
      render: (row) => <span className="font-medium">#{row.id}</span>
    },
    {
      key: 'name',
      label: 'Name',
      sortable: true,
      maxWidth: '150px'
    },
    {
      key: 'email',
      label: 'Email',
      sortable: true,
      maxWidth: '200px'
    },
    {
      key: 'message',
      label: 'Message',
      maxWidth: '250px',
      render: (row) => row.message
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      noWrap: true,
      render: (row) => (
        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
          statusColors[row.status] === 'blue' ? 'bg-blue-100 text-blue-800' :
          statusColors[row.status] === 'green' ? 'bg-green-100 text-green-800' :
          statusColors[row.status] === 'purple' ? 'bg-purple-100 text-purple-800' :
          'bg-gray-100 text-gray-800'
        }`}>
          {row.status.charAt(0).toUpperCase() + row.status.slice(1)}
        </span>
      )
    },
    {
      key: 'created_at',
      label: 'Date',
      sortable: true,
      noWrap: true,
      render: (row) => format(new Date(row.created_at), 'MMM d, yyyy h:mm a')
    },
    {
      key: 'actions',
      label: 'Actions',
      noWrap: true,
      render: (row) => (
        <div className="flex space-x-2">
          <button
            onClick={() => handleViewMessage(row)}
            className="text-blue-600 hover:text-blue-800"
            title="View Message"
          >
            <EnvelopeIcon className="w-5 h-5" />
          </button>
          {row.status === 'new' && (
            <button
              onClick={() => handleUpdateStatus(row.id, 'read')}
              className="text-green-600 hover:text-green-800"
              title="Mark as Read"
            >
              <CheckCircleIcon className="w-5 h-5" />
            </button>
          )}
          {row.status !== 'replied' && row.status !== 'archived' && (
            <button
              onClick={() => handleUpdateStatus(row.id, 'replied')}
              className="text-purple-600 hover:text-purple-800"
              title="Mark as Replied"
            >
              <ChatBubbleLeftRightIcon className="w-5 h-5" />
            </button>
          )}
          {row.status !== 'archived' && (
            <button
              onClick={() => handleUpdateStatus(row.id, 'archived')}
              className="text-gray-600 hover:text-gray-800"
              title="Archive Message"
            >
              <ArchiveBoxIcon className="w-5 h-5" />
            </button>
          )}
          <button
            onClick={() => handleDeleteMessage(row.id)}
            className="text-red-600 hover:text-red-800"
            title="Delete Message"
          >
            <XCircleIcon className="w-5 h-5" />
          </button>
        </div>
      )
    }
  ];

  // Create table actions
  const tableActions = (
    <div className="flex flex-wrap gap-2">
      <select
        value={statusFilter}
        onChange={(e) => setStatusFilter(e.target.value)}
        className="rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm"
      >
        <option value="all">All Messages</option>
        <option value="new">New</option>
        <option value="read">Read</option>
        <option value="replied">Replied</option>
        <option value="archived">Archived</option>
      </select>
      <button
        onClick={fetchMessages}
        className="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
      >
        <ArrowPathIcon className="h-4 w-4 mr-1" />
        Refresh
      </button>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center">
          <EnvelopeIcon className="h-6 w-6 mr-2 text-emerald-600" />
          Contact Messages
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage customer inquiries and messages
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-md mb-6">
          <p className="font-medium">Error:</p>
          <p>{error}</p>
        </div>
      )}

      <Table
        data={messages}
        columns={columns}
        title="Contact Messages"
        actions={tableActions}
        isLoading={isLoading}
        emptyMessage="No contact messages found"
        enableSorting={true}
        enablePagination={true}
        pageSizeOptions={[10, 25, 50, 100]}
        initialState={{
          pageSize: 10,
          sortBy: 'created_at',
          sortDirection: 'desc',
        }}
      />

      {/* Message Detail Modal */}
      {selectedMessage && (
        <ContactMessageModal
          message={selectedMessage}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onUpdateStatus={handleUpdateStatus}
          onDelete={handleDeleteMessage}
        />
      )}
    </div>
  );
}
