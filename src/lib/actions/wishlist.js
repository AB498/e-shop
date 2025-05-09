import { db } from '@/lib/db';
import { wishlistItems, products, categories } from '@/db/schema';
import { eq, and, inArray } from 'drizzle-orm';

/**
 * Get all wishlist items for a user
 * @param {number} userId - The user ID
 * @returns {Promise<Array>} - Array of wishlist items with product details
 */
export async function getUserWishlist(userId) {
  try {
    // Validate user ID
    if (!userId) {
      throw new Error('User ID is required');
    }

    // Get wishlist items with product details
    const wishlistWithProducts = await db
      .select({
        id: wishlistItems.id,
        user_id: wishlistItems.user_id,
        product_id: wishlistItems.product_id,
        created_at: wishlistItems.created_at,
        product: {
          id: products.id,
          name: products.name,
          price: products.price,
          image: products.image,
          category_id: products.category_id,
          description: products.description,
          stock: products.stock,
          sku: products.sku
        }
      })
      .from(wishlistItems)
      .leftJoin(products, eq(wishlistItems.product_id, products.id))
      .where(eq(wishlistItems.user_id, userId));

    // Get unique category IDs from products
    const categoryIds = [...new Set(wishlistWithProducts.map(item => item.product.category_id))];

    // Get category details if there are any categories
    let categoryData = [];
    if (categoryIds.length > 0) {
      categoryData = await db
        .select()
        .from(categories)
        .where(
          categoryIds.length === 1
            ? eq(categories.id, categoryIds[0])
            : inArray(categories.id, categoryIds)
        );
    }

    // Create a map of category ID to category details
    const categoryMap = {};
    categoryData.forEach(category => {
      categoryMap[category.id] = category;
    });

    // Add category details to each product
    const wishlistWithCategories = wishlistWithProducts.map(item => ({
      ...item,
      product: {
        ...item.product,
        category: item.product.category_id ? categoryMap[item.product.category_id] : null
      }
    }));

    return wishlistWithCategories;
  } catch (error) {
    console.error('Error fetching user wishlist:', error);
    throw error;
  }
}

/**
 * Add a product to the user's wishlist
 * @param {number} userId - The user ID
 * @param {number} productId - The product ID
 * @returns {Promise<Object>} - The added wishlist item
 */
export async function addToWishlist(userId, productId) {
  try {
    // Validate inputs
    if (!userId) {
      throw new Error('User ID is required');
    }
    if (!productId) {
      throw new Error('Product ID is required');
    }

    // Check if the product is already in the wishlist
    const existingItem = await db
      .select()
      .from(wishlistItems)
      .where(
        and(
          eq(wishlistItems.user_id, userId),
          eq(wishlistItems.product_id, productId)
        )
      )
      .limit(1);

    // If the product is already in the wishlist, return it
    if (existingItem.length > 0) {
      return existingItem[0];
    }

    // Add the product to the wishlist
    const result = await db
      .insert(wishlistItems)
      .values({
        user_id: userId,
        product_id: productId
      })
      .returning();

    return result[0];
  } catch (error) {
    console.error('Error adding to wishlist:', error);
    throw error;
  }
}

/**
 * Remove a product from the user's wishlist
 * @param {number} userId - The user ID
 * @param {number} productId - The product ID
 * @returns {Promise<boolean>} - True if the item was removed, false otherwise
 */
export async function removeFromWishlist(userId, productId) {
  try {
    // Validate inputs
    if (!userId) {
      throw new Error('User ID is required');
    }
    if (!productId) {
      throw new Error('Product ID is required');
    }

    // Remove the product from the wishlist
    const result = await db
      .delete(wishlistItems)
      .where(
        and(
          eq(wishlistItems.user_id, userId),
          eq(wishlistItems.product_id, productId)
        )
      )
      .returning();

    return result.length > 0;
  } catch (error) {
    console.error('Error removing from wishlist:', error);
    throw error;
  }
}

/**
 * Check if a product is in the user's wishlist
 * @param {number} userId - The user ID
 * @param {number} productId - The product ID
 * @returns {Promise<boolean>} - True if the product is in the wishlist, false otherwise
 */
export async function isInWishlist(userId, productId) {
  try {
    // Validate inputs
    if (!userId || !productId) {
      return false;
    }

    // Check if the product is in the wishlist
    const existingItem = await db
      .select()
      .from(wishlistItems)
      .where(
        and(
          eq(wishlistItems.user_id, userId),
          eq(wishlistItems.product_id, productId)
        )
      )
      .limit(1);

    return existingItem.length > 0;
  } catch (error) {
    console.error('Error checking wishlist:', error);
    return false;
  }
}
