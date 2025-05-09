import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { db } from '@/lib/db';
import { files } from '@/db/schema';
import { eq } from 'drizzle-orm';

// GET handler to find a file by its key
export async function GET(request) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get the key from the query parameters
    const { searchParams } = new URL(request.url);
    const key = searchParams.get('key');

    if (!key) {
      return NextResponse.json({ error: 'File key is required' }, { status: 400 });
    }

    // Find the file in the database
    const fileData = await db
      .select({
        id: files.id,
        key: files.key,
        url: files.url,
        created_at: files.created_at,
      })
      .from(files)
      .where(eq(files.key, key))
      .limit(1);

    if (fileData.length === 0) {
      return NextResponse.json({ error: 'File not found' }, { status: 404 });
    }

    return NextResponse.json(fileData[0]);
  } catch (error) {
    console.error('Error finding file by key:', error);
    return NextResponse.json({ error: 'Failed to find file' }, { status: 500 });
  }
}
