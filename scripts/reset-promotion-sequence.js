#!/usr/bin/env node

/**
 * Reset Promotion Sequence Script
 * 
 * This script resets the sequence for the promotions table to start after the highest ID in the table.
 * This fixes the issue where new promotions fail to be created due to ID conflicts.
 * 
 * Usage:
 *   node scripts/reset-promotion-sequence.js
 */

import dotenv from 'dotenv';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

// Load environment variables
dotenv.config();

// Create database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false // Allow self-signed certificates for Supabase
  }
});

async function resetPromotionSequence() {
  try {
    console.log('Connecting to database...');
    
    // Check if the promotions table exists
    const tableCheck = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'promotions'
      )
    `);
    
    if (!tableCheck.rows[0].exists) {
      console.log('Promotions table does not exist. Nothing to do.');
      return;
    }
    
    console.log('Promotions table exists. Checking current sequence value...');
    
    // Get the current sequence value
    const currentSeq = await pool.query(`
      SELECT last_value FROM promotions_id_seq
    `);
    
    console.log(`Current sequence value: ${currentSeq.rows[0].last_value}`);
    
    // Get the maximum ID from the promotions table
    const maxId = await pool.query(`
      SELECT COALESCE(MAX(id), 0) as max_id FROM promotions
    `);
    
    const maxIdValue = maxId.rows[0].max_id;
    console.log(`Maximum ID in promotions table: ${maxIdValue}`);
    
    // Reset the sequence to start after the maximum ID
    await pool.query(`
      SELECT setval('promotions_id_seq', ${maxIdValue}, true)
    `);
    
    console.log(`Sequence reset to start after ID ${maxIdValue}`);
    
    // Verify the new sequence value
    const newSeq = await pool.query(`
      SELECT last_value FROM promotions_id_seq
    `);
    
    console.log(`New sequence value: ${newSeq.rows[0].last_value}`);
    console.log('Sequence reset successfully!');
    
  } catch (error) {
    console.error('Error resetting promotion sequence:', error);
  } finally {
    // Close the database connection
    await pool.end();
    console.log('Database connection closed.');
  }
}

// Run the function
resetPromotionSequence();
