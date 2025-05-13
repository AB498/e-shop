'use client';

import { useTable } from './TableContext';

export default function TableToolbar({ title, actions }) {
  const { selectedRows } = useTable();

  const hasSelection = selectedRows.length > 0;

  return (
    <div className="px-3 py-3 sm:px-4 bg-white border-b border-gray-100">
      <div className="flex flex-wrap items-center justify-between gap-2 sm:gap-3">
        {/* Title section */}
        <div className="flex-shrink-0 mb-1 sm:mb-0">
          <h3 className="text-base sm:text-lg font-medium leading-6 text-gray-900">
            {hasSelection ? `${selectedRows.length} selected` : title}
          </h3>
        </div>

        {/* Actions section */}
        {actions && (
          <div className="flex flex-wrap gap-1 sm:gap-2 ml-auto">
            {Array.isArray(actions) ? (
              actions.map((action, index) => (
                <div key={index} className="flex-shrink-0">{action}</div>
              ))
            ) : (
              <div className="flex-shrink-0">{actions}</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
