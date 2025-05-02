'use server';

import { db } from '@/lib/db';
import { sql } from 'drizzle-orm';

/**
 * Migration script to add a courier_data column to the orders table
 * to store additional courier information as JSON
 */
export async function runMigration() {
  try {
    console.log('Starting migration to add courier_data column...');
    
    // Check if courier_data column exists in orders table
    const checkCourierDataColumn = await db.execute(sql`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'orders' AND column_name = 'courier_data'
    `);
    
    // Add courier_data column if it doesn't exist
    if (checkCourierDataColumn.length === 0) {
      console.log('Adding courier_data column to orders table...');
      await db.execute(sql`
        ALTER TABLE orders 
        ADD COLUMN courier_data JSONB DEFAULT NULL
      `);
      console.log('courier_data column added successfully');
    } else {
      console.log('courier_data column already exists');
    }
    
    console.log('Migration completed successfully');
    return { success: true, message: 'Migration completed successfully' };
  } catch (error) {
    console.error('Migration failed:', error);
    return { success: false, message: `Migration failed: ${error.message}` };
  }
}
