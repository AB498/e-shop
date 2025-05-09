'use server';

import { db } from '@/lib/db';
import { sql } from 'drizzle-orm';

/**
 * Migration script to add courier_type field to couriers table
 * and create delivery_persons table for internal delivery staff
 */
export async function runMigration() {
  try {
    console.log('Starting migration to add courier type and delivery persons table...');
    
    // Check if courier_type column exists in couriers table
    const checkCourierTypeColumn = await db.execute(sql`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'couriers' AND column_name = 'courier_type'
    `);
    
    // Add courier_type column if it doesn't exist
    if (checkCourierTypeColumn.length === 0) {
      console.log('Adding courier_type column to couriers table...');
      await db.execute(sql`
        ALTER TABLE couriers 
        ADD COLUMN courier_type TEXT DEFAULT 'external' NOT NULL
      `);
      console.log('courier_type column added successfully');
      
      // Update existing Pathao courier to have 'external' type
      await db.execute(sql`
        UPDATE couriers
        SET courier_type = 'external'
        WHERE name = 'Pathao'
      `);
      console.log('Updated existing Pathao courier to have external type');
    } else {
      console.log('courier_type column already exists');
    }
    
    // Check if delivery_persons table exists
    const checkDeliveryPersonsTable = await db.execute(sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_name = 'delivery_persons'
    `);
    
    // Create delivery_persons table if it doesn't exist
    if (checkDeliveryPersonsTable.length === 0) {
      console.log('Creating delivery_persons table...');
      await db.execute(sql`
        CREATE TABLE delivery_persons (
          id SERIAL PRIMARY KEY,
          name TEXT NOT NULL,
          phone TEXT NOT NULL,
          email TEXT,
          address TEXT,
          city TEXT,
          area TEXT,
          status TEXT DEFAULT 'active' NOT NULL,
          current_orders INTEGER DEFAULT 0 NOT NULL,
          total_orders INTEGER DEFAULT 0 NOT NULL,
          rating DECIMAL(3, 2) DEFAULT 5.00,
          profile_image TEXT,
          notes TEXT,
          created_at TIMESTAMP DEFAULT NOW(),
          updated_at TIMESTAMP DEFAULT NOW()
        )
      `);
      console.log('delivery_persons table created successfully');
    } else {
      console.log('delivery_persons table already exists');
    }
    
    // Check if delivery_person_id column exists in orders table
    const checkDeliveryPersonIdColumn = await db.execute(sql`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'orders' AND column_name = 'delivery_person_id'
    `);
    
    // Add delivery_person_id column if it doesn't exist
    if (checkDeliveryPersonIdColumn.length === 0) {
      console.log('Adding delivery_person_id column to orders table...');
      await db.execute(sql`
        ALTER TABLE orders 
        ADD COLUMN delivery_person_id INTEGER REFERENCES delivery_persons(id)
      `);
      console.log('delivery_person_id column added successfully');
    } else {
      console.log('delivery_person_id column already exists');
    }
    
    console.log('Migration completed successfully');
    return { success: true, message: 'Migration completed successfully' };
  } catch (error) {
    console.error('Migration failed:', error);
    return { success: false, message: `Migration failed: ${error.message}` };
  }
}
