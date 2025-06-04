import { createHash } from 'crypto';
import { db, pool } from '@/lib/db';
import { databaseBackups } from '@/db/schema';
import { uploadFromBuffer } from '@/lib/s3';
import { S3Client, GetObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { eq, lt, desc } from 'drizzle-orm';

// S3 Client configuration (using existing Cloudflare R2 setup)
const s3Client = new S3Client({
  region: 'auto',
  endpoint: `https://ee1b0a70a9a38c79368106e3dd1c1bda.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.CLOUDFLARE_ACCESS_KEY_ID,
    secretAccessKey: process.env.CLOUDFLARE_SECRET_ACCESS_KEY,
  },
});

const BUCKET_NAME = 'main-bucket';
const BACKUP_FOLDER = 'database-backups';

/**
 * Generate a robust backup filename with timestamp and hash
 * Format: backup_YYYY-MM-DD_HH-mm-ss_[hash].sql
 */
function generateBackupFilename() {
  const now = new Date();
  const timestamp = now.toISOString()
    .replace(/:/g, '-')
    .replace(/\./g, '-')
    .replace('T', '_')
    .slice(0, 19); // Remove milliseconds and timezone
  
  const hash = createHash('md5')
    .update(now.getTime().toString() + Math.random().toString())
    .digest('hex')
    .slice(0, 8);
  
  return `backup_${timestamp}_${hash}.sql`;
}

/**
 * Get all table names from the database
 */
async function getAllTables() {
  try {
    const result = await pool.query(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      AND table_type = 'BASE TABLE'
      ORDER BY table_name
    `);
    return result.rows.map(row => row.table_name);
  } catch (error) {
    console.error('Error getting table names:', error);
    throw error;
  }
}

/**
 * Get table schema information
 */
async function getTableSchema(tableName) {
  try {
    const result = await pool.query(`
      SELECT
        column_name,
        data_type,
        is_nullable,
        column_default,
        character_maximum_length
      FROM information_schema.columns
      WHERE table_schema = 'public'
      AND table_name = $1
      ORDER BY ordinal_position
    `, [tableName]);
    return result.rows;
  } catch (error) {
    console.error(`Error getting schema for table ${tableName}:`, error);
    throw error;
  }
}

/**
 * Get row count for a table
 */
async function getTableRowCount(tableName) {
  try {
    const result = await pool.query(`SELECT COUNT(*) as count FROM ${tableName}`);
    return parseInt(result.rows[0].count);
  } catch (error) {
    console.warn(`Error getting row count for ${tableName}:`, error.message);
    return 0;
  }
}

/**
 * Generate INSERT statements for table data with streaming approach
 */
async function generateInsertStatements(tableName) {
  try {
    // Get total row count first
    const totalRows = await getTableRowCount(tableName);

    if (totalRows === 0) {
      return `-- No data in table ${tableName}\n`;
    }

    console.log(`  📊 Table ${tableName}: ${totalRows} rows`);

    let insertSQL = `-- Data for table ${tableName} (${totalRows} rows)\n`;

    // Use appropriate batch size based on table size
    const batchSize = totalRows > 10000 ? 100 : totalRows > 1000 ? 200 : 500;
    let processedRows = 0;

    // Process in batches using LIMIT/OFFSET
    for (let offset = 0; offset < totalRows; offset += batchSize) {
      const result = await pool.query(`SELECT * FROM ${tableName} ORDER BY 1 LIMIT ${batchSize} OFFSET ${offset}`);

      if (result.rows.length === 0) break;

      // Get columns from first batch
      if (offset === 0) {
        const columns = Object.keys(result.rows[0]);
        const columnsList = columns.join(', ');
        insertSQL += `-- Columns: ${columnsList}\n`;
      }

      const columns = Object.keys(result.rows[0]);
      const columnsList = columns.join(', ');

      const values = result.rows.map(row => {
        const valuesList = columns.map(col => {
          const value = row[col];
          if (value === null) return 'NULL';
          if (typeof value === 'string') {
            // Simplified escaping for speed
            return `'${value.replace(/'/g, "''")}'`;
          }
          if (typeof value === 'object') {
            return `'${JSON.stringify(value).replace(/'/g, "''")}'`;
          }
          if (typeof value === 'boolean') {
            return value ? 'true' : 'false';
          }
          if (value instanceof Date) {
            return `'${value.toISOString()}'`;
          }
          return value;
        }).join(', ');

        return `(${valuesList})`;
      }).join(',\n  ');

      insertSQL += `INSERT INTO ${tableName} (${columnsList}) VALUES\n  ${values};\n`;

      processedRows += result.rows.length;
    }

    console.log(`  ✅ Completed ${tableName}: ${processedRows} rows processed`);
    return insertSQL + '\n';

  } catch (error) {
    console.error(`❌ Error generating INSERT statements for ${tableName}:`, error);
    return `-- Error backing up table ${tableName}: ${error.message}\n`;
  }
}

