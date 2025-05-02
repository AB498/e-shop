'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import PageHeader from './PageHeader';
import SearchBar from './SearchBar';
import StoreLocationsTable from './StoreLocationsTable';
import AddLocationModal from './AddLocationModal';
import EditLocationModal from './EditLocationModal';

export default function StoreLocationsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [storeLocations, setStoreLocations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Pathao location data
  const [cities, setCities] = useState([]);
  const [zones, setZones] = useState([]);
  const [areas, setAreas] = useState([]);
  const [selectedCityId, setSelectedCityId] = useState('');
  const [selectedZoneId, setSelectedZoneId] = useState('');

  // Loading states for location data
  const [loadingCities, setLoadingCities] = useState(false);
  const [loadingZones, setLoadingZones] = useState(false);
  const [loadingAreas, setLoadingAreas] = useState(false);

  // Check authentication and redirect if not admin
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    } else if (status === 'authenticated' && session.user.role !== 'admin') {
      router.push('/');
    }
  }, [status, session, router]);

  // Fetch store locations on component mount if authenticated
  useEffect(() => {
    if (status === 'authenticated') {
      fetchStoreLocations();
      fetchPathaoCities();
    }
  }, [status]);

  // Fetch Pathao zones when city is selected
  useEffect(() => {
    if (selectedCityId) {
      fetchPathaoZones(selectedCityId);
    } else {
      setZones([]);
      setSelectedZoneId('');
    }
  }, [selectedCityId]);

  // Fetch Pathao areas when zone is selected
  useEffect(() => {
    if (selectedZoneId) {
      fetchPathaoAreas(selectedZoneId);
    } else {
      setAreas([]);
    }
  }, [selectedZoneId]);

  // Function to fetch store locations
  const fetchStoreLocations = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/store-locations');
      if (!response.ok) {
        throw new Error('Failed to fetch store locations');
      }
      const data = await response.json();
      setStoreLocations(data);
    } catch (error) {
      console.error('Error fetching store locations:', error);
      setError('Failed to load store locations. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Function to fetch Pathao cities
  const fetchPathaoCities = async () => {
    setLoadingCities(true);
    try {
      const response = await fetch('/api/couriers/pathao/cities');
      if (!response.ok) {
        throw new Error('Failed to fetch Pathao cities');
      }
      const data = await response.json();

      // Handle different response structures
      let citiesData = [];
      if (data && data.data && Array.isArray(data.data)) {
        // Standard Pathao API response
        citiesData = data.data;
      } else if (data && data.data && data.data.data && Array.isArray(data.data.data)) {
        // Nested Pathao API response
        citiesData = data.data.data;
      } else if (Array.isArray(data)) {
        // Direct array response
        citiesData = data;
      }

      console.log('Cities data:', citiesData);
      setCities(citiesData);
    } catch (error) {
      console.error('Error fetching Pathao cities:', error);
      setError('Failed to fetch Pathao cities');
    } finally {
      setLoadingCities(false);
    }
  };

  // Function to fetch Pathao zones
  const fetchPathaoZones = async (cityId) => {
    setLoadingZones(true);
    try {
      const response = await fetch(`/api/couriers/pathao/zones?cityId=${cityId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch Pathao zones');
      }
      const data = await response.json();

      // Handle different response structures
      let zonesData = [];
      if (data && data.data && Array.isArray(data.data)) {
        // Standard Pathao API response
        zonesData = data.data;
      } else if (data && data.data && data.data.data && Array.isArray(data.data.data)) {
        // Nested Pathao API response
        zonesData = data.data.data;
      } else if (Array.isArray(data)) {
        // Direct array response
        zonesData = data;
      }

      console.log('Zones data:', zonesData);
      setZones(zonesData);
    } catch (error) {
      console.error('Error fetching Pathao zones:', error);
      setError('Failed to fetch Pathao zones');
    } finally {
      setLoadingZones(false);
    }
  };

  // Function to fetch Pathao areas
  const fetchPathaoAreas = async (zoneId) => {
    setLoadingAreas(true);
    try {
      const response = await fetch(`/api/couriers/pathao/areas?zoneId=${zoneId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch Pathao areas');
      }
      const data = await response.json();

      // Handle different response structures
      let areasData = [];
      if (data && data.data && Array.isArray(data.data)) {
        // Standard Pathao API response
        areasData = data.data;
      } else if (data && data.data && data.data.data && Array.isArray(data.data.data)) {
        // Nested Pathao API response
        areasData = data.data.data;
      } else if (Array.isArray(data)) {
        // Direct array response
        areasData = data;
      }

      console.log('Areas data:', areasData);
      setAreas(areasData);
    } catch (error) {
      console.error('Error fetching Pathao areas:', error);
      setError('Failed to fetch Pathao areas');
    } finally {
      setLoadingAreas(false);
    }
  };

  // Function to handle adding a store location
  const handleAddLocation = async (locationData) => {
    try {
      const response = await fetch('/api/store-locations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(locationData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to add store location');
      }

      // Refresh store locations list
      fetchStoreLocations();
      setShowAddModal(false);
    } catch (error) {
      console.error('Error adding store location:', error);
      setError(error.message || 'Failed to add store location. Please try again.');
    }
  };

  // Function to handle editing a store location
  const handleEditLocation = async (id, locationData) => {
    try {
      const response = await fetch(`/api/store-locations/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(locationData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update store location');
      }

      // Refresh store locations list
      fetchStoreLocations();
      setShowEditModal(false);
      setCurrentLocation(null);
    } catch (error) {
      console.error('Error updating store location:', error);
      setError(error.message || 'Failed to update store location. Please try again.');
    }
  };

  // Function to handle deleting a store location
  const handleDeleteLocation = async (id) => {
    if (!window.confirm('Are you sure you want to delete this store location?')) {
      return;
    }

    try {
      const response = await fetch(`/api/store-locations/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete store location');
      }

      // Refresh store locations list
      fetchStoreLocations();
    } catch (error) {
      console.error('Error deleting store location:', error);
      setError(error.message || 'Failed to delete store location. Please try again.');
    }
  };

  // Filter store locations based on search term
  const filteredLocations = storeLocations.filter(location =>
    location.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    location.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // If loading session, show loading state
  if (status === 'loading') {
    return (
      <div className="px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      </div>
    );
  }

  // If not authenticated or not admin, return null (will redirect in useEffect)
  if (status === 'unauthenticated' || (status === 'authenticated' && session.user.role !== 'admin')) {
    return null;
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      <PageHeader
        onAddClick={() => {
          setCurrentLocation(null);
          setSelectedCityId('');
          setSelectedZoneId('');
          setShowAddModal(true);
        }}
      />

      <SearchBar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
      />

      {/* Error message */}
      {error && (
        <div className="mt-4 bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded relative">
          {error}
        </div>
      )}

      {/* Store locations table */}
      <div className="mt-6 flex flex-col">
        <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
              <StoreLocationsTable
                locations={filteredLocations}
                isLoading={isLoading}
                onEdit={(location) => {
                  setCurrentLocation(location);
                  setSelectedCityId(location.city_id.toString());
                  setSelectedZoneId(location.zone_id.toString());
                  setShowEditModal(true);
                }}
                onDelete={handleDeleteLocation}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Add Store Location Modal */}
      <AddLocationModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSubmit={handleAddLocation}
        cities={cities}
        zones={zones}
        areas={areas}
        selectedCityId={selectedCityId}
        selectedZoneId={selectedZoneId}
        onCityChange={setSelectedCityId}
        onZoneChange={setSelectedZoneId}
        loadingCities={loadingCities}
        loadingZones={loadingZones}
        loadingAreas={loadingAreas}
      />

      {/* Edit Store Location Modal */}
      <EditLocationModal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setCurrentLocation(null);
        }}
        onSubmit={handleEditLocation}
        location={currentLocation}
        cities={cities}
        zones={zones}
        areas={areas}
        onCityChange={setSelectedCityId}
        onZoneChange={setSelectedZoneId}
        loadingCities={loadingCities}
        loadingZones={loadingZones}
        loadingAreas={loadingAreas}
      />
    </div>
  );
}
