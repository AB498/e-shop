'use client';

import { createContext, useContext, useState, useCallback, useMemo } from 'react';

const TableContext = createContext(null);

export function TableProvider({
  children,
  data = [],
  columns = [],
  initialState = {},
  onStateChange,
  serverSide = false,
  isLoading = false,
}) {
  // Pagination state
  const [pagination, setPagination] = useState({
    pageIndex: initialState.pageIndex || 0,
    pageSize: initialState.pageSize || 10,
    pageCount: initialState.pageCount || Math.ceil(data.length / (initialState.pageSize || 10)),
    ...initialState.pagination,
  });

  // Sorting state
  const [sorting, setSorting] = useState({
    sortBy: initialState.sortBy || '',
    sortDirection: initialState.sortDirection || 'asc',
    ...initialState.sorting,
  });

  // Filtering state
  const [filters, setFilters] = useState(initialState.filters || {});

  // Selection state
  const [selectedRows, setSelectedRows] = useState(initialState.selectedRows || []);
  const [selectAll, setSelectAll] = useState(initialState.selectAll || false);

  // Loading state - use the prop value directly instead of state
  // This ensures the loading state is controlled by the parent component
  const [loadingState, setLoadingState] = useState(false);

  // Computed data (if not server-side)
  const processedData = useMemo(() => {
    if (serverSide) return data;

    // Apply filters
    let filteredData = [...data];
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        filteredData = filteredData.filter(row => {
          const cellValue = row[key];
          if (typeof value === 'function') {
            return value(cellValue, row);
          }
          if (typeof cellValue === 'string' && typeof value === 'string') {
            return cellValue.toLowerCase().includes(value.toLowerCase());
          }
          return cellValue === value;
        });
      }
    });

    // Apply sorting
    if (sorting.sortBy) {
      filteredData.sort((a, b) => {
        const aValue = a[sorting.sortBy];
        const bValue = b[sorting.sortBy];

        // Handle different data types
        if (typeof aValue === 'string' && typeof bValue === 'string') {
          return sorting.sortDirection === 'asc'
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue);
        }

        if (sorting.sortDirection === 'asc') {
          return aValue > bValue ? 1 : -1;
        } else {
          return aValue < bValue ? 1 : -1;
        }
      });
    }

    // Apply pagination
    const start = pagination.pageIndex * pagination.pageSize;
    const end = start + pagination.pageSize;
    return filteredData.slice(start, end);
  }, [data, filters, sorting, pagination, serverSide]);

  // Pagination handlers
  const goToPage = useCallback((pageIndex) => {
    setPagination(prev => {
      const newState = { ...prev, pageIndex };
      if (onStateChange) {
        onStateChange({ ...initialState, pagination: newState });
      }
      return newState;
    });
  }, [initialState, onStateChange]);

  const setPageSize = useCallback((pageSize) => {
    setPagination(prev => {
      const newState = {
        ...prev,
        pageSize,
        pageCount: Math.ceil(data.length / pageSize),
        pageIndex: 0, // Reset to first page when changing page size
      };
      if (onStateChange) {
        onStateChange({ ...initialState, pagination: newState });
      }
      return newState;
    });
  }, [data.length, initialState, onStateChange]);

  // Sorting handlers
  const handleSort = useCallback((columnKey) => {
    setSorting(prev => {
      const newState = {
        sortBy: columnKey,
        sortDirection:
          prev.sortBy === columnKey
            ? prev.sortDirection === 'asc' ? 'desc' : 'asc'
            : 'asc',
      };
      if (onStateChange) {
        onStateChange({ ...initialState, sorting: newState });
      }
      return newState;
    });
  }, [initialState, onStateChange]);

  // Filter handlers
  const setFilter = useCallback((columnKey, value) => {
    setFilters(prev => {
      const newState = { ...prev, [columnKey]: value };
      if (onStateChange) {
        onStateChange({ ...initialState, filters: newState });
      }
      return newState;
    });
  }, [initialState, onStateChange]);

  // Selection handlers
  const toggleRowSelection = useCallback((rowId) => {
    setSelectedRows(prev => {
      const isSelected = prev.includes(rowId);
      const newState = isSelected
        ? prev.filter(id => id !== rowId)
        : [...prev, rowId];

      if (onStateChange) {
        onStateChange({ ...initialState, selectedRows: newState });
      }
      return newState;
    });
  }, [initialState, onStateChange]);

  const toggleSelectAll = useCallback(() => {
    setSelectAll(prev => {
      const newSelectAll = !prev;
      const newSelectedRows = newSelectAll
        ? data.map(row => row.id || row._id || data.indexOf(row))
        : [];

      setSelectedRows(newSelectedRows);

      if (onStateChange) {
        onStateChange({
          ...initialState,
          selectAll: newSelectAll,
          selectedRows: newSelectedRows
        });
      }
      return newSelectAll;
    });
  }, [data, initialState, onStateChange]);

  const value = {
    // Data
    data: processedData,
    rawData: data,
    columns,

    // Pagination
    pagination,
    goToPage,
    setPageSize,

    // Sorting
    sorting,
    handleSort,

    // Filtering
    filters,
    setFilter,

    // Selection
    selectedRows,
    toggleRowSelection,
    selectAll,
    toggleSelectAll,

    // Loading
    isLoading: isLoading || loadingState,
    setIsLoading: setLoadingState,

    // Server-side rendering flag
    serverSide,
  };

  return (
    <TableContext.Provider value={value}>
      {children}
    </TableContext.Provider>
  );
}

export function useTable() {
  const context = useContext(TableContext);
  if (!context) {
    throw new Error('useTable must be used within a TableProvider');
  }
  return context;
}
