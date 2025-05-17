import { Pool } from 'pg';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

/**
 * Add product_reviews table to the database
 */
async function addProductReviewsTable() {
  // Create a new pool
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    // Check if the table already exists
    const tableCheckResult = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables
        WHERE table_schema = 'public'
        AND table_name = 'product_reviews'
      );
    `);

    const tableExists = tableCheckResult.rows[0].exists;

    if (tableExists) {
      console.log('product_reviews table already exists. Skipping creation.');
      return;
    }

    // Create the product_reviews table
    console.log('Creating product_reviews table...');
    await pool.query(`
      CREATE TABLE product_reviews (
        id SERIAL PRIMARY KEY,
        product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        rating DECIMAL(2, 1) NOT NULL,
        review_text TEXT,
        title TEXT,
        verified_purchase BOOLEAN DEFAULT FALSE,
        status TEXT DEFAULT 'published' NOT NULL,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW(),
        UNIQUE(user_id, product_id)
      );
    `);

    // Create an index for faster queries
    await pool.query(`
      CREATE INDEX product_reviews_product_id_idx ON product_reviews(product_id);
    `);

    console.log('product_reviews table created successfully!');
  } catch (error) {
    console.error('Error creating product_reviews table:', error);
  } finally {
    await pool.end();
  }
}

// Run the function
addProductReviewsTable().catch(console.error);

// Add type: module to package.json or use .mjs extension
