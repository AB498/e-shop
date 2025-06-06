'use server';

import { db } from '@/lib/db';
import { products, categories, productImages, productPromotions, promotions, productReviews } from '@/db/schema';
import { eq, or, desc, asc, like, sql, and, inArray, avg } from 'drizzle-orm';

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
        createdAt: products.created_at,
      })
      .from(products)
      .where(or(...categoryConditions))
      .orderBy(desc(products.created_at))
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

    // Get product promotions for all products in the result
    const resultProductIds = productData.map(product => product.id);

    // Fetch all product promotions for these products
    let productDiscounts = {};
    if (resultProductIds.length > 0) {
      const productPromotionsData = await db
        .select({
          productId: productPromotions.product_id,
          promotionId: productPromotions.promotion_id,
          discountPercentage: productPromotions.discount_percentage,
          promotionTitle: promotions.title,
          promotionType: promotions.type,
        })
        .from(productPromotions)
        .innerJoin(promotions, eq(productPromotions.promotion_id, promotions.id))
        .where(
          and(
            inArray(productPromotions.product_id, resultProductIds),
            eq(promotions.is_active, true)
          )
        );

      // Create a map of product ID to its best discount
      productPromotionsData.forEach(promo => {
        const productId = promo.productId;
        const discount = parseFloat(promo.discountPercentage);

        // If this product doesn't have a discount yet, or this discount is better
        if (!productDiscounts[productId] || discount > productDiscounts[productId].discount) {
          productDiscounts[productId] = {
            discount,
            promotionId: promo.promotionId,
            promotionTitle: promo.promotionTitle,
            promotionType: promo.promotionType,
          };
        }
      });
    }

    // Add category name and calculate discount for each product
    const productsWithCategory = productData.map(product => {
      // Get the best discount for this product (if any)
      const productDiscount = productDiscounts[product.id];
      const discountPercentage = productDiscount ? productDiscount.discount : 0;

      // Calculate the discounted price
      const originalPrice = parseFloat(product.price);
      const discountPrice = discountPercentage > 0
        ? (originalPrice * (1 - discountPercentage / 100)).toFixed(2)
        : originalPrice.toFixed(2);

      return {
        ...product,
        category: categoryMap[product.categoryId] || 'Unknown',
        discountPrice,
        discountPercentage,
        promotion: productDiscount ? {
          id: productDiscount.promotionId,
          title: productDiscount.promotionTitle,
          type: productDiscount.promotionType,
        } : null,
      };
    });

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
 * @param {number} options.promotionId - Filter by promotion ID
 * @returns {Promise<Object>} - Object containing products and pagination info
 */
