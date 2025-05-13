import { NextResponse } from 'next/server';
import { getFileUrl } from '@/lib/s3';

export async function GET(request, props) {
  const params = await props.params;
  try {
    // Get the file path from the URL
    const filePath = params.path.join('/');

    if (!filePath) {
      return NextResponse.json({ error: 'No file path provided' }, { status: 400 });
    }

    // Get the file URL from S3
    const result = await getFileUrl(filePath);

    if (!result.success) {
      console.error('Error getting file URL:', result.error);
      // Return a placeholder image instead of an error
      return NextResponse.redirect(new URL('/images/placeholder-category.svg', request.url));
    }

    // Redirect to the presigned URL
    return NextResponse.redirect(result.url);
  } catch (error) {
    console.error('Error getting file:', error);
    // Return a placeholder image instead of an error
    return NextResponse.redirect(new URL('/images/placeholder-category.svg', request.url));
  }
}
