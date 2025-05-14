// Script to add product_promotions data
require('dotenv').config();
const { Pool } = require('pg');
const { drizzle } = require('drizzle-orm/node-postgres');
const { sql } = require('drizzle-orm');
const productPromotionsSeed = require('./seed/product-promotions-seed.js').default;
const { productPromotions } = require('../src/db/schema.js');

async function addProductPromotions() {
  console.log('Adding product_promotions data...');

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

    // Check if there are existing product_promotions
    const existingPromotions = await db.select().from(productPromotions);

    if (existingPromotions.length > 0) {
      console.log(`Found ${existingPromotions.length} existing product_promotions.`);

      // Ask for confirmation to continue
      const readline = require('readline').createInterface({
        input: process.stdin,
        output: process.stdout
      });

      const answer = await new Promise(resolve => {
        readline.question('Do you want to add more product_promotions? (y/n): ', resolve);
      });

      readline.close();

      if (answer.toLowerCase() !== 'y') {
        console.log('Operation cancelled.');
        await pool.end();
        return;
      }
    }

    // Insert product_promotions data
    console.log(`Adding ${productPromotionsSeed.length} product_promotions...`);

    // Insert in batches to avoid overwhelming the database
    const batchSize = 50;
    for (let i = 0; i < productPromotionsSeed.length; i += batchSize) {
      const batch = productPromotionsSeed.slice(i, i + batchSize);

      // Insert batch
      await db.insert(productPromotions).values(batch)
        .onConflictDoUpdate({
          target: [productPromotions.product_id, productPromotions.promotion_id],
          set: {
            discount_percentage: sql`excluded.discount_percentage`,
            updated_at: sql`CURRENT_TIMESTAMP`
          }
        });

      console.log(`Added batch ${i / batchSize + 1}/${Math.ceil(productPromotionsSeed.length / batchSize)}`);
    }

    const addedPromotions = await db.select().from(productPromotions);
    console.log(`Total product_promotions after operation: ${addedPromotions.length}`);

    // Close the pool
    await pool.end();
    console.log('Done.');
  } catch (error) {
    console.error('Error adding product_promotions:', error);
    await pool.end();
    process.exit(1);
  }
}

// Run the function
addProductPromotions();
