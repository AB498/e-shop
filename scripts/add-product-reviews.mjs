import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import { eq } from 'drizzle-orm';
import productReviewsSeed from './seed/product-reviews-seed.js';
import readline from 'readline';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

/**
 * Add product reviews to the database
 */
async function addProductReviews() {
  // Create a new pool
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
        AND table_name = 'product_reviews'
      );
    `);

    const tableExists = result.rows[0].exists;

    if (!tableExists) {
      console.log('product_reviews table does not exist. Please run add-product-reviews-table.js first.');
      await pool.end();
      return;
    }

    // Check if there are existing reviews
    const existingReviews = await pool.query(`
      SELECT COUNT(*) FROM product_reviews;
    `);

    const reviewCount = parseInt(existingReviews.rows[0].count);

    if (reviewCount > 0) {
      // Ask for confirmation before proceeding
      const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
      });

      const answer = await new Promise(resolve => {
        rl.question(`There are already ${reviewCount} reviews in the database. Do you want to add more? (y/n) `, resolve);
      });

      rl.close();

      if (answer.toLowerCase() !== 'y') {
        console.log('Operation cancelled.');
        await pool.end();
        return;
      }
    }

    // Insert reviews in batches
    console.log(`Adding ${productReviewsSeed.length} product reviews...`);

    // Insert reviews in batches of 10
    const batchSize = 10;
    for (let i = 0; i < productReviewsSeed.length; i += batchSize) {
      const batch = productReviewsSeed.slice(i, i + batchSize);

      // Insert each review in the batch
      for (const review of batch) {
        try {
          await pool.query(`
            INSERT INTO product_reviews (
              product_id, user_id, rating, review_text, title,
              verified_purchase, status, created_at, updated_at
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
            ON CONFLICT (user_id, product_id) DO NOTHING
          `, [
            review.product_id,
            review.user_id,
            review.rating,
            review.review_text,
            review.title,
            review.verified_purchase,
            review.status,
            review.created_at,
            review.updated_at
          ]);
        } catch (error) {
          console.error(`Error inserting review for product ${review.product_id} by user ${review.user_id}:`, error);
        }
      }

      console.log(`Added batch ${Math.floor(i / batchSize) + 1} of ${Math.ceil(productReviewsSeed.length / batchSize)}`);
    }

    // Get the count of added reviews
    const addedReviews = await pool.query(`
      SELECT COUNT(*) FROM product_reviews;
    `);

    console.log(`Successfully added product reviews. Total reviews in database: ${addedReviews.rows[0].count}`);
  } catch (error) {
    console.error('Error adding product reviews:', error);
  } finally {
    await pool.end();
  }
}

// Run the function
addProductReviews().catch(console.error);

// Add type: module to package.json or use .mjs extension
