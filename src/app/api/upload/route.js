import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { uploadFile } from '@/lib/s3';

export async function POST(request) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get the form data from the request
    const formData = await request.formData();
    const file = formData.get('file');
    const folder = formData.get('folder') || 'uploads';

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Generate a unique filename
    const timestamp = Date.now();
    const originalName = file.name;
    const fileExtension = originalName.split('.').pop();
    const sanitizedName = originalName.replace(/\s+/g, '-').replace(/[^a-zA-Z0-9.-]/g, '');
    const fileName = `${folder}/${timestamp}-${sanitizedName}`;

    // Create a File object that's compatible with the uploadFile function
    const fileObject = new File([await file.arrayBuffer()], fileName, { type: file.type });

    // Upload to S3
    const result = await uploadFile(fileObject);

    if (!result.success) {
      console.error('S3 upload error:', result.error);
      return NextResponse.json({ error: result.error || 'Failed to upload to storage' }, { status: 500 });
    }

    // Return the file URL
    return NextResponse.json({
      success: true,
      url: `/api/files/${fileName}`,
      fileName: fileName
    });
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 });
  }
}

// Set the maximum file size to 10MB
export const config = {
  api: {
    bodyParser: false,
  },
};
