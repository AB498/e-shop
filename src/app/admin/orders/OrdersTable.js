'use client';

import {
  EyeIcon,
  TruckIcon,
  ArrowPathIcon,
  UserGroupIcon,
  CreditCardIcon
} from '@heroicons/react/24/outline';
import Table from '@/components/ui/table';

export default function OrdersTable({
  orders,
  isLoading,
  onViewOrder,
  onCreateCourierOrder,
  onAssignDeliveryPerson,
  onShowPaymentPage,
  internalCourierEnabled = true
}) {
  // Define table columns
  const columns = [
    {
      key: 'id',
      label: 'Order ID',
      sortable: true,
      render: (order) => (
        <div className="text-sm font-medium text-blue-600">#{order.id}</div>
      )
    },
    {
      key: 'customer',
      label: 'Customer',
      sortable: true,
      render: (order) => (
        <div className="text-sm text-gray-900">{order.customer}</div>
      )
    },
    {
      key: 'date',
      label: 'Date',
      sortable: true,
      responsive: 'md',
      render: (order) => (
        <div className="text-sm text-gray-500">{order.date}</div>
      )
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      render: (order) => (
        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
          ${order.status === 'Delivered' ? 'bg-green-100 text-green-800' :
            order.status === 'Shipped' ? 'bg-blue-100 text-blue-800' :
            order.status === 'Cancelled' ? 'bg-red-100 text-red-800' :
            'bg-yellow-100 text-yellow-800'}`}>
          {order.status}
        </span>
      )
    },
    {
      key: 'total',
      label: 'Total',
      sortable: true,
      render: (order) => (
        <div className="text-sm text-gray-900">
          {order.total}
          {order.payment_method && (
            <div className="text-xs text-gray-500 mt-1">
              {order.payment_method === 'cod' ? 'Cash on Delivery' : 'Online Payment'}
            </div>
          )}
        </div>
      )
    },
    {
      key: 'itemsCount',
      label: 'Items',
      sortable: true,
      responsive: 'lg',
      render: (order) => (
        <div className="text-sm text-gray-900">{order.itemsCount}</div>
      )
    },
    {
      key: 'courier',
      label: 'Courier',
      sortable: true,
      render: (order) => (
        order.courier_id ? (
          <div>
            <div className="flex items-center space-x-1 mb-1">
              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                ${order.courier_status === 'delivered' ? 'bg-green-100 text-green-800' :
                  order.courier_status === 'in_transit' ? 'bg-blue-100 text-blue-800' :
                  order.courier_status === 'cancelled' || order.courier_status === 'returned' ? 'bg-red-100 text-red-800' :
                  'bg-yellow-100 text-yellow-800'}`}>
                {order.courier_status ?
                  (typeof order.courier_status === 'string' ?
                    order.courier_status.replace('_', ' ').charAt(0).toUpperCase() +
                    order.courier_status.replace('_', ' ').slice(1) :
                    'Pending') :
                  'Pending'}
              </span>
              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                ${order.courier_type === 'internal' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'}`}>
                {order.courier_type === 'internal' ? 'Internal' : 'External'}
              </span>
            </div>

            {order.courier_type === 'internal' && order.delivery_person_name && (
              <div className="text-xs text-gray-700 mt-1">
                <span className="font-medium">Delivery Person:</span> {order.delivery_person_name}
              </div>
            )}

            {order.courier_tracking_id && (
              <div className="text-xs text-gray-500 mt-1">
                ID: {order.courier_tracking_id}
              </div>
            )}
          </div>
        ) : (
          <span className="text-gray-500 text-xs">Not assigned</span>
        )
      )
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (order) => (
        <div className="flex space-x-3">
          <button
            onClick={() => onViewOrder(order)}
            className="text-emerald-600 hover:text-emerald-900"
            title="View Order"
          >
            <EyeIcon className="h-5 w-5" />
          </button>
          {order.status !== 'delivered' && order.status !== 'cancelled' && !order.courier_id && (
            <>
              <button
                onClick={() => onCreateCourierOrder(order.id)}
                className="text-blue-600 hover:text-blue-900"
                title="Auto-Order External Courier"
                disabled={order.isProcessingCourier}
              >
                {order.isProcessingCourier ? (
                  <ArrowPathIcon className="h-5 w-5 animate-spin" />
                ) : (
                  <TruckIcon className="h-5 w-5" />
                )}
              </button>
              {/* Only show the Assign Internal Delivery Person button if internal courier is enabled */}
              {internalCourierEnabled && (
                <button
                  onClick={() => onAssignDeliveryPerson(order)}
                  className="text-emerald-600 hover:text-emerald-900"
                  title="Assign Internal Delivery Person"
                >
                  <UserGroupIcon className="h-5 w-5" />
                </button>
              )}
            </>
          )}
          {order.status.toLowerCase() === 'pending' && (
            <button
              onClick={() => onShowPaymentPage(order.id)}
              className="text-amber-600 hover:text-amber-900"
              title="Show Payment Page"
            >
              <CreditCardIcon className="h-5 w-5" />
            </button>
          )}
        </div>
      )
    }
  ];

  return (
    <Table
      data={orders}
      columns={columns}
      title="Orders"
      isLoading={isLoading}
      emptyMessage="No orders found"
      enableSorting={true}
      enablePagination={true}
      pageSizeOptions={[10, 25, 50, 100]}
      initialState={{
        pageSize: 10,
        sortBy: 'id',
        sortDirection: 'desc',
      }}
    />
  );
}
