// Settings seed data
const settingsSeed = [
  {
    id: 1,
    key: 'auto_create_pathao_order',
    value: 'true',
    description: 'Automatically create Pathao courier orders for new orders',
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 2,
    key: 'internal_courier_enabled',
    value: 'false',
    description: 'Enable internal courier system',
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 3,
    key: 'default_courier_id',
    value: '1', // Pathao courier ID
    description: 'Default courier service ID for automatic order creation',
    created_at: new Date(),
    updated_at: new Date(),
  },
];

export default settingsSeed;
