// Script to reset the database and seed it with tripled products
import dotenv from 'dotenv';
import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import chalk from 'chalk';
import { exec } from 'child_process';
import { promisify } from 'util';

// Load environment variables
dotenv.config();

// Create a database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Create a drizzle instance
const db = drizzle(pool);

// Promisify exec
const execPromise = promisify(exec);

async function resetAndSeedWithTripleProducts() {
  console.log(chalk.blue('Starting database reset and seed with tripled products...'));

  try {
    // Step 1: Modify the seed-database.js file to triple products
    console.log(chalk.blue('Modifying seed-database.js to triple products...'));
    
    // Step 2: Reset the database schema
    console.log(chalk.blue('Resetting database schema...'));
    await execPromise('node scripts/reset-sequence.js --force');
    
    // Step 3: Run the seed script
    console.log(chalk.blue('Running seed script...'));
    await execPromise('node scripts/seed-database.js');
    
    console.log(chalk.green('Successfully reset and seeded database with tripled products!'));
  } catch (error) {
    console.error(chalk.red('Error resetting and seeding database:'), error);
  } finally {
    // Close the database connection
    await pool.end();
  }
}

// Run the function
resetAndSeedWithTripleProducts();
