import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { restoreFromBackup, getBackupById } from '@/lib/backup';

/**
 * POST handler to restore database from a specific backup
 */
export async function POST(request, { params }) {
  try {
    // Check authentication and admin role
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const backupId = parseInt(params.id);

    if (!backupId || isNaN(backupId)) {
      return NextResponse.json({ 
        error: 'Valid backup ID is required' 
      }, { status: 400 });
    }

    // Verify backup exists and is valid
    const backupCheck = await getBackupById(backupId);
    if (!backupCheck.success) {
      return NextResponse.json({ 
        error: backupCheck.error || 'Backup not found' 
      }, { status: 404 });
    }

    const backup = backupCheck.backup;
    
    if (backup.status !== 'completed') {
      return NextResponse.json({ 
        error: 'Cannot restore from incomplete backup' 
      }, { status: 400 });
    }

    console.log(`Admin ${session.user.email} initiating database restore from backup: ${backup.filename}`);

    // Perform the restore
    const result = await restoreFromBackup(backupId);

    if (!result.success) {
      console.error('Database restore failed:', result.error);
      return NextResponse.json({ 
        error: result.error || 'Failed to restore database',
        message: result.message 
      }, { status: 500 });
    }

    console.log('Database restore completed successfully');

    return NextResponse.json({
      success: true,
      message: result.message,
      backup: result.backup,
      restoredAt: result.restoredAt,
      restoredBy: session.user.email
    });

  } catch (error) {
    console.error('Error in POST /api/admin/backups/[id]/restore:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      message: 'An unexpected error occurred during restore'
    }, { status: 500 });
  }
}

/**
 * GET handler to get restore information for a backup
 */
export async function GET(request, { params }) {
  try {
    // Check authentication and admin role
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const backupId = parseInt(params.id);

    if (!backupId || isNaN(backupId)) {
      return NextResponse.json({ 
        error: 'Valid backup ID is required' 
      }, { status: 400 });
    }

    // Get backup details
    const result = await getBackupById(backupId);

    if (!result.success) {
      return NextResponse.json({ 
        error: result.error || 'Backup not found' 
      }, { status: 404 });
    }

    const backup = result.backup;

    // Return backup information and restore readiness
    return NextResponse.json({
      success: true,
      backup: backup,
      canRestore: backup.status === 'completed',
      restoreInfo: {
        filename: backup.filename,
        size: backup.file_size,
        createdAt: backup.created_at,
        createdBy: backup.created_by,
        tablesCount: backup.metadata?.tables_backed_up || 'Unknown'
      }
    });

  } catch (error) {
    console.error('Error in GET /api/admin/backups/[id]/restore:', error);
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 });
  }
}
