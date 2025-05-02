'use server';

import { db } from '@/lib/db';
import { categories } from '@/db/schema';
import { eq, desc, sql } from 'drizzle-orm';

/**
 * Get all categories
 * @returns {Promise<Array>} - List of categories
 */
export async function getAllCategories() {
  try {
    const categoriesList = await db
      .select({
        id: categories.id,
        name: categories.name,
        slug: categories.slug,
        image: categories.image,
        created_at: categories.created_at,
        updated_at: categories.updated_at,
      })
      .from(categories)
      .orderBy(categories.name);

    return categoriesList;
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}

/**
 * Get category by ID
 * @param {number} id - Category ID
 * @returns {Promise<object|null>} - Category information
 */
export async function getCategoryById(id) {
  try {
    const categoryData = await db
      .select({
        id: categories.id,
        name: categories.name,
        slug: categories.slug,
        image: categories.image,
        created_at: categories.created_at,
        updated_at: categories.updated_at,
      })
      .from(categories)
      .where(eq(categories.id, id))
      .limit(1);

    return categoryData.length ? categoryData[0] : null;
  } catch (error) {
    console.error(`Error fetching category with ID ${id}:`, error);
    return null;
  }
}

/**
 * Create a new category
 * @param {object} categoryData - Category data
 * @returns {Promise<object|null>} - Created category
 */
export async function createCategory(categoryData) {
  try {
    // Generate slug from name if not provided
    if (!categoryData.slug) {
      categoryData.slug = categoryData.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
    }

    const result = await db.insert(categories).values({
      name: categoryData.name,
      slug: categoryData.slug,
      image: categoryData.image || null,
    }).returning();

    return result.length ? result[0] : null;
  } catch (error) {
    console.error('Error creating category:', error);
    return null;
  }
}

/**
 * Update a category
 * @param {number} id - Category ID
 * @param {object} categoryData - Updated category data
 * @returns {Promise<object|null>} - Updated category
 */
export async function updateCategory(id, categoryData) {
  try {
    // Generate slug from name if not provided
    if (!categoryData.slug && categoryData.name) {
      categoryData.slug = categoryData.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
    }

    const result = await db.update(categories)
      .set({
        name: categoryData.name,
        slug: categoryData.slug,
        image: categoryData.image,
        updated_at: new Date(),
      })
      .where(eq(categories.id, id))
      .returning();

    return result.length ? result[0] : null;
  } catch (error) {
    console.error(`Error updating category with ID ${id}:`, error);
    return null;
  }
}

/**
 * Delete a category
 * @param {number} id - Category ID
 * @returns {Promise<boolean>} - Success status
 */
export async function deleteCategory(id) {
  try {
    await db.delete(categories).where(eq(categories.id, id));
    return true;
  } catch (error) {
    console.error(`Error deleting category with ID ${id}:`, error);
    return false;
  }
}

/**
 * Get category statistics
 * @returns {Promise<object>} - Category statistics
 */
export async function getCategoryStats() {
  try {
    const totalCategories = await db
      .select({ count: sql`count(*)` })
      .from(categories);
    
    const recentCategories = await db
      .select({
        id: categories.id,
        name: categories.name,
        created_at: categories.created_at,
      })
      .from(categories)
      .orderBy(desc(categories.created_at))
      .limit(5);

    return {
      total: parseInt(totalCategories[0].count),
      recent: recentCategories
    };
  } catch (error) {
    console.error('Error fetching category statistics:', error);
    return { total: 0, recent: [] };
  }
}
