'use client';

export default function AdminDashboardSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Stats Cards Skeleton */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, index) => (
          <div
            key={index}
            className="relative overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:px-6 sm:py-6"
          >
            <div className="flex items-center">
              <div className="h-12 w-12 rounded-md bg-gray-200"></div>
              <div className="ml-4 w-full">
                <div className="h-4 w-24 bg-gray-200 rounded"></div>
                <div className="mt-2 h-6 w-16 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Skeleton */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <div className="rounded-lg bg-white shadow p-6">
          <div className="h-6 w-40 bg-gray-200 rounded mb-4"></div>
          <div className="h-80 bg-gray-100 rounded"></div>
        </div>
        <div className="rounded-lg bg-white shadow p-6">
          <div className="h-6 w-40 bg-gray-200 rounded mb-4"></div>
          <div className="h-80 bg-gray-100 rounded"></div>
        </div>
      </div>

      {/* Tables Skeleton */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        {/* Recent Orders Skeleton */}
        <div className="rounded-lg bg-white shadow overflow-hidden">
          <div className="px-4 py-5 sm:px-6 bg-gray-50 border-b border-gray-200">
            <div className="h-6 w-32 bg-gray-200 rounded"></div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {[...Array(5)].map((_, index) => (
                    <th key={index} scope="col" className="px-6 py-3 text-left">
                      <div className="h-4 w-16 bg-gray-200 rounded"></div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {[...Array(5)].map((_, rowIndex) => (
                  <tr key={rowIndex}>
                    {[...Array(5)].map((_, colIndex) => (
                      <td key={colIndex} className="px-6 py-4 whitespace-nowrap">
                        <div className="h-4 w-16 bg-gray-200 rounded"></div>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 sm:px-6">
            <div className="h-4 w-24 bg-gray-200 rounded"></div>
          </div>
        </div>

        {/* Low Stock Products Skeleton */}
        <div className="rounded-lg bg-white shadow overflow-hidden">
          <div className="px-4 py-5 sm:px-6 bg-gray-50 border-b border-gray-200">
            <div className="h-6 w-32 bg-gray-200 rounded"></div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {[...Array(4)].map((_, index) => (
                    <th key={index} scope="col" className="px-6 py-3 text-left">
                      <div className="h-4 w-16 bg-gray-200 rounded"></div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {[...Array(4)].map((_, rowIndex) => (
                  <tr key={rowIndex}>
                    {[...Array(4)].map((_, colIndex) => (
                      <td key={colIndex} className="px-6 py-4 whitespace-nowrap">
                        <div className="h-4 w-16 bg-gray-200 rounded"></div>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 sm:px-6">
            <div className="h-4 w-24 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
