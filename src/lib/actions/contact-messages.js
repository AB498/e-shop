'use server';

import { db } from '@/lib/db';
import { contactMessages } from '@/db/schema';
import { eq, desc, and, sql } from 'drizzle-orm';

/**
 * Create a new contact message
 * @param {Object} data - Contact message data
 * @returns {Promise<Object>} - Created contact message
 */
export async function createContactMessage(data) {
  try {
    // Validate required fields
    if (!data.name || !data.email || !data.message) {
      throw new Error('Name, email, and message are required');
    }

    // Insert contact message
    const result = await db.insert(contactMessages).values({
      name: data.name,
      email: data.email,
      phone: data.phone || null,
      message: data.message,
      status: 'new',
      created_at: new Date(),
      updated_at: new Date(),
    }).returning();

    return result[0];
  } catch (error) {
    console.error('Error creating contact message:', error);
    throw error;
  }
}

/**
 * Get all contact messages
 * @param {Object} options - Query options
 * @returns {Promise<Array>} - List of contact messages
 */
export async function getAllContactMessages(options = {}) {
  try {
    const { status, limit = 100, offset = 0, sortBy = 'created_at', sortOrder = 'desc' } = options;

    // Build query
    let query = db.select().from(contactMessages);

    // Apply status filter if provided
    if (status) {
      query = query.where(eq(contactMessages.status, status));
    }

    // Apply sorting
    if (sortOrder.toLowerCase() === 'desc') {
      query = query.orderBy(desc(contactMessages[sortBy]));
    } else {
      query = query.orderBy(contactMessages[sortBy]);
    }

    // Apply pagination
    query = query.limit(limit).offset(offset);

    // Execute query
    const messages = await query;

    return messages;
  } catch (error) {
    console.error('Error fetching contact messages:', error);
    return [];
  }
}

/**
 * Get contact message by ID
 * @param {number} id - Contact message ID
 * @returns {Promise<Object|null>} - Contact message or null if not found
 */
export async function getContactMessageById(id) {
  try {
    const message = await db
      .select()
      .from(contactMessages)
      .where(eq(contactMessages.id, id))
      .limit(1);

    return message.length > 0 ? message[0] : null;
  } catch (error) {
    console.error(`Error fetching contact message with ID ${id}:`, error);
    return null;
  }
}

/**
 * Update contact message
 * @param {number} id - Contact message ID
 * @param {Object} data - Updated contact message data
 * @returns {Promise<Object|null>} - Updated contact message or null if not found
 */
export async function updateContactMessage(id, data) {
  try {
    // Check if message exists
    const existingMessage = await getContactMessageById(id);
    if (!existingMessage) {
      return null;
    }

    // Update message
    const result = await db
      .update(contactMessages)
      .set({
        status: data.status || existingMessage.status,
        admin_notes: data.admin_notes !== undefined ? data.admin_notes : existingMessage.admin_notes,
        updated_at: new Date(),
      })
      .where(eq(contactMessages.id, id))
      .returning();

    return result.length > 0 ? result[0] : null;
  } catch (error) {
    console.error(`Error updating contact message with ID ${id}:`, error);
    return null;
  }
}

/**
 * Delete contact message
 * @param {number} id - Contact message ID
 * @returns {Promise<boolean>} - Success status
 */
export async function deleteContactMessage(id) {
  try {
    await db
      .delete(contactMessages)
      .where(eq(contactMessages.id, id));

    return true;
  } catch (error) {
    console.error(`Error deleting contact message with ID ${id}:`, error);
    return false;
  }
}

/**
 * Get contact message statistics
 * @returns {Promise<Object>} - Contact message statistics
 */
export async function getContactMessageStats() {
  try {
    // Get total count
    const totalResult = await db
      .select({ count: sql`COUNT(*)` })
      .from(contactMessages);
    
    // Get count by status
    const statusCounts = await db
      .select({
        status: contactMessages.status,
        count: sql`COUNT(*)`
      })
      .from(contactMessages)
      .groupBy(contactMessages.status);
    
    // Get recent messages
    const recentMessages = await db
      .select()
      .from(contactMessages)
      .orderBy(desc(contactMessages.created_at))
      .limit(5);

    // Format status counts
    const formattedStatusCounts = {};
    statusCounts.forEach(item => {
      formattedStatusCounts[item.status] = parseInt(item.count);
    });

    return {
      total: parseInt(totalResult[0].count),
      statusCounts: formattedStatusCounts,
      recent: recentMessages
    };
  } catch (error) {
    console.error('Error fetching contact message statistics:', error);
    return { total: 0, statusCounts: {}, recent: [] };
  }
}
