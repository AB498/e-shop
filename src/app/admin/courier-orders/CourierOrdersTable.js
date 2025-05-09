'use client';

import Link from 'next/link';
import {
  TruckIcon,
  ArrowPathIcon,
  UserGroupIcon,
  ArrowUpCircleIcon,
  EyeIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';
import Table from '@/components/ui/table';

// Status badge component
const StatusBadge = ({ status }) => {
  const statusConfig = {
    pending: { color: 'bg-yellow-100 text-yellow-800', icon: ClockIcon, text: 'Pending' },
    picked: { color: 'bg-blue-100 text-blue-800', icon: TruckIcon, text: 'Picked' },
    picked_up: { color: 'bg-blue-100 text-blue-800', icon: TruckIcon, text: 'Picked Up' },
    in_transit: { color: 'bg-indigo-100 text-indigo-800', icon: TruckIcon, text: 'In Transit' },
    delivered: { color: 'bg-green-100 text-green-800', icon: CheckCircleIcon, text: 'Delivered' },
    returned: { color: 'bg-red-100 text-red-800', icon: XCircleIcon, text: 'Returned' },
    cancelled: { color: 'bg-gray-100 text-gray-800', icon: XCircleIcon, text: 'Cancelled' },
    processing: { color: 'bg-yellow-100 text-yellow-800', icon: ClockIcon, text: 'Processing' },
  };

  const config = statusConfig[status] || statusConfig.pending;
  const Icon = config.icon;

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
      <Icon className="-ml-0.5 mr-1.5 h-3 w-3" />
      {config.text}
    </span>
  );
};

export default function CourierOrdersTable({
  orders = [],
  isLoading = false,
  refreshing = false,
  onRefreshTracking,
  onAssignDeliveryPerson,
  onUpdateStatus,
  filterType = 'all'
}) {
  // Filter orders based on courier type
  const filteredOrders = orders ? orders.filter(order => {
    if (filterType === 'all') return true;
    const courierType = order.courier_type || 'external';
    return filterType === courierType;
  }) : [];

  // Define table columns
  const columns = [
    {
      key: 'order',
      label: 'Order',
      sortable: true,
      render: (order) => (
        <div className="flex items-center">
          <p className="text-sm font-medium text-indigo-600 truncate">
            Order #{order.id}
          </p>
          <p className="ml-2 text-sm text-gray-500 truncate">
            (ID: {order.courier_order_id})
          </p>
          <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            order.courier_type === 'internal'
              ? 'bg-emerald-100 text-emerald-800'
              : 'bg-blue-100 text-blue-800'
          }`}>
            {order.courier_type === 'internal' ? 'Internal' : 'External'}
          </span>
        </div>
      )
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      render: (order) => (
        <StatusBadge status={order.courier_status} />
      )
    },
    {
      key: 'address',
      label: 'Shipping Address',
      responsive: 'md',
      render: (order) => (
        <p className="flex items-center text-sm text-gray-500">
          <TruckIcon className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
          {order.shipping_address}, {order.shipping_city}
        </p>
      )
    },
    {
      key: 'created_at',
      label: 'Created',
      sortable: true,
      responsive: 'lg',
      render: (order) => (
        <p className="text-sm text-gray-500">
          {new Date(order.created_at).toLocaleDateString()}
        </p>
      )
    },
    {
      key: 'customer',
      label: 'Customer Info',
      render: (order) => (
        <div>
          <p className="text-sm text-gray-500">
            <span className="font-medium">Customer:</span> {order.customer_name}
          </p>
          <p className="text-sm text-gray-500">
            <span className="font-medium">Phone:</span> {order.shipping_phone}
          </p>
          {order.courier_tracking_id && (
            <p className="text-sm text-gray-500">
              <span className="font-medium">Tracking ID:</span> {order.courier_tracking_id}
            </p>
          )}
          {order.delivery_person_name && (
            <p className="text-sm text-gray-500">
              <span className="font-medium">Delivery Person:</span> {order.delivery_person_name}
            </p>
          )}
          {order.shipping_instructions && order.shipping_instructions.includes('Delivery Fee:') && (
            <p className="text-sm text-gray-500">
              <span className="font-medium">{order.shipping_instructions}</span>
            </p>
          )}
        </div>
      )
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (order) => (
        <div className="flex flex-wrap gap-2">
          {order.courier_type === 'internal' && (
            <>
              <button
                onClick={() => onAssignDeliveryPerson(order)}
                className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                title="Assign to delivery person"
              >
                <UserGroupIcon className="-ml-0.5 mr-1 h-4 w-4" />
                Assign
              </button>
              <button
                onClick={() => onUpdateStatus(order)}
                className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                title="Update delivery status"
              >
                <ArrowUpCircleIcon className="-ml-0.5 mr-1 h-4 w-4" />
                Update Status
              </button>
            </>
          )}
          <button
            onClick={() => onRefreshTracking(order.id)}
            disabled={refreshing}
            className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            title="View latest tracking information without altering tracking history"
          >
            <ArrowPathIcon className={`-ml-0.5 mr-1 h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
            View Latest
          </button>
          <Link
            href={`/admin/orders/tracking/${order.id}`}
            className="inline-flex items-center px-3 py-1 border border-gray-300 text-xs font-medium rounded shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <EyeIcon className="-ml-0.5 mr-1 h-4 w-4" />
            Details
          </Link>
        </div>
      )
    }
  ];

  return (
    <Table
      data={filteredOrders}
      columns={columns}
      title="Courier Orders"
      isLoading={isLoading}
      emptyMessage="No courier orders found"
      enableSorting={true}
      enablePagination={true}
      pageSizeOptions={[10, 25, 50, 100]}
      initialState={{
        pageSize: 10,
        sortBy: 'created_at',
        sortDirection: 'desc',
      }}
    />
  );
}
