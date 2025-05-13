#!/usr/bin/env node

/**
 * Reset Products Table Sequence
 * 
 * This script resets the auto-increment sequence for the products table.
 * Use this when you encounter primary key constraint violations during product creation.
 */

import dotenv from 'dotenv';
import { Pool } from 'pg';
import chalk from 'chalk';

// Load environment variables
dotenv.config();

// Create database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false // Allow self-signed certificates
  }
});

async function resetProductsSequence() {
  console.log(chalk.blue('Starting products table sequence reset...'));

  try {
    // Check if DATABASE_URL is set
    if (!process.env.DATABASE_URL) {
      throw new Error('DATABASE_URL environment variable is not set. Please check your .env file.');
    }

    // Test database connection
    try {
      console.log(chalk.blue('Testing database connection...'));
      console.log(`Connecting to: ${process.env.DATABASE_URL.replace(/:[^:]*@/, ':****@')}`);
      const result = await pool.query('SELECT NOW() as current_time');
      console.log(chalk.green(`Database connection successful! Server time: ${result.rows[0].current_time}`));
    } catch (error) {
      console.error(chalk.red('Database connection failed!'));
      console.error(chalk.red('Error details:'), error.message);
      throw new Error('Failed to connect to the database. See above for details.');
    }

    // Check if the products table exists
    console.log(chalk.blue(`Checking if products table exists...`));
    const tableCheckQuery = `
      SELECT EXISTS (
        SELECT FROM information_schema.tables
        WHERE table_name = 'products'
      )
    `;

    const tableCheckResult = await pool.query(tableCheckQuery);

    if (!tableCheckResult.rows[0].exists) {
      throw new Error(`Table 'products' does not exist in the database.`);
    }

    console.log(chalk.green(`Table 'products' exists.`));

    // Get the current max ID
    const maxIdQuery = `SELECT MAX(id) FROM products`;
    const maxIdResult = await pool.query(maxIdQuery);
    const maxId = maxIdResult.rows[0].max || 0;
    
    console.log(chalk.blue(`Current maximum product ID: ${maxId}`));
    
    // Reset the sequence to max ID + 10 (to avoid future conflicts)
    const newSequenceValue = maxId + 10;
    console.log(chalk.blue(`Resetting sequence to ${newSequenceValue}...`));
    
    await pool.query(`ALTER SEQUENCE products_id_seq RESTART WITH ${newSequenceValue}`);
    
    // Verify the new sequence value
    const sequenceQuery = `SELECT last_value FROM products_id_seq`;
    const sequenceResult = await pool.query(sequenceQuery);
    const newValue = sequenceResult.rows[0].last_value;
    
    console.log(chalk.green(`Products table sequence reset successfully!`));
    console.log(chalk.green(`New sequence value: ${newValue}`));

  } catch (error) {
    console.error(chalk.red('Error resetting products sequence:'), error);
    process.exit(1);
  } finally {
    // Close the database connection
    await pool.end();
  }
}

// Run the function
resetProductsSequence();
