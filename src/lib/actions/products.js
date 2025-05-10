'use server';

import { db } from '@/lib/db';
import { products, categories } from '@/db/schema';
import { eq, or, desc, asc, like, sql, and } from 'drizzle-orm';

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
 * Fetch all products with pagination, filtering, and sorting
 * @param {Object} options - Options for fetching products
 * @param {number} options.page - Page number (1-based)
 * @param {number} options.limit - Number of products per page
 * @param {string} options.sortBy - Field to sort by (name, price)
 * @param {string} options.sortOrder - Sort order (asc, desc)
 * @param {number} options.categoryId - Filter by category ID
 * @param {string} options.search - Search term for product name
 * @param {number} options.minPrice - Minimum price filter
 * @param {number} options.maxPrice - Maximum price filter
 * @param {string} options.color - Color filter (comma-separated values)
 * @param {string} options.condition - Condition filter (comma-separated values)
 * @returns {Promise<Object>} - Object containing products and pagination info
 */
export async function getAllProducts({
  page = 1,
  limit = 12,
  sortBy = 'id',
  sortOrder = 'asc',
  categoryId = null,
  search = '',
  minPrice = null,
  maxPrice = null,
  color = null,
  condition = null,
} = {}) {
  console.log('getAllProducts called with search:', search);
  try {
    // Calculate offset for pagination
    const offset = (page - 1) * limit;

    // Build query conditions
    let conditions = [];

    // Add category filter if provided
    if (categoryId) {
      conditions.push(eq(products.category_id, categoryId));
    }

    // Add search filter if provided
    if (search && search.trim() !== '') {
      console.log('Searching for:', search);

      // Split search term into words for more flexible searching
      const searchWords = search.trim().split(/\s+/);

      // For each word, create a condition that checks if it appears in name or description
      const searchConditions = searchWords.map(word => {
        const searchTerm = `%${word}%`;
        return or(
          sql`${products.name} LIKE ${searchTerm}`,
          sql`${products.description} LIKE ${searchTerm}`
        );
      });

      // Add the combined search conditions (all words must match)
      if (searchConditions.length > 0) {
        conditions.push(and(...searchConditions));
      }
    }

    // Add price range filters if provided
    if (minPrice !== null) {
      conditions.push(sql`CAST(${products.price} AS DECIMAL) >= ${minPrice}`);
    }

    if (maxPrice !== null) {
      conditions.push(sql`CAST(${products.price} AS DECIMAL) <= ${maxPrice}`);
    }

    // Add color filter if provided (for demo purposes, we'll just filter by name containing the color)
    if (color) {
      const colorValues = color.split(',');
      const colorConditions = colorValues.map(c => like(products.name, `%${c}%`));
      if (colorConditions.length > 0) {
        conditions.push(or(...colorConditions));
      }
    }

    // Add condition filter if provided (for demo purposes, we'll just filter by description containing the condition)
    if (condition) {
      const conditionValues = condition.split(',');
      const conditionConditions = conditionValues.map(c => like(products.description, `%${c}%`));
      if (conditionConditions.length > 0) {
        conditions.push(or(...conditionConditions));
      }
    }

    // Build the base query
    let query = db
      .select({
        id: products.id,
        name: products.name,
        price: products.price,
        image: products.image,
        description: products.description,
        categoryId: products.category_id,
        stock: products.stock,
        sku: products.sku,
      })
      .from(products);

    // Add conditions if any
    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    // Add sorting
    if (sortBy && sortOrder) {
      const orderFunc = sortOrder.toLowerCase() === 'desc' ? desc : asc;
      query = query.orderBy(orderFunc(products[sortBy]));
    }

    // Add pagination
    query = query.limit(limit).offset(offset);

    // Execute the query
    console.log('Query conditions:', conditions);
    const productData = await query;

    // Count total products for pagination
    let countQuery = db.select({ count: sql`count(*)` }).from(products);
    if (conditions.length > 0) {
      countQuery = countQuery.where(and(...conditions));
    }
    const [{ count }] = await countQuery;
    const totalProducts = Number(count);

    // Fetch category information for the products
    const uniqueCategoryIds = [...new Set(productData.map(product => product.categoryId))];

    let categoryData = [];
    if (uniqueCategoryIds.length > 0) {
      const categoryConditions = uniqueCategoryIds.map(id => eq(categories.id, id));
      categoryData = await db
        .select({
          id: categories.id,
          name: categories.name,
        })
        .from(categories)
        .where(or(...categoryConditions));
    }

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

    // Calculate pagination info
    const totalPages = Math.ceil(totalProducts / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    return {
      products: productsWithCategory,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        totalProducts,
        totalPages,
        hasNextPage,
        hasPrevPage,
      },
    };
  } catch (error) {
    console.error('Error fetching all products:', error);
    return {
      products: [],
      pagination: {
        page: Number(page),
        limit: Number(limit),
        totalPages: 0,
        totalProducts: 0,
        hasNextPage: false,
        hasPrevPage: false
      }
    };
  }
}

/**
 * Fetch a single product by ID
 * @param {number} id - Product ID
 * @returns {Promise<Object|null>} - Product object or null if not found
 */
