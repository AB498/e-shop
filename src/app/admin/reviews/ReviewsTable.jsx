'use client';

import { PencilIcon, TrashIcon, StarIcon } from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import Table from '@/components/ui/table';
import Link from 'next/link';

export default function ReviewsTable({
  reviews = [],
  isLoading = false,
  onChangeStatus,
  onDelete
}) {
  // Helper function to format date
  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown date';

    try {
      const date = new Date(dateString);
      // Check if date is valid
      if (isNaN(date.getTime())) {
        return 'Invalid date';
      }

      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      return date.toLocaleDateString(undefined, options);
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Invalid date';
    }
  };

  // Helper function to get status badge class
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'published':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Define table columns
  const columns = [
    {
      key: 'id',
      label: 'ID',
      sortable: true,
      maxWidth: '60px'
    },
    {
      key: 'product',
      label: 'Product',
      sortable: true,
      render: (review) => {
        const productId = review.productId || 0;
        const productName = review.productName || 'Unknown Product';

        return (
          <div>
            {productId > 0 ? (
              <Link
                href={`/admin/products/${productId}`}
                className="text-emerald-600 hover:text-emerald-800 font-medium"
              >
                {productName}
              </Link>
            ) : (
              <span className="text-gray-600">{productName}</span>
            )}
          </div>
        );
      }
    },
    {
      key: 'user',
      label: 'Customer',
      sortable: true,
      render: (review) => {
        const userName = review.userName || 'Unknown User';
        const userEmail = review.userEmail || 'No email';

        return (
          <div>
            <div className="text-sm font-medium text-gray-900">{userName}</div>
            <div className="text-xs text-gray-500">{userEmail}</div>
          </div>
        );
      }
    },
    {
      key: 'rating',
      label: 'Rating',
      sortable: true,
      maxWidth: '100px',
      render: (review) => {
        // Ensure rating is a number
        const rating = typeof review.rating === 'number'
          ? review.rating
          : parseFloat(review.rating || 0);

        return (
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              i < Math.floor(rating) ? (
                <StarIconSolid key={i} className="h-4 w-4 text-yellow-400" />
              ) : (
                <StarIcon key={i} className="h-4 w-4 text-yellow-400" />
              )
            ))}
            <span className="ml-1 text-sm text-gray-600">{rating.toFixed(1)}</span>
          </div>
        );
      }
    },
    {
      key: 'title',
      label: 'Title',
      sortable: true,
      render: (review) => (
        <div>
          {review.title ? (
            <div className="text-sm font-medium text-gray-900">{review.title}</div>
          ) : (
            <div className="text-sm italic text-gray-500">No Title</div>
          )}
          <div className="text-xs text-gray-500 line-clamp-2">{review.reviewText || 'No review text'}</div>
        </div>
      )
    },
    {
      key: 'verifiedPurchase',
      label: 'Verified',
      sortable: true,
      maxWidth: '80px',
      render: (review) => (
        <div className="text-center">
          {review.verifiedPurchase ? (
            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
              Yes
            </span>
          ) : (
            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
              No
            </span>
          )}
        </div>
      )
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      maxWidth: '100px',
      render: (review) => {
        const status = review.status || 'pending';
        return (
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass(status)}`}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </span>
        );
      }
    },
    {
      key: 'createdAt',
      label: 'Date',
      sortable: true,
      maxWidth: '120px',
      responsive: 'md',
      render: (review) => {
        return (
          <div className="text-sm text-gray-500">
            {formatDate(review.createdAt)}
          </div>
        );
      }
    },
    {
      key: 'actions',
      label: 'Actions',
      maxWidth: '80px',
      render: (review) => (
        <div className="flex space-x-2">
          <button
            onClick={() => onChangeStatus(review)}
            className="text-indigo-600 hover:text-indigo-900"
            title="Change Status"
          >
            <PencilIcon className="h-5 w-5" />
          </button>
          <button
            onClick={() => onDelete(review)}
            className="text-red-600 hover:text-red-900"
            title="Delete Review"
          >
            <TrashIcon className="h-5 w-5" />
          </button>
        </div>
      )
    }
  ];

  return (
    <Table
      data={reviews}
      columns={columns}
      title="Product Reviews"
      isLoading={isLoading}
      emptyMessage="No reviews found"
      enableSorting={true}
      enablePagination={true}
      pageSizeOptions={[10, 25, 50, 100]}
      initialState={{
        pageSize: 10,
        sortBy: 'createdAt',
        sortDirection: 'desc',
      }}
    />
  );
}
