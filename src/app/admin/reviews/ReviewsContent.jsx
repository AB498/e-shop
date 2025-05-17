'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { toast } from 'react-hot-toast';
import { ArrowPathIcon, FunnelIcon } from '@heroicons/react/24/outline';
import ReviewsTable from './ReviewsTable';
import ConfirmDeleteModal from './ConfirmDeleteModal';
import EditReviewStatusModal from './EditReviewStatusModal';

export default function ReviewsContent() {
  const { data: session } = useSession();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentReview, setCurrentReview] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditStatusModal, setShowEditStatusModal] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');

  // Fetch reviews on component mount
  useEffect(() => {
    fetchReviews();
  }, []);

  // Function to fetch reviews
  const fetchReviews = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/admin/reviews');
      if (!response.ok) {
        throw new Error('Failed to fetch reviews');
      }
      const data = await response.json();
      setReviews(data);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      setError(error.message);
      toast.error('Failed to load reviews');
    } finally {
      setLoading(false);
    }
  };

  // Function to handle review deletion
  const handleDeleteReview = async (reviewId) => {
    try {
      const response = await fetch(`/api/admin/reviews/${reviewId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete review');
      }

      // Remove the deleted review from the state
      setReviews(reviews.filter(review => review.id !== reviewId));
      toast.success('Review deleted successfully');
      setShowDeleteModal(false);
    } catch (error) {
      console.error('Error deleting review:', error);
      toast.error('Failed to delete review');
    }
  };

  // Function to handle review status update
  const handleUpdateReviewStatus = async (reviewId, status) => {
    try {
      const response = await fetch(`/api/admin/reviews/${reviewId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        throw new Error('Failed to update review status');
      }

      // Update the review status in the state
      setReviews(reviews.map(review =>
        review.id === reviewId ? { ...review, status } : review
      ));

      toast.success('Review status updated successfully');
      setShowEditStatusModal(false);
    } catch (error) {
      console.error('Error updating review status:', error);
      toast.error('Failed to update review status');
    }
  };

  // Filter reviews based on status
  const filteredReviews = statusFilter === 'all'
    ? reviews
    : reviews.filter(review => review.status === statusFilter);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-4 justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Product Reviews</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage customer reviews for products
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={fetchReviews}
            className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
          >
            <ArrowPathIcon className={`-ml-1 mr-2 h-5 w-5 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <div className="relative">
            <button
              className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
              onClick={() => {
                const select = document.getElementById('status-filter');
                if (select) {
                  select.classList.toggle('hidden');
                }
              }}
            >
              <FunnelIcon className="-ml-1 mr-2 h-5 w-5" />
              Filter: {statusFilter === 'all' ? 'All' : statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1)}
            </button>
            <select
              id="status-filter"
              className="hidden absolute top-full left-0 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 py-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                e.target.classList.add('hidden');
              }}
            >
              <option value="all">All Reviews</option>
              <option value="published">Published</option>
              <option value="pending">Pending</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-md mb-6">
          <p className="font-medium">Error:</p>
          <p>{error}</p>
        </div>
      )}

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <ReviewsTable
          reviews={filteredReviews}
          isLoading={loading}
          onChangeStatus={(review) => {
            setCurrentReview(review);
            setShowEditStatusModal(true);
          }}
          onDelete={(review) => {
            setCurrentReview(review);
            setShowDeleteModal(true);
          }}
        />
      </div>

      {/* Modals */}
      {showDeleteModal && currentReview && (
        <ConfirmDeleteModal
          review={currentReview}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={() => handleDeleteReview(currentReview.id)}
        />
      )}

      {showEditStatusModal && currentReview && (
        <EditReviewStatusModal
          review={currentReview}
          onClose={() => setShowEditStatusModal(false)}
          onSubmit={(status) => handleUpdateReviewStatus(currentReview.id, status)}
        />
      )}
    </div>
  );
}
