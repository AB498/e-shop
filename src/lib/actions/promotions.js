'use server';

import { db } from '@/lib/db';
import { promotions, productPromotions } from '@/db/schema';
import { eq, desc, and, gte, lte, sql, or } from 'drizzle-orm';
import { uploadFromBuffer } from '@/lib/s3';

/**
 * Get all promotions with optional filtering
 * @param {object} options - Query options
 * @param {number} options.page - Page number (1-based)
 * @param {number} options.limit - Number of items per page
 * @param {string} options.type - Filter by promotion type
 * @param {string} options.position - Filter by position
 * @param {boolean} options.activeOnly - Only return active promotions
 * @returns {Promise<{promotions: Array, totalPromotions: number, totalPages: number}>}
 */
export async function getAllPromotions({
  page = 1,
  limit = 10,
  type = null,
  position = null,
  activeOnly = false,
  searchTerm = '',
} = {}) {
  try {
    const offset = (page - 1) * limit;

    // Build conditions based on filters
    let conditions = [];

    if (type) {
      conditions.push(eq(promotions.type, type));
    }

    if (position) {
      conditions.push(eq(promotions.position, position));
    }

    if (activeOnly) {
      conditions.push(eq(promotions.is_active, true));

      // Only include promotions that are currently active (within date range)
      const now = new Date();
      conditions.push(
        and(
          or(
            eq(promotions.start_date, null),
            lte(promotions.start_date, now)
          ),
          or(
            eq(promotions.end_date, null),
            gte(promotions.end_date, now)
          )
        )
      );
    }

    if (searchTerm) {
      conditions.push(
        or(
          sql`${promotions.title} ILIKE ${`%${searchTerm}%`}`,
          sql`${promotions.description} ILIKE ${`%${searchTerm}%`}`
        )
      );
    }

    // Get promotions with pagination
    const promotionsData = await db
      .select()
      .from(promotions)
      .where(conditions.length ? and(...conditions) : undefined)
      .orderBy(desc(promotions.priority), desc(promotions.created_at))
      .limit(limit)
      .offset(offset);

    // Get total count for pagination
    const [{ count }] = await db
      .select({ count: sql`count(*)` })
      .from(promotions)
      .where(conditions.length ? and(...conditions) : undefined);

    const totalPromotions = Number(count);
    const totalPages = Math.ceil(totalPromotions / limit);

    return {
      promotions: promotionsData,
      totalPromotions,
      totalPages,
      currentPage: page,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1
    };
  } catch (error) {
    console.error('Error fetching promotions:', error);
    throw new Error('Failed to fetch promotions');
  }
}

/**
 * Get active promotions for display on the frontend
 * @param {string} type - Promotion type (optional)
 * @param {string} position - Position (optional)
 * @param {number} limit - Maximum number of promotions to return
 * @returns {Promise<Array>} - Active promotions
 */
export async function getActivePromotions(type = null, position = null, limit = 10) {
  try {
    console.log(`Fetching active promotions: type=${type}, position=${position}, limit=${limit}`);
    const now = new Date();

    // Build conditions
    let conditions = [
      eq(promotions.is_active, true)
    ];

    // Add date conditions if needed
    // Commenting out for now as it might be causing issues
    /*
    conditions.push(
      and(
        or(
          eq(promotions.start_date, null),
          lte(promotions.start_date, now)
        ),
        or(
          eq(promotions.end_date, null),
          gte(promotions.end_date, now)
        )
      )
    );
    */

    if (type) {
      conditions.push(eq(promotions.type, type));
    }

    if (position) {
      conditions.push(eq(promotions.position, position));
    }

    // Get active promotions
    const query = db
      .select()
      .from(promotions)
      .where(and(...conditions))
      .orderBy(desc(promotions.priority), desc(promotions.created_at))
      .limit(limit);

    const activePromotions = await query;
    console.log(`Found ${activePromotions.length} active promotions`);

    // If no promotions found with type filter, try fetching with just position filter
    if (activePromotions.length === 0 && type) {
      console.log('No promotions found with type filter, trying with just position filter');
      const positionConditions = [eq(promotions.is_active, true)];

      if (position) {
        positionConditions.push(eq(promotions.position, position));
      }

      const positionPromotions = await db
        .select()
        .from(promotions)
        .where(and(...positionConditions))
        .orderBy(desc(promotions.priority), desc(promotions.created_at))
        .limit(limit);

      console.log(`Found ${positionPromotions.length} promotions with position filter`);

      if (positionPromotions.length > 0) {
        return positionPromotions;
      }
    }

    // If still no promotions found, try fetching without any filters
    if (activePromotions.length === 0) {
      console.log('No promotions found with filters, trying without filters');
      const allPromotions = await db
        .select()
        .from(promotions)
        .where(eq(promotions.is_active, true))
        .orderBy(desc(promotions.priority), desc(promotions.created_at))
        .limit(limit);

      console.log(`Found ${allPromotions.length} total active promotions in database`);

      if (allPromotions.length > 0) {
        console.log('Returning available promotions despite filter mismatch');
        return allPromotions;
      }
    }

    return activePromotions;
  } catch (error) {
    console.error('Error fetching active promotions:', error);
    console.error(error.stack);
    return [];
  }
}

