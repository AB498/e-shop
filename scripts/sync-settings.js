const { Pool } = require('pg');
require('dotenv').config();

// Define the settings seed data directly
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
    value: '1', // Pathao courier ID
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

async function syncSettings() {
  // Create a connection pool
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    console.log('Syncing settings with seed data...');

    // Get all existing settings
    const existingSettings = await pool.query('SELECT key FROM settings');
    const existingKeys = existingSettings.rows.map(row => row.key);

    console.log('Existing settings:', existingKeys);
    console.log('Settings in seed data:', settingsSeed.map(s => s.key));

    // Find settings that are in the seed data but not in the database
    const missingSettings = settingsSeed.filter(setting => !existingKeys.includes(setting.key));

    if (missingSettings.length === 0) {
      console.log('No missing settings found.');
      return;
    }

    console.log(`Found ${missingSettings.length} missing settings:`, missingSettings.map(s => s.key));

    // Get the highest ID currently in the settings table
    const maxIdResult = await pool.query('SELECT MAX(id) FROM settings');
    let nextId = maxIdResult.rows[0].max ? Number(maxIdResult.rows[0].max) + 1 : 1;

    // Add missing settings
    for (const setting of missingSettings) {
      console.log(`Adding setting: ${setting.key} with ID: ${nextId}`);

      await pool.query(
        `INSERT INTO settings (id, key, value, description, created_at, updated_at)
         VALUES ($1, $2, $3, $4, NOW(), NOW())`,
        [
          nextId,
          setting.key,
          setting.value,
          setting.description
        ]
      );

      console.log(`Successfully added setting: ${setting.key} with ID: ${nextId}`);
      nextId++;
    }

    console.log('Settings sync completed successfully.');
  } catch (error) {
    console.error('Error syncing settings:', error);
  } finally {
    // Close the pool
    await pool.end();
  }
}

// Run the function
syncSettings();
