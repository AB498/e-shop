#!/usr/bin/env node

/**
 * Reset Contact Messages Sequence Script
 * 
 * This script resets the auto-increment sequence for the contact_messages table.
 * This is useful when you encounter primary key constraint violations during inserts.
 * 
 * Usage:
 *   node scripts/reset-contact-messages-sequence.js
 * 
 * Requirements:
 *   - DATABASE_URL environment variable must be set in .env file
 */

// Import required modules
import dotenv from 'dotenv';
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

/**
 * Resets the auto-increment sequence for the contact_messages table
 */
async function resetContactMessagesSequence() {
  try {
    console.log('Resetting sequence for contact_messages table...');
    
    // Reset the sequence to the maximum ID + 1
    const result = await pool.query(`
      SELECT setval(pg_get_serial_sequence('contact_messages', 'id'),
        (SELECT COALESCE(MAX(id), 0) + 1 FROM contact_messages), false);
    `);
    
    console.log('Sequence reset successfully!');
    console.log('New sequence value:', result.rows[0].setval);
    
    // Close the database connection
    await pool.end();
  } catch (error) {
    console.error('Error resetting sequence:', error);
    
    // Close the database connection
    try {
      await pool.end();
    } catch (err) {
      console.error('Error closing database connection:', err);
    }
    
    process.exit(1);
  }
}

// Run the function
resetContactMessagesSequence();
