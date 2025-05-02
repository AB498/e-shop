'use server';

import { db } from '@/lib/db';
import { sql } from 'drizzle-orm';

/**
 * Migration script to add new fields to the orders and products tables
 * for the automated courier integration
 */
export async function runMigration() {
  try {
    console.log('Starting migration to add courier fields...');
    
    // Check if shipping_area column exists in orders table
    const checkAreaColumn = await db.execute(sql`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'orders' AND column_name = 'shipping_area'
    `);
    
    // Add shipping_area column if it doesn't exist
    if (checkAreaColumn.length === 0) {
      console.log('Adding shipping_area column to orders table...');
      await db.execute(sql`
        ALTER TABLE orders 
        ADD COLUMN shipping_area TEXT
      `);
      console.log('shipping_area column added successfully');
    } else {
      console.log('shipping_area column already exists');
    }
    
    // Check if shipping_landmark column exists in orders table
    const checkLandmarkColumn = await db.execute(sql`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'orders' AND column_name = 'shipping_landmark'
    `);
    
    // Add shipping_landmark column if it doesn't exist
    if (checkLandmarkColumn.length === 0) {
      console.log('Adding shipping_landmark column to orders table...');
      await db.execute(sql`
        ALTER TABLE orders 
        ADD COLUMN shipping_landmark TEXT
      `);
      console.log('shipping_landmark column added successfully');
    } else {
      console.log('shipping_landmark column already exists');
    }
    
    // Check if shipping_instructions column exists in orders table
    const checkInstructionsColumn = await db.execute(sql`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'orders' AND column_name = 'shipping_instructions'
    `);
    
    // Add shipping_instructions column if it doesn't exist
    if (checkInstructionsColumn.length === 0) {
      console.log('Adding shipping_instructions column to orders table...');
      await db.execute(sql`
        ALTER TABLE orders 
        ADD COLUMN shipping_instructions TEXT
      `);
      console.log('shipping_instructions column added successfully');
    } else {
      console.log('shipping_instructions column already exists');
    }
    
    // Check if weight column exists in products table
    const checkWeightColumn = await db.execute(sql`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'products' AND column_name = 'weight'
    `);
    
    // Add weight column if it doesn't exist
    if (checkWeightColumn.length === 0) {
      console.log('Adding weight column to products table...');
      await db.execute(sql`
        ALTER TABLE products 
        ADD COLUMN weight DECIMAL(5,2) DEFAULT 0.5
      `);
      console.log('weight column added successfully');
    } else {
      console.log('weight column already exists');
    }
    
    console.log('Migration completed successfully');
    return { success: true, message: 'Migration completed successfully' };
  } catch (error) {
    console.error('Migration failed:', error);
    return { success: false, message: `Migration failed: ${error.message}` };
  }
}
