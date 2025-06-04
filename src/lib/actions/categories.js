'use server';

import { db } from '@/lib/db';
import { categories, products } from '@/db/schema';
import { eq, desc, sql } from 'drizzle-orm';

/**
 * Get all categories
 * @returns {Promise<Array>} - List of categories
 */
async function getAllCategories() {
  try {
    const categoriesList = await db
      .select({
        id: categories.id,
        name: categories.name,
        slug: categories.slug,
        image: categories.image,
        display_order: categories.display_order,
        created_at: categories.created_at,
        updated_at: categories.updated_at,
      })
      .from(categories)
      .orderBy(categories.display_order);

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
async function getCategoryById(id) {
  try {
    const categoryData = await db
      .select({
        id: categories.id,
        name: categories.name,
        slug: categories.slug,
        image: categories.image,
        display_order: categories.display_order,
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
async function createCategory(categoryData) {
  try {
    // Generate slug from name if not provided
    if (!categoryData.slug) {
      categoryData.slug = categoryData.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
    }

    // Get the highest display_order value
    const maxOrderResult = await db
      .select({ maxOrder: sql`MAX(${categories.display_order})` })
      .from(categories);

    const maxOrder = maxOrderResult[0]?.maxOrder || 0;
    // Ensure display_order is at least 1
    const newOrder = categoryData.display_order !== undefined ?
      Math.max(1, categoryData.display_order) : maxOrder + 1;

    const result = await db.insert(categories).values({
      name: categoryData.name,
      slug: categoryData.slug,
      image: categoryData.image || null,
      display_order: newOrder,
    }).returning();

    // Normalize category order to ensure sequential ordering
    await normalizeCategoryOrder();

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
async function updateCategory(id, categoryData) {
  try {
    // Generate slug from name if not provided
    if (!categoryData.slug && categoryData.name) {
      categoryData.slug = categoryData.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
    }

    // Ensure display_order is at least 1
    const displayOrder = categoryData.display_order !== undefined
      ? Math.max(1, categoryData.display_order)
      : categories.display_order;

    const result = await db.update(categories)
      .set({
        name: categoryData.name,
        slug: categoryData.slug,
        image: categoryData.image,
        display_order: displayOrder,
        updated_at: new Date(),
      })
      .where(eq(categories.id, id))
      .returning();

    // Normalize category order to ensure sequential ordering
    await normalizeCategoryOrder();

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
async function deleteCategory(id) {
  try {
    // Check if category exists
    const categoryExists = await db
      .select({ id: categories.id })
      .from(categories)
      .where(eq(categories.id, id))
      .limit(1);

    if (!categoryExists.length) {
      return false;
    }

    // Check if any products are assigned to this category
    const productsInCategory = await db
      .select({ count: sql`COUNT(*)` })
      .from(products)
      .where(eq(products.category_id, id));

    const productCount = productsInCategory[0]?.count || 0;
    if (productCount > 0) {
      throw new Error(`Cannot delete category with ${productCount} products. Please move or delete the products first.`);
    }

    // Delete the category
    await db.delete(categories).where(eq(categories.id, id));

    // Normalize category order after deletion to ensure sequential ordering
    await normalizeCategoryOrder();

    return true;
  } catch (error) {
    console.error(`Error deleting category with ID ${id}:`, error);
    throw new Error(error.message || 'Failed to delete category');
  }
}

/**
 * Get category statistics
 * @returns {Promise<object>} - Category statistics
 */
async function getCategoryStats() {
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

/**
 * Normalize the display order of all categories to ensure sequential ordering without gaps
 * @returns {Promise<boolean>} - Success status
 */
async function normalizeCategoryOrder() {
  try {
    // Get all categories ordered by current display_order
    const allCategories = await db
      .select()
      .from(categories)
      .orderBy(categories.display_order);

    // Update each category with a new sequential display_order
    await db.transaction(async (tx) => {
      for (let i = 0; i < allCategories.length; i++) {
        await tx.update(categories)
          .set({ display_order: i + 1 }) // Start from 1
          .where(eq(categories.id, allCategories[i].id));
      }
    });

    return true;
  } catch (error) {
    console.error('Error normalizing category order:', error);
    return false;
  }
}

/**
 * Move a category up in the display order
 * @param {number} id - Category ID
 * @returns {Promise<boolean>} - Success status
 */
async function moveCategoryUp(id) {
  try {
    // First normalize to ensure sequential ordering
    await normalizeCategoryOrder();

    // Get the current category
    const currentCategory = await getCategoryById(id);
    if (!currentCategory) return false;

    // If already at the top (display_order is 1), can't move up further
    if (currentCategory.display_order <= 1) return false;

    // Find the category with the next lower display_order (which should be current - 1)
    const prevCategory = await db
      .select()
      .from(categories)
      .where(eq(categories.display_order, currentCategory.display_order - 1))
      .limit(1)
      .then(results => results[0]);

    if (!prevCategory) return false;

    // Swap display_order values
    await db.transaction(async (tx) => {
      await tx.update(categories)
        .set({ display_order: prevCategory.display_order })
        .where(eq(categories.id, currentCategory.id));

      await tx.update(categories)
        .set({ display_order: currentCategory.display_order })
        .where(eq(categories.id, prevCategory.id));
    });

    return true;
  } catch (error) {
    console.error(`Error moving category ${id} up:`, error);
    return false;
  }
}

/**
 * Move a category down in the display order
 * @param {number} id - Category ID
 * @returns {Promise<boolean>} - Success status
 */
async function moveCategoryDown(id) {
  try {
    // First normalize to ensure sequential ordering
    await normalizeCategoryOrder();

    // Get the current category
    const currentCategory = await getCategoryById(id);
    if (!currentCategory) return false;

    // Get total count of categories to determine if already at bottom
    const totalCount = await db
      .select({ count: sql`count(*)` })
      .from(categories)
      .then(result => parseInt(result[0].count));

    // If already at the bottom, can't move down further
    if (currentCategory.display_order >= totalCount) return false;

    // Find the category with the next higher display_order (which should be current + 1)
    const nextCategory = await db
      .select()
      .from(categories)
      .where(eq(categories.display_order, currentCategory.display_order + 1))
      .limit(1)
      .then(results => results[0]);

    if (!nextCategory) return false;

    // Swap display_order values
    await db.transaction(async (tx) => {
      await tx.update(categories)
        .set({ display_order: nextCategory.display_order })
        .where(eq(categories.id, currentCategory.id));

      await tx.update(categories)
        .set({ display_order: currentCategory.display_order })
        .where(eq(categories.id, nextCategory.id));
    });

    return true;
  } catch (error) {
    console.error(`Error moving category ${id} down:`, error);
    return false;
  }
}

/**
 * Update display order for all categories
 * @param {Array<{id: number, display_order: number}>} orderData - Array of category IDs and their new display orders
 * @returns {Promise<boolean>} - Success status
 */
async function updateCategoriesOrder(orderData) {
  try {
    // First update with the provided order data
    await db.transaction(async (tx) => {
      for (const item of orderData) {
        await tx.update(categories)
          .set({ display_order: item.display_order })
          .where(eq(categories.id, item.id));
      }
    });

    // Then normalize to ensure sequential ordering without gaps
    await normalizeCategoryOrder();

    return true;
  } catch (error) {
    console.error('Error updating categories order:', error);
    return false;
  }
}

/**
 * Get product counts for each category
 * @returns {Promise<Object>} - Object with category IDs as keys and product counts as values
 */
async function getProductCountsByCategory() {
  try {
    const result = await db
      .select({
        categoryId: products.category_id,
        count: sql`count(*)`,
      })
      .from(products)
      .groupBy(products.category_id);

    // Convert the result to an object with category IDs as keys and counts as values
    const countsByCategory = {};
    result.forEach(item => {
      if (item.categoryId) {
        countsByCategory[item.categoryId] = parseInt(item.count);
      }
    });

    return countsByCategory;
  } catch (error) {
    console.error('Error fetching product counts by category:', error);
    return {};
  }
}

// Alias for updateCategoriesOrder for backward compatibility
const reorderCategories = updateCategoriesOrder;

export {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
  getCategoryStats,
  reorderCategories,
  updateCategoriesOrder,
  moveCategoryUp,
  moveCategoryDown,
  getProductCountsByCategory,
  normalizeCategoryOrder
};