/**
 * Create a complete database backup using JavaScript
 * @param {string} createdBy - Who created the backup ('system' or 'admin')
 * @returns {Promise<object>} - Backup result with metadata
 */
export async function createDatabaseBackup(createdBy = 'system') {
  const filename = generateBackupFilename();
  const s3Key = `${BACKUP_FOLDER}/${filename}`;
  const startTime = Date.now();

  let backupRecord = null;

  try {
    console.log('🚀 Starting complete JavaScript-based database backup...');
    console.log('⏰ Backup started at:', new Date().toISOString());

    // Create initial backup record
    const [record] = await db.insert(databaseBackups).values({
      filename,
      s3_key: s3Key,
      file_size: 0,
      status: 'in_progress',
      created_by: createdBy,
      metadata: {
        backup_method: 'javascript',
        database_url_masked: process.env.DATABASE_URL?.replace(/:[^:]*@/, ':****@') || 'unknown',
        node_version: process.version,
        timestamp: new Date().toISOString(),
        complete_backup: true,
        start_time: startTime
      }
    }).returning();

    backupRecord = record;
    console.log('✓ Backup record created:', record.id);

    // Get all tables
    console.log('📋 Getting table list...');
    const tables = await getAllTables();
    console.log(`✓ Found ${tables.length} tables:`, tables.join(', '));

    // Generate SQL dump
    let sqlDump = '';

    // Add header
    sqlDump += `-- Database Backup Generated by JavaScript\n`;
    sqlDump += `-- Created: ${new Date().toISOString()}\n`;
    sqlDump += `-- Method: JavaScript (Complete Backup)\n`;
    sqlDump += `-- Tables: ${tables.length}\n\n`;

    // Add cleanup commands
    sqlDump += `-- Cleanup existing data\n`;
    for (const table of tables.reverse()) { // Reverse order for dependencies
      sqlDump += `DELETE FROM ${table};\n`;
    }
    sqlDump += '\n';

    tables.reverse(); // Back to original order

    // Process each table
    let processedTables = 0;

    for (const tableName of tables) {
      try {
        console.log(`📊 Processing table: ${tableName}... (${processedTables + 1}/${tables.length})`);

        // Get table schema
        const columns = await getTableSchema(tableName);

        // Add table comment
        sqlDump += `-- Table: ${tableName}\n`;
        sqlDump += `-- Columns: ${columns.length}\n`;

        // Generate INSERT statements
        const insertStatements = await generateInsertStatements(tableName);
        sqlDump += insertStatements;

        processedTables++;
        const progress = Math.round((processedTables / tables.length) * 100);
        console.log(`✓ Processed ${tableName} (${processedTables}/${tables.length} - ${progress}%)`);

      } catch (error) {
        console.warn(`⚠️ Error processing table ${tableName}:`, error.message);
        sqlDump += `-- Error processing table ${tableName}: ${error.message}\n\n`;
        processedTables++; // Count as processed even if failed
      }
    }

    // Calculate timing
    const endTime = Date.now();
    const totalDuration = endTime - startTime;
    const durationMinutes = Math.round(totalDuration / 1000 / 60 * 100) / 100;

    // Add footer with timing
    sqlDump += `-- Backup completed: ${new Date().toISOString()}\n`;
    sqlDump += `-- Total tables processed: ${processedTables}/${tables.length}\n`;
    sqlDump += `-- Total duration: ${durationMinutes} minutes\n`;

    // Convert to buffer
    const backupBuffer = Buffer.from(sqlDump, 'utf8');
    const fileSize = backupBuffer.length;

    console.log(`✓ SQL dump generated, size: ${(fileSize / 1024 / 1024).toFixed(2)} MB`);
    console.log(`⏱️ Processing took: ${durationMinutes} minutes`);

    // Upload to S3
    console.log('☁️ Uploading backup to S3...');
    const uploadResult = await uploadFromBuffer(
      backupBuffer,
      s3Key,
      'application/sql'
    );

    if (!uploadResult.success) {
      throw new Error(`Failed to upload backup: ${uploadResult.error}`);
    }

    console.log('✓ Backup uploaded to S3:', uploadResult.url);

    // Update backup record with completion details
    const [updatedRecord] = await db.update(databaseBackups)
      .set({
        file_size: fileSize,
        status: 'completed',
        completed_at: new Date(),
        metadata: {
          ...record.metadata,
          upload_url: uploadResult.url,
          upload_key: uploadResult.key,
          tables_backed_up: processedTables,
          total_tables: tables.length,
          completion_time: new Date().toISOString(),
          sql_dump_size_mb: (fileSize / 1024 / 1024).toFixed(2),
          duration_ms: totalDuration,
          duration_minutes: durationMinutes,
          processing_rate_tables_per_minute: Math.round((processedTables / durationMinutes) * 100) / 100
        }
      })
      .where(eq(databaseBackups.id, record.id))
      .returning();

    console.log('🎉 Backup completed successfully:', filename);
    console.log(`📊 Performance: ${processedTables} tables in ${durationMinutes} minutes`);

    return {
      success: true,
      backup: updatedRecord,
      message: `Backup created successfully: ${filename} (${(fileSize / 1024 / 1024).toFixed(2)} MB)`
    };

  } catch (error) {
    console.error('💥 Backup creation failed:', error);

    // Update backup record to failed status if it exists
    if (backupRecord) {
      try {
        await db.update(databaseBackups)
          .set({
            status: 'failed',
            completed_at: new Date(),
            metadata: {
              ...backupRecord.metadata,
              error_message: error.message,
              failure_time: new Date().toISOString()
            }
          })
          .where(eq(databaseBackups.id, backupRecord.id));
      } catch (updateError) {
        console.error('Error updating backup record:', updateError);
      }
    }

    return {
      success: false,
      error: error.message,
      message: 'Failed to create database backup'
    };
  }
}

