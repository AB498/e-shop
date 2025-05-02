'use client';

export default function DataTable({
  title,
  columns,
  data,
  isLoading,
  emptyMessage = 'No data available',
  color = 'blue',
  footerLink,
  footerText
}) {
  // Define gradient colors based on the provided color
  const gradientColors = {
    blue: 'from-[#006B51] to-[#008B6A]',
    green: 'from-[#006B51] to-[#008B6A]',
    purple: 'from-[#006B51] to-[#008B6A]',
    amber: 'from-[#006B51] to-[#008B6A]',
    red: 'from-red-500 to-red-400',
    primary: 'from-[#006B51] to-[#008B6A]',
  };

  const gradientClass = gradientColors[color] || gradientColors.blue;

  return (
    <div className="relative overflow-hidden rounded-xl bg-white shadow-md">
      {/* Gradient overlay at the top */}
      <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${gradientClass}`}></div>

      <div className="px-4 py-5 sm:px-6 bg-white border-b border-gray-100">
        <h3 className="text-lg font-medium leading-6 text-gray-900">{title}</h3>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {isLoading ? (
              // Loading skeleton
              Array.from({ length: 5 }).map((_, index) => (
                <tr key={`loading-${index}`}>
                  {columns.map((column) => (
                    <td key={`loading-cell-${column.key}-${index}`} className="px-6 py-4 whitespace-nowrap">
                      <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                    </td>
                  ))}
                </tr>
              ))
            ) : data && data.length > 0 ? (
              // Actual data
              data.map((row, rowIndex) => (
                <tr key={`row-${rowIndex}`} className="hover:bg-gray-50 transition-colors duration-150">
                  {columns.map((column) => (
                    <td
                      key={`cell-${column.key}-${rowIndex}`}
                      className="px-6 py-4 whitespace-nowrap text-sm"
                    >
                      {column.render ? column.render(row) : row[column.key]}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              // Empty state
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-6 py-8 text-center text-sm text-gray-500"
                >
                  {emptyMessage}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {footerLink && (
        <div className="px-4 py-3 bg-white border-t border-gray-100 sm:px-6">
          <div className="text-sm">
            <a
              href={footerLink}
              className="font-medium text-blue-600 hover:text-blue-500 transition-colors duration-150"
            >
              {footerText || 'View all'}
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
