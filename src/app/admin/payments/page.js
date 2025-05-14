'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  MagnifyingGlassIcon,
  ArrowPathIcon,
  CurrencyDollarIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline';
import PaymentsTable from './PaymentsTable';
import PaymentDetailsModal from './PaymentDetailsModal';
import PaymentStatsCards from './PaymentStatsCards';

export default function PaymentsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [transactions, setTransactions] = useState([]);
  const [stats, setStats] = useState({
    totalTransactions: 0,
    successfulTransactions: 0,
    failedTransactions: 0,
    totalAmount: 0,
    recentTransactions: []
  });
  const [pagination, setPagination] = useState({
    total: 0,
    totalPages: 0,
    currentPage: 1,
    limit: 10,
    hasNextPage: false,
    hasPrevPage: false
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [migrationLoading, setMigrationLoading] = useState(false);
  const [migrationSuccess, setMigrationSuccess] = useState(false);

  // Get page from URL query params
  const page = searchParams.get('page') ? parseInt(searchParams.get('page')) : 1;
  const statusParam = searchParams.get('status') || '';
  const searchParam = searchParams.get('search') || '';

  // Set initial filter values from URL
  useEffect(() => {
    if (statusParam) setStatusFilter(statusParam);
    if (searchParam) setSearchTerm(searchParam);
  }, [statusParam, searchParam]);

  // Fetch transactions data
  useEffect(() => {
    async function fetchTransactions() {
      try {
        setLoading(true);

        // Fetch transactions
        const response = await fetch(
          `/api/admin/payments?page=${page}&limit=10${statusFilter ? `&status=${statusFilter}` : ''}${searchTerm ? `&search=${searchTerm}` : ''}`
        );

        if (!response.ok) {
          throw new Error('Failed to fetch transactions');
        }

        const data = await response.json();
        setTransactions(data.transactions);
        setPagination(data.pagination);

        // Fetch stats
        const statsResponse = await fetch('/api/admin/payments/stats');

        if (!statsResponse.ok) {
          throw new Error('Failed to fetch payment stats');
        }

        const statsData = await statsResponse.json();
        setStats(statsData);

        setLoading(false);
      } catch (err) {
        console.error('Error fetching transactions:', err);
        setError(err.message);
        setLoading(false);
      }
    }

    fetchTransactions();
  }, [page, statusFilter, searchTerm]);

  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    updateUrlParams({ page: 1, search: searchTerm });
  };

  // Handle status filter change
  const handleStatusFilterChange = (e) => {
    const newStatus = e.target.value;
    setStatusFilter(newStatus);
    updateUrlParams({ page: 1, status: newStatus });
  };

  // Handle pagination
  const handlePageChange = (newPage) => {
    updateUrlParams({ page: newPage });
  };

  // Update URL parameters
  const updateUrlParams = (params) => {
    const newParams = new URLSearchParams(searchParams);

    Object.entries(params).forEach(([key, value]) => {
      if (value) {
        newParams.set(key, value);
      } else {
        newParams.delete(key);
      }
    });

    router.push(`/admin/payments?${newParams.toString()}`);
  };

  // Handle view transaction details
  const handleViewTransaction = async (transaction) => {
    try {
      setLoading(true);

      const response = await fetch(`/api/admin/payments/${transaction.id}`);

      if (!response.ok) {
        throw new Error('Failed to fetch transaction details');
      }

      const data = await response.json();
      setSelectedTransaction(data);
      setShowDetailsModal(true);

      setLoading(false);
    } catch (err) {
      console.error('Error fetching transaction details:', err);
      setError(err.message);
      setLoading(false);
    }
  };

  // Run database migration
  const runMigration = async () => {
    try {
      setMigrationLoading(true);
      setMigrationSuccess(false);
      setError(null);

      const response = await fetch('/api/admin/migrations/run', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to run migration');
      }

      setMigrationSuccess(true);

      // Refresh the page after successful migration
      setTimeout(() => {
        router.refresh();
      }, 2000);
    } catch (err) {
      console.error('Error running migration:', err);
      setError(err.message);
    } finally {
      setMigrationLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <CurrencyDollarIcon className="h-6 w-6 mr-2 text-emerald-600" />
            Payments
          </h1>
          <p className="mt-1 text-sm text-gray-600">
            View and manage all payment transactions processed through SSLCommerz
          </p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => {
              setLoading(true);
              router.refresh();
              setTimeout(() => setLoading(false), 500);
            }}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
          >
            <ArrowPathIcon className={`-ml-1 mr-2 h-5 w-5 ${loading ? 'animate-spin' : ''}`} />
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

      {/* Stats Cards */}
      <PaymentStatsCards stats={stats} isLoading={loading} />

      {/* Filters */}
      <div className="bg-white shadow rounded-lg p-4 sm:p-6 mb-6">
        <div className="flex flex-wrap gap-4">
          <div className="w-full sm:flex-1">
            <form onSubmit={handleSearch} className="flex flex-wrap gap-2">
              <div className="relative flex-grow">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by ID or transaction ID"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                />
              </div>
              <button
                type="submit"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
              >
                Search
              </button>
            </form>
          </div>

          <div className="w-full sm:w-auto">
            <select
              value={statusFilter}
              onChange={handleStatusFilterChange}
              className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm rounded-md"
            >
              <option value="">All Statuses</option>
              <option value="VALID">Valid</option>
              <option value="VALIDATED">Validated</option>
              <option value="FAILED">Failed</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <PaymentsTable
          transactions={transactions}
          isLoading={loading}
          onViewDetails={handleViewTransaction}
        />

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing <span className="font-medium">{((pagination.currentPage - 1) * pagination.limit) + 1}</span> to{' '}
                  <span className="font-medium">
                    {Math.min(pagination.currentPage * pagination.limit, pagination.total)}
                  </span>{' '}
                  of <span className="font-medium">{pagination.total}</span> results
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <button
                    onClick={() => handlePageChange(pagination.currentPage - 1)}
                    disabled={!pagination.hasPrevPage}
                    className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${
                      pagination.hasPrevPage ? 'text-gray-500 hover:bg-gray-50' : 'text-gray-300 cursor-not-allowed'
                    }`}
                  >
                    <span className="sr-only">Previous</span>
                    <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
                  </button>

                  {[...Array(pagination.totalPages).keys()].map((pageIdx) => {
                    const pageNumber = pageIdx + 1;
                    const isCurrentPage = pageNumber === pagination.currentPage;

                    // Show limited page numbers to avoid clutter
                    if (
                      pageNumber === 1 ||
                      pageNumber === pagination.totalPages ||
                      (pageNumber >= pagination.currentPage - 1 && pageNumber <= pagination.currentPage + 1)
                    ) {
                      return (
                        <button
                          key={pageNumber}
                          onClick={() => handlePageChange(pageNumber)}
                          className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                            isCurrentPage
                              ? 'z-10 bg-emerald-50 border-emerald-500 text-emerald-600'
                              : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                          }`}
                        >
                          {pageNumber}
                        </button>
                      );
                    }

                    // Add ellipsis for skipped pages
                    if (
                      (pageNumber === 2 && pagination.currentPage > 3) ||
                      (pageNumber === pagination.totalPages - 1 && pagination.currentPage < pagination.totalPages - 2)
                    ) {
                      return (
                        <span
                          key={`ellipsis-${pageNumber}`}
                          className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700"
                        >
                          ...
                        </span>
                      );
                    }

                    return null;
                  })}

                  <button
                    onClick={() => handlePageChange(pagination.currentPage + 1)}
                    disabled={!pagination.hasNextPage}
                    className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${
                      pagination.hasNextPage ? 'text-gray-500 hover:bg-gray-50' : 'text-gray-300 cursor-not-allowed'
                    }`}
                  >
                    <span className="sr-only">Next</span>
                    <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Transaction Details Modal */}
      {showDetailsModal && selectedTransaction && (
        <PaymentDetailsModal
          transaction={selectedTransaction}
          onClose={() => {
            setShowDetailsModal(false);
            setSelectedTransaction(null);
          }}
        />
      )}
    </div>
  );
}
