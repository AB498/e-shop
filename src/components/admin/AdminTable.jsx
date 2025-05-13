'use client';

import React, { useState, useEffect } from 'react';
import { ChevronUpIcon, ChevronDownIcon } from '@heroicons/react/24/outline';

export default function AdminTable({
  columns,
  data,
  isLoading = false,
  error = null,
  emptyMessage = 'No data available',
  onRowClick = null,
  initialSort = { field: null, direction: 'asc' }
}) {
  const [sortConfig, setSortConfig] = useState(initialSort);
  const [sortedData, setSortedData] = useState([]);

  // Sort data when sortConfig or data changes
  useEffect(() => {
    if (!data || data.length === 0) {
      setSortedData([]);
      return;
    }

    let sortableData = [...data];
    
    if (sortConfig.field) {
      sortableData.sort((a, b) => {
        const aValue = a[sortConfig.field];
        const bValue = b[sortConfig.field];
        
        if (aValue === null || aValue === undefined) return 1;
        if (bValue === null || bValue === undefined) return -1;
        
        if (typeof aValue === 'string' && typeof bValue === 'string') {
          return sortConfig.direction === 'asc' 
            ? aValue.localeCompare(bValue) 
            : bValue.localeCompare(aValue);
        }
        
        return sortConfig.direction === 'asc' 
          ? aValue - bValue 
          : bValue - aValue;
      });
    }
    
    setSortedData(sortableData);
  }, [data, sortConfig]);

  // Handle column header click for sorting
  const handleSort = (field) => {
    setSortConfig(prevConfig => ({
      field,
      direction: prevConfig.field === field && prevConfig.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  // Render sort indicator
  const renderSortIndicator = (field) => {
    if (sortConfig.field !== field) return null;
    
    return sortConfig.direction === 'asc' 
      ? <ChevronUpIcon className="h-4 w-4 ml-1" /> 
      : <ChevronDownIcon className="h-4 w-4 ml-1" />;
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-[200px] flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-12 rounded-full bg-gray-200"></div>
          <div className="mt-2 h-4 w-24 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-[200px] flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-lg font-medium mb-2">Error loading data</div>
          <div className="text-gray-500">{error}</div>
        </div>
      </div>
    );
  }

  // Empty state
  if (!data || data.length === 0) {
    return (
      <div className="min-h-[200px] flex items-center justify-center">
        <div className="text-center text-gray-500">{emptyMessage}</div>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((column, index) => (
              <th 
                key={index}
                scope="col" 
                className={`px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${column.sortable ? 'cursor-pointer' : ''}`}
                onClick={column.sortable ? () => handleSort(column.accessor) : undefined}
              >
                <div className="flex items-center">
                  {column.header}
                  {column.sortable && renderSortIndicator(column.accessor)}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {sortedData.map((row, rowIndex) => (
            <tr 
              key={rowIndex} 
              className={onRowClick ? 'cursor-pointer hover:bg-gray-50' : ''}
              onClick={onRowClick ? () => onRowClick(row) : undefined}
            >
              {columns.map((column, colIndex) => (
                <td key={colIndex} className="px-4 py-4 whitespace-nowrap">
                  {column.cell ? column.cell(row) : row[column.accessor]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
