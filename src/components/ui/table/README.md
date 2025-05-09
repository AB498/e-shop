# Extensible Table Component

A comprehensive, feature-rich table component for React applications. This component combines the best features from all existing tables in the project and adds new functionality for a future-proof implementation.

## Features

- **Sorting**: Sort data by any column
- **Pagination**: Navigate through large datasets with ease
- **Filtering**: Filter data based on search terms or complex conditions
- **Selection**: Select rows with checkboxes
- **Custom Rendering**: Render cells with custom components
- **Loading States**: Show loading skeletons while data is being fetched
- **Empty States**: Display custom messages when no data is available
- **Responsive Design**: Works on all screen sizes with smart flex wrapping
- **Column Visibility Control**: Show/hide columns based on screen size
- **Text Handling Options**: Control text wrapping, truncation, and column widths
- **Server-Side Support**: Works with server-side pagination, sorting, and filtering
- **Customizable Styling**: Multiple variants and size options

## Usage

### Basic Example

```jsx
import Table from '@/components/ui/table';

export default function MyPage() {
  const data = [
    { id: 1, name: 'Product A', price: 29.99 },
    { id: 2, name: 'Product B', price: 49.99 },
    // ...more data
  ];

  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'name', label: 'Product Name' },
    { key: 'price', label: 'Price', render: (row) => `$${row.price.toFixed(2)}` },
  ];

  return (
    <Table
      data={data}
      columns={columns}
      title="Products"
    />
  );
}
```

### Advanced Example

```jsx
import { useState } from 'react';
import Table from '@/components/ui/table';
import { PlusIcon, RefreshIcon } from '@heroicons/react/outline';

export default function AdvancedTable() {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);

  const data = [/* your data */];

  const columns = [
    { key: 'id', label: 'ID', sortable: true },
    { key: 'name', label: 'Product Name', sortable: true },
    {
      key: 'category',
      label: 'Category',
      sortable: true,
      responsive: 'md' // Only show on medium screens and up
    },
    {
      key: 'price',
      label: 'Price',
      sortable: true,
      render: (row) => (
        <div className="font-medium">${row.price.toFixed(2)}</div>
      )
    },
    {
      key: 'stock',
      label: 'Stock',
      sortable: true,
      responsive: 'lg', // Only show on large screens and up
      render: (row) => (
        <div className={row.stock === 0 ? 'text-red-500 font-medium' : 'font-medium'}>
          {row.stock}
        </div>
      )
    },
    {
      key: 'status',
      label: 'Status',
      render: (row) => (
        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(row.status)}`}>
          {row.status}
        </span>
      )
    },
    // Action column
    {
      key: 'actions',
      label: 'Actions',
      render: (row) => (
        <div className="flex space-x-2">
          <button onClick={() => handleEdit(row)}>Edit</button>
          <button onClick={() => handleDelete(row)}>Delete</button>
        </div>
      )
    }
  ];

  const handleRefresh = () => {
    setIsLoading(true);
    // Fetch data
    setTimeout(() => setIsLoading(false), 1000);
  };

  const handleSelectionChange = (selectedIds) => {
    setSelectedRows(selectedIds);
  };

  const tableActions = [
    <button key="refresh" onClick={handleRefresh}>
      <RefreshIcon className="h-5 w-5 mr-1" />
      Refresh
    </button>,
    <button key="add">
      <PlusIcon className="h-5 w-5 mr-1" />
      Add New
    </button>
  ];

  return (
    <Table
      data={data}
      columns={columns}
      title="Advanced Table Example"
      actions={tableActions}
      isLoading={isLoading}
      enableSorting={true}
      enablePagination={true}
      enableSelection={true}
      enableFiltering={true}
      initialState={{
        pageSize: 10,
        sortBy: 'id',
        sortDirection: 'asc',
        selectedRows: selectedRows,
      }}
      onStateChange={(state) => {
        if (state.selectedRows) {
          handleSelectionChange(state.selectedRows);
        }
      }}
    />
  );
}
```

## Props

### Table Component Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `data` | Array | `[]` | The data to display in the table |
| `columns` | Array | `[]` | Column definitions |
| `title` | String | - | Table title displayed in the toolbar |
| `actions` | Array/Node | - | Actions to display in the toolbar |
| `isLoading` | Boolean | `false` | Whether the table is in a loading state |
| `loadingRows` | Number | `5` | Number of skeleton rows to display when loading |
| `emptyMessage` | String | `'No data available'` | Message to display when there is no data |
| `enableSorting` | Boolean | `true` | Enable sorting functionality |
| `enablePagination` | Boolean | `true` | Enable pagination functionality |
| `enableSelection` | Boolean | `false` | Enable row selection with checkboxes |
| `enableFiltering` | Boolean | `false` | Enable filtering functionality |
| `enableToolbar` | Boolean | `true` | Show the toolbar with title and actions |
| `variant` | String | `'default'` | Table style variant (`'default'`, `'bordered'`, `'minimal'`) |
| `size` | String | `'default'` | Table size (`'sm'`, `'default'`, `'lg'`) |
| `initialState` | Object | `{}` | Initial state for pagination, sorting, etc. |
| `onStateChange` | Function | - | Callback when table state changes |
| `serverSide` | Boolean | `false` | Whether to use server-side processing |
| `pageSizeOptions` | Array | `[10, 25, 50, 100]` | Available page size options |
| `renderToolbar` | Function | - | Custom toolbar renderer |
| `renderPagination` | Function | - | Custom pagination renderer |
| `renderEmptyState` | Function | - | Custom empty state renderer |
| `renderLoadingState` | Function | - | Custom loading state renderer |

### Column Definition Props

| Prop | Type | Description |
|------|------|-------------|
| `key` | String | Unique identifier for the column, also used to access data |
| `label` | String | Display label for the column header |
| `sortable` | Boolean | Whether the column is sortable |
| `responsive` | String | Control column visibility based on screen size (`'md'`, `'lg'`, `'xl'`) |
| `render` | Function | Custom cell renderer function `(row, rowIndex) => ReactNode` |
| `className` | String | Additional CSS class for the header cell |
| `cellClassName` | String | Additional CSS class for data cells in this column |
| `style` | Object | Inline styles for the header cell |
| `cellStyle` | Object | Inline styles for data cells in this column |
| `noWrap` | Boolean | Prevent text wrapping in the cell (uses `whitespace-nowrap`) |
| `truncate` | Boolean | Truncate text with ellipsis if it overflows (adds tooltip with full text) |
| `maxWidth` | String | Maximum width for the column (e.g., `'200px'`, `'10rem'`, `'25%'`) |

## Advanced Usage

### Using the Context Hook

You can access the table state and methods using the `useTable` hook in custom components:

```jsx
import { useTable } from '@/components/ui/table';

