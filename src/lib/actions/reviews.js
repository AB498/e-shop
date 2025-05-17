import { db } from '@/lib/db';
import { productReviews, users, products, orderItems, orders } from '@/db/schema';
import { eq, and, desc, avg, count, sql } from 'drizzle-orm';

/**
 * Get reviews for a specific product
 * @param {number} productId - Product ID
 * @returns {Promise<Array>} - Array of reviews
 */
export async function getProductReviews(productId) {
  try {
    // Get all reviews for the product
    const reviews = await db
      .select({
        id: productReviews.id,
        rating: productReviews.rating,
        reviewText: productReviews.review_text,
        title: productReviews.title,
        verifiedPurchase: productReviews.verified_purchase,
        createdAt: productReviews.created_at,
        userId: productReviews.user_id,
        userName: sql`concat(${users.first_name}, ' ', ${users.last_name})`,
      })
      .from(productReviews)
      .innerJoin(users, eq(productReviews.user_id, users.id))
      .where(
        and(
          eq(productReviews.product_id, productId),
          eq(productReviews.status, 'published')
        )
      )
      .orderBy(desc(productReviews.created_at));

    return reviews;
  } catch (error) {
    console.error(`Error fetching reviews for product ${productId}:`, error);
    return [];
  }
}

/**
 * Get review statistics for a product
 * @param {number} productId - Product ID
 * @returns {Promise<Object>} - Review statistics
 */
export async function getProductReviewStats(productId) {
  try {
    const stats = await db
      .select({
        averageRating: avg(productReviews.rating),
        totalReviews: count(productReviews.id),
      })
      .from(productReviews)
      .where(
        and(
          eq(productReviews.product_id, productId),
          eq(productReviews.status, 'published')
        )
      );

    // Get rating distribution
    const ratingDistribution = await db
      .select({
        rating: productReviews.rating,
        count: count(productReviews.id),
      })
      .from(productReviews)
      .where(
        and(
          eq(productReviews.product_id, productId),
          eq(productReviews.status, 'published')
        )
      )
      .groupBy(productReviews.rating);

    // Format distribution as an object
    const distribution = {};
    ratingDistribution.forEach(item => {
      distribution[item.rating] = item.count;
    });

    return {
      averageRating: stats[0]?.averageRating ? parseFloat(stats[0].averageRating) : 0,
      totalReviews: stats[0]?.totalReviews ? parseInt(stats[0].totalReviews) : 0,
      distribution,
    };
  } catch (error) {
    console.error(`Error fetching review stats for product ${productId}:`, error);
    return {
      averageRating: 0.0,
      totalReviews: 0,
      distribution: {},
    };
  }
}

/**
 * Check if a user has purchased a product
 * @param {number} userId - User ID
 * @param {number} productId - Product ID
 * @returns {Promise<boolean>} - True if the user has purchased the product
 */
export async function hasUserPurchasedProduct(userId, productId) {
  try {
    // Check if the user has any completed orders with this product
    const purchaseHistory = await db
      .select({
        orderId: orderItems.order_id,
      })
      .from(orderItems)
      .innerJoin(orders, eq(orderItems.order_id, orders.id))
      .where(
        and(
          eq(orderItems.product_id, productId),
          eq(orders.user_id, userId),
          eq(orders.status, 'delivered') // Only count delivered orders
        )
      )
      .limit(1);

    return purchaseHistory.length > 0;
  } catch (error) {
    console.error(`Error checking purchase history for user ${userId} and product ${productId}:`, error);
    return false;
  }
}

/**
 * Create a new product review
 * @param {Object} reviewData - Review data
 * @returns {Promise<Object|null>} - Created review or null if failed
 */
export async function createProductReview(reviewData) {
  try {
    // Validate required fields
    if (!reviewData.productId || !reviewData.userId || !reviewData.rating) {
      throw new Error('Product ID, user ID, and rating are required');
    }

    // Check if the user has already reviewed this product
    const existingReview = await db
      .select({ id: productReviews.id })
      .from(productReviews)
      .where(
        and(
          eq(productReviews.product_id, reviewData.productId),
          eq(productReviews.user_id, reviewData.userId)
        )
      )
      .limit(1);

    if (existingReview.length > 0) {
      throw new Error('You have already reviewed this product');
    }

    // Check if the user has purchased the product
    const hasPurchased = await hasUserPurchasedProduct(
      reviewData.userId,
      reviewData.productId
    );

    // Insert the review
    const result = await db.insert(productReviews).values({
      product_id: reviewData.productId,
      user_id: reviewData.userId,
      rating: reviewData.rating,
      review_text: reviewData.reviewText || null,
      title: reviewData.title || null,
      verified_purchase: hasPurchased,
      status: 'published', // Auto-publish for now
      created_at: new Date(),
      updated_at: new Date(),
    }).returning();

    return result[0] || null;
  } catch (error) {
    console.error('Error creating product review:', error);
    throw error;
  }
}

/**
 * Check if a user has already reviewed a product
 * @param {number} userId - User ID
 * @param {number} productId - Product ID
 * @returns {Promise<boolean>} - True if the user has already reviewed the product
 */
export async function hasUserReviewedProduct(userId, productId) {
  try {
    const existingReview = await db
      .select({ id: productReviews.id })
      .from(productReviews)
      .where(
        and(
          eq(productReviews.product_id, productId),
          eq(productReviews.user_id, userId)
        )
      )
      .limit(1);

    return existingReview.length > 0;
  } catch (error) {
    console.error(`Error checking if user ${userId} has reviewed product ${productId}:`, error);
    return false;
  }
}
