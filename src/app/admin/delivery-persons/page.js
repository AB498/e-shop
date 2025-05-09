'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { PlusIcon } from '@heroicons/react/24/outline';
import AddDeliveryPersonModal from './AddDeliveryPersonModal';
import EditDeliveryPersonModal from './EditDeliveryPersonModal';
import ConfirmDeleteModal from './ConfirmDeleteModal';
import DeliveryPersonsTable from './DeliveryPersonsTable';

export default function DeliveryPersonsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [deliveryPersons, setDeliveryPersons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentDeliveryPerson, setCurrentDeliveryPerson] = useState(null);

  // Fetch delivery persons
  const fetchDeliveryPersons = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/admin/delivery-persons');
      if (!response.ok) {
        throw new Error('Failed to fetch delivery persons');
      }

      const data = await response.json();
      setDeliveryPersons(data);
    } catch (err) {
      console.error('Error fetching delivery persons:', err);
      setError(err.message || 'Failed to fetch delivery persons');
    } finally {
      setLoading(false);
    }
  };

  // Handle add delivery person
  const handleAddDeliveryPerson = async (data) => {
    try {
      const response = await fetch('/api/admin/delivery-persons', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to add delivery person');
      }

      // Refresh delivery persons list
      fetchDeliveryPersons();
      setShowAddModal(false);
    } catch (err) {
      console.error('Error adding delivery person:', err);
      setError(err.message || 'Failed to add delivery person');
    }
  };

  // Handle edit delivery person
  const handleEditDeliveryPerson = async (id, data) => {
    try {
      const response = await fetch(`/api/admin/delivery-persons/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update delivery person');
      }

      // Refresh delivery persons list
      fetchDeliveryPersons();
      setShowEditModal(false);
    } catch (err) {
      console.error('Error updating delivery person:', err);
      setError(err.message || 'Failed to update delivery person');
    }
  };

  // Handle delete delivery person
  const handleDeleteDeliveryPerson = async (id) => {
    try {
      const response = await fetch(`/api/admin/delivery-persons/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete delivery person');
      }

      // Refresh delivery persons list
      fetchDeliveryPersons();
      setShowDeleteModal(false);
    } catch (err) {
      console.error('Error deleting delivery person:', err);
      setError(err.message || 'Failed to delete delivery person');
    }
  };

  // Initial fetch
  useEffect(() => {
    if (session?.user?.role === 'admin') {
      fetchDeliveryPersons();
    }
  }, []);



  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Delivery Persons</h1>
        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
          Add Delivery Person
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-md mb-6">
          <p className="font-medium">Error:</p>
          <p>{error}</p>
        </div>
      )}

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <DeliveryPersonsTable
          deliveryPersons={deliveryPersons}
          isLoading={loading}
          onEdit={(person) => {
            setCurrentDeliveryPerson(person);
            setShowEditModal(true);
          }}
          onDelete={(person) => {
            setCurrentDeliveryPerson(person);
            setShowDeleteModal(true);
          }}
        />
      </div>

      {/* Modals */}
      {showAddModal && (
        <AddDeliveryPersonModal
          onClose={() => setShowAddModal(false)}
          onSubmit={handleAddDeliveryPerson}
        />
      )}

      {showEditModal && currentDeliveryPerson && (
        <EditDeliveryPersonModal
          deliveryPerson={currentDeliveryPerson}
          onClose={() => setShowEditModal(false)}
          onSubmit={(data) => handleEditDeliveryPerson(currentDeliveryPerson.id, data)}
        />
      )}

      {showDeleteModal && currentDeliveryPerson && (
        <ConfirmDeleteModal
          deliveryPerson={currentDeliveryPerson}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={() => handleDeleteDeliveryPerson(currentDeliveryPerson.id)}
        />
      )}
    </div>
  );
}