/**
 * Get a promotion by ID
 * @param {number} id - Promotion ID
 * @returns {Promise<object|null>} - Promotion data
 */
export async function getPromotionById(id) {
  try {
    const [promotion] = await db
      .select()
      .from(promotions)
      .where(eq(promotions.id, id))
      .limit(1);

    return promotion || null;
  } catch (error) {
    console.error(`Error fetching promotion with ID ${id}:`, error);
    return null;
  }
}

/**
 * Get the next available promotion ID
 * @returns {Promise<number>} - Next available promotion ID
 */
export async function getNextPromotionId() {
  try {
    const [result] = await db
      .select({ maxId: sql`COALESCE(MAX(${promotions.id}), 0) + 1` })
      .from(promotions);

    return result?.maxId || 1;
  } catch (error) {
    console.error('Error fetching next promotion ID:', error);
    return 1;
  }
}

/**
 * Create a new promotion
 * @param {object} data - Promotion data
 * @param {File} imageFile - Image file (optional)
 * @returns {Promise<object|null>} - Created promotion
 */
export async function createPromotion(data, imageFile = null) {
  try {
    let imageUrl = data.image_url;

    // If image file is provided, upload it to S3
    if (imageFile) {
      console.log('Image file provided for upload:', {
        name: imageFile.name,
        type: imageFile.type,
        size: imageFile.size
      });

      const buffer = await imageFile.arrayBuffer();
      const fileName = `promotions/${Date.now()}-${imageFile.name.replace(/\s+/g, '-')}`;
      const contentType = imageFile.type;

      console.log('Uploading image to S3:', { fileName, contentType });

      const uploadResult = await uploadFromBuffer(
        Buffer.from(buffer),
        fileName,
        contentType
      );

      if (uploadResult.success) {
        // Use the URL returned from the uploadFromBuffer function
        imageUrl = uploadResult.url;
        console.log('Image uploaded successfully, URL:', imageUrl);
      } else {
        console.error('Failed to upload image:', uploadResult.error);
        throw new Error('Failed to upload image');
      }
    }

    // Ensure we have an image URL
    if (!imageUrl) {
      // Use a default image if none is provided
      imageUrl = '/images/default-promotion.jpg';
      console.log('Using default image URL:', imageUrl);
    }

    // Create promotion - ensure we don't include an ID to let the database auto-generate it
    // Check if data contains an id and remove it to prevent duplicate key errors
    const { id, ...insertData } = data;

    // Log the data being inserted for debugging
    console.log('Creating promotion with data:', {
      title: insertData.title,
      image_url: imageUrl ? imageUrl.substring(0, 50) + '...' : 'null',
      type: insertData.type || 'banner',
    });

    // Create promotion
    const result = await db.insert(promotions).values({
      title: insertData.title,
      description: insertData.description || null,
      image_url: imageUrl,
      link_url: insertData.link_url || null,
      type: insertData.type || 'banner',
      position: insertData.position || 'home',
      start_date: insertData.start_date ? new Date(insertData.start_date) : null,
      end_date: insertData.end_date ? new Date(insertData.end_date) : null,
      is_active: insertData.is_active !== undefined ? insertData.is_active : true,
      priority: insertData.priority || 0,
      discount: insertData.discount || null,
    }).returning();

    return result.length ? result[0] : null;
  } catch (error) {
    console.error('Error creating promotion:', error);
    throw new Error('Failed to create promotion');
  }
}

