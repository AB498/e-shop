import { PencilIcon, TrashIcon, EyeIcon, ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import Table from '@/components/ui/table';

export default function PromotionsTable({
  promotions,
  isLoading,
  currentPage,
  totalPages,
  onPageChange,
  onEdit,
  onDelete
}) {
  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';

    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Table columns configuration
  const columns = [
    {
      id: 'id',
      key: 'id',
      label: 'ID',
      cell: ({ row }) => (
        <span className="text-sm font-mono text-gray-900">
          #{row.id}
        </span>
      ),
    },
    {
      id: 'image',
      key: 'image',
      label: 'Image',
      cell: ({ row }) => (
        <div className="w-16 h-16 relative rounded overflow-hidden">
          {row.image_url ? (
            <Image
              src={row.image_url}
              alt={row.title}
              fill
              className="object-cover"
              sizes="64px"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500">
              No Image
            </div>
          )}
        </div>
      ),
    },
    {
      id: 'title',
      key: 'title',
      label: 'Title',
      cell: ({ row }) => (
        <div className="font-medium text-gray-900 truncate max-w-xs">
          {row.title}
          {row.description && (
            <p className="text-sm text-gray-500 truncate">{row.description}</p>
          )}
        </div>
      ),
    },
    {
      id: 'type',
      key: 'type',
      label: 'Type',
      cell: ({ row }) => (
        <div>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            {row.type}
          </span>
          {row.discount && (
            <span className="mt-1 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
              {row.discount}% OFF
            </span>
          )}
        </div>
      ),
    },
    {
      id: 'position',
      key: 'position',
      label: 'Position',
      cell: ({ row }) => (
        <span className="text-sm text-gray-500">
          {row.position}
        </span>
      ),
    },
    {
      id: 'dates',
      key: 'dates',
      label: 'Active Period',
      cell: ({ row }) => (
        <div className="text-sm text-gray-500">
          {row.start_date ? (
            <span>From: {formatDate(row.start_date)}</span>
          ) : (
            <span>No start date</span>
          )}
          <br />
          {row.end_date ? (
            <span>To: {formatDate(row.end_date)}</span>
          ) : (
            <span>No end date</span>
          )}
        </div>
      ),
    },
    {
      id: 'status',
      key: 'status',
      label: 'Status',
      cell: ({ row }) => {
        const isActive = row.is_active;
        const now = new Date();
        const startDate = row.start_date ? new Date(row.start_date) : null;
        const endDate = row.end_date ? new Date(row.end_date) : null;

        let status = 'Active';
        let colorClass = 'bg-green-100 text-green-800';

        if (!isActive) {
          status = 'Inactive';
          colorClass = 'bg-gray-100 text-gray-800';
        } else if (startDate && startDate > now) {
          status = 'Scheduled';
          colorClass = 'bg-yellow-100 text-yellow-800';
        } else if (endDate && endDate < now) {
          status = 'Expired';
          colorClass = 'bg-red-100 text-red-800';
        }

        return (
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colorClass}`}>
            {status}
          </span>
        );
      },
    },
    {
      id: 'actions',
      key: 'actions',
      label: 'Actions',
      cell: ({ row }) => (
        <div className="flex space-x-2">
          {row.link_url && (
            <a
              href={row.link_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-gray-500"
              title="Open link"
            >
              <ArrowTopRightOnSquareIcon className="h-5 w-5" />
            </a>
          )}
          <button
            onClick={() => onEdit(row)}
            className="text-indigo-600 hover:text-indigo-900"
            title="Edit promotion"
          >
            <PencilIcon className="h-5 w-5" />
          </button>
          <button
            onClick={() => onDelete(row)}
            className="text-red-600 hover:text-red-900"
            title="Delete promotion"
          >
            <TrashIcon className="h-5 w-5" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <Table
      data={promotions}
      columns={columns}
      isLoading={isLoading}
      pagination={{
        currentPage,
        totalPages,
        onPageChange,
      }}
      emptyState={{
        title: 'No promotions found',
        description: 'Get started by creating a new promotion.',
      }}
    />
  );
}