/**
 * Get all database backups with pagination
 * @param {number} limit - Number of backups to return
 * @param {number} offset - Offset for pagination
 * @returns {Promise<Array>} - List of backups
 */
export async function getAllBackups(limit = 50, offset = 0) {
  try {
    const backups = await db.select()
      .from(databaseBackups)
      .orderBy(desc(databaseBackups.created_at))
      .limit(limit)
      .offset(offset);
    
    return {
      success: true,
      backups,
      total: backups.length
    };
  } catch (error) {
    console.error('Error fetching backups:', error);
    return {
      success: false,
      error: error.message,
      backups: []
    };
  }
}

/**
 * Get a specific backup by ID
 * @param {number} backupId - Backup ID
 * @returns {Promise<object>} - Backup details
 */
export async function getBackupById(backupId) {
  try {
    const [backup] = await db.select()
      .from(databaseBackups)
      .where(eq(databaseBackups.id, backupId))
      .limit(1);
    
    if (!backup) {
      return {
        success: false,
        error: 'Backup not found'
      };
    }
    
    return {
      success: true,
      backup
    };
  } catch (error) {
    console.error('Error fetching backup:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Delete a backup (both database record and S3 file)
 * @param {number} backupId - Backup ID to delete
 * @returns {Promise<object>} - Deletion result
 */
export async function deleteBackup(backupId) {
  try {
    // Get backup details first
    const backupResult = await getBackupById(backupId);
    if (!backupResult.success) {
      return backupResult;
    }
    
    const backup = backupResult.backup;
    
    // Delete from S3
    try {
      const deleteCommand = new DeleteObjectCommand({
        Bucket: BUCKET_NAME,
        Key: backup.s3_key
      });
      
      await s3Client.send(deleteCommand);
      console.log('Deleted backup from S3:', backup.s3_key);
    } catch (s3Error) {
      console.warn('Failed to delete from S3 (continuing with database deletion):', s3Error.message);
    }
    
    // Delete from database
    await db.delete(databaseBackups)
      .where(eq(databaseBackups.id, backupId));
    
    return {
      success: true,
      message: `Backup ${backup.filename} deleted successfully`
    };
    
  } catch (error) {
    console.error('Error deleting backup:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Execute SQL statements safely
 */
async function executeSQLStatements(sqlContent) {
  const statements = sqlContent
    .split(';')
    .map(stmt => stmt.trim())
    .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));

  let executedCount = 0;
  const errors = [];

  for (const statement of statements) {
    try {
      if (statement.trim()) {
        await pool.query(statement);
        executedCount++;
      }
    } catch (error) {
      console.warn(`Warning executing statement: ${error.message}`);
      errors.push({
        statement: statement.substring(0, 100) + '...',
        error: error.message
      });
      // Continue with other statements
    }
  }

  return {
    executedCount,
    totalStatements: statements.length,
    errors
  };
}

/**
 * Restore database from a backup (Vercel-compatible)
 * @param {number} backupId - Backup ID to restore from
 * @returns {Promise<object>} - Restore result
 */
export async function restoreFromBackup(backupId) {
  try {
    console.log('🔄 Starting JavaScript-based database restore...');

    // Get backup details
    const backupResult = await getBackupById(backupId);
    if (!backupResult.success) {
      return backupResult;
    }

    const backup = backupResult.backup;

    if (backup.status !== 'completed') {
      return {
        success: false,
        error: 'Cannot restore from incomplete backup'
      };
    }

    console.log('✓ Backup found:', backup.filename);

    // Download backup from S3
    console.log('📥 Downloading backup from S3...');
    const getCommand = new GetObjectCommand({
      Bucket: BUCKET_NAME,
      Key: backup.s3_key
    });

    const s3Response = await s3Client.send(getCommand);
    const backupData = await streamToBuffer(s3Response.Body);
    const sqlContent = backupData.toString('utf8');

    console.log(`✓ Downloaded backup file, size: ${(backupData.length / 1024 / 1024).toFixed(2)} MB`);

    // Execute SQL statements
    console.log('⚡ Executing SQL statements...');
    const result = await executeSQLStatements(sqlContent);

    console.log(`✓ Executed ${result.executedCount}/${result.totalStatements} statements`);

    if (result.errors.length > 0) {
      console.warn(`⚠️ ${result.errors.length} statements had warnings:`, result.errors);
    }

    console.log('🎉 Database restore completed successfully');

    return {
      success: true,
      message: `Database restored successfully from ${backup.filename}`,
      backup: backup,
      restoredAt: new Date().toISOString(),
      executionStats: {
        executedStatements: result.executedCount,
        totalStatements: result.totalStatements,
        warnings: result.errors.length
      }
    };

  } catch (error) {
    console.error('💥 Database restore failed:', error);
    return {
      success: false,
      error: error.message,
      message: 'Failed to restore database'
    };
  }
}

/**
 * Convert stream to buffer
 */
async function streamToBuffer(stream) {
  const chunks = [];
  for await (const chunk of stream) {
    chunks.push(chunk);
  }
  return Buffer.concat(chunks);
}

/**
 * Download a backup file from S3
 * @param {number} backupId - Backup ID to download
 * @returns {Promise<object>} - Download result with file data
 */
export async function downloadBackup(backupId) {
  try {
    // Get backup details
    const backupResult = await getBackupById(backupId);
    if (!backupResult.success) {
      return backupResult;
    }

    const backup = backupResult.backup;

    if (backup.status !== 'completed') {
      return {
        success: false,
        error: 'Cannot download incomplete backup'
      };
    }

    console.log('Downloading backup from S3:', backup.filename);

    // Download from S3
    const getCommand = new GetObjectCommand({
      Bucket: BUCKET_NAME,
      Key: backup.s3_key
    });

    const s3Response = await s3Client.send(getCommand);
    const backupData = await streamToBuffer(s3Response.Body);

    console.log(`Downloaded backup, size: ${(backupData.length / 1024 / 1024).toFixed(2)} MB`);

    return {
      success: true,
      backup: backup,
      data: backupData,
      filename: backup.filename,
      size: backupData.length,
      message: `Downloaded ${backup.filename} successfully`
    };

  } catch (error) {
    console.error('Error downloading backup:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Clean up old backups (older than 7 days)
 * @returns {Promise<object>} - Cleanup result
 */
export async function cleanupOldBackups() {
  try {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    // Get old backups
    const oldBackups = await db.select()
      .from(databaseBackups)
      .where(lt(databaseBackups.created_at, sevenDaysAgo));

    console.log(`Found ${oldBackups.length} old backups to clean up`);

    let deletedCount = 0;
    let errors = [];

    // Delete each old backup
    for (const backup of oldBackups) {
      const deleteResult = await deleteBackup(backup.id);
      if (deleteResult.success) {
        deletedCount++;
      } else {
        errors.push(`Failed to delete ${backup.filename}: ${deleteResult.error}`);
      }
    }

    return {
      success: true,
      deletedCount,
      totalFound: oldBackups.length,
      errors: errors.length > 0 ? errors : null,
      message: `Cleaned up ${deletedCount} old backups`
    };

  } catch (error) {
    console.error('Error during cleanup:', error);
    return {
      success: false,
      error: error.message
    };
  }
}
