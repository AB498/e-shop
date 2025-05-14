// Script to add product_promotions junction table
require('dotenv').config();
const { Pool } = require('pg');

async function addProductPromotionsTable() {
  console.log('Creating product_promotions junction table...');
  
  // Create a connection pool
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    // Check if the table already exists
    const tableCheckResult = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'product_promotions'
      );
    `);

    const tableExists = tableCheckResult.rows[0].exists;

    if (tableExists) {
      console.log('product_promotions table already exists.');
    } else {
      // Create the product_promotions junction table
      await pool.query(`
        CREATE TABLE product_promotions (
          id SERIAL PRIMARY KEY,
          product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
          promotion_id INTEGER NOT NULL REFERENCES promotions(id) ON DELETE CASCADE,
          discount_percentage DECIMAL(5,2),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          UNIQUE(product_id, promotion_id)
        );
      `);
      
      console.log('product_promotions table created successfully.');
    }

    // Close the pool
    await pool.end();
    console.log('Done.');
  } catch (error) {
    console.error('Error creating product_promotions table:', error);
    await pool.end();
    process.exit(1);
  }
}

// Run the function
addProductPromotionsTable();
