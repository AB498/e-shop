// Script to check product_promotions data
require('dotenv').config();
const { Pool } = require('pg');
const { drizzle } = require('drizzle-orm/node-postgres');
const { productPromotions, products, promotions } = require('../src/db/schema.js');
const { eq, and, or } = require('drizzle-orm');

async function checkProductPromotions() {
  console.log('Checking product_promotions data...');

  // Create a connection pool
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  // Create a drizzle instance
  const db = drizzle(pool);

  try {
    // Check if the table exists
    const result = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables
        WHERE table_schema = 'public'
        AND table_name = 'product_promotions'
      );
    `);

    const tableExists = result.rows[0].exists;

    if (!tableExists) {
      console.log('product_promotions table does not exist. Please run add-product-promotions-table.js first.');
      await pool.end();
      return;
    }

    // Get all product promotions
    const allProductPromotions = await db
      .select({
        id: productPromotions.id,
        productId: productPromotions.product_id,
        promotionId: productPromotions.promotion_id,
        discountPercentage: productPromotions.discount_percentage,
      })
      .from(productPromotions);

    console.log(`Found ${allProductPromotions.length} product promotions.`);

    // Get promotions by ID
    const promotionIds = [...new Set(allProductPromotions.map(pp => pp.promotionId))];
    let promotionData = [];

    if (promotionIds.length > 0) {
      promotionData = await db
        .select()
        .from(promotions)
        .where(
          or(...promotionIds.map(id => eq(promotions.id, id)))
        );
    }

    const promotionMap = {};
    promotionData.forEach(p => {
      promotionMap[p.id] = p;
    });

    console.log('\nPromotions with product counts:');
    console.log('------------------------------');

    // Group by promotion
    const promotionCounts = {};
    allProductPromotions.forEach(pp => {
      if (!promotionCounts[pp.promotionId]) {
        promotionCounts[pp.promotionId] = 0;
      }
      promotionCounts[pp.promotionId]++;
    });

    // Display promotion details
    for (const promotionId in promotionCounts) {
      const promotion = promotionMap[promotionId];
      if (promotion) {
        console.log(`Promotion ID: ${promotionId}`);
        console.log(`Title: ${promotion.title}`);
        console.log(`Type: ${promotion.type}`);
        console.log(`Position: ${promotion.position}`);
        console.log(`Active: ${promotion.is_active ? 'Yes' : 'No'}`);
        console.log(`Products: ${promotionCounts[promotionId]}`);
        console.log('------------------------------');
      }
    }

    // Sample some products with their promotions
    console.log('\nSample products with promotions:');
    console.log('------------------------------');

    const sampleSize = Math.min(5, allProductPromotions.length);
    const sampleProductPromotions = allProductPromotions.slice(0, sampleSize);

    for (const pp of sampleProductPromotions) {
      const product = await db
        .select({
          id: products.id,
          name: products.name,
          price: products.price,
        })
        .from(products)
        .where(eq(products.id, pp.productId))
        .limit(1);

      if (product.length > 0) {
        const promotion = promotionMap[pp.promotionId];
        const originalPrice = parseFloat(product[0].price);
        const discountPercentage = parseFloat(pp.discountPercentage);
        const discountedPrice = (originalPrice * (1 - discountPercentage / 100)).toFixed(2);

        console.log(`Product ID: ${product[0].id}`);
        console.log(`Name: ${product[0].name}`);
        console.log(`Original Price: ৳${originalPrice.toFixed(2)}`);
        console.log(`Discount: ${discountPercentage}%`);
        console.log(`Discounted Price: ৳${discountedPrice}`);
        console.log(`Promotion: ${promotion ? promotion.title : 'Unknown'}`);
        console.log('------------------------------');
      }
    }

    // Close the pool
    await pool.end();
    console.log('Done.');
  } catch (error) {
    console.error('Error checking product_promotions:', error);
    await pool.end();
    process.exit(1);
  }
}

// Run the function
checkProductPromotions();
