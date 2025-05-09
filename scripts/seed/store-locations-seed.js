const storeLocationsSeed = [
  {
    name: 'Main Store',
    contact_name: 'Store Manager',
    contact_number: '01712345678',
    secondary_contact: '01812345678',
    address: '123 Main Street, Gulshan',
    city_id: 1, // Dhaka
    zone_id: 1, // Gulshan
    area_id: 1, // Gulshan 1
    is_default: true,
    is_active: true
  },
  {
    name: 'Warehouse',
    contact_name: 'Warehouse Manager',
    contact_number: '01712345679',
    secondary_contact: '01812345679',
    address: '456 Storage Road, Uttara',
    city_id: 1, // Dhaka
    zone_id: 2, // Uttara
    area_id: 2, // Uttara Sector 1
    is_default: false,
    is_active: true
  }
];

export default storeLocationsSeed;
