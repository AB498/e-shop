# E-Shop Database Seeding Scripts

This directory contains scripts for database operations, including seeding the database with sample data.

## Available Scripts

### `seed-database.js`

This script seeds the database with sample data for development and testing purposes. It performs the same operation as the Dev UI seeding functionality but can be run directly from the terminal.

#### Prerequisites

- Node.js 18+ installed
- PostgreSQL database running
- `.env` file with `DATABASE_URL` environment variable set

#### Usage

You can run the script in two ways:

1. Using npm script:
   ```bash
   npm run seed
   ```

2. Directly using Node:
   ```bash
   node --experimental-json-modules scripts/seed-database.js
   ```

#### What the Script Does

The script performs the following operations:

1. Drops existing tables (if any)
2. Creates the database schema
3. Seeds the database with sample data:
   - Categories
   - Products
   - Users (with hashed passwords)
   - Files
   - Couriers
   - Store Locations
   - Delivery Persons

#### Warning

**This script will drop all existing tables in the database before creating new ones.** Make sure you're not running this on a production database or a database with important data.

## Troubleshooting

### Database Connection Issues

If you encounter database connection issues, check:

1. Your `.env` file has the correct `DATABASE_URL` format for Supabase:
   ```
   DATABASE_URL="postgres://postgres.[project-ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres?sslmode=require&supa=base-pooler.x"
   ```

2. Make sure the `sslmode=require` parameter is included in your connection string

3. Verify that your IP address is allowed in the Supabase dashboard:
   - Go to your Supabase project
   - Navigate to Project Settings > API
   - Check the "IP Restrictions" section

4. If you're using a local PostgreSQL database instead, use this format:
   ```
   DATABASE_URL=postgresql://username:password@localhost:5432/database_name
   ```

### Module Import Errors

If you encounter module import errors, make sure:

1. You're using Node.js version 18 or higher
2. You're using the `--experimental-json-modules` flag when running the script directly
3. The `"type": "module"` is set in the root `package.json`

### Permission Issues

If you encounter permission issues when running the script directly:

```bash
chmod +x scripts/seed-database.js
```

Then run it with:

```bash
./scripts/seed-database.js
```
