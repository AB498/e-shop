'use client';

import { useTable } from './TableContext';
import { ChevronUpIcon, ChevronDownIcon } from '@heroicons/react/24/outline';

export default function TableHead({ enableSorting = true, enableSelection = false }) {
  const {
    columns,
    sorting,
    handleSort,
    selectAll,
    toggleSelectAll,
    rawData
  } = useTable();

  return (
    <thead className="bg-gray-50">
      <tr>
        {/* Selection checkbox column */}
        {enableSelection && (
          <th className="px-2 sm:px-4 py-2 w-8">
            <div className="flex items-center">
              <input
                type="checkbox"
                className="h-3.5 w-3.5 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                checked={selectAll}
                onChange={toggleSelectAll}
                disabled={!rawData.length}
              />
            </div>
          </th>
        )}

        {/* Data columns */}
        {columns.map((column) => {
          const columnKey = column.key || column.id;
          const isSorted = sorting.sortBy === columnKey;
          const sortDirection = isSorted ? sorting.sortDirection : null;

          // Determine if this column is sortable
          const isSortable = enableSorting && column.sortable !== false;

          // Responsive classes for column visibility
          const responsiveClasses = column.responsive ?
            `${column.responsive === 'md' ? 'hidden md:table-cell' :
              column.responsive === 'lg' ? 'hidden lg:table-cell' :
              column.responsive === 'xl' ? 'hidden xl:table-cell' : ''}`
            : '';

          // Apply max width if specified
          const headerStyle = {
            ...(column.maxWidth ? { maxWidth: column.maxWidth } : {}),
            ...column.style
          };

          return (
            <th
              key={columnKey}
              className={`
                px-2 sm:px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider
                ${isSortable ? 'cursor-pointer select-none' : ''}
                ${responsiveClasses}
                ${column.className || ''}
              `}
              style={headerStyle}
              onClick={() => isSortable && handleSort(columnKey)}
            >
              <div className="flex items-center space-x-1">
                <span className="truncate">{column.label || column.header || columnKey}</span>

                {isSortable && (
                  <span className="inline-flex flex-col flex-shrink-0">
                    <ChevronUpIcon
                      className={`h-2.5 w-2.5 ${sortDirection === 'asc' && isSorted ? 'text-emerald-600' : 'text-gray-400'}`}
                    />
                    <ChevronDownIcon
                      className={`h-2.5 w-2.5 -mt-1 ${sortDirection === 'desc' && isSorted ? 'text-emerald-600' : 'text-gray-400'}`}
                    />
                  </span>
                )}
              </div>
            </th>
          );
        })}
      </tr>
    </thead>
  );
}
