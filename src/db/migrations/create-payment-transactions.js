'use server';

import { db } from '@/lib/db';
import { sql } from 'drizzle-orm';

/**
 * Migration script to create payment_transactions table for storing SSLCommerz payment data
 */
export async function runMigration() {
  try {
    console.log('Starting migration to create payment_transactions table...');
    
    // Check if payment_transactions table exists
    const checkTableExists = await db.execute(sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'payment_transactions'
      ) as exists
    `);
    
    const tableExists = checkTableExists[0]?.exists || false;
    
    // Create payment_transactions table if it doesn't exist
    if (!tableExists) {
      console.log('Creating payment_transactions table...');
      await db.execute(sql`
        CREATE TABLE payment_transactions (
          id SERIAL PRIMARY KEY,
          order_id INTEGER REFERENCES orders(id),
          transaction_id TEXT NOT NULL,
          val_id TEXT,
          amount DECIMAL(10, 2) NOT NULL,
          status TEXT NOT NULL,
          currency TEXT NOT NULL,
          tran_date TIMESTAMP,
          card_type TEXT,
          card_no TEXT,
          bank_tran_id TEXT,
          card_issuer TEXT,
          card_brand TEXT,
          card_issuer_country TEXT,
          card_issuer_country_code TEXT,
          store_amount DECIMAL(10, 2),
          verify_sign TEXT,
          verify_key TEXT,
          risk_level TEXT,
          risk_title TEXT,
          payment_method TEXT,
          gateway_url TEXT,
          response_data JSONB,
          created_at TIMESTAMP DEFAULT NOW(),
          updated_at TIMESTAMP DEFAULT NOW()
        )
      `);
      console.log('payment_transactions table created successfully');
    } else {
      console.log('payment_transactions table already exists');
    }
    
    return { success: true, message: 'Migration completed successfully' };
  } catch (error) {
    console.error('Migration failed:', error);
    return { success: false, message: error.message };
  }
}
