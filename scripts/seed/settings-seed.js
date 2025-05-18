// Settings seed data
const settingsSeed = [
  {
    id: 1,
    key: 'auto_create_courier_order',
    value: 'false', // Disabled by default
    description: 'Automatically create courier orders for new orders',
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 2,
    key: 'auto_create_pathao_order',
    value: 'false', // Deprecated - kept for backward compatibility
    description: 'Deprecated - Use auto_create_courier_order instead',
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 3,
    key: 'internal_courier_enabled',
    value: 'false',
    description: 'Enable internal courier system',
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 4,
    key: 'default_courier_id',
    value: '2', // Steadfast courier ID
    description: 'Default courier service ID for automatic order creation',
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 5,
    key: 'notify_orders',
    value: 'true',
    description: 'Get notified when a new order is placed',
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 6,
    key: 'notify_stock',
    value: 'true',
    description: 'Get notified when products are running low',
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 7,
    key: 'notify_customers',
    value: 'false',
    description: 'Get notified when a new customer registers',
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 8,
    key: 'sslcommerz_enabled',
    value: 'false', // Disabled by default
    description: 'Enable SSLCommerz payment gateway',
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 9,
    key: 'auto_create_steadfast_order',
    value: 'false', // Deprecated - kept for backward compatibility
    description: 'Deprecated - Use auto_create_courier_order instead',
    created_at: new Date(),
    updated_at: new Date(),
  },
];

export default settingsSeed;
