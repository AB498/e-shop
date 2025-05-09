#!/usr/bin/env node

/**
 * Database Sequence Reset Script
 *
 * This script resets the auto-increment sequence for a database table.
 * This is useful when you encounter primary key constraint violations during inserts.
 *
 * Usage:
 *   node scripts/reset-sequence.js <table_name> [value]
 *
 * Examples:
 *   node scripts/reset-sequence.js users
 *   node scripts/reset-sequence.js products 100
 *
 * Common tables to reset:
 *   - users - User accounts
 *   - orders - Customer orders
 *   - order_items - Items within orders
 *   - products - Product catalog
 *   - categories - Product categories
 *   - files - Uploaded files
 *
 * Requirements:
 *   - DATABASE_URL environment variable must be set in .env file
 */

// Import required modules
import dotenv from 'dotenv';
import { Pool } from 'pg';
import chalk from 'chalk';

// Load environment variables first - must happen before any database connections
dotenv.config();

// Set NODE_TLS_REJECT_UNAUTHORIZED to 0 to allow self-signed certificates
// This is needed for connecting to Supabase
// WARNING: This makes TLS connections insecure by disabling certificate verification
// Only use this in development environments, never in production
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
console.log(chalk.yellow('WARNING: SSL certificate verification disabled for database connection.'));
console.log(chalk.yellow('This should only be used in development environments.'));

// Create our own database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false // Allow self-signed certificates for Supabase
  }
});

/**
 * Resets the auto-increment sequence for a table to the maximum ID + 1
 * @param {string} tableName - The name of the table
 * @returns {Promise<boolean>} - True if successful, false otherwise
 */
async function resetSequence(tableName) {
  try {
    await pool.query(`
      SELECT setval(pg_get_serial_sequence('${tableName}', 'id'),
        (SELECT COALESCE(MAX(id), 0) + 1 FROM ${tableName}), false);
    `);
    console.log(`Sequence for table ${tableName} has been reset`);
    return true;
  } catch (error) {
    console.error(`Error resetting sequence for ${tableName}:`, error);
    return false;
  }
}

/**
 * Forcefully resets the auto-increment sequence for a table to a specific value
 * @param {string} tableName - The name of the table
 * @param {number} [value] - The value to set the sequence to (defaults to max ID + 1)
 * @returns {Promise<boolean>} - True if successful, false otherwise
 */
async function forceResetSequence(tableName, value) {
  try {
    if (value === undefined) {
      // Get the current max ID
      const result = await pool.query(`SELECT MAX(id) FROM ${tableName}`);
      value = (result.rows[0].max || 0) + 1;
    }

    await pool.query(`ALTER SEQUENCE ${tableName}_id_seq RESTART WITH ${value}`);
    console.log(`Forcefully reset sequence for table ${tableName} to ${value}`);
    return true;
  } catch (error) {
    console.error(`Error forcefully resetting sequence for ${tableName}:`, error);
    return false;
  }
}

// Main function to reset sequence
async function resetTableSequence(table, value) {
  console.log(chalk.blue(`Starting sequence reset for table '${table}'${value ? ` to value ${value}` : ''}...`));

  try {
    // Check if DATABASE_URL is set
    if (!process.env.DATABASE_URL) {
      throw new Error('DATABASE_URL environment variable is not set. Please check your .env file.');
    }

    // Validate input parameters
    if (!table) {
      throw new Error('Table name is required. Usage: node scripts/reset-sequence.js <table_name> [value]');
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

    // Check if the table exists
    console.log(chalk.blue(`Checking if table '${table}' exists...`));
    const tableCheckQuery = `
      SELECT EXISTS (
        SELECT FROM information_schema.tables
        WHERE table_name = $1
      )
    `;

    const tableCheckResult = await pool.query(tableCheckQuery, [table]);

    if (!tableCheckResult.rows[0].exists) {
      throw new Error(`Table '${table}' does not exist in the database.`);
    }

    console.log(chalk.green(`Table '${table}' exists.`));

    // Reset the sequence
    let success;

    if (value !== undefined) {
      console.log(chalk.blue(`Resetting sequence for table '${table}' to value ${value}...`));
      success = await forceResetSequence(table, value);
    } else {
      console.log(chalk.blue(`Resetting sequence for table '${table}' to max ID + 1...`));
      success = await resetSequence(table);
    }

    if (!success) {
      throw new Error(`Failed to reset sequence for table '${table}'`);
    }

    // Get the current sequence value
    const sequenceQuery = `
      SELECT pg_get_serial_sequence($1, 'id') as sequence_name
    `;

    const sequenceResult = await pool.query(sequenceQuery, [table]);
    const sequenceName = sequenceResult.rows[0].sequence_name;

    if (sequenceName) {
      const currentValueQuery = `
        SELECT last_value FROM ${sequenceName}
      `;

      const currentValueResult = await pool.query(currentValueQuery);
      const currentValue = currentValueResult.rows[0].last_value;

      console.log(chalk.green(`Sequence for table '${table}' reset successfully.`));
      console.log(chalk.green(`Current sequence value is now: ${currentValue}`));
    } else {
      console.log(chalk.yellow(`Could not determine sequence name for table '${table}'.`));
      console.log(chalk.green(`Sequence for table '${table}' reset successfully.`));
    }

    // Close the database connection
    await pool.end();

    return {
      success: true,
      message: `Sequence for table '${table}' reset successfully.`
    };
  } catch (error) {
    console.error(chalk.red('Error resetting sequence:'), error);

    // Close the database connection
    try {
      await pool.end();
    } catch (err) {
      console.error(chalk.red('Error closing database connection:'), err);
    }

    process.exit(1);
  }
}

// Get command line arguments
const table = process.argv[2];
const value = process.argv[3] ? parseInt(process.argv[3], 10) : undefined;

// Run the function
resetTableSequence(table, value);