export async function getAllProducts({
  page = 1,
  limit = 12,
  sortBy = 'created_at',
  sortOrder = 'desc',
  categoryId = null,
  search = '',
  minPrice = null,
  maxPrice = null,
  color = null,
  condition = null,
  rating = null,
  promotionId = null,
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

    // Handle rating filter - filter products by average rating
    let ratingFilteredProductIds = null;
    if (rating) {
      console.log('Filtering by rating:', rating);
      const minRating = parseFloat(rating);

      // Get products with average rating >= minRating
      const ratingQuery = await db
        .select({
          productId: productReviews.product_id,
          avgRating: avg(productReviews.rating),
        })
        .from(productReviews)
        .where(eq(productReviews.status, 'published'))
        .groupBy(productReviews.product_id)
        .having(sql`AVG(${productReviews.rating}) >= ${minRating}`);

      if (ratingQuery.length > 0) {
        ratingFilteredProductIds = ratingQuery.map(r => r.productId);
        console.log(`Found ${ratingFilteredProductIds.length} products with rating >= ${minRating}`);
      } else {
        console.log(`No products found with rating >= ${minRating}`);
        // Return empty result if no products meet the rating criteria
        return {
          products: [],
          pagination: {
            page: Number(page),
            limit: Number(limit),
            totalProducts: 0,
            totalPages: 0,
            hasNextPage: false,
            hasPrevPage: false,
          },
        };
      }
    }

    // Handle promotion filter
    let productIds = null;
    if (promotionId) {
      console.log('Filtering by promotion ID:', promotionId);

      // Get all product IDs that are part of this promotion
      const promotionProducts = await db
        .select({
          productId: productPromotions.product_id,
          discountPercentage: productPromotions.discount_percentage
        })
        .from(productPromotions)
        .where(eq(productPromotions.promotion_id, promotionId));

      if (promotionProducts.length > 0) {
        productIds = promotionProducts.map(p => p.productId);
        console.log(`Found ${productIds.length} products in promotion ${promotionId}`);
      } else {
        console.log(`No products found for promotion ${promotionId}`);
        // Return empty result if no products in this promotion
        return {
          products: [],
          pagination: {
            page: Number(page),
            limit: Number(limit),
            totalProducts: 0,
            totalPages: 0,
            hasNextPage: false,
            hasPrevPage: false,
          },
        };
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
        createdAt: products.created_at,
      })
      .from(products);

    // Add conditions if any
    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    // Combine promotion and rating filters
    let finalProductIds = null;
    if (productIds && ratingFilteredProductIds) {
      // If both filters are active, get intersection
      finalProductIds = productIds.filter(id => ratingFilteredProductIds.includes(id));
    } else if (productIds) {
      // Only promotion filter
      finalProductIds = productIds;
    } else if (ratingFilteredProductIds) {
      // Only rating filter
      finalProductIds = ratingFilteredProductIds;
    }

    // Add product ID filters if we have any
    if (finalProductIds) {
      if (conditions.length > 0) {
        query = query.where(and(...conditions, inArray(products.id, finalProductIds)));
      } else {
        query = query.where(inArray(products.id, finalProductIds));
      }
    } else if (conditions.length > 0) {
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

    // Apply the same filters as the main query
    if (finalProductIds) {
      if (conditions.length > 0) {
        countQuery = countQuery.where(and(...conditions, inArray(products.id, finalProductIds)));
      } else {
        countQuery = countQuery.where(inArray(products.id, finalProductIds));
      }
    } else if (conditions.length > 0) {
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

    // Get product promotions for all products in the result
    const resultProductIds = productData.map(product => product.id);

    // Fetch all product promotions for these products
    let productDiscounts = {};
    if (resultProductIds.length > 0) {
      const productPromotionsData = await db
        .select({
          productId: productPromotions.product_id,
          promotionId: productPromotions.promotion_id,
          discountPercentage: productPromotions.discount_percentage,
          promotionTitle: promotions.title,
          promotionType: promotions.type,
        })
        .from(productPromotions)
        .innerJoin(promotions, eq(productPromotions.promotion_id, promotions.id))
        .where(
          and(
            inArray(productPromotions.product_id, resultProductIds),
            eq(promotions.is_active, true)
          )
        );

      // Create a map of product ID to its best discount
      productPromotionsData.forEach(promo => {
        const productId = promo.productId;
        const discount = parseFloat(promo.discountPercentage);

        // If this product doesn't have a discount yet, or this discount is better
        if (!productDiscounts[productId] || discount > productDiscounts[productId].discount) {
          productDiscounts[productId] = {
            discount,
            promotionId: promo.promotionId,
            promotionTitle: promo.promotionTitle,
            promotionType: promo.promotionType,
          };
        }
      });
    }

    // Fetch review statistics for all products
    let productRatings = {};
    if (resultProductIds.length > 0) {
      const reviewStatsData = await db
        .select({
          productId: productReviews.product_id,
          averageRating: avg(productReviews.rating),
          totalReviews: sql`COUNT(${productReviews.id})`,
        })
        .from(productReviews)
        .where(
          and(
            inArray(productReviews.product_id, resultProductIds),
            eq(productReviews.status, 'published')
          )
        )
        .groupBy(productReviews.product_id);

      // Create a map of product ID to its rating data
      reviewStatsData.forEach(stat => {
        productRatings[stat.productId] = {
          rating: parseFloat(stat.averageRating) || 0,
          reviewCount: parseInt(stat.totalReviews) || 0,
        };
      });
    }

    // Add category name and calculate discount for each product
    const productsWithCategory = productData.map(product => {
      // Get the best discount for this product (if any)
      const productDiscount = productDiscounts[product.id];
      const discountPercentage = productDiscount ? productDiscount.discount : 0;

      // Calculate the discounted price
      const originalPrice = parseFloat(product.price);
      const discountPrice = discountPercentage > 0
        ? (originalPrice * (1 - discountPercentage / 100)).toFixed(2)
        : originalPrice.toFixed(2);

      // Get rating data for this product
      const ratingData = productRatings[product.id] || { rating: 0, reviewCount: 0 };

      return {
        ...product,
        category: categoryMap[product.categoryId] || 'Unknown',
        discountPrice,
        discountPercentage,
        rating: ratingData.rating,
        reviewCount: ratingData.reviewCount,
        promotion: productDiscount ? {
          id: productDiscount.promotionId,
          title: productDiscount.promotionTitle,
          type: productDiscount.promotionType,
        } : null,
      };
    });

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
        // New product attributes
        sizes: products.sizes,
        colors: products.colors,
        tags: products.tags,
        type: products.type,
        brand: products.brand,
        material: products.material,
        originCountry: products.origin_country,
        mfgDate: products.mfg_date,
        lifespan: products.lifespan,
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

    // Fetch product images
    const productImagesData = await db
      .select({
        id: productImages.id,
        url: productImages.url,
        altText: productImages.alt_text,
        position: productImages.position,
        isPrimary: productImages.is_primary,
      })
      .from(productImages)
      .where(eq(productImages.product_id, id))
      .orderBy(asc(productImages.position));

    // Fetch review statistics
    const reviewStats = await db
      .select({
        averageRating: avg(productReviews.rating),
        totalReviews: sql`COUNT(${productReviews.id})`,
      })
      .from(productReviews)
      .where(
        and(
          eq(productReviews.product_id, id),
          eq(productReviews.status, 'published')
        )
      );

    // Get promotion information for this product
    const productPromotionsData = await db
      .select({
        promotionId: productPromotions.promotion_id,
        discountPercentage: productPromotions.discount_percentage,
        promotionTitle: promotions.title,
        promotionType: promotions.type,
      })
      .from(productPromotions)
      .innerJoin(promotions, eq(productPromotions.promotion_id, promotions.id))
      .where(
        and(
          eq(productPromotions.product_id, id),
          eq(promotions.is_active, true)
        )
      );

    // Find the best discount
    let bestDiscount = null;
    let discountPercentage = 0;

    if (productPromotionsData.length > 0) {
      bestDiscount = productPromotionsData.reduce((best, current) => {
        const currentDiscount = parseFloat(current.discountPercentage);
        return !best || currentDiscount > parseFloat(best.discountPercentage) ? current : best;
      }, null);

      discountPercentage = bestDiscount ? parseFloat(bestDiscount.discountPercentage) : 0;
    }

    // Calculate discount price
    const originalPrice = parseFloat(product.price);
    const discountPrice = discountPercentage > 0
      ? (originalPrice * (1 - discountPercentage / 100)).toFixed(2)
      : originalPrice.toFixed(2);

    // Return the product with additional info
    return {
      ...product,
      category: category.name,
      categorySlug: category.slug,
      discountPrice,
      discountPercentage,
      // Add promotion information if available
      promotion: bestDiscount ? {
        id: bestDiscount.promotionId,
        title: bestDiscount.promotionTitle,
        type: bestDiscount.promotionType,
        discountPercentage: discountPercentage,
      } : null,
      // Add product images
      images: productImagesData.length > 0 ? productImagesData : [
        // If no images found, create a default one from the main image
        {
          id: 0,
          url: product.image,
          altText: product.name,
          position: 0,
          isPrimary: true
        }
      ],
      // Add review data
      rating: reviewStats[0]?.averageRating ? parseFloat(reviewStats[0].averageRating) : 0.0,
      reviewCount: reviewStats[0]?.totalReviews ? parseInt(reviewStats[0].totalReviews) : 0,
      // Add product attributes from database
      sizes: product.sizes || [],
      colors: product.colors || [],
      tags: product.tags || [],
      type: product.type || null,
      brand: product.brand || null,
      material: product.material || null,
      originCountry: product.originCountry || null,
      mfgDate: product.mfgDate || null,
      lifespan: product.lifespan || null,
      // Set default size to first available size or fallback
      defaultSize: (product.sizes && product.sizes.length > 0) ? product.sizes[0] : '60g',
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

    // Get product IDs for fetching promotions
    const resultProductIds = productData.map(product => product.id);

    // Fetch all product promotions for these products
    let productDiscounts = {};
    if (resultProductIds.length > 0) {
      const productPromotionsData = await db
        .select({
          productId: productPromotions.product_id,
          promotionId: productPromotions.promotion_id,
          discountPercentage: productPromotions.discount_percentage,
          promotionTitle: promotions.title,
          promotionType: promotions.type,
        })
        .from(productPromotions)
        .innerJoin(promotions, eq(productPromotions.promotion_id, promotions.id))
        .where(
          and(
            inArray(productPromotions.product_id, resultProductIds),
            eq(promotions.is_active, true)
          )
        );

      // Create a map of product ID to its best discount
      productPromotionsData.forEach(promo => {
        const productId = promo.productId;
        const discount = parseFloat(promo.discountPercentage);

        // If this product doesn't have a discount yet, or this discount is better
        if (!productDiscounts[productId] || discount > productDiscounts[productId].discount) {
          productDiscounts[productId] = {
            discount,
            promotionId: promo.promotionId,
            promotionTitle: promo.promotionTitle,
            promotionType: promo.promotionType,
          };
        }
      });
    }

    // Add category name and calculate discount for each product
    const productsWithCategory = productData.map(product => {
      // Get the best discount for this product (if any)
      const productDiscount = productDiscounts[product.id];
      const discountPercentage = productDiscount ? productDiscount.discount : 0;

      // Calculate the discounted price
      const originalPrice = parseFloat(product.price);
      const discountPrice = discountPercentage > 0
        ? (originalPrice * (1 - discountPercentage / 100)).toFixed(2)
        : originalPrice.toFixed(2);

      return {
        ...product,
        category: categoryName,
        discountPrice,
        discountPercentage,
        // Add promotion information if available
        promotion: productDiscount ? {
          id: productDiscount.promotionId,
          title: productDiscount.promotionTitle,
          type: productDiscount.promotionType,
        } : null,
        // Add mock rating and review count for display
        rating: (Math.random() * 2 + 3).toFixed(1), // Random rating between 3.0 and 5.0
        reviewCount: Math.floor(Math.random() * 20) + 1, // Random review count between 1 and 20
      };
    });

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
/**
 * Fetch product images by product ID
 * @param {number} productId - Product ID
 * @returns {Promise<Array>} - Array of product images
 */
export async function getProductImages(productId) {
  try {
    // Fetch product images
    const imageData = await db
      .select({
        id: productImages.id,
        url: productImages.url,
        altText: productImages.alt_text,
        position: productImages.position,
        isPrimary: productImages.is_primary,
      })
      .from(productImages)
      .where(eq(productImages.product_id, productId))
      .orderBy(asc(productImages.position));

    return imageData;
  } catch (error) {
    console.error('Error fetching product images:', error);
    return [];
  }
}

/**
 * Get rating statistics for filter options
 * @returns {Promise<Array>} - Array of rating options with counts
 */
export async function getRatingFilterStats() {
  try {
    // Get products with average rating >= 5 (perfect rating)
    const rating5Plus = await db
      .select({
        productId: productReviews.product_id,
        avgRating: avg(productReviews.rating),
      })
      .from(productReviews)
      .where(eq(productReviews.status, 'published'))
      .groupBy(productReviews.product_id)
      .having(sql`AVG(${productReviews.rating}) >= 5`);

    // Get products with average rating >= 4
    const rating4Plus = await db
      .select({
        productId: productReviews.product_id,
        avgRating: avg(productReviews.rating),
      })
      .from(productReviews)
      .where(eq(productReviews.status, 'published'))
      .groupBy(productReviews.product_id)
      .having(sql`AVG(${productReviews.rating}) >= 4`);

    // Get products with average rating >= 3
    const rating3Plus = await db
      .select({
        productId: productReviews.product_id,
        avgRating: avg(productReviews.rating),
      })
      .from(productReviews)
      .where(eq(productReviews.status, 'published'))
      .groupBy(productReviews.product_id)
      .having(sql`AVG(${productReviews.rating}) >= 3`);

    // Get products with average rating >= 2
    const rating2Plus = await db
      .select({
        productId: productReviews.product_id,
        avgRating: avg(productReviews.rating),
      })
      .from(productReviews)
      .where(eq(productReviews.status, 'published'))
      .groupBy(productReviews.product_id)
      .having(sql`AVG(${productReviews.rating}) >= 2`);

    return [
      { value: '5', label: '5 Stars', count: rating5Plus.length },
      { value: '4', label: '4 Stars & Up', count: rating4Plus.length },
      { value: '3', label: '3 Stars & Up', count: rating3Plus.length },
      { value: '2', label: '2 Stars & Up', count: rating2Plus.length }
    ];
  } catch (error) {
    console.error('Error fetching rating filter stats:', error);
    // Return default values if there's an error
    return [
      { value: '5', label: '5 Stars', count: 0 },
      { value: '4', label: '4 Stars & Up', count: 0 },
      { value: '3', label: '3 Stars & Up', count: 0 },
      { value: '2', label: '2 Stars & Up', count: 0 }
    ];
  }
}

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

    // Get product IDs for fetching promotions
    const resultProductIds = productData.map(product => product.id);

    // Fetch all product promotions for these products
    let productDiscounts = {};
    if (resultProductIds.length > 0) {
      const productPromotionsData = await db
        .select({
          productId: productPromotions.product_id,
          promotionId: productPromotions.promotion_id,
          discountPercentage: productPromotions.discount_percentage,
          promotionTitle: promotions.title,
          promotionType: promotions.type,
        })
        .from(productPromotions)
        .innerJoin(promotions, eq(productPromotions.promotion_id, promotions.id))
        .where(
          and(
            inArray(productPromotions.product_id, resultProductIds),
            eq(promotions.is_active, true)
          )
        );

      // Create a map of product ID to its best discount
      productPromotionsData.forEach(promo => {
        const productId = promo.productId;
        const discount = parseFloat(promo.discountPercentage);

        // If this product doesn't have a discount yet, or this discount is better
        if (!productDiscounts[productId] || discount > productDiscounts[productId].discount) {
          productDiscounts[productId] = {
            discount,
            promotionId: promo.promotionId,
            promotionTitle: promo.promotionTitle,
            promotionType: promo.promotionType,
          };
        }
      });
    }

    // Fetch review statistics for new products
    let productRatings = {};
    if (resultProductIds.length > 0) {
      const reviewStatsData = await db
        .select({
          productId: productReviews.product_id,
          averageRating: avg(productReviews.rating),
          totalReviews: sql`COUNT(${productReviews.id})`,
        })
        .from(productReviews)
        .where(
          and(
            inArray(productReviews.product_id, resultProductIds),
            eq(productReviews.status, 'published')
          )
        )
        .groupBy(productReviews.product_id);

      // Create a map of product ID to its rating data
      reviewStatsData.forEach(stat => {
        productRatings[stat.productId] = {
          rating: parseFloat(stat.averageRating) || 0,
          reviewCount: parseInt(stat.totalReviews) || 0,
        };
      });
    }

    // Add category name and calculate discount for each product
    const productsWithCategory = productData.map(product => {
      // Get the best discount for this product (if any)
      const productDiscount = productDiscounts[product.id];
      const discountPercentage = productDiscount ? productDiscount.discount : 0;

      // Calculate the discounted price
      const originalPrice = parseFloat(product.price);
      const discountPrice = discountPercentage > 0
        ? (originalPrice * (1 - discountPercentage / 100)).toFixed(2)
        : originalPrice.toFixed(2);

      // Get rating data for this product
      const ratingData = productRatings[product.id] || { rating: 0, reviewCount: 0 };

      return {
        ...product,
        category: categoryMap[product.categoryId] || 'Unknown',
        discountPrice,
        discountPercentage,
        rating: ratingData.rating,
        reviewCount: ratingData.reviewCount,
        // Add promotion information if available
        promotion: productDiscount ? {
          id: productDiscount.promotionId,
          title: productDiscount.promotionTitle,
          type: productDiscount.promotionType,
        } : null,
      };
    });

    return productsWithCategory;
  } catch (error) {
    console.error('Error fetching new products:', error);
    return [];
  }
}
