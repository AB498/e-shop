#!/usr/bin/env node

/**
 * Add Discount Column Script
 * 
 * This script adds the discount column to the promotions table.
 * 
 * Usage:
 *   node scripts/add-discount-column.js
 */

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

async function addDiscountColumn() {
  try {
    console.log('Starting to add discount column to promotions table...');
    
    // Check if DATABASE_URL is set
    if (!process.env.DATABASE_URL) {
      throw new Error('DATABASE_URL environment variable is not set. Please check your .env file.');
    }
    
    // Test database connection
    try {
      console.log('Testing database connection...');
      const result = await pool.query('SELECT NOW() as current_time');
      console.log(`Database connection successful! Server time: ${result.rows[0].current_time}`);
    } catch (error) {
      console.error('Database connection failed!');
      console.error('Error details:', error.message);
      throw new Error('Failed to connect to the database.');
    }
    
    // Check if promotions table exists
    try {
      console.log('Checking if promotions table exists...');
      const tableCheck = await pool.query(`
        SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_schema = 'public' 
          AND table_name = 'promotions'
        );
      `);
      
      if (!tableCheck.rows[0].exists) {
        console.error('Promotions table does not exist.');
        return;
      } else {
        console.log('Promotions table exists.');
      }
    } catch (error) {
      console.error('Error checking promotions table:', error);
      throw error;
    }
    
    // Check if discount column exists
    try {
      console.log('Checking if discount column exists...');
      const columnCheck = await pool.query(`
        SELECT EXISTS (
          SELECT FROM information_schema.columns 
          WHERE table_schema = 'public' 
          AND table_name = 'promotions'
          AND column_name = 'discount'
        );
      `);
      
      if (columnCheck.rows[0].exists) {
        console.log('Discount column already exists.');
        return;
      } else {
        console.log('Discount column does not exist. Adding it...');
        
        // Add discount column
        await pool.query(`
          ALTER TABLE promotions
          ADD COLUMN discount TEXT;
        `);
        
        console.log('Discount column added successfully.');
      }
    } catch (error) {
      console.error('Error adding discount column:', error);
      throw error;
    }
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    // Close the database connection
    await pool.end();
    console.log('Database connection closed.');
  }
}

// Run the function
addDiscountColumn();
