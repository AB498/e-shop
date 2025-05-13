import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { getFileById, deleteFile } from '@/lib/actions/files';

// GET handler to fetch a specific file
export async function GET(request, props) {
  const params = await props.params;
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await params;
    const { id } = params;
    
    // Validate ID
    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json({ error: 'Invalid file ID' }, { status: 400 });
    }

    // Get file by ID
    const file = await getFileById(parseInt(id));
    
    if (!file) {
      return NextResponse.json({ error: 'File not found' }, { status: 404 });
    }

    return NextResponse.json(file);
  } catch (error) {
    console.error(`Error fetching file with ID ${params.id}:`, error);
    return NextResponse.json({ error: 'Failed to fetch file' }, { status: 500 });
  }
}

// DELETE handler to delete a file
export async function DELETE(request, props) {
  const params = await props.params;
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await params;
    const { id } = params;
    
    // Validate ID
    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json({ error: 'Invalid file ID' }, { status: 400 });
    }

    // Delete file
    const success = await deleteFile(parseInt(id));
    
    if (!success) {
      return NextResponse.json({ error: 'Failed to delete file' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(`Error deleting file with ID ${params.id}:`, error);
    return NextResponse.json({ error: 'Failed to delete file' }, { status: 500 });
  }
}
