// Expanded orders seed data
const ordersSeed = [
  {
    id: 1,
    user_id: 1,
    status: 'delivered',
    total: 35.96,
    courier_id: 1, // Pathao
    courier_order_id: 'PTH123456789',
    courier_tracking_id: 'PTH123456789',
    courier_status: 'delivered',
    shipping_address: '123 Main Street, Apartment 4B',
    shipping_city: 'Dhaka',
    shipping_post_code: '1000',
    shipping_phone: '+8801712345678',
    created_at: new Date('2023-06-15')
  },
  {
    id: 2,
    user_id: 2,
    status: 'processing',
    total: 29.95,
    created_at: new Date('2023-06-16')
  },
  {
    id: 3,
    user_id: 1,
    status: 'shipped',
    total: 24.96,
    courier_id: 2, // Internal Delivery
    courier_order_id: 'INT789012345',
    courier_tracking_id: 'INT789012345',
    courier_status: 'in_transit',
    shipping_address: '456 Park Avenue, Building C',
    shipping_city: 'Chittagong',
    shipping_post_code: '4000',
    shipping_phone: '+8801812345678',
    created_at: new Date('2023-06-17')
  },
  // Additional orders
  {
    id: 4,
    user_id: 4,
    status: 'delivered',
    total: 42.97,
    created_at: new Date('2023-07-01')
  },
  {
    id: 5,
    user_id: 5,
    status: 'pending',
    total: 18.49,
    created_at: new Date('2023-07-05')
  },
  {
    id: 6,
    user_id: 6,
    status: 'cancelled',
    total: 56.94,
    created_at: new Date('2023-07-10')
  },
  {
    id: 7,
    user_id: 7,
    status: 'delivered',
    total: 33.97,
    created_at: new Date('2023-07-15')
  },
  {
    id: 8,
    user_id: 1,
    status: 'processing',
    total: 27.98,
    created_at: new Date('2023-07-20')
  },
  {
    id: 9,
    user_id: 2,
    status: 'shipped',
    total: 45.96,
    courier_id: 1, // Pathao
    courier_order_id: 'PTH456789012',
    courier_tracking_id: 'PTH456789012',
    courier_status: 'picked',
    shipping_address: '789 Lake View Road',
    shipping_city: 'Sylhet',
    shipping_post_code: '3100',
    shipping_phone: '+8801912345678',
    created_at: new Date('2023-07-25')
  },
  {
    id: 10,
    user_id: 4,
    status: 'delivered',
    total: 39.98,
    created_at: new Date('2023-08-01')
  },
  {
    id: 11,
    user_id: 5,
    status: 'delivered',
    total: 22.99,
    created_at: new Date('2023-08-05')
  },
  {
    id: 12,
    user_id: 6,
    status: 'processing',
    total: 67.95,
    created_at: new Date('2023-08-10')
  },
  {
    id: 13,
    user_id: 7,
    status: 'pending',
    total: 15.99,
    created_at: new Date('2023-08-15')
  },
  {
    id: 14,
    user_id: 1,
    status: 'delivered',
    total: 29.97,
    created_at: new Date('2023-08-20')
  },
  {
    id: 15,
    user_id: 2,
    status: 'shipped',
    total: 48.96,
    created_at: new Date('2023-08-25')
  },
  // Beauty product orders
  {
    id: 16,
    user_id: 4,
    status: 'delivered',
    total: 57.95,
    created_at: new Date('2023-09-01')
  },
  {
    id: 17,
    user_id: 2,
    status: 'processing',
    total: 63.96,
    created_at: new Date('2023-09-05')
  },
  {
    id: 18,
    user_id: 5,
    status: 'pending',
    total: 42.97,
    created_at: new Date('2023-09-10')
  }
];

export default ordersSeed;
