import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { getBackupById } from '@/lib/backup';
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';

// S3 Client configuration
const s3Client = new S3Client({
  region: 'auto',
  endpoint: `https://ee1b0a70a9a38c79368106e3dd1c1bda.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.CLOUDFLARE_ACCESS_KEY_ID,
    secretAccessKey: process.env.CLOUDFLARE_SECRET_ACCESS_KEY,
  },
});

const BUCKET_NAME = 'main-bucket';

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
 * GET handler to download a backup file
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
    const backupResult = await getBackupById(backupId);
    if (!backupResult.success) {
      return NextResponse.json({ 
        error: backupResult.error || 'Backup not found' 
      }, { status: 404 });
    }

    const backup = backupResult.backup;
    
    if (backup.status !== 'completed') {
      return NextResponse.json({ 
        error: 'Cannot download incomplete backup' 
      }, { status: 400 });
    }

    console.log(`Admin ${session.user.email} downloading backup: ${backup.filename}`);

    try {
      // Download backup from S3
      const getCommand = new GetObjectCommand({
        Bucket: BUCKET_NAME,
        Key: backup.s3_key
      });

      const s3Response = await s3Client.send(getCommand);
      const backupData = await streamToBuffer(s3Response.Body);

      console.log(`Backup downloaded from S3, size: ${(backupData.length / 1024 / 1024).toFixed(2)} MB`);

      // Return the file as a download
      return new NextResponse(backupData, {
        status: 200,
        headers: {
          'Content-Type': 'application/sql',
          'Content-Disposition': `attachment; filename="${backup.filename}"`,
          'Content-Length': backupData.length.toString(),
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      });

    } catch (s3Error) {
      console.error('Error downloading from S3:', s3Error);
      
      if (s3Error.name === 'NoSuchKey') {
        return NextResponse.json({ 
          error: 'Backup file not found in storage' 
        }, { status: 404 });
      }
      
      return NextResponse.json({ 
        error: 'Failed to download backup file from storage' 
      }, { status: 500 });
    }

  } catch (error) {
    console.error('Error in GET /api/admin/backups/[id]/download:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      message: 'An unexpected error occurred during download'
    }, { status: 500 });
  }
}
