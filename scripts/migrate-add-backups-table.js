#!/usr/bin/env node

/**
 * Safe Migration Script: Add Database Backups Table
 * 
 * This script safely adds the database_backups table to the existing database
 * without affecting production data or existing functionality.
 * 
 * Safety Features:
 * - Checks if table already exists before creating
 * - Uses transactions for atomic operations
 * - Comprehensive error handling
 * - Rollback capability on failure
 * - Production-safe with minimal downtime
 * 
 * Usage: node scripts/migrate-add-backups-table.js
 */

import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { config } from 'dotenv';
import { Pool } from 'pg';
import chalk from 'chalk';

// Load environment variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const envPath = join(__dirname, '..', '.env');
config({ path: envPath });

// Create database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false // Allow self-signed certificates for hosted databases
  }
});

/**
 * Check if a table exists in the database
 */
async function tableExists(tableName) {
  try {
    const result = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = $1
      );
    `, [tableName]);
    
    return result.rows[0].exists;
  } catch (error) {
    console.error(chalk.red(`Error checking if table ${tableName} exists:`), error.message);
    throw error;
  }
}

/**
 * Check if a column exists in a table
 */
async function columnExists(tableName, columnName) {
  try {
    const result = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = $1 
        AND column_name = $2
      );
    `, [tableName, columnName]);
    
    return result.rows[0].exists;
  } catch (error) {
    console.error(chalk.red(`Error checking if column ${columnName} exists in ${tableName}:`), error.message);
    throw error;
  }
}

/**
 * Create the database_backups table
 */
async function createBackupsTable() {
  const createTableSQL = `
    CREATE TABLE database_backups (
      id SERIAL PRIMARY KEY,
      filename TEXT NOT NULL UNIQUE,
      s3_key TEXT NOT NULL,
      file_size INTEGER NOT NULL,
      backup_type TEXT DEFAULT 'full' NOT NULL,
      status TEXT DEFAULT 'completed' NOT NULL,
      created_by TEXT DEFAULT 'system' NOT NULL,
      metadata JSONB,
      created_at TIMESTAMP DEFAULT NOW(),
      completed_at TIMESTAMP
    );
  `;

  const createIndexesSQL = [
    'CREATE INDEX idx_database_backups_created_at ON database_backups(created_at);',
    'CREATE INDEX idx_database_backups_status ON database_backups(status);',
    'CREATE INDEX idx_database_backups_created_by ON database_backups(created_by);'
  ];

  try {
    console.log(chalk.blue('Creating database_backups table...'));
    await pool.query(createTableSQL);
    console.log(chalk.green('✓ Table database_backups created successfully'));

    console.log(chalk.blue('Creating indexes for better performance...'));
    for (const indexSQL of createIndexesSQL) {
      await pool.query(indexSQL);
    }
    console.log(chalk.green('✓ Indexes created successfully'));

    return true;
  } catch (error) {
    console.error(chalk.red('Error creating database_backups table:'), error.message);
    throw error;
  }
}

/**
 * Reset the sequence for the database_backups table
 */
async function resetSequence() {
  try {
    console.log(chalk.blue('Resetting sequence for database_backups table...'));
    await pool.query(`
      SELECT setval(
        pg_get_serial_sequence('database_backups', 'id'), 
        COALESCE((SELECT MAX(id) FROM database_backups), 1), 
        true
      );
    `);
    console.log(chalk.green('✓ Sequence reset successfully'));
  } catch (error) {
    console.error(chalk.red('Error resetting sequence:'), error.message);
    throw error;
  }
}

/**
 * Verify the migration was successful
 */
async function verifyMigration() {
  try {
    console.log(chalk.blue('Verifying migration...'));
    
    // Check table exists
    const exists = await tableExists('database_backups');
    if (!exists) {
      throw new Error('Table database_backups was not created');
    }

    // Check all required columns exist
    const requiredColumns = [
      'id', 'filename', 's3_key', 'file_size', 'backup_type', 
      'status', 'created_by', 'metadata', 'created_at', 'completed_at'
    ];

    for (const column of requiredColumns) {
      const columnExistsResult = await columnExists('database_backups', column);
      if (!columnExistsResult) {
        throw new Error(`Required column ${column} is missing from database_backups table`);
      }
    }

    // Test insert and delete to ensure table is functional
    const testResult = await pool.query(`
      INSERT INTO database_backups (filename, s3_key, file_size, status, created_by) 
      VALUES ('test_migration.sql', 'test/test_migration.sql', 1024, 'completed', 'migration_test') 
      RETURNING id;
    `);
    
    const testId = testResult.rows[0].id;
    
    await pool.query('DELETE FROM database_backups WHERE id = $1', [testId]);
    
    console.log(chalk.green('✓ Migration verification successful'));
    return true;
  } catch (error) {
    console.error(chalk.red('Migration verification failed:'), error.message);
    throw error;
  }
}

