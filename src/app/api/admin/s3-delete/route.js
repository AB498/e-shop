import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { deleteFile } from '@/lib/s3';

// POST handler to delete a file directly from S3
export async function POST(request) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get the file key from the request body
    const body = await request.json();
    const { key } = body;

    if (!key) {
      return NextResponse.json({ error: 'File key is required' }, { status: 400 });
    }

    // Delete the file from S3
    const result = await deleteFile(key);

    if (!result.success) {
      return NextResponse.json({ error: result.error || 'Failed to delete file' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting file from S3:', error);
    return NextResponse.json({ error: 'Failed to delete file' }, { status: 500 });
  }
}
