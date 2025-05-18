const { Pool } = require('pg');
require('dotenv').config();

async function addSslcommerzSetting() {
  // Create a connection pool
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    console.log('Checking if sslcommerz_enabled setting exists...');

    // Check if the setting already exists
    const checkResult = await pool.query(
      'SELECT * FROM settings WHERE key = $1',
      ['sslcommerz_enabled']
    );

    if (checkResult.rows.length > 0) {
      console.log('Setting sslcommerz_enabled already exists.');
      return;
    }

    console.log('Adding sslcommerz_enabled setting...');

    // Get the highest ID currently in the settings table
    const maxIdResult = await pool.query('SELECT MAX(id) FROM settings');
    const nextId = maxIdResult.rows[0].max ? Number(maxIdResult.rows[0].max) + 1 : 1;

    console.log(`Using next ID: ${nextId} for new setting`);

    // Add the setting with explicit ID
    await pool.query(
      `INSERT INTO settings (id, key, value, description, created_at, updated_at)
       VALUES ($1, $2, $3, $4, NOW(), NOW())`,
      [
        nextId,
        'sslcommerz_enabled',
        'false', // Disabled by default
        'Enable SSLCommerz payment gateway'
      ]
    );

    console.log('Successfully added sslcommerz_enabled setting.');
  } catch (error) {
    console.error('Error adding sslcommerz_enabled setting:', error);
  } finally {
    // Close the pool
    await pool.end();
  }
}

// Run the function
addSslcommerzSetting();
