'use server';

import { db } from '@/lib/db';
import { sql } from 'drizzle-orm';

/**
 * Migration script to create the store_locations table
 * for the Pathao courier integration
 */
export async function runMigration() {
  try {
    console.log('Starting migration to create store_locations table...');
    
    // Check if store_locations table exists
    const checkTableExists = await db.execute(sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'store_locations'
      );
    `);
    
    const tableExists = checkTableExists[0]?.exists || false;
    
    // Create store_locations table if it doesn't exist
    if (!tableExists) {
      console.log('Creating store_locations table...');
      await db.execute(sql`
        CREATE TABLE store_locations (
          id SERIAL PRIMARY KEY,
          name TEXT NOT NULL,
          contact_name TEXT NOT NULL,
          contact_number TEXT NOT NULL,
          secondary_contact TEXT,
          address TEXT NOT NULL,
          city_id INTEGER NOT NULL,
          zone_id INTEGER NOT NULL,
          area_id INTEGER NOT NULL,
          is_default BOOLEAN DEFAULT FALSE,
          pathao_store_id TEXT,
          is_active BOOLEAN DEFAULT TRUE,
          created_at TIMESTAMP DEFAULT NOW(),
          updated_at TIMESTAMP DEFAULT NOW()
        )
      `);
      console.log('store_locations table created successfully');
    } else {
      console.log('store_locations table already exists');
    }
    
    console.log('Migration completed successfully');
    return { success: true, message: 'Migration completed successfully' };
  } catch (error) {
    console.error('Migration failed:', error);
    return { success: false, message: `Migration failed: ${error.message}` };
  }
}
