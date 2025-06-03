/**
 * Client-side file upload utility using S3 presigned URLs
 * This bypasses Vercel's 4.5MB limit by uploading directly to S3
 */

/**
 * Upload a file directly to S3 using presigned URLs
 * @param {File} file - The file to upload
 * @param {string} folder - The folder to upload to (default: 'uploads')
 * @param {function} onProgress - Optional progress callback (progress: number 0-100)
 * @returns {Promise<{success: boolean, url?: string, key?: string, error?: string}>}
 */
export async function uploadFileToS3(file, folder = 'uploads', onProgress = null) {
  try {
    // Validate file
    if (!file || !(file instanceof File)) {
      throw new Error('Invalid file provided');
    }

    // Validate file size (max 50MB for client-side upload)
    const maxSize = 50 * 1024 * 1024; // 50MB
    if (file.size > maxSize) {
      throw new Error(`File size exceeds ${maxSize / (1024 * 1024)}MB limit`);
    }

    // Step 1: Get presigned URL from our API
    const presignedResponse = await fetch(
      `/api/s3-upload?fileName=${encodeURIComponent(file.name)}&contentType=${encodeURIComponent(file.type)}&folder=${encodeURIComponent(folder)}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!presignedResponse.ok) {
      const errorData = await presignedResponse.json();
      throw new Error(errorData.error || 'Failed to get presigned URL');
    }

    const { presignedUrl, publicUrl, key } = await presignedResponse.json();

    // Step 2: Upload file directly to S3 using presigned URL
    const uploadResponse = await fetch(presignedUrl, {
      method: 'PUT',
      body: file,
      headers: {
        'Content-Type': file.type,
      },
    });

    if (!uploadResponse.ok) {
      throw new Error(`Upload failed with status: ${uploadResponse.status}`);
    }

    // Step 3: Return success response
    return {
      success: true,
      url: publicUrl,
      key: key,
      fileName: key
    };

  } catch (error) {
    console.error('Client-side upload error:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Upload multiple files to S3 using presigned URLs
 * @param {File[]} files - Array of files to upload
 * @param {string} folder - The folder to upload to (default: 'uploads')
 * @param {function} onProgress - Optional progress callback (fileIndex: number, progress: number, fileName: string)
 * @returns {Promise<{success: boolean, results: Array, errors: Array}>}
 */
export async function uploadMultipleFilesToS3(files, folder = 'uploads', onProgress = null) {
  const results = [];
  const errors = [];

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    
    try {
      if (onProgress) {
        onProgress(i, 0, file.name);
      }

      const result = await uploadFileToS3(file, folder, (progress) => {
        if (onProgress) {
          onProgress(i, progress, file.name);
        }
      });

      if (result.success) {
        results.push({
          file: file.name,
          url: result.url,
          key: result.key
        });
      } else {
        errors.push({
          file: file.name,
          error: result.error
        });
      }

      if (onProgress) {
        onProgress(i, 100, file.name);
      }

    } catch (error) {
      errors.push({
        file: file.name,
        error: error.message
      });
    }
  }

  return {
    success: errors.length === 0,
    results,
    errors
  };
}

/**
 * Upload file with progress tracking using XMLHttpRequest
 * This provides more detailed progress information than fetch
 * @param {File} file - The file to upload
 * @param {string} folder - The folder to upload to
 * @param {function} onProgress - Progress callback (progress: number 0-100)
 * @returns {Promise<{success: boolean, url?: string, key?: string, error?: string}>}
 */
export async function uploadFileToS3WithProgress(file, folder = 'uploads', onProgress = null) {
  try {
    // Validate file
    if (!file || !(file instanceof File)) {
      throw new Error('Invalid file provided');
    }

    // Validate file size
    const maxSize = 50 * 1024 * 1024; // 50MB
    if (file.size > maxSize) {
      throw new Error(`File size exceeds ${maxSize / (1024 * 1024)}MB limit`);
    }

    // Step 1: Get presigned URL
    const presignedResponse = await fetch(
      `/api/s3-upload?fileName=${encodeURIComponent(file.name)}&contentType=${encodeURIComponent(file.type)}&folder=${encodeURIComponent(folder)}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!presignedResponse.ok) {
      const errorData = await presignedResponse.json();
      throw new Error(errorData.error || 'Failed to get presigned URL');
    }

    const { presignedUrl, publicUrl, key } = await presignedResponse.json();

    // Step 2: Upload with XMLHttpRequest for progress tracking
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();

      // Track upload progress
      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable && onProgress) {
          const progress = Math.round((event.loaded / event.total) * 100);
          onProgress(progress);
        }
      });

      // Handle completion
      xhr.addEventListener('load', () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve({
            success: true,
            url: publicUrl,
            key: key,
            fileName: key
          });
        } else {
          reject(new Error(`Upload failed with status: ${xhr.status}`));
        }
      });

      // Handle errors
      xhr.addEventListener('error', () => {
        reject(new Error('Upload failed due to network error'));
      });

      // Start upload
      xhr.open('PUT', presignedUrl);
      xhr.setRequestHeader('Content-Type', file.type);
      xhr.send(file);
    });

  } catch (error) {
    console.error('Client-side upload with progress error:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Fallback to server-side upload if client-side fails
 * @param {File} file - The file to upload
 * @param {string} folder - The folder to upload to
 * @returns {Promise<{success: boolean, url?: string, key?: string, error?: string}>}
 */
export async function uploadFileWithFallback(file, folder = 'uploads') {
  // Try client-side upload first
  const clientResult = await uploadFileToS3(file, folder);
  
  if (clientResult.success) {
    return clientResult;
  }

  console.warn('Client-side upload failed, falling back to server-side upload:', clientResult.error);

  // Fallback to server-side upload
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', folder);

    const response = await fetch('/api/s3-upload', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Server-side upload failed');
    }

    const data = await response.json();
    return {
      success: true,
      url: data.url,
      key: data.key || data.fileName,
      fileName: data.fileName
    };

  } catch (error) {
    return {
      success: false,
      error: `Both client-side and server-side uploads failed: ${error.message}`
    };
  }
}
