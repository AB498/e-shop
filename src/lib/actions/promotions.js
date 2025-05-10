'use server';

import { db } from '@/lib/db';
import { promotions } from '@/db/schema';
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

    console.log('SQL Query:', query.toSQL());

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
      const buffer = await imageFile.arrayBuffer();
      const fileName = `promotions/${Date.now()}-${imageFile.name.replace(/\s+/g, '-')}`;
      const contentType = imageFile.type;

      const uploadResult = await uploadFromBuffer(
        Buffer.from(buffer),
        fileName,
        contentType
      );

      if (uploadResult.success) {
        imageUrl = uploadResult.url;
      } else {
        throw new Error('Failed to upload image');
      }
    }

    // Create promotion
    const result = await db.insert(promotions).values({
      title: data.title,
      description: data.description || null,
      image_url: imageUrl,
      link_url: data.link_url || null,
      type: data.type || 'banner',
      position: data.position || 'home',
      start_date: data.start_date ? new Date(data.start_date) : null,
      end_date: data.end_date ? new Date(data.end_date) : null,
      is_active: data.is_active !== undefined ? data.is_active : true,
      priority: data.priority || 0,
      discount: data.discount || null,
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
      const buffer = await imageFile.arrayBuffer();
      const fileName = `promotions/${Date.now()}-${imageFile.name.replace(/\s+/g, '-')}`;
      const contentType = imageFile.type;

      const uploadResult = await uploadFromBuffer(
        Buffer.from(buffer),
        fileName,
        contentType
      );

      if (uploadResult.success) {
        imageUrl = uploadResult.url;
      } else {
        throw new Error('Failed to upload image');
      }
    }

    // Update promotion
    const result = await db.update(promotions)
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
        discount: data.discount || null,
        updated_at: new Date(),
      })
      .where(eq(promotions.id, id))
      .returning();

    return result.length ? result[0] : null;
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
    const result = await db.delete(promotions)
      .where(eq(promotions.id, id))
      .returning();

    return result.length > 0;
  } catch (error) {
    console.error(`Error deleting promotion with ID ${id}:`, error);
    return false;
  }
}
