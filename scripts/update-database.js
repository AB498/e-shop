#!/usr/bin/env node

/**
 * Database Update Script
 *
 * This script updates the database schema to add missing columns.
 *
 * Usage:
 *   node scripts/update-database.js
 *
 * Requirements:
 *   - DATABASE_URL environment variable must be set in .env file
 */

// Import required modules
import dotenv from 'dotenv';
import { Pool } from 'pg';

// Load environment variables first - must happen before any database connections
dotenv.config();

// Create our own database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false // Allow self-signed certificates for Supabase
  }
});

// Main function to update the database
async function updateDatabase() {
  console.log('Starting database update process...');

  try {
    // Check if DATABASE_URL is set
    if (!process.env.DATABASE_URL) {
      throw new Error('DATABASE_URL environment variable is not set. Please check your .env file.');
    }

    // Test database connection
    try {
      console.log('Testing database connection...');
      console.log(`Connecting to: ${process.env.DATABASE_URL.replace(/:[^:]*@/, ':****@')}`);
      const result = await pool.query('SELECT NOW() as current_time');
      console.log(`Database connection successful! Server time: ${result.rows[0].current_time}`);
      console.log('Connection to Supabase PostgreSQL database established.');
    } catch (error) {
      console.error('Database connection failed!');
      console.error('Error details:', error.message);
      throw new Error('Failed to connect to the database. See above for details.');
    }

    // Check if delivery_person_id column exists in orders table
    const checkColumnQuery = `
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'orders' AND column_name = 'delivery_person_id'
    `;
    
    const columnCheckResult = await pool.query(checkColumnQuery);
    
    if (columnCheckResult.rows.length === 0) {
      console.log('Adding delivery_person_id column to orders table...');
      
      // Add delivery_person_id column to orders table
      await pool.query(`
        ALTER TABLE orders 
        ADD COLUMN delivery_person_id INTEGER REFERENCES delivery_persons(id)
      `);
      
      console.log('delivery_person_id column added successfully.');
    } else {
      console.log('delivery_person_id column already exists in orders table.');
    }

    // Check for other missing columns
    const missingColumnsCheck = [
      { table: 'orders', column: 'shipping_area', type: 'TEXT' },
      { table: 'orders', column: 'shipping_landmark', type: 'TEXT' },
      { table: 'orders', column: 'shipping_instructions', type: 'TEXT' }
    ];

    for (const { table, column, type } of missingColumnsCheck) {
      const checkQuery = `
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_name = '${table}' AND column_name = '${column}'
      `;
      
      const result = await pool.query(checkQuery);
      
      if (result.rows.length === 0) {
        console.log(`Adding ${column} column to ${table} table...`);
        
        await pool.query(`
          ALTER TABLE ${table} 
          ADD COLUMN ${column} ${type}
        `);
        
        console.log(`${column} column added successfully.`);
      } else {
        console.log(`${column} column already exists in ${table} table.`);
      }
    }

    console.log('Database update completed successfully!');

    // Close the database connection
    await pool.end();

    return {
      success: true,
      message: 'Database updated successfully!'
    };
  } catch (error) {
    console.error('Error updating database:', error);

    // Close the database connection
    try {
      await pool.end();
    } catch (err) {
      console.error('Error closing database connection:', err);
    }

    process.exit(1);
  }
}

// Run the update function
updateDatabase();
