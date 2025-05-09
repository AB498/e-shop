'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import {
  ArrowPathIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  UserIcon,
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
  StarIcon,
} from '@heroicons/react/24/outline';
import AddDeliveryPersonModal from './AddDeliveryPersonModal';
import EditDeliveryPersonModal from './EditDeliveryPersonModal';
import ConfirmDeleteModal from './ConfirmDeleteModal';

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

  // Check authentication and redirect if not admin
  useEffect(() => {
    if (status === 'unauthenticated' || (session && session.user.role !== 'admin')) {
      router.push('/login');
    }
  }, [session, status, router]);

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
  }, [session]);

  // Get status badge class
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-red-100 text-red-800';
      case 'on_delivery':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

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
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <ArrowPathIcon className="h-8 w-8 text-indigo-500 animate-spin" />
            <span className="ml-2 text-gray-600">Loading delivery persons...</span>
          </div>
        ) : deliveryPersons.length === 0 ? (
          <div className="p-6 text-center">
            <UserIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900">No delivery persons found</h3>
            <p className="mt-1 text-sm text-gray-500">
              Add your first delivery person to get started.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Location
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Orders
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rating
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {deliveryPersons.map((person) => (
                  <tr key={person.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                          {person.profile_image ? (
                            <img
                              src={person.profile_image}
                              alt={person.name}
                              className="h-10 w-10 rounded-full"
                            />
                          ) : (
                            <UserIcon className="h-5 w-5 text-gray-500" />
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{person.name}</div>
                          <div className="text-sm text-gray-500">{person.notes}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 flex items-center">
                        <PhoneIcon className="h-4 w-4 text-gray-400 mr-1" />
                        {person.phone}
                      </div>
                      {person.email && (
                        <div className="text-sm text-gray-500 flex items-center">
                          <EnvelopeIcon className="h-4 w-4 text-gray-400 mr-1" />
                          {person.email}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{person.city}</div>
                      <div className="text-sm text-gray-500">{person.area}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass(person.status)}`}>
                        {person.status === 'on_delivery' ? 'On Delivery' : person.status === 'active' ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div>Current: {person.current_orders}</div>
                      <div>Total: {person.total_orders}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center">
                        <StarIcon className="h-4 w-4 text-yellow-400 mr-1" />
                        {person.rating}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => {
                            setCurrentDeliveryPerson(person);
                            setShowEditModal(true);
                          }}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          <PencilIcon className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => {
                            setCurrentDeliveryPerson(person);
                            setShowDeleteModal(true);
                          }}
                          className="text-red-600 hover:text-red-900"
                        >
                          <TrashIcon className="h-5 w-5" />
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
