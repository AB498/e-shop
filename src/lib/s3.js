import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand, ListObjectsV2Command } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const s3Client = new S3Client({
  region: 'auto',
  endpoint: `https://ee1b0a70a9a38c79368106e3dd1c1bda.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.CLOUDFLARE_ACCESS_KEY_ID,
    secretAccessKey: process.env.CLOUDFLARE_SECRET_ACCESS_KEY,
  },
});

const BUCKET_NAME = 'main-bucket';

// Upload a file from a File object (browser)
export async function uploadFile(file) {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: file.name,
      Body: buffer,
      ContentType: file.type,
    });

    const response = await s3Client.send(command);
    return { success: true, data: response };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// Get a file's download URL (presigned URL)
export async function getFileUrl(fileName, expiresIn = 3600) {
  try {
    const command = new GetObjectCommand({
      Bucket: BUCKET_NAME,
      Key: fileName,
    });

    const url = await getSignedUrl(s3Client, command, { expiresIn });
    return { success: true, url };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// Delete a file
export async function deleteFile(fileName) {
  try {
    const command = new DeleteObjectCommand({
      Bucket: BUCKET_NAME,
      Key: fileName,
    });

    const response = await s3Client.send(command);
    return { success: true, data: response };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// List all files in the bucket
export async function listFiles(prefix = '') {
  try {
    const command = new ListObjectsV2Command({
      Bucket: BUCKET_NAME,
      Prefix: prefix,
      Delimiter: '/',
    });

    const response = await s3Client.send(command);

    return {
      success: true,
      files: response.Contents?.map(file => ({
        name: file.Key,
        size: file.Size,
        lastModified: file.LastModified,
        type: 'file',
      })) || [],
      prefixes: response.CommonPrefixes?.map(prefix => ({
        name: prefix.Prefix,
        type: 'directory',
      })) || [],
    };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// Get the directory structure of the bucket
export async function getDirectoryStructure(prefix = '') {
  try {
    const { success, files, prefixes, error } = await listFiles(prefix);

    if (!success) {
      return { success: false, error };
    }

    // Filter out files that are actually just empty "directory markers"
    const actualFiles = files.filter(file => {
      // Skip files that end with '/' as they are directory markers
      return !file.name.endsWith('/') || file.size > 0;
    });

    return {
      success: true,
      path: prefix,
      directories: prefixes,
      files: actualFiles,
    };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// Upload a file from a buffer (useful for handling file uploads from forms)
export async function uploadFromBuffer(buffer, fileName, contentType) {
  try {
    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: fileName,
      Body: buffer,
      ContentType: contentType,
    });

    const response = await s3Client.send(command);
    return { success: true, data: response };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// Get file type based on file extension
export function getFileType(fileName) {
  const extension = fileName.split('.').pop().toLowerCase();

  const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp', 'bmp', 'ico'];
  const documentExtensions = ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt', 'rtf', 'csv'];
  const videoExtensions = ['mp4', 'webm', 'mov', 'avi', 'wmv', 'flv', 'mkv'];
  const audioExtensions = ['mp3', 'wav', 'ogg', 'flac', 'aac'];

  if (imageExtensions.includes(extension)) return 'image';
  if (documentExtensions.includes(extension)) return 'document';
  if (videoExtensions.includes(extension)) return 'video';
  if (audioExtensions.includes(extension)) return 'audio';

  return 'other';
}