function CustomTableAction() {
  const { selectedRows, data, toggleSelectAll } = useTable();

  const handleBulkAction = () => {
    console.log('Performing action on:', selectedRows);
  };

  return (
    <div>
      <button
        disabled={selectedRows.length === 0}
        onClick={handleBulkAction}
      >
        Bulk Action ({selectedRows.length})
      </button>
      <button onClick={toggleSelectAll}>
        {selectedRows.length === data.length ? 'Deselect All' : 'Select All'}
      </button>
    </div>
  );
}
```

### Responsive Design

The table component is designed to be fully responsive with smart flex wrapping:

```jsx
// Example of responsive column configuration
const columns = [
  { key: 'id', label: 'ID' },
  { key: 'name', label: 'Product Name' }, // Always visible
  { key: 'category', label: 'Category', responsive: 'md' }, // Only visible on md screens and up
  { key: 'price', label: 'Price' }, // Always visible
  { key: 'stock', label: 'Stock', responsive: 'lg' }, // Only visible on lg screens and up
  { key: 'status', label: 'Status', responsive: 'xl' }, // Only visible on xl screens and up
  { key: 'actions', label: 'Actions' } // Always visible
];
```

The table's pagination controls, toolbar, and other UI elements automatically adapt to different screen sizes using flex wrapping. This ensures that the table remains usable on all devices from mobile phones to large desktop monitors.

### Server-Side Processing

For large datasets, you can use server-side processing:

```jsx
import { useState, useEffect } from 'react';
import Table from '@/components/ui/table';

export default function ServerSideTable() {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [tableState, setTableState] = useState({
    pageIndex: 0,
    pageSize: 10,
    sortBy: 'id',
    sortDirection: 'asc',
    filters: {},
  });

  useEffect(() => {
    fetchData(tableState);
  }, [tableState]);

  const fetchData = async (state) => {
    setIsLoading(true);
    try {
      // Convert table state to API parameters
      const params = new URLSearchParams({
        page: state.pageIndex + 1,
        limit: state.pageSize,
        sortBy: state.sortBy,
        sortOrder: state.sortDirection,
        ...Object.entries(state.filters).reduce((acc, [key, value]) => {
          if (value) acc[key] = value;
          return acc;
        }, {})
      });

      const response = await fetch(`/api/data?${params}`);
      const result = await response.json();

      setData(result.data);
      setTotalCount(result.total);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Table
      data={data}
      columns={columns}
      isLoading={isLoading}
      serverSide={true}
      initialState={{
        ...tableState,
        pageCount: Math.ceil(totalCount / tableState.pageSize),
      }}
      onStateChange={(newState) => {
        setTableState(newState);
      }}
    />
  );
}
```

## Customization

The table component is designed to be highly customizable. You can override any part of it by providing custom renderers or by extending the components.

### Custom Cell Rendering

```jsx
const columns = [
  {
    key: 'image',
    label: 'Image',
    render: (row) => (
      <div className="h-10 w-10 relative">
        <Image
          src={row.image || '/placeholder.png'}
          alt={row.name}
          fill
          className="rounded-md object-cover"
        />
      </div>
    )
  },
  // Other columns...
];
```

### Text Handling in Cells

You can control how text behaves in cells using the new text handling properties:

```jsx
const columns = [
  // Default behavior - text will wrap naturally
  { key: 'id', label: 'ID' },

  // No wrapping - text stays on one line (may cause horizontal overflow)
  { key: 'code', label: 'Product Code', noWrap: true },

  // Truncate with ellipsis and show full text on hover
  {
    key: 'description',
    label: 'Description',
    truncate: true,
    maxWidth: '200px'
  },

  // Fixed width column with wrapping text
  {
    key: 'notes',
    label: 'Notes',
    maxWidth: '150px'
  },

  // Actions column that shouldn't grow too wide
  {
    key: 'actions',
    label: 'Actions',
    maxWidth: '120px',
    render: (row) => (
      <div className="flex space-x-2">
        <button>Edit</button>
        <button>Delete</button>
      </div>
    )
  }
];
```

### Custom Empty State

```jsx
<Table
  // ...other props
  renderEmptyState={({ columns, emptyMessage }) => (
    <tbody>
      <tr>
        <td colSpan={columns.length} className="py-10 text-center">
          <div className="flex flex-col items-center">
            <NoDataIcon className="h-12 w-12 text-gray-400" />
            <p className="mt-2 text-gray-500">{emptyMessage}</p>
            <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded">
              Add New Item
            </button>
          </div>
        </td>
      </tr>
    </tbody>
  )}
/>
```
