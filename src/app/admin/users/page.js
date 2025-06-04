'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { PlusIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import UsersTable from './UsersTable';
import AddUserModal from './AddUserModal';
import EditUserModal from './EditUserModal';
import ConfirmDeleteModal from './ConfirmDeleteModal';

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const { data: session } = useSession();
  const router = useRouter();

  // Fetch admin users
  const fetchAdminUsers = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/admin/users');

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch admin users');
      }

      const data = await response.json();
      setUsers(data);
    } catch (err) {
      console.error('Error fetching admin users:', err);
      setError(err.message || 'Failed to fetch admin users');
    } finally {
      setLoading(false);
    }
  };

  // Handle add admin user
  const handleAddUser = async (data) => {
    try {
      setError(null);

      const response = await fetch('/api/admin/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to add admin user');
      }

      // Refresh admin users list
      fetchAdminUsers();
      setShowAddModal(false);
    } catch (err) {
      console.error('Error adding admin user:', err);
      setError(err.message || 'Failed to add admin user');
    }
  };

  // Handle edit admin user
  const handleEditUser = async (id, data) => {
    try {
      setError(null);

      const response = await fetch(`/api/admin/users/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update admin user');
      }

      // Refresh admin users list
      fetchAdminUsers();
      setShowEditModal(false);
    } catch (err) {
      console.error('Error updating admin user:', err);
      setError(err.message || 'Failed to update admin user');
    }
  };

  // Handle delete admin user
  const handleDeleteUser = async (id) => {
    try {
      setError(null);

      const response = await fetch(`/api/admin/users/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete admin user');
      }

      // Refresh admin users list
      fetchAdminUsers();
      setShowDeleteModal(false);
    } catch (err) {
      console.error('Error deleting admin user:', err);
      setError(err.message || 'Failed to delete admin user');
    }
  };

  // Filter users based on search term
  const filteredUsers = users.filter(user => {
    const searchTermLower = searchTerm.toLowerCase();
    return (
      (user.firstName && user.firstName.toLowerCase().includes(searchTermLower)) ||
      (user.lastName && user.lastName.toLowerCase().includes(searchTermLower)) ||
      (user.email && user.email.toLowerCase().includes(searchTermLower)) ||
      (user.fullName && user.fullName.toLowerCase().includes(searchTermLower))
    );
  });

  // Initial fetch
  useEffect(() => {
    if (session?.user?.role === 'admin') {
      fetchAdminUsers();
    } else if (session && session.user && session.user.role !== 'admin') {
      router.push('/');
    }
  }, [session]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-4 justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Users</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage admin users who have access to the admin panel
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={fetchAdminUsers}
            className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
          >
            <ArrowPathIcon className={`-ml-1 mr-2 h-5 w-5 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
          >
            <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
            Add Admin User
          </button>
        </div>
      </div>

      {/* Search bar */}
      <div className="mb-6">
        <div className="relative rounded-md shadow-sm w-full sm:max-w-md">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pr-10 sm:text-sm border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500"
            placeholder="Search admin users..."
          />
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-md mb-6">
          <p className="font-medium">Error:</p>
          <p>{error}</p>
        </div>
      )}

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <UsersTable
          users={filteredUsers}
          isLoading={loading}
          onEdit={(user) => {
            setCurrentUser(user);
            setShowEditModal(true);
          }}
          onDelete={(user) => {
            setCurrentUser(user);
            setShowDeleteModal(true);
          }}
          currentUserId={session?.user?.id}
        />
      </div>

      {/* Modals */}
      {showAddModal && (
        <AddUserModal
          onClose={() => setShowAddModal(false)}
          onSubmit={handleAddUser}
        />
      )}

      {showEditModal && currentUser && (
        <EditUserModal
          user={currentUser}
          onClose={() => setShowEditModal(false)}
          onSubmit={(data) => handleEditUser(currentUser.id, data)}
        />
      )}

      {showDeleteModal && currentUser && (
        <ConfirmDeleteModal
          user={currentUser}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={() => handleDeleteUser(currentUser.id)}
          currentUserId={session?.user?.id}
        />
      )}
    </div>
  );
}