/**
 * Update a promotion
 * @param {number} id - Promotion ID
 * @param {object} data - Updated promotion data
 * @param {File} imageFile - New image file (optional)
 * @returns {Promise<object|null>} - Updated promotion
 */
export async function updatePromotion(id, data, imageFile = null) {
  try {
    let imageUrl = data.image_url;

    // If image file is provided, upload it to S3
    if (imageFile) {
      console.log('Image file provided for update:', {
        name: imageFile.name,
        type: imageFile.type,
        size: imageFile.size
      });

      const buffer = await imageFile.arrayBuffer();
      const fileName = `promotions/${Date.now()}-${imageFile.name.replace(/\s+/g, '-')}`;
      const contentType = imageFile.type;

      console.log('Uploading image to S3 for update:', { fileName, contentType });

      const uploadResult = await uploadFromBuffer(
        Buffer.from(buffer),
        fileName,
        contentType
      );

      if (uploadResult.success) {
        // Use the URL returned from the uploadFromBuffer function
        imageUrl = uploadResult.url;
        console.log('Image uploaded successfully, URL:', imageUrl);
      } else {
        console.error('Failed to upload image:', uploadResult.error);
        throw new Error('Failed to upload image');
      }
    }

    // Ensure we have an image URL
    if (!imageUrl) {
      // Use a default image if none is provided
      imageUrl = '/images/default-promotion.jpg';
      console.log('Using default image URL:', imageUrl);
    }

    // Check if discount has changed
    const oldPromotion = await getPromotionById(id);
    const discountChanged = oldPromotion && oldPromotion.discount !== data.discount;
    const newDiscount = data.discount || null;

    // Use a transaction to update both the promotion and its related product-promotion entries
    return await db.transaction(async (tx) => {
      // Update promotion
      const result = await tx.update(promotions)
        .set({
          title: data.title,
          description: data.description !== undefined ? data.description : null,
          image_url: imageUrl,
          link_url: data.link_url !== undefined ? data.link_url : null,
          type: data.type || 'banner',
          position: data.position || 'home',
          start_date: data.start_date ? new Date(data.start_date) : null,
          end_date: data.end_date ? new Date(data.end_date) : null,
          is_active: data.is_active !== undefined ? data.is_active : true,
          priority: data.priority !== undefined ? data.priority : 0,
          discount: newDiscount,
          updated_at: new Date(),
        })
        .where(eq(promotions.id, id))
        .returning();

      // If discount has changed, update all related product-promotion entries
      if (discountChanged) {
        const discountValue = newDiscount ? parseFloat(newDiscount) : 0;

        // Update all product-promotion entries for this promotion
        await tx.update(productPromotions)
          .set({
            discount_percentage: discountValue,
            updated_at: new Date(),
          })
          .where(eq(productPromotions.promotion_id, id));

        console.log(`Updated discount for all products in promotion ID ${id} to ${discountValue}%`);
      }

      return result.length ? result[0] : null;
    });
  } catch (error) {
    console.error(`Error updating promotion with ID ${id}:`, error);
    throw new Error('Failed to update promotion');
  }
}

/**
 * Delete a promotion
 * @param {number} id - Promotion ID
 * @returns {Promise<boolean>} - Success status
 */
export async function deletePromotion(id) {
  try {
    // Use a transaction to ensure both operations succeed or fail together
    return await db.transaction(async (tx) => {
      console.log(`Deleting promotion with ID ${id}...`);

      // First, delete all product_promotions entries that reference this promotion
      console.log(`Deleting product_promotions entries for promotion ID ${id}...`);
      const deletedRelations = await tx.delete(productPromotions)
        .where(eq(productPromotions.promotion_id, id))
        .returning();

      console.log(`Deleted ${deletedRelations.length} product_promotions entries for promotion ID ${id}`);

      // Then, delete the promotion itself
      const result = await tx.delete(promotions)
        .where(eq(promotions.id, id))
        .returning();

      console.log(`Deleted promotion with ID ${id}: ${result.length > 0 ? 'success' : 'failed'}`);

      return result.length > 0;
    });
  } catch (error) {
    console.error(`Error deleting promotion with ID ${id}:`, error);
    throw new Error('Failed to delete promotion');
  }
}
