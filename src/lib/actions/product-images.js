'use server';

import { db } from '@/lib/db';
import { productImages } from '@/db/schema';
import { eq, and } from 'drizzle-orm';

/**
 * Add multiple images to a product
 * @param {number} productId - Product ID
 * @param {Array} images - Array of image objects with url, key, altText, position, isPrimary
 * @returns {Promise<Array>} - Array of created product images
 */
export async function addProductImages(productId, images) {
  try {
    if (!productId || !images || !Array.isArray(images) || images.length === 0) {
      throw new Error('Invalid product ID or images');
    }
    
    // Ensure only one image is primary
    let hasPrimary = false;
    const processedImages = images.map((image, index) => {
      // If this image is marked as primary and we already have a primary image,
      // make it non-primary
      if (image.isPrimary && hasPrimary) {
        return { ...image, isPrimary: false };
      }

      // If this is the first primary image, mark it as such
      if (image.isPrimary) {
        hasPrimary = true;
      }

      
      return image;
    });

    // If we don't have a primary image still,
    // make the first image primary
    if (!hasPrimary) {
      hasPrimary = true;
      return processedImages[0].isPrimary = true;
    }

    // Insert images into database
    const insertedImages = [];
    for (const image of processedImages) {
      const result = await db.insert(productImages).values({
        product_id: productId,
        url: image.url,
        key: image.key,
        alt_text: image.altText || '',
        position: image.position || 0,
        is_primary: image.isPrimary || false,
      }).returning();

      if (result.length > 0) {
        insertedImages.push(result[0]);
      }
    }

    return insertedImages;
  } catch (error) {
    console.error('Error adding product images:', error);
    throw error;
  }
}

/**
 * Get all images for a product
 * @param {number} productId - Product ID
 * @returns {Promise<Array>} - Array of product images
 */
export async function getProductImages(productId) {
  try {
    if (!productId) {
      throw new Error('Invalid product ID');
    }

    const images = await db
      .select({
        id: productImages.id,
        url: productImages.url,
        key: productImages.key,
        altText: productImages.alt_text,
        position: productImages.position,
        isPrimary: productImages.is_primary,
      })
      .from(productImages)
      .where(eq(productImages.product_id, productId))
      .orderBy(productImages.position);

    return images;
  } catch (error) {
    console.error('Error getting product images:', error);
    throw error;
  }
}

/**
 * Update a product image
 * @param {number} imageId - Image ID
 * @param {Object} imageData - Image data to update
 * @returns {Promise<Object>} - Updated image
 */
export async function updateProductImage(imageId, imageData) {
  try {
    if (!imageId) {
      throw new Error('Invalid image ID');
    }

    const result = await db
      .update(productImages)
      .set({
        url: imageData.url,
        key: imageData.key,
        alt_text: imageData.altText || productImages.alt_text,
        position: imageData.position !== undefined ? imageData.position : productImages.position,
        is_primary: imageData.isPrimary !== undefined ? imageData.isPrimary : productImages.is_primary,
      })
      .where(eq(productImages.id, imageId))
      .returning();

    if (result.length === 0) {
      throw new Error('Image not found');
    }

    return result[0];
  } catch (error) {
    console.error('Error updating product image:', error);
    throw error;
  }
}

/**
 * Delete a product image
 * @param {number} imageId - Image ID
 * @returns {Promise<boolean>} - True if successful
 */
export async function deleteProductImage(imageId) {
  try {
    if (!imageId) {
      throw new Error('Invalid image ID');
    }

    const result = await db
      .delete(productImages)
      .where(eq(productImages.id, imageId))
      .returning();

    return result.length > 0;
  } catch (error) {
    console.error('Error deleting product image:', error);
    throw error;
  }
}

/**
 * Delete all images for a product
 * @param {number} productId - Product ID
 * @returns {Promise<number>} - Number of deleted images
 */
export async function deleteAllProductImages(productId) {
  try {
    if (!productId) {
      throw new Error('Invalid product ID');
    }

    const result = await db
      .delete(productImages)
      .where(eq(productImages.product_id, productId))
      .returning();

    return result.length;
  } catch (error) {
    console.error('Error deleting all product images:', error);
    throw error;
  }
}
