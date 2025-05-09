'use client';

import { PlusIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

export default function PageHeader({ 
  title, 
  description, 
  onAddClick, 
  addButtonText = 'Add New',
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
        
        <div className="flex flex-wrap gap-3 justify-end">
          {actions.map((action, index) => (
            <button
              key={index}
              type="button"
              onClick={action.onClick}
              className={`inline-flex items-center px-3 py-2 border text-sm font-medium rounded-md ${
                action.primary 
                  ? 'border-transparent shadow-sm text-white bg-emerald-600 hover:bg-emerald-700 focus:ring-emerald-500' 
                  : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50 focus:ring-emerald-500'
              } focus:outline-none focus:ring-2 focus:ring-offset-2`}
            >
              {action.icon && (
                <action.icon className="-ml-1 mr-2 h-4 w-4" aria-hidden="true" />
              )}
              {action.text}
            </button>
          ))}
          
          {onAddClick && (
            <button
              type="button"
              onClick={onAddClick}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gradient-to-r from-[#006B51] to-[#008B6A] hover:from-[#00604A] hover:to-[#007D5F] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all duration-200"
            >
              <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
              {addButtonText}
            </button>
          )}
        </div>
      </div>
      
      {/* Optional breadcrumb */}
      <div className="mt-2 flex items-center text-sm text-gray-500">
        <Link href="/admin" className="hover:text-emerald-600 transition-colors">
          Dashboard
        </Link>
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="16" 
          height="16" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          className="mx-2 h-4 w-4"
        >
          <polyline points="9 18 15 12 9 6"></polyline>
        </svg>
        <span>{title}</span>
      </div>
    </div>
  );
}
