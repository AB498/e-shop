// Sample tracking data for demonstration
// This will be used to seed tracking data for the first order
const courierTrackingSeed = [
  {
    order_id: 1,
    courier_id: 1, // Pathao
    tracking_id: 'PTH123456789',
    status: 'pending',
    details: 'Order has been created and is pending pickup',
    location: 'Merchant Warehouse',
    timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), // 4 days ago
    created_at: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000)
  },
  {
    order_id: 1,
    courier_id: 1, // Pathao
    tracking_id: 'PTH123456789',
    status: 'picked',
    details: 'Order has been picked up by courier',
    location: 'Merchant Warehouse',
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
  },
  {
    order_id: 1,
    courier_id: 1, // Pathao
    tracking_id: 'PTH123456789',
    status: 'in_transit',
    details: 'Order is in transit to delivery location',
    location: 'Dhaka Hub',
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
  },
  {
    order_id: 1,
    courier_id: 1, // Pathao
    tracking_id: 'PTH123456789',
    status: 'delivered',
    details: 'Order has been delivered successfully',
    location: 'Customer Address',
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
    created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
  }
];

export default courierTrackingSeed;