export async function getProductById(id) {
  try {
    // Fetch the product
    const productData = await db
      .select({
        id: products.id,
        name: products.name,
        price: products.price,
        image: products.image,
        description: products.description,
        categoryId: products.category_id,
        stock: products.stock,
        sku: products.sku,
        createdAt: products.created_at,
      })
      .from(products)
      .where(eq(products.id, id))
      .limit(1);

    // If no product found, return null
    if (!productData || productData.length === 0) {
      return null;
    }

    const product = productData[0];

    // Fetch the category
    const categoryData = await db
      .select({
        id: categories.id,
        name: categories.name,
        slug: categories.slug,
      })
      .from(categories)
      .where(eq(categories.id, product.categoryId))
      .limit(1);

    // Add category name to the product
    const category = categoryData.length > 0 ? categoryData[0] : { name: 'Unknown', slug: 'unknown' };

    // Calculate discount price (10% off for demo purposes)
    const discountPrice = (parseFloat(product.price) * 0.9).toFixed(2);
    const discountPercentage = 10;

    // Return the product with additional info
    return {
      ...product,
      category: category.name,
      categorySlug: category.slug,
      discountPrice,
      discountPercentage,
      // Add some additional fields for the product detail page
      rating: 4.5, // Mock rating
      reviewCount: Math.floor(Math.random() * 50) + 5, // Mock review count
      sizes: ['50g', '60g', '80g'], // Mock sizes
      defaultSize: '60g', // Mock default size
      type: 'Thai Brand', // Mock type
      mfgDate: 'Apr 4, 2025', // Mock manufacturing date
      lifespan: '70 days', // Mock lifespan
      tags: ['Beauty', 'Thai Brand', 'Skin Care'], // Mock tags
    };
  } catch (error) {
    console.error('Error fetching product by ID:', error);
    return null;
  }
}

/**
 * Fetch related products (products in the same category)
 * @param {number} productId - Current product ID to exclude
 * @param {number} categoryId - Category ID to filter by
 * @param {number} limit - Maximum number of products to return
 * @returns {Promise<Array>} - Array of related products
 */
export async function getRelatedProducts(productId, categoryId, limit = 4) {
  try {
    // Fetch products in the same category, excluding the current product
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
      .where(
        and(
          eq(products.category_id, categoryId),
          sql`${products.id} != ${productId}`
        )
      )
      .limit(limit);

    // Fetch category information
    const categoryData = await db
      .select({
        id: categories.id,
        name: categories.name,
      })
      .from(categories)
      .where(eq(categories.id, categoryId))
      .limit(1);

    const categoryName = categoryData.length > 0 ? categoryData[0].name : 'Unknown';

    // Add category name to each product
    const productsWithCategory = productData.map(product => ({
      ...product,
      category: categoryName,
      // Calculate a 10% discount for display purposes
      discountPrice: (parseFloat(product.price) * 0.9).toFixed(2),
    }));

    return productsWithCategory;
  } catch (error) {
    console.error('Error fetching related products:', error);
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

/**
 * Fetch new products sorted by creation date
 * @param {number} limit - Maximum number of products to return
 * @returns {Promise<Array>} - Array of new products
 */
export async function getNewProducts(limit = 3) {
  try {
    // Fetch products sorted by creation date (newest first)
    const productData = await db
      .select({
        id: products.id,
        name: products.name,
        price: products.price,
        image: products.image,
        categoryId: products.category_id,
        createdAt: products.created_at,
        sku: products.sku,
      })
      .from(products)
      .where(sql`${products.image} IS NOT NULL`)  // Only get products with images
      .orderBy(desc(products.created_at))
      .limit(limit);

    // If no products with images found, try again without the image filter
    if (productData.length === 0) {
      console.log('No products with images found, fetching any products');
      const fallbackProductData = await db
        .select({
          id: products.id,
          name: products.name,
          price: products.price,
          image: products.image,
          categoryId: products.category_id,
          createdAt: products.created_at,
          sku: products.sku,
        })
        .from(products)
        .orderBy(desc(products.created_at))
        .limit(limit);

      if (fallbackProductData.length > 0) {
        productData.push(...fallbackProductData);
      }
    }

    // Fetch all categories to map category IDs to names
    const categoryData = await db
      .select({
        id: categories.id,
        name: categories.name,
      })
      .from(categories);

    // Create a map of category IDs to names
    const categoryMap = categoryData.reduce((map, category) => {
      map[category.id] = category.name;
      return map;
    }, {});

    // Add category name to each product and calculate discount price
    const productsWithCategory = productData.map(product => ({
      ...product,
      category: categoryMap[product.categoryId] || 'Unknown',
      // Calculate a 10% discount for display purposes
      discountPrice: (parseFloat(product.price) * 0.9).toFixed(2),
      // Add mock rating and review count for display
      rating: (Math.random() * 2 + 3).toFixed(1), // Random rating between 3.0 and 5.0
      reviewCount: Math.floor(Math.random() * 20) + 1, // Random review count between 1 and 20
    }));

    return productsWithCategory;
  } catch (error) {
    console.error('Error fetching new products:', error);
    return [];
  }
}
