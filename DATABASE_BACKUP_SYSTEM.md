# Database Backup System

A comprehensive database backup and restore system with automated scheduling, S3 storage, and instant rollback capabilities.

## Features

- **Automated Daily Backups**: Scheduled via Vercel Cron (24-hour intervals)
- **Manual Backup Creation**: On-demand backups through admin panel
- **Instant Rollback**: One-click database restoration
- **S3 Storage**: Secure backup storage using Cloudflare R2
- **7-Day Retention**: Automatic cleanup of old backups
- **Robust Naming**: Descriptive filenames with timestamps and hashes
- **Admin Interface**: Full backup management through web UI
- **Metadata Tracking**: Detailed backup information and statistics

## System Architecture

### Components

1. **Database Schema**: `database_backups` table for metadata tracking
2. **Backup Service**: Core backup/restore functionality (`src/lib/backup.js`)
3. **API Routes**: RESTful endpoints for backup operations
4. **Admin UI**: React-based management interface
5. **Cron Jobs**: Automated backup scheduling via Vercel
6. **S3 Integration**: Cloudflare R2 storage for backup files

### File Naming Convention

Backups use a robust naming pattern that includes all necessary information:

```
backup_YYYY-MM-DD_HH-mm-ss_[hash].sql
```

Example: `backup_2024-01-15_14-30-25_a1b2c3d4.sql`

This format ensures:
- Chronological sorting
- Unique identification
- Easy date/time recognition
- Collision prevention

## Setup Instructions

### 1. Environment Variables

Add to your `.env` file:

```bash
# Existing S3/R2 configuration
CLOUDFLARE_ACCESS_KEY_ID=your-access-key
CLOUDFLARE_SECRET_ACCESS_KEY=your-secret-key

# Cron job authentication
CRON_SECRET=your-secure-random-string
```

### 2. Database Migration

Run the seed script to create the backup table:

```bash
npm run seed
```

Or manually create the table:

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

### 3. Vercel Deployment

The `vercel.json` file is already configured for daily backups at 2 AM UTC:

```json
{
  "crons": [
    {
      "path": "/api/cron/backup",
      "schedule": "0 2 * * *"
    }
  ]
}
```

### 4. Required System Dependencies

Ensure your deployment environment has:
- `pg_dump` (PostgreSQL client tools)
- `psql` (PostgreSQL client)

For Vercel, these are typically available in the Node.js runtime.

## Usage

### Admin Panel

Navigate to `/admin/backups` to:

- **View all backups** with status, size, and creation details
- **Create manual backups** for immediate backup needs
- **Download backup files** directly to your computer
- **Restore from any backup** with one-click rollback
- **Delete individual backups** to manage storage
- **Cleanup old backups** manually (also automated)

### API Endpoints

#### List Backups
```
GET /api/admin/backups
```

#### Create Backup
```
POST /api/admin/backups
Content-Type: application/json

{
  "action": "create"
}
```

#### Download Backup
```
GET /api/admin/backups/[id]/download
```

#### Restore Backup
```
POST /api/admin/backups/[id]/restore
```

#### Delete Backup
```
DELETE /api/admin/backups?id=[backup_id]
```

#### Cleanup Old Backups
```
POST /api/admin/backups
Content-Type: application/json

{
  "action": "cleanup"
}
```

### Cron Job Endpoint

The automated backup endpoint (called by Vercel Cron):

```
POST /api/cron/backup
Authorization: Bearer [CRON_SECRET]
```

## Backup Process

### Creation Process

1. **Initialize**: Create backup record with "in_progress" status
2. **Extract**: Use `pg_dump` to create SQL dump
3. **Upload**: Store backup file to S3/R2
4. **Update**: Mark backup as "completed" with metadata
5. **Cleanup**: Remove old backups (7+ days)

### Restore Process

1. **Validate**: Verify backup exists and is complete
2. **Download**: Retrieve backup file from S3/R2
3. **Restore**: Execute SQL dump using `psql`
4. **Cleanup**: Remove temporary files
5. **Confirm**: Return success/failure status

## Storage Details

### S3/R2 Configuration

- **Bucket**: `main-bucket`
- **Folder**: `database-backups/`
- **Format**: Plain SQL files
- **Compression**: None (for compatibility)
- **Access**: Private (presigned URLs for downloads)

### Retention Policy

- **Duration**: 7 days
- **Cleanup**: Automated daily during backup process
- **Manual**: Available through admin panel
- **Safety**: Backup metadata preserved even if S3 file missing

## Security Considerations

### Access Control

- **Admin Only**: All backup operations require admin authentication
- **Cron Protection**: Cron endpoint secured with secret token
- **S3 Security**: Private bucket with IAM-controlled access

### Data Protection

- **Encryption**: S3/R2 server-side encryption
- **Network**: HTTPS for all transfers
- **Credentials**: Environment variable protection
- **Audit**: All operations logged with user attribution

## Monitoring and Troubleshooting

### Logs

All backup operations are logged with:
- Timestamp and duration
- Success/failure status
- File sizes and metadata
- Error details for failures

### Common Issues

1. **pg_dump not found**: Ensure PostgreSQL client tools installed
2. **S3 upload fails**: Check credentials and bucket permissions
3. **Restore fails**: Verify backup file integrity and database permissions
4. **Cron not running**: Check Vercel deployment and cron configuration

### Health Checks

Use the cron status endpoint to verify system health:

```
GET /api/cron/backup
Authorization: Bearer [CRON_SECRET]
```

## Performance Considerations

### Backup Size

- **Typical**: 1-10 MB for small e-commerce databases
- **Large**: 50-100 MB for databases with extensive product catalogs
- **Optimization**: Consider incremental backups for very large databases

### Timing

- **Creation**: 30 seconds to 5 minutes depending on database size
- **Upload**: Additional 30 seconds to 2 minutes for S3 transfer
- **Restore**: 1-10 minutes depending on backup size and complexity

### Resource Usage

- **Memory**: 50-200 MB during backup/restore operations
- **CPU**: Moderate usage during pg_dump/psql execution
- **Network**: Bandwidth for S3 uploads/downloads

## Future Enhancements

Potential improvements for the backup system:

1. **Incremental Backups**: Reduce backup size and time
2. **Compression**: Gzip compression for storage efficiency
3. **Encryption**: Client-side encryption before S3 upload
4. **Multi-Region**: Cross-region backup replication
5. **Notifications**: Email/Slack alerts for backup status
6. **Scheduling**: Custom backup schedules beyond daily
7. **Partial Restore**: Table-specific restoration options
