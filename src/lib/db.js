const { drizzle } = require('drizzle-orm/node-postgres')
const { Pool } = require('pg')

// Create a pool with SSL configuration that accepts self-signed certificates
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false // This allows self-signed certificates
  }
})

const db = drizzle(pool)

// Export both the db instance and the pool for direct query access
module.exports = { db, pool }
