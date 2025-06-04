# Database Migration Guide: Adding Backup System

This guide explains how to safely add the database backup system to your existing production database without affecting current operations.

## Overview

The migration adds a new `database_backups` table to track backup metadata. This is a **safe, non-destructive migration** that:

- ✅ **Won't affect existing data** - Only adds new table
- ✅ **Won't break existing functionality** - No changes to current tables
- ✅ **Uses transactions** - Atomic operation with rollback on failure
- ✅ **Checks for conflicts** - Verifies table doesn't already exist
- ✅ **Production-safe** - Minimal downtime and comprehensive error handling

## What Gets Added

### New Table: `database_backups`

```sql
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
```

### Performance Indexes

```sql
CREATE INDEX idx_database_backups_created_at ON database_backups(created_at);
CREATE INDEX idx_database_backups_status ON database_backups(status);
CREATE INDEX idx_database_backups_created_by ON database_backups(created_by);
```

## Pre-Migration Checklist

### 1. Environment Setup

Ensure you have the required environment variables:

```bash
# Required
DATABASE_URL=your-database-connection-string

# For backup functionality (add after migration)
CRON_SECRET=your-secure-random-string
CLOUDFLARE_ACCESS_KEY_ID=your-r2-access-key
CLOUDFLARE_SECRET_ACCESS_KEY=your-r2-secret-key
```

### 2. Database Access

Verify you have:
- ✅ Database connection access
- ✅ CREATE TABLE permissions
- ✅ CREATE INDEX permissions
- ✅ INSERT/DELETE permissions (for verification)

### 3. Backup Current Database (Recommended)

Before running any migration, create a backup of your current database:

```bash
# Using pg_dump (replace with your actual connection details)
pg_dump $DATABASE_URL > backup_before_migration_$(date +%Y%m%d_%H%M%S).sql
```

## Running the Migration

### Option 1: Using npm script (Recommended)

```bash
npm run migrate-backups
```

### Option 2: Direct execution

```bash
node scripts/migrate-add-backups-table.js
```

## Migration Process

The script performs these steps:

1. **Connection Test** - Verifies database connectivity
2. **Existence Check** - Checks if table already exists
3. **Transaction Start** - Begins atomic operation
4. **Table Creation** - Creates the database_backups table
5. **Index Creation** - Adds performance indexes
6. **Sequence Reset** - Ensures proper ID sequencing
7. **Verification** - Tests table functionality
8. **Transaction Commit** - Finalizes changes

## Expected Output

### Successful Migration

```
🚀 Starting safe migration: Add database_backups table
Database: postgres://****@****
✓ Database connection successful
  Server time: 2024-01-15 10:30:25
  PostgreSQL version: PostgreSQL 15.4
✓ Table database_backups created successfully
✓ Indexes created successfully
✓ Sequence reset successfully
✓ Migration verification successful
✓ Transaction committed successfully

🎉 Migration completed successfully!
The database_backups table has been added to your database.
You can now use the backup system in your admin panel.
```

### If Table Already Exists

```
🚀 Starting safe migration: Add database_backups table
✓ Database connection successful
⚠️  Table database_backups already exists
✓ Migration verification successful
✅ Migration not needed - table already exists and is valid
```

## Rollback Strategy

### Automatic Rollback

The migration uses database transactions, so any failure automatically rolls back all changes.

### Manual Rollback (if needed)

If you need to manually remove the table after migration:

```sql
-- Remove the table and indexes
DROP TABLE IF EXISTS database_backups CASCADE;
```

## Post-Migration Steps

### 1. Verify Migration Success

Check that the table was created:

```sql
-- Check table exists
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' AND table_name = 'database_backups';

-- Check table structure
\d database_backups
```

### 2. Add Environment Variables

Add the backup system environment variables:

```bash
# Add to your .env file
CRON_SECRET=your-secure-random-string-here
```

### 3. Deploy Application

Deploy your updated application with the backup system code.

### 4. Test Backup System

1. Navigate to `/admin/backups` in your admin panel
2. Create a manual backup to test functionality
3. Verify backup appears in your S3/R2 storage

## Troubleshooting

### Common Issues

#### Permission Denied

```
Error: permission denied for schema public
```

**Solution**: Ensure your database user has CREATE permissions:

```sql
GRANT CREATE ON SCHEMA public TO your_database_user;
```

#### Connection Failed

```
Error: connection to server failed
```

**Solution**: 
- Verify DATABASE_URL is correct
- Check network connectivity
- Ensure database server is running

#### Table Already Exists (Different Structure)

```
Error: Required column metadata is missing from database_backups table
```

**Solution**: The table exists but has wrong structure. Either:
1. Drop the existing table: `DROP TABLE database_backups CASCADE;`
2. Or manually add missing columns

### Getting Help

If you encounter issues:

1. **Check the logs** - The script provides detailed error messages
2. **Verify permissions** - Ensure database user has required permissions
3. **Test connection** - Verify you can connect to the database manually
4. **Check environment** - Ensure DATABASE_URL is correctly set

## Safety Features

### Transaction Safety

- All operations wrapped in database transaction
- Automatic rollback on any failure
- No partial state possible

### Existence Checks

- Verifies table doesn't already exist
- Checks for required columns in existing tables
- Validates table structure after creation

### Error Handling

- Comprehensive error messages
- Graceful handling of connection issues
- Safe cleanup on interruption (Ctrl+C)

### Verification

- Tests table functionality after creation
- Verifies all required columns exist
- Ensures indexes are properly created

## Performance Impact

### During Migration

- **Downtime**: Near zero (table creation is fast)
- **Lock Duration**: Minimal (only during table creation)
- **Resource Usage**: Low (simple DDL operations)

### After Migration

- **Storage**: Minimal overhead (empty table + indexes)
- **Performance**: No impact on existing queries
- **Memory**: Negligible additional usage

## Security Considerations

### Database Access

- Migration requires CREATE permissions
- Uses existing database connection
- No additional credentials needed

### Data Protection

- No existing data is modified
- New table starts empty
- All operations are logged

This migration is designed to be as safe as possible for production environments. The backup system will be ready to use immediately after successful migration.
