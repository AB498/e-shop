import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { getDirectoryStructure, getFileUrl, getFileType } from '@/lib/s3';

// GET handler to fetch directory structure
export async function GET(request) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get the prefix from the query parameters
    const { searchParams } = new URL(request.url);
    const prefix = searchParams.get('prefix') || '';

    // Get the directory structure
    const result = await getDirectoryStructure(prefix);

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    // Generate presigned URLs for files and add file type information
    const filesWithUrls = await Promise.all(
      result.files.map(async (file) => {
        const urlResult = await getFileUrl(file.name);
        return {
          ...file,
          url: urlResult.success ? urlResult.url : null,
          fileType: getFileType(file.name),
          fileName: file.name.split('/').pop(),
        };
      })
    );

    return NextResponse.json({
      success: true,
      path: result.path,
      directories: result.directories.map(dir => ({
        ...dir,
        name: dir.name.endsWith('/') ? dir.name : `${dir.name}/`,
        displayName: dir.name.split('/').filter(Boolean).pop() || '/',
      })),
      files: filesWithUrls,
      breadcrumbs: getBreadcrumbs(prefix),
    });
  } catch (error) {
    console.error('Error fetching directory structure:', error);
    return NextResponse.json({ error: 'Failed to fetch directory structure' }, { status: 500 });
  }
}

// Helper function to generate breadcrumbs from a path
function getBreadcrumbs(path) {
  if (!path) {
    return [{ name: 'Root', path: '' }];
  }

  const parts = path.split('/').filter(Boolean);
  const breadcrumbs = [{ name: 'Root', path: '' }];

  let currentPath = '';
  for (let i = 0; i < parts.length; i++) {
    currentPath += parts[i] + '/';
    breadcrumbs.push({
      name: parts[i],
      path: currentPath,
    });
  }

  return breadcrumbs;
}
