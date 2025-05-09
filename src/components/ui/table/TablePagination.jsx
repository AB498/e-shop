'use client';

import { useTable } from './TableContext';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

export default function TablePagination({ pageSizeOptions = [10, 25, 50, 100] }) {
  const { pagination, goToPage, setPageSize, rawData } = useTable();

  const { pageIndex, pageSize, pageCount } = pagination;

  // Calculate visible page numbers
  const getPageNumbers = () => {
    const maxVisiblePages = 5;
    const pageNumbers = [];

    if (pageCount <= maxVisiblePages) {
      // If we have fewer pages than the max visible, show all pages
      for (let i = 0; i < pageCount; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Always include first page
      pageNumbers.push(0);

      // Calculate start and end of visible page range
      let startPage = Math.max(1, pageIndex - Math.floor(maxVisiblePages / 2));
      let endPage = Math.min(pageCount - 2, startPage + maxVisiblePages - 3);

      // Adjust if we're near the end
      if (endPage - startPage < maxVisiblePages - 3) {
        startPage = Math.max(1, endPage - (maxVisiblePages - 3));
      }

      // Add ellipsis if needed
      if (startPage > 1) {
        pageNumbers.push('...');
      }

      // Add middle pages
      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }

      // Add ellipsis if needed
      if (endPage < pageCount - 2) {
        pageNumbers.push('...');
      }

      // Always include last page
      if (pageCount > 1) {
        pageNumbers.push(pageCount - 1);
      }
    }

    return pageNumbers;
  };

  const pageNumbers = getPageNumbers();

  // Calculate range of visible items
  const startItem = pageIndex * pageSize + 1;
  const endItem = Math.min((pageIndex + 1) * pageSize, rawData.length);

  return (
    <div className="px-4 py-3 border-t border-gray-200 sm:px-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        {/* Item count display */}
        <div className="flex-shrink-0">
          <p className="text-sm text-gray-700 whitespace-nowrap">
            Showing <span className="font-medium">{startItem}</span> to{' '}
            <span className="font-medium">{endItem}</span> of{' '}
            <span className="font-medium">{rawData.length}</span> results
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          {/* Page size selector */}
          <div className="flex items-center">
            <label htmlFor="pageSize" className="mr-2 text-sm text-gray-600 whitespace-nowrap">
              Rows per page:
            </label>
            <select
              id="pageSize"
              value={pageSize}
              onChange={(e) => setPageSize(Number(e.target.value))}
              className="block w-20 pl-3 pr-10 py-1 text-base border-gray-300 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm rounded-md"
            >
              {pageSizeOptions.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </div>

          {/* Pagination controls */}
          <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px overflow-x-auto" aria-label="Pagination">
            {/* Previous page button */}
            <button
              onClick={() => goToPage(Math.max(0, pageIndex - 1))}
              disabled={pageIndex === 0}
              className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 text-sm font-medium ${
                pageIndex === 0
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-white text-gray-500 hover:bg-gray-50'
              }`}
            >
              <span className="sr-only">Previous</span>
              <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
            </button>

            {/* Page number buttons */}
            <div className="flex">
              {pageNumbers.map((pageNumber, index) => {
                if (pageNumber === '...') {
                  return (
                    <span
                      key={`ellipsis-${index}`}
                      className="relative inline-flex items-center px-2 sm:px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700"
                    >
                      ...
                    </span>
                  );
                }

                return (
                  <button
                    key={`page-${pageNumber}`}
                    onClick={() => goToPage(pageNumber)}
                    className={`relative inline-flex items-center px-2 sm:px-4 py-2 border text-sm font-medium ${
                      pageNumber === pageIndex
                        ? 'z-10 bg-emerald-50 border-emerald-500 text-emerald-600'
                        : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    {pageNumber + 1}
                  </button>
                );
              })}
            </div>

            {/* Next page button */}
            <button
              onClick={() => goToPage(Math.min(pageCount - 1, pageIndex + 1))}
              disabled={pageIndex === pageCount - 1}
              className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 text-sm font-medium ${
                pageIndex === pageCount - 1
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-white text-gray-500 hover:bg-gray-50'
              }`}
            >
              <span className="sr-only">Next</span>
              <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
            </button>
          </nav>
        </div>
      </div>
    </div>
  );
}
