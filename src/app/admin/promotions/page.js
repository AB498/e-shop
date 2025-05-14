'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { ArrowPathIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';
import PageHeader from './PageHeader';
import SearchBar from './SearchBar';
import PromotionsTable from './PromotionsTable';
import AddPromotionModal from './AddPromotionModal';
import EditPromotionModal from './EditPromotionModal';
import ConfirmDeleteModal from './ConfirmDeleteModal';
import { getAllPromotions, deletePromotion } from '@/lib/actions/promotions';

export default function PromotionsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentPromotion, setCurrentPromotion] = useState(null);
  const [filterType, setFilterType] = useState('');
  const [filterPosition, setFilterPosition] = useState('');
  const [filterActive, setFilterActive] = useState(false);

  // Check authentication
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    } else if (status === 'authenticated' && session?.user?.role !== 'admin') {
      router.push('/');
    }
  }, [status, session, router]);

  // Fetch promotions
  const fetchPromotions = async () => {
    try {
      setLoading(true);
      setError(null);

      const result = await getAllPromotions({
        page: currentPage,
        limit: 10,
        type: filterType || null,
        position: filterPosition || null,
        activeOnly: filterActive,
        searchTerm: searchTerm,
      });

      setPromotions(result.promotions);
      setTotalPages(result.totalPages);
      setCurrentPage(result.currentPage);
    } catch (err) {
      console.error('Error fetching promotions:', err);
      setError('Failed to load promotions. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    if (status === 'authenticated' && session?.user?.role === 'admin') {
      fetchPromotions();
    }
  }, [status, session, currentPage, filterType, filterPosition, filterActive]);

  // Handle search with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      if (status === 'authenticated' && session?.user?.role === 'admin') {
        fetchPromotions();
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Handle add promotion
  const handleAddPromotion = async () => {
    toast.success('Promotion created successfully');
    await fetchPromotions();
    setShowAddModal(false);
  };

  // Handle edit promotion
  const handleEditPromotion = async () => {
    toast.success('Promotion updated successfully');
    await fetchPromotions();
    setShowEditModal(false);
    setCurrentPromotion(null);
  };

  // Handle delete promotion
  const handleDeletePromotion = async () => {
    try {
      setLoading(true);
      setError(null); // Clear any previous errors

      const success = await deletePromotion(currentPromotion.id);

      if (success) {
        toast.success('Promotion deleted successfully');
        await fetchPromotions();
      } else {
        setError('Failed to delete promotion. Please try again.');
      }
    } catch (err) {
      console.error('Error deleting promotion:', err);
      setError(`Failed to delete promotion: ${err.message || 'Please try again.'}`);
    } finally {
      setLoading(false);
      setShowDeleteModal(false);
      setCurrentPromotion(null);
    }
  };

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  if (status === 'loading') {
    return <div className="p-8 text-center">Loading...</div>;
  }

  if (status === 'authenticated' && session?.user?.role !== 'admin') {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="space-y-6">
      <PageHeader
        onAddClick={() => setShowAddModal(true)}
      />

      <div className="mb-6 space-y-4">
        <div className="w-full">
          <SearchBar
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="rounded-md border-gray-300 shadow-sm focus:border-emerald-300 focus:ring focus:ring-emerald-200 focus:ring-opacity-50 text-sm"
          >
            <option value="">All Types</option>
            <option value="banner">Banner</option>
            <option value="carousel">Carousel</option>
            <option value="deal">Deal</option>
          </select>

          <select
            value={filterPosition}
            onChange={(e) => setFilterPosition(e.target.value)}
            className="rounded-md border-gray-300 shadow-sm focus:border-emerald-300 focus:ring focus:ring-emerald-200 focus:ring-opacity-50 text-sm"
          >
            <option value="">All Positions</option>
            <option value="home">Home</option>
            <option value="category">Category</option>
            <option value="product">Product</option>
          </select>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="activeOnly"
              checked={filterActive}
              onChange={(e) => setFilterActive(e.target.checked)}
              className="rounded border-gray-300 text-emerald-600 shadow-sm focus:border-emerald-300 focus:ring focus:ring-emerald-200 focus:ring-opacity-50"
            />
            <label htmlFor="activeOnly" className="ml-2 text-sm text-gray-700">
              Active Only
            </label>
          </div>

          <button
            onClick={() => fetchPromotions()}
            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
          >
            <ArrowPathIcon className={`-ml-0.5 mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-md mb-6">
          <p className="font-medium">Error:</p>
          <p>{error}</p>
        </div>
      )}

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <PromotionsTable
          promotions={promotions}
          isLoading={loading}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          onEdit={(promotion) => {
            setCurrentPromotion(promotion);
            setShowEditModal(true);
          }}
          onDelete={(promotion) => {
            setCurrentPromotion(promotion);
            setShowDeleteModal(true);
          }}
        />
      </div>

      {/* Modals */}
      {showAddModal && (
        <AddPromotionModal
          onClose={() => setShowAddModal(false)}
          onSubmit={handleAddPromotion}
        />
      )}

      {showEditModal && currentPromotion && (
        <EditPromotionModal
          promotion={currentPromotion}
          onClose={() => {
            setShowEditModal(false);
            setCurrentPromotion(null);
          }}
          onSubmit={handleEditPromotion}
        />
      )}

      {showDeleteModal && currentPromotion && (
        <ConfirmDeleteModal
          promotion={currentPromotion}
          onClose={() => {
            setShowDeleteModal(false);
            setCurrentPromotion(null);
          }}
          onConfirm={handleDeletePromotion}
        />
      )}
    </div>
  );
}
