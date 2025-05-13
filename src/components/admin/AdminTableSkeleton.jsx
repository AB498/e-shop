'use client';

export default function AdminTableSkeleton() {
  return (
    <div className="py-6 animate-pulse">
      <div className="mx-auto px-4 sm:px-6 md:px-8">
        {/* Header Skeleton */}
        <div className="mb-6">
          <div className="flex items-center">
            <div className="h-10 w-10 rounded-md bg-gray-200"></div>
            <div className="ml-3 h-8 w-48 bg-gray-200 rounded"></div>
          </div>
          <div className="mt-2 h-4 w-64 bg-gray-200 rounded"></div>
        </div>

        {/* Card Skeleton */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          {/* Card Header */}
          <div className="border-b border-gray-200 p-4">
            <div className="flex justify-between items-center">
              <div className="flex space-x-2">
                <div className="h-8 w-32 bg-gray-200 rounded"></div>
                <div className="h-8 w-24 bg-gray-200 rounded"></div>
              </div>
              <div className="h-8 w-24 bg-gray-200 rounded"></div>
            </div>
          </div>

          {/* Table Skeleton */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {[...Array(6)].map((_, i) => (
                    <th key={i} scope="col" className="px-6 py-3">
                      <div className="h-4 bg-gray-200 rounded w-20"></div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {[...Array(5)].map((_, rowIndex) => (
                  <tr key={rowIndex}>
                    {[...Array(6)].map((_, colIndex) => (
                      <td key={colIndex} className="px-6 py-4 whitespace-nowrap">
                        <div className="h-4 bg-gray-200 rounded w-full" style={{ maxWidth: colIndex === 0 ? '40px' : '120px' }}></div>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
