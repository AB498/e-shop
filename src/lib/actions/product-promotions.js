'use server';

import { db } from '@/lib/db';
import { productPromotions, products, promotions } from '@/db/schema';
import { eq, and, inArray, sql, desc, or } from 'drizzle-orm';

/**
 * Get all products associated with a promotion
 * @param {number} promotionId - Promotion ID
 * @returns {Promise<Array>} - Products associated with the promotion
 */
export async function getProductsByPromotionId(promotionId) {
  try {
    // First, get the promotion to get its discount value
    const [promotionData] = await db
      .select({
        id: promotions.id,
        discount: promotions.discount,
      })
      .from(promotions)
      .where(eq(promotions.id, promotionId))
      .limit(1);

    // Get the promotion's discount value
    const promotionDiscount = promotionData?.discount ? parseFloat(promotionData.discount) : 0;

    // Get all products associated with this promotion
    const result = await db
      .select({
        id: products.id,
        name: products.name,
        sku: products.sku,
        price: products.price,
        image: products.image,
        // Use the promotion's discount value instead of the individual product-promotion discount
        discountPercentage: sql`${promotionDiscount}`,
      })
      .from(productPromotions)
      .innerJoin(products, eq(productPromotions.product_id, products.id))
      .where(eq(productPromotions.promotion_id, promotionId))
      .orderBy(products.name);

    return result;
  } catch (error) {
    console.error(`Error fetching products for promotion ID ${promotionId}:`, error);
    throw new Error('Failed to fetch products for promotion');
  }
}

/**
 * Get all promotions associated with a product
 * @param {number} productId - Product ID
 * @returns {Promise<Array>} - Promotions associated with the product
 */
export async function getPromotionsByProductId(productId) {
  try {
    const result = await db
      .select({
        id: promotions.id,
        title: promotions.title,
        type: promotions.type,
        discountPercentage: productPromotions.discount_percentage,
      })
      .from(productPromotions)
      .innerJoin(promotions, eq(productPromotions.promotion_id, promotions.id))
      .where(eq(productPromotions.product_id, productId))
      .orderBy(desc(promotions.priority));

    return result;
  } catch (error) {
    console.error(`Error fetching promotions for product ID ${productId}:`, error);
    throw new Error('Failed to fetch promotions for product');
  }
}

/**
 * Search products for multiselect
 * @param {string} searchTerm - Search term
 * @param {number} limit - Maximum number of results to return
 * @returns {Promise<Array>} - Products matching the search term
 */
export async function searchProducts(searchTerm, limit = 20) {
  try {
    if (!searchTerm || searchTerm.trim().length < 2) {
      return [];
    }

    const result = await db
      .select({
        id: products.id,
        name: products.name,
        sku: products.sku,
        price: products.price,
        image: products.image,
      })
      .from(products)
      .where(
        or(
          sql`${products.name} ILIKE ${`%${searchTerm}%`}`,
          sql`${products.sku} ILIKE ${`%${searchTerm}%`}`
        )
      )
      .limit(limit)
      .orderBy(products.name);

    return result;
  } catch (error) {
    console.error(`Error searching products with term "${searchTerm}":`, error);
    throw new Error('Failed to search products');
  }
}

/**
 * Update product-promotion relationships
 * @param {number} promotionId - Promotion ID
 * @param {Array} productRelations - Array of product relations with discount percentages
 * @returns {Promise<boolean>} - Success status
 */
export async function updateProductPromotionRelations(promotionId, productRelations) {
  try {
    // Start a transaction
    return await db.transaction(async (tx) => {
      // Get the promotion to ensure we use its discount value
      const [promotion] = await tx
        .select({
          id: promotions.id,
          discount: promotions.discount,
        })
        .from(promotions)
        .where(eq(promotions.id, promotionId))
        .limit(1);

      // Use the promotion's discount value if available
      const promotionDiscount = promotion?.discount ? parseFloat(promotion.discount) : null;

      // Get existing product IDs for this promotion
      const existingRelations = await tx
        .select({
          productId: productPromotions.product_id,
        })
        .from(productPromotions)
        .where(eq(productPromotions.promotion_id, promotionId));

      const existingProductIds = existingRelations.map(rel => rel.productId);
      const newProductIds = productRelations.map(rel => rel.productId);

      // Find product IDs to delete (in existing but not in new)
      const productIdsToDelete = existingProductIds.filter(id => !newProductIds.includes(id));

      // Delete removed relations
      if (productIdsToDelete.length > 0) {
        await tx
          .delete(productPromotions)
          .where(
            and(
              eq(productPromotions.promotion_id, promotionId),
              inArray(productPromotions.product_id, productIdsToDelete)
            )
          );
      }

      // Upsert new/updated relations
      for (const relation of productRelations) {
        // Always use the promotion's discount value if available
        const discountToUse = promotionDiscount !== null ? promotionDiscount : relation.discountPercentage;

        await tx
          .insert(productPromotions)
          .values({
            product_id: relation.productId,
            promotion_id: promotionId,
            discount_percentage: discountToUse,
          })
          .onConflictDoUpdate({
            target: [productPromotions.product_id, productPromotions.promotion_id],
            set: {
              discount_percentage: discountToUse,
              updated_at: new Date(),
            },
          });
      }

      return true;
    });
  } catch (error) {
    console.error(`Error updating product-promotion relations for promotion ID ${promotionId}:`, error);
    throw new Error('Failed to update product-promotion relations');
  }
}