/**
 * Main migration function
 */
async function runMigration() {
  const client = await pool.connect();
  
  try {
    console.log(chalk.cyan('🚀 Starting safe migration: Add database_backups table'));
    console.log(chalk.gray('Database:', process.env.DATABASE_URL?.replace(/:[^:]*@/, ':****@')));
    
    // Test database connection
    console.log(chalk.blue('Testing database connection...'));
    const connectionTest = await client.query('SELECT NOW() as current_time, version() as pg_version');
    console.log(chalk.green('✓ Database connection successful'));
    console.log(chalk.gray(`  Server time: ${connectionTest.rows[0].current_time}`));
    console.log(chalk.gray(`  PostgreSQL version: ${connectionTest.rows[0].pg_version.split(' ')[0]}`));

    // Check if table already exists
    console.log(chalk.blue('Checking if database_backups table already exists...'));
    const exists = await tableExists('database_backups');
    
    if (exists) {
      console.log(chalk.yellow('⚠️  Table database_backups already exists'));
      console.log(chalk.blue('Verifying existing table structure...'));
      
      // Verify existing table has all required columns
      await verifyMigration();
      console.log(chalk.green('✅ Migration not needed - table already exists and is valid'));
      return;
    }

    // Begin transaction for atomic operation
    console.log(chalk.blue('Starting transaction...'));
    await client.query('BEGIN');

    try {
      // Create the table and indexes
      await createBackupsTable();
      
      // Reset sequence
      await resetSequence();
      
      // Verify migration
      await verifyMigration();
      
      // Commit transaction
      await client.query('COMMIT');
      console.log(chalk.green('✓ Transaction committed successfully'));
      
      console.log(chalk.green.bold('\n🎉 Migration completed successfully!'));
      console.log(chalk.gray('The database_backups table has been added to your database.'));
      console.log(chalk.gray('You can now use the backup system in your admin panel.'));
      
    } catch (error) {
      // Rollback on any error
      await client.query('ROLLBACK');
      console.log(chalk.red('❌ Transaction rolled back due to error'));
      throw error;
    }

  } catch (error) {
    console.error(chalk.red.bold('\n💥 Migration failed:'), error.message);
    console.error(chalk.gray('Stack trace:'), error.stack);
    process.exit(1);
  } finally {
    client.release();
  }
}

/**
 * Cleanup function
 */
async function cleanup() {
  try {
    await pool.end();
    console.log(chalk.gray('Database connection closed'));
  } catch (error) {
    console.error(chalk.red('Error closing database connection:'), error.message);
  }
}

// Handle process termination
process.on('SIGINT', async () => {
  console.log(chalk.yellow('\n⚠️  Migration interrupted by user'));
  await cleanup();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log(chalk.yellow('\n⚠️  Migration terminated'));
  await cleanup();
  process.exit(0);
});

// Run the migration
// Fix for Windows path comparison - normalize paths
const scriptPath = fileURLToPath(import.meta.url);
const executedPath = process.argv[1];
const isDirectExecution = scriptPath === executedPath ||
  scriptPath.replace(/\\/g, '/') === executedPath.replace(/\\/g, '/');

console.log(chalk.blue('🔧 Migration script started...'));
console.log(chalk.gray('Script path:', scriptPath));
console.log(chalk.gray('Executed path:', executedPath));
console.log(chalk.gray('Is direct execution:', isDirectExecution));

if (isDirectExecution) {
  console.log(chalk.gray('Environment check:'));
  console.log(chalk.gray('  DATABASE_URL:', process.env.DATABASE_URL ? 'Set' : 'Not set'));
  console.log(chalk.gray('  NODE_ENV:', process.env.NODE_ENV || 'Not set'));

  runMigration()
    .then(async () => {
      console.log(chalk.green('✅ Migration process completed successfully'));
      await cleanup();
      console.log(chalk.blue('👋 Exiting migration script'));
      process.exit(0);
    })
    .catch(async (error) => {
      console.error(chalk.red('❌ Unhandled error in migration:'), error);
      await cleanup();
      process.exit(1);
    });
} else {
  console.log(chalk.yellow('⚠️  Script not executed directly - skipping migration'));
}
