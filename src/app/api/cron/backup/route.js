import { NextResponse } from 'next/server';
import { createDatabaseBackup, cleanupOldBackups } from '@/lib/backup';

/**
 * POST handler for automated database backup cron job
 * This endpoint is called by Vercel Cron every 24 hours
 */
export async function POST(request) {
  try {
    // Verify the request is from Vercel Cron
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      console.error('Unauthorized cron request');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log('Starting automated database backup...');
    const startTime = Date.now();

    // Create the backup
    const backupResult = await createDatabaseBackup('system');

    if (!backupResult.success) {
      console.error('Automated backup failed:', backupResult.error);
      return NextResponse.json({
        success: false,
        error: backupResult.error,
        message: backupResult.message,
        timestamp: new Date().toISOString()
      }, { status: 500 });
    }

    console.log('Automated backup completed successfully:', backupResult.backup.filename);

    // Perform cleanup of old backups
    console.log('Starting cleanup of old backups...');
    const cleanupResult = await cleanupOldBackups();

    if (!cleanupResult.success) {
      console.warn('Cleanup failed but backup succeeded:', cleanupResult.error);
    } else {
      console.log(`Cleanup completed: ${cleanupResult.deletedCount} old backups removed`);
    }

    const endTime = Date.now();
    const duration = endTime - startTime;

    return NextResponse.json({
      success: true,
      backup: {
        id: backupResult.backup.id,
        filename: backupResult.backup.filename,
        size: backupResult.backup.file_size,
        createdAt: backupResult.backup.created_at
      },
      cleanup: {
        success: cleanupResult.success,
        deletedCount: cleanupResult.deletedCount || 0,
        totalFound: cleanupResult.totalFound || 0,
        errors: cleanupResult.errors
      },
      performance: {
        duration: `${duration}ms`,
        durationSeconds: Math.round(duration / 1000)
      },
      message: 'Automated backup and cleanup completed successfully',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error in automated backup cron job:', error);
    return NextResponse.json({
      success: false,
      error: error.message,
      message: 'Automated backup failed',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}

/**
 * GET handler for cron job status/health check
 */
export async function GET(request) {
  try {
    // Verify the request is from Vercel Cron or admin
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      console.error('Unauthorized cron status request');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    return NextResponse.json({
      success: true,
      status: 'healthy',
      message: 'Backup cron job is ready',
      timestamp: new Date().toISOString(),
      environment: {
        nodeVersion: process.version,
        platform: process.platform,
        hasDatabase: !!process.env.DATABASE_URL,
        hasS3Config: !!(process.env.CLOUDFLARE_ACCESS_KEY_ID && process.env.CLOUDFLARE_SECRET_ACCESS_KEY)
      }
    });

  } catch (error) {
    console.error('Error in backup cron status check:', error);
    return NextResponse.json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
