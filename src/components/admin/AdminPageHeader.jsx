'use client';

import { PlusIcon } from '@heroicons/react/24/outline';

export default function AdminPageHeader({
  title,
  description,
  icon: Icon,
  actions = []
}) {
  return (
    <div className="mb-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
        <div className="mb-4 sm:mb-0">
          <div className="flex items-center">
            {Icon && (
              <div className="mr-3 p-2 rounded-md bg-emerald-100">
                <Icon className="h-6 w-6 text-emerald-600" aria-hidden="true" />
              </div>
            )}
            <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
          </div>
          {description && (
            <p className="mt-2 text-sm text-gray-600">{description}</p>
          )}
        </div>
        
        {actions.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {actions.map((action, index) => (
              <button
                key={index}
                type="button"
                onClick={action.onClick}
                className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm ${
                  action.primary
                    ? 'text-white bg-emerald-600 hover:bg-emerald-700'
                    : 'text-gray-700 bg-white border-gray-300 hover:bg-gray-50'
                }`}
              >
                {action.icon && (
                  <action.icon className="mr-2 -ml-1 h-5 w-5" aria-hidden="true" />
                )}
                {action.text}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
