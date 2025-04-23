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
    });

    const response = await s3Client.send(command);
    return { 
      success: true, 
      files: response.Contents?.map(file => ({
        name: file.Key,
        size: file.Size,
        lastModified: file.LastModified,
      })) || []
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
