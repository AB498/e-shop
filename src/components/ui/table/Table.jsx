'use client';

import { forwardRef } from 'react';
import { TableProvider } from './TableContext.jsx';
import TableHead from './TableHead.jsx';
import TableBody from './TableBody.jsx';
import TablePagination from './TablePagination.jsx';
import TableToolbar from './TableToolbar.jsx';

const Table = forwardRef(({
  // Data props
  data = [],
  columns = [],

  // Feature flags
  enableSorting = true,
  enablePagination = true,
  enableSelection = false,
  enableFiltering = false,
  enableToolbar = true,

  // Styling props
  className = '',
  variant = 'default',
  size = 'default',

  // State props
  initialState = {},
  onStateChange,

  // Loading state
  isLoading = false,
  loadingRows = 5,

  // Empty state
  emptyMessage = 'No data available',

  // Server-side rendering
  serverSide = false,

  // Pagination props
  pageSizeOptions = [10, 25, 50, 100],

  // Toolbar props
  title,
  actions,

  // Custom components
  renderToolbar,
  renderPagination,
  renderEmptyState,
  renderLoadingState,

  // Additional props
  ...props
}, ref) => {
  // Determine table variant classes
  const variantClasses = {
    default: 'bg-white divide-y divide-gray-200 shadow-sm rounded-lg border border-gray-200',
    bordered: 'bg-white divide-y divide-gray-200 border border-gray-200 rounded-lg',
    minimal: 'bg-transparent divide-y divide-gray-200',
  };

  // Determine table size classes
  const sizeClasses = {
    sm: 'text-xs',
    default: 'text-sm',
    lg: 'text-base',
  };

  // Combine classes
  const tableClasses = `min-w-full ${variantClasses[variant] || variantClasses.default} ${sizeClasses[size] || sizeClasses.default} ${className}`;

  return (
    <TableProvider
      data={data}
      columns={columns}
      initialState={initialState}
      onStateChange={onStateChange}
      serverSide={serverSide}
      isLoading={isLoading}
    >
      <div className="relative overflow-hidden rounded-lg">
        {/* Gradient overlay at the top - similar to the existing DataTable */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#006B51] to-[#008B6A]"></div>

        <div className="overflow-hidden">
          {/* Table Toolbar */}
          {enableToolbar && (
            renderToolbar ? (
              renderToolbar({ title, actions })
            ) : (
              <TableToolbar title={title} actions={actions} />
            )
          )}

          {/* Table Container */}
          <div className="overflow-x-auto">
            <div className="inline-block min-w-full align-middle">
              <div className="overflow-hidden">
                <table className={tableClasses} ref={ref} {...props}>
                  {/* Table Header */}
                  <TableHead
                    enableSorting={enableSorting}
                    enableSelection={enableSelection}
                  />

                  {/* Table Body */}
                  <TableBody
                    enableSelection={enableSelection}
                    emptyMessage={emptyMessage}
                    loadingRows={loadingRows}
                    renderEmptyState={renderEmptyState}
                    renderLoadingState={renderLoadingState}
                  />
                </table>
              </div>
            </div>
          </div>

          {/* Pagination */}
          {enablePagination && (
            renderPagination ? (
              renderPagination({ pageSizeOptions })
            ) : (
              <TablePagination pageSizeOptions={pageSizeOptions} />
            )
          )}
        </div>
      </div>
    </TableProvider>
  );
});

Table.displayName = 'Table';

export default Table;
