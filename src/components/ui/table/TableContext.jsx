'use client';

import { createContext, useContext, useState, useCallback, useMemo, useEffect } from 'react';

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
  // Calculate initial pageCount
  const initialPageSize = initialState.pageSize || 10;
  const initialPageCount = initialState.pageCount || Math.max(1, Math.ceil(data.length / initialPageSize));

  // Pagination state
  const [pagination, setPagination] = useState({
    pageIndex: initialState.pageIndex || 0,
    pageSize: initialPageSize,
    pageCount: initialPageCount,
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

  // Update pageCount when data changes
  useEffect(() => {
    if (!serverSide) {
      setPagination(prev => {
        const newPageCount = Math.max(1, Math.ceil(data.length / prev.pageSize));
        if (newPageCount !== prev.pageCount) {
          const newState = {
            ...prev,
            pageCount: newPageCount,
            // Ensure pageIndex is still valid with the new pageCount
            pageIndex: Math.min(prev.pageIndex, newPageCount - 1)
          };
          if (onStateChange) {
            onStateChange({ ...initialState, pagination: newState });
          }
          return newState;
        }
        return prev;
      });
    }
  }, [data.length, serverSide, initialState, onStateChange]);

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
        let aValue = a[sorting.sortBy];
        let bValue = b[sorting.sortBy];

        // Handle null/undefined values
        if (aValue == null && bValue == null) return 0;
        if (aValue == null) return sorting.sortDirection === 'asc' ? -1 : 1;
        if (bValue == null) return sorting.sortDirection === 'asc' ? 1 : -1;

        // Handle different data types
        const columnKey = sorting.sortBy;

        // Special handling for ID columns (numeric sorting)
        if (columnKey === 'id' || columnKey.toLowerCase().includes('id')) {
          const aNum = parseInt(aValue, 10);
          const bNum = parseInt(bValue, 10);
          if (!isNaN(aNum) && !isNaN(bNum)) {
            return sorting.sortDirection === 'asc' ? aNum - bNum : bNum - aNum;
          }
        }

        // Special handling for date columns
        if (columnKey.toLowerCase().includes('date') || columnKey === 'createdAt' || columnKey === 'updatedAt') {
          const aDate = new Date(aValue);
          const bDate = new Date(bValue);
          if (!isNaN(aDate.getTime()) && !isNaN(bDate.getTime())) {
            return sorting.sortDirection === 'asc' ? aDate - bDate : bDate - aDate;
          }
        }

        // Handle numeric values
        if (typeof aValue === 'number' && typeof bValue === 'number') {
          return sorting.sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
        }

        // Handle string values that might be numbers
        if (typeof aValue === 'string' && typeof bValue === 'string') {
          const aNum = parseFloat(aValue);
          const bNum = parseFloat(bValue);
          if (!isNaN(aNum) && !isNaN(bNum)) {
            return sorting.sortDirection === 'asc' ? aNum - bNum : bNum - aNum;
          }
          // String comparison
          return sorting.sortDirection === 'asc'
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue);
        }

        // Fallback comparison
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
      // Ensure pageIndex is valid and within bounds
      const validPageIndex = Math.max(0, Math.min(prev.pageCount - 1, pageIndex));
      const newState = { ...prev, pageIndex: validPageIndex };
      if (onStateChange) {
        onStateChange({
          pagination: newState,
          sorting,
          filters,
          selectedRows
        });
      }
      return newState;
    });
  }, [onStateChange, sorting, filters, selectedRows]);

  const setPageSize = useCallback((pageSize) => {
    setPagination(prev => {
      // Calculate pageCount, ensuring it's at least 1 even when there's no data
      const pageCount = data.length === 0 ? 1 : Math.ceil(data.length / pageSize);
      const newState = {
        ...prev,
        pageSize,
        pageCount,
        pageIndex: 0, // Reset to first page when changing page size
      };
      if (onStateChange) {
        onStateChange({
          pagination: newState,
          sorting,
          filters,
          selectedRows
        });
      }
      return newState;
    });
  }, [data.length, onStateChange, sorting, filters, selectedRows]);

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
        onStateChange({
          sorting: newState,
          pagination,
          filters,
          selectedRows
        });
      }
      return newState;
    });
  }, [onStateChange, pagination, filters, selectedRows]);

  // Filter handlers
  const setFilter = useCallback((columnKey, value) => {
    setFilters(prev => {
      const newState = { ...prev, [columnKey]: value };
      if (onStateChange) {
        onStateChange({
          filters: newState,
          sorting,
          pagination,
          selectedRows
        });
      }
      return newState;
    });
  }, [onStateChange, sorting, pagination, selectedRows]);

  // Selection handlers
  const toggleRowSelection = useCallback((rowId) => {
    setSelectedRows(prev => {
      const isSelected = prev.includes(rowId);
      const newState = isSelected
        ? prev.filter(id => id !== rowId)
        : [...prev, rowId];

      if (onStateChange) {
        onStateChange({
          selectedRows: newState,
          sorting,
          pagination,
          filters
        });
      }
      return newState;
    });
  }, [onStateChange, sorting, pagination, filters]);

  const toggleSelectAll = useCallback(() => {
    setSelectAll(prev => {
      const newSelectAll = !prev;
      const newSelectedRows = newSelectAll
        ? data.map(row => row.id || row._id || data.indexOf(row))
        : [];

      setSelectedRows(newSelectedRows);

      if (onStateChange) {
        onStateChange({
          selectAll: newSelectAll,
          selectedRows: newSelectedRows,
          sorting,
          pagination,
          filters
        });
      }
      return newSelectAll;
    });
  }, [data, onStateChange, sorting, pagination, filters]);

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
