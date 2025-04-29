import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

// Create a pool with SSL configuration that accepts self-signed certificates
export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false // This allows self-signed certificates
  }
});

export const db = drizzle(pool);
