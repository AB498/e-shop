import { PlusIcon, SparklesIcon } from '@heroicons/react/24/outline';

export default function PageHeader({ onAddClick }) {
  return (
    <div className="flex justify-between items-center mb-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center">
          <SparklesIcon className="h-6 w-6 mr-2 text-indigo-600" />
          Promotions
        </h1>
        <p className="mt-1 text-sm text-gray-600">
          Manage banners, carousels, and promotional content across the site
        </p>
      </div>
      <button
        onClick={onAddClick}
        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
        Add Promotion
      </button>
    </div>
  );
}
