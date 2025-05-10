'use client';

import { useTable } from './TableContext';

export default function TableBody({
  enableSelection = false,
  emptyMessage = 'No data available',
  loadingRows = 5,
  renderEmptyState,
  renderLoadingState,
}) {
  const {
    data,
    columns,
    isLoading,
    selectedRows,
    toggleRowSelection,
  } = useTable();

  // Loading state
  if (isLoading) {
    if (renderLoadingState) {
      return <tbody>{renderLoadingState({ columns, loadingRows })}</tbody>;
    }

    return (
      <tbody className="bg-white divide-y divide-gray-100">
        {Array.from({ length: loadingRows }).map((_, rowIndex) => (
          <tr key={`loading-${rowIndex}`}>
            {enableSelection && (
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="h-4 w-4 bg-gray-200 rounded animate-pulse"></div>
              </td>
            )}
            {columns.map((column) => (
              <td
                key={`loading-cell-${column.id || column.key}-${rowIndex}`}
                className="px-6 py-4"
              >
                <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    );
  }

  // Empty state
  if (!data.length) {
    if (renderEmptyState) {
      return <tbody>{renderEmptyState({ columns, emptyMessage })}</tbody>;
    }

    return (
      <tbody className="bg-white">
        <tr>
          <td
            colSpan={enableSelection ? columns.length + 1 : columns.length}
            className="px-6 py-8 text-center text-sm text-gray-500"
          >
            {emptyMessage}
          </td>
        </tr>
      </tbody>
    );
  }

  // Render data rows
  return (
    <tbody className="bg-white divide-y divide-gray-100">
      {data.map((row, rowIndex) => {
        // Get row ID for selection
        const rowId = row.id || row._id || rowIndex;
        const isSelected = selectedRows.includes(rowId);

        return (
          <tr
            key={`row-${rowId}`}
            className={`hover:bg-gray-50 transition-colors duration-150 ${
              isSelected ? 'bg-emerald-50' : ''
            }`}
          >
            {/* Selection checkbox */}
            {enableSelection && (
              <td className="px-3 sm:px-6 py-4 w-10">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                    checked={isSelected}
                    onChange={() => toggleRowSelection(rowId)}
                  />
                </div>
              </td>
            )}

            {/* Data cells */}
            {columns.map((column) => {
              // Responsive classes for column visibility
              const responsiveClasses = column.responsive ?
                `${column.responsive === 'md' ? 'hidden md:table-cell' :
                  column.responsive === 'lg' ? 'hidden lg:table-cell' :
                  column.responsive === 'xl' ? 'hidden xl:table-cell' : ''}`
                : '';

              // Determine text handling based on column configuration
              const textHandlingClass = column.noWrap
                ? 'whitespace-nowrap'
                : column.truncate
                  ? 'truncate'
                  : 'break-words';

              // Apply max width if specified
              const cellStyle = {
                ...(column.maxWidth ? { maxWidth: column.maxWidth } : {}),
                ...column.cellStyle
              };

              return (
                <td
                  key={`cell-${column.id || column.key}-${rowIndex}`}
                  className={`px-3 sm:px-6 py-4 text-sm ${textHandlingClass} ${responsiveClasses} ${column.cellClassName || ''}`}
                  style={cellStyle}
                  title={column.truncate && typeof row[column.key] === 'string' ? row[column.key] : undefined}
                >
                  <div className={column.truncate ? 'truncate' : ''}>
                    {column.cell ? column.cell({ row, rowIndex }) : (column.render ? column.render(row, rowIndex) : row[column.key])}
                  </div>
                </td>
              );
            })}
          </tr>
        );
      })}
    </tbody>
  );
}
