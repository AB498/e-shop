// Script to list products from the database
import dotenv from 'dotenv';
import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from '../src/db/schema.js';

// Load environment variables
dotenv.config();

// Initialize database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const db = drizzle(pool);

// Function to list products
async function listProducts() {
  try {
    console.log('Fetching products from database...');
    
    // Get all products
    const products = await db.select().from(schema.products);
    
    console.log(`Found ${products.length} products in the database:`);
    console.log('---------------------------------------------------');
    
    // Display products
    products.forEach(product => {
      console.log(`ID: ${product.id}`);
      console.log(`Name: ${product.name}`);
      console.log(`Category ID: ${product.category_id}`);
      console.log(`Price: $${product.price}`);
      console.log(`Stock: ${product.stock}`);
      console.log(`Description: ${product.description?.substring(0, 50)}${product.description?.length > 50 ? '...' : ''}`);
      console.log('---------------------------------------------------');
    });
    
  } catch (error) {
    console.error('Error listing products:', error);
  } finally {
    // Close the database connection
    await pool.end();
  }
}

// Run the function
listProducts();
