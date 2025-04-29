'use server';

import { db } from '@/lib/db';
import { products, categories } from '@/db/schema';
import { eq, or } from 'drizzle-orm';

/**
 * Fetch products by category IDs
 * @param {number[]} categoryIds - Array of category IDs to filter by
 * @param {number} limit - Maximum number of products to return
 * @returns {Promise<Array>} - Array of products
 */
export async function getProductsByCategories(categoryIds, limit = 6) {
  try {
    // Create an array of conditions for each category ID
    const categoryConditions = categoryIds.map(id => eq(products.category_id, id));

    // Fetch products that match any of the category conditions
    const productData = await db
      .select({
        id: products.id,
        name: products.name,
        price: products.price,
        image: products.image,
        description: products.description,
        categoryId: products.category_id,
      })
      .from(products)
      .where(or(...categoryConditions))
      .limit(limit);

    // Fetch category information for the products
    const uniqueCategoryIds = [...new Set(productData.map(product => product.categoryId))];
    const categoryConditions2 = uniqueCategoryIds.map(id => eq(categories.id, id));

    const categoryData = await db
      .select({
        id: categories.id,
        name: categories.name,
      })
      .from(categories)
      .where(or(...categoryConditions2));

    // Create a map of category IDs to category names for quick lookup
    const categoryMap = {};
    categoryData.forEach(category => {
      categoryMap[category.id] = category.name;
    });

    // Add category name to each product
    const productsWithCategory = productData.map(product => ({
      ...product,
      category: categoryMap[product.categoryId] || 'Unknown',
      // Calculate a 10% discount for display purposes
      discountPrice: (parseFloat(product.price) * 0.9).toFixed(2),
    }));

    return productsWithCategory;
  } catch (error) {
    console.error('Error fetching products by categories:', error);
    return [];
  }
}

/**
 * Fetch all categories
 * @returns {Promise<Array>} - Array of categories
 */
export async function getAllCategories() {
  try {
    const categoryData = await db
      .select({
        id: categories.id,
        name: categories.name,
        slug: categories.slug,
        image: categories.image,
      })
      .from(categories);

    return categoryData;
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}
