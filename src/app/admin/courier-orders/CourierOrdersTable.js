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
          <p className="ml-2 text-sm text-gray-500 truncate whitespace-nowrap">
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
        <div className="flex flex-col">
          <div className="text-sm font-medium text-gray-900">{order.customer_name}</div>
          <div className="text-xs text-gray-500">{order.shipping_phone}</div>
          {order.courier_tracking_id && (
            <div className="text-xs text-gray-500 mt-1">
              <span className="inline-block px-1.5 py-0.5 bg-gray-100 rounded text-gray-700 whitespace-nowrap">
                ID: {order.courier_tracking_id}
              </span>
            </div>
          )}
          {order.delivery_person_name && (
            <div className="text-xs text-gray-500 mt-1">
              <span className="inline-block px-1.5 py-0.5 bg-emerald-50 rounded text-emerald-700">
                {order.delivery_person_name}
              </span>
            </div>
          )}
          {order.shipping_instructions && order.shipping_instructions.includes('Delivery Fee:') && (
            <div className="text-xs text-gray-500 mt-1">
              <span className="inline-block px-1.5 py-0.5 bg-blue-50 rounded text-blue-700">
                {order.shipping_instructions}
              </span>
            </div>
          )}
        </div>
      )
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (order) => (
        <div className="flex items-center justify-end space-x-2">
          {order.courier_type === 'internal' && (
            <>
              <button
                onClick={() => onAssignDeliveryPerson(order)}
                className="text-emerald-600 hover:text-emerald-900 inline-block"
                title="Assign to delivery person"
              >
                <UserGroupIcon className="h-5 w-5" />
              </button>
              <button
                onClick={() => onUpdateStatus(order)}
                className="text-blue-600 hover:text-blue-900 inline-block"
                title="Update delivery status"
              >
                <ArrowUpCircleIcon className="h-5 w-5" />
              </button>
            </>
          )}
          <button
            onClick={() => onRefreshTracking(order.id)}
            disabled={refreshing}
            className="text-indigo-600 hover:text-indigo-900 inline-block"
            title="View latest tracking information"
          >
            <ArrowPathIcon className={`h-5 w-5 ${refreshing ? 'animate-spin' : ''}`} />
          </button>
          <Link
            href={`/admin/orders/tracking/${order.id}`}
            className="text-emerald-600 hover:text-emerald-900 inline-block"
            title="View tracking details"
          >
            <EyeIcon className="h-5 w-5" />
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
