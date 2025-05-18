const couriersSeed = [
  {
    name: 'Pathao',
    description: 'Pathao Courier Service - Fast and reliable delivery across Bangladesh',
    courier_type: 'external',
    is_active: false,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    name: 'Steadfast',
    description: 'Steadfast Courier Limited - Reliable nationwide delivery service',
    courier_type: 'external',
    is_active: true,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    name: 'Internal Delivery',
    description: 'Our own delivery service - Managed by our internal team',
    courier_type: 'internal',
    is_active: false, // Disabled by default as per requirements
    created_at: new Date(),
    updated_at: new Date(),
  }
];

export default couriersSeed;
