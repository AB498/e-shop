import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { 
  createDatabaseBackup, 
  getAllBackups, 
  deleteBackup,
  cleanupOldBackups 
} from '@/lib/backup';

/**
 * GET handler to fetch all database backups
 */
export async function GET(request) {
  try {
    // Check authentication and admin role
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get query parameters for pagination
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    // Fetch backups
    const result = await getAllBackups(limit, offset);

    if (!result.success) {
      return NextResponse.json({ 
        error: result.error || 'Failed to fetch backups' 
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      backups: result.backups,
      total: result.total,
      limit,
      offset
    });

  } catch (error) {
    console.error('Error in GET /api/admin/backups:', error);
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 });
  }
}

/**
 * POST handler to create a new database backup or perform cleanup
 */
export async function POST(request) {
  try {
    // Check authentication and admin role
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { action } = body;

    if (action === 'create') {
      // Create a new backup
      console.log('Creating manual database backup...');
      const result = await createDatabaseBackup('admin');

      if (!result.success) {
        return NextResponse.json({ 
          error: result.error || 'Failed to create backup',
          message: result.message 
        }, { status: 500 });
      }

      return NextResponse.json({
        success: true,
        backup: result.backup,
        message: result.message
      });

    } else if (action === 'cleanup') {
      // Clean up old backups
      console.log('Cleaning up old backups...');
      const result = await cleanupOldBackups();

      if (!result.success) {
        return NextResponse.json({ 
          error: result.error || 'Failed to cleanup backups' 
        }, { status: 500 });
      }

      return NextResponse.json({
        success: true,
        deletedCount: result.deletedCount,
        totalFound: result.totalFound,
        errors: result.errors,
        message: result.message
      });

    } else {
      return NextResponse.json({ 
        error: 'Invalid action. Use "create" or "cleanup"' 
      }, { status: 400 });
    }

  } catch (error) {
    console.error('Error in POST /api/admin/backups:', error);
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 });
  }
}

/**
 * DELETE handler to delete a specific backup
 */
export async function DELETE(request) {
  try {
    // Check authentication and admin role
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const backupId = parseInt(searchParams.get('id'));

    if (!backupId || isNaN(backupId)) {
      return NextResponse.json({ 
        error: 'Valid backup ID is required' 
      }, { status: 400 });
    }

    console.log('Deleting backup with ID:', backupId);
    const result = await deleteBackup(backupId);

    if (!result.success) {
      return NextResponse.json({ 
        error: result.error || 'Failed to delete backup' 
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: result.message
    });

  } catch (error) {
    console.error('Error in DELETE /api/admin/backups:', error);
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 });
  }
}
