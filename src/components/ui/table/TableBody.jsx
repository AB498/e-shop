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
              <td className="px-2 sm:px-4 py-2 whitespace-nowrap">
                <div className="h-3.5 w-3.5 bg-gray-200 rounded animate-pulse"></div>
              </td>
            )}
            {columns.map((column) => (
              <td
                key={`loading-cell-${column.id || column.key}-${rowIndex}`}
                className="px-2 sm:px-4 py-2"
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
            className="px-2 sm:px-4 py-4 text-center text-sm text-gray-500"
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
              <td className="px-2 sm:px-4 py-2 w-8">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    className="h-3.5 w-3.5 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
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
              // Only apply whitespace-nowrap or break-words to the td element
              const textHandlingClass = column.noWrap
                ? 'whitespace-nowrap'
                : 'break-words';

              // Apply max width if specified
              const cellStyle = {
                ...(column.maxWidth ? { maxWidth: column.maxWidth } : {}),
                ...column.cellStyle
              };

              // Determine title for tooltip
              const cellContent = column.key && row[column.key];

              // By default, show tooltip for all string content unless explicitly disabled
              const shouldShowTooltip =
                typeof cellContent === 'string' &&
                cellContent.length > 0 &&
                !(column.noWrap || column.showTooltip === false);

              // Get tooltip content - either from the raw data or from a custom tooltip function
              let tooltipTitle;
              if (column.tooltip) {
                tooltipTitle = typeof column.tooltip === 'function' ? column.tooltip(row) : column.tooltip;
              } else if (shouldShowTooltip) {
                tooltipTitle = cellContent;
              }

              return (
                <td
                  key={`cell-${column.id || column.key}-${rowIndex}`}
                  className={`px-2 sm:px-4 py-2 text-xs sm:text-sm ${textHandlingClass} ${responsiveClasses} ${column.cellClassName || ''}`}
                  style={cellStyle}
                  title={tooltipTitle}
                >
                  <div className={
                    column.truncate
                      ? 'truncate'
                      : column.noWrap
                        ? ''
                        : column.clampLines === false
                          ? ''
                          : 'line-clamp-4'
                  }>
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
