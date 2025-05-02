'use server';

import { db } from '@/lib/db';
import { files } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';
import { deleteFile as deleteS3File } from '@/lib/s3';

/**
 * Get all files
 * @returns {Promise<Array>} - List of files
 */
export async function getAllFiles() {
  try {
    const filesList = await db
      .select({
        id: files.id,
        key: files.key,
        url: files.url,
        created_at: files.created_at,
      })
      .from(files)
      .orderBy(desc(files.created_at));

    return filesList;
  } catch (error) {
    console.error('Error fetching files:', error);
    return [];
  }
}

/**
 * Get file by ID
 * @param {number} id - File ID
 * @returns {Promise<object|null>} - File information
 */
export async function getFileById(id) {
  try {
    const fileData = await db
      .select({
        id: files.id,
        key: files.key,
        url: files.url,
        created_at: files.created_at,
      })
      .from(files)
      .where(eq(files.id, id))
      .limit(1);

    return fileData.length ? fileData[0] : null;
  } catch (error) {
    console.error(`Error fetching file with ID ${id}:`, error);
    return null;
  }
}

/**
 * Delete a file
 * @param {number} id - File ID
 * @returns {Promise<boolean>} - Success status
 */
export async function deleteFile(id) {
  try {
    // Get file info first to get the key for S3 deletion
    const fileData = await getFileById(id);
    
    if (!fileData) {
      throw new Error(`File with ID ${id} not found`);
    }
    
    // Delete from database
    await db.delete(files).where(eq(files.id, id));
    
    // Try to delete from S3 if possible
    try {
      await deleteS3File(fileData.key);
    } catch (s3Error) {
      console.error(`Error deleting file from S3: ${s3Error.message}`);
      // Continue even if S3 deletion fails
    }
    
    return true;
  } catch (error) {
    console.error(`Error deleting file with ID ${id}:`, error);
    return false;
  }
}

/**
 * Get file statistics
 * @returns {Promise<object>} - File statistics
 */
export async function getFileStats() {
  try {
    const totalFiles = await db
      .select({ count: sql`count(*)` })
      .from(files);
    
    const recentFiles = await db
      .select({
        id: files.id,
        key: files.key,
        url: files.url,
        created_at: files.created_at,
      })
      .from(files)
      .orderBy(desc(files.created_at))
      .limit(5);

    return {
      total: parseInt(totalFiles[0].count),
      recent: recentFiles
    };
  } catch (error) {
    console.error('Error fetching file statistics:', error);
    return { total: 0, recent: [] };
  }
}
