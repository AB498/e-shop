// Script to triple the number of products per category
import dotenv from 'dotenv';
import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import chalk from 'chalk';
import { products, productImages } from '../src/db/schema.js';
import { eq } from 'drizzle-orm';

// Load environment variables
dotenv.config();

// Create a database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Create a drizzle instance
const db = drizzle(pool);

async function tripleProducts() {
  console.log(chalk.blue('Starting to triple products for each category...'));

  try {
    // Get all existing products
    const existingProducts = await db.select().from(products);
    console.log(chalk.green(`Found ${existingProducts.length} existing products`));

    // Get the highest product ID to start new IDs from
    const maxId = Math.max(...existingProducts.map(p => p.id));
    console.log(chalk.green(`Highest existing product ID: ${maxId}`));

    // Get all existing product images
    const existingImages = await db.select().from(productImages);
    console.log(chalk.green(`Found ${existingImages.length} existing product images`));

    // Get the highest image ID to start new IDs from
    const maxImageId = Math.max(...existingImages.map(img => img.id || 0));
    console.log(chalk.green(`Highest existing image ID: ${maxImageId}`));

    // Group products by category
    const productsByCategory = {};
    existingProducts.forEach(product => {
      if (!productsByCategory[product.category_id]) {
        productsByCategory[product.category_id] = [];
      }
      productsByCategory[product.category_id].push(product);
    });

    // Create new products (2 copies of each existing product with variations)
    const newProducts = [];
    const newImages = [];
    let newProductId = maxId + 1;
    let newImageId = maxImageId + 1;

    // For each category
    for (const categoryId in productsByCategory) {
      const categoryProducts = productsByCategory[categoryId];
      console.log(chalk.blue(`Processing category ${categoryId} with ${categoryProducts.length} products`));

      // For each product in the category
      for (const product of categoryProducts) {
        // Create two variations of the product
        for (let i = 1; i <= 2; i++) {
          const suffix = i === 1 ? 'Premium' : 'Deluxe';
          const priceMultiplier = i === 1 ? 1.1 : 1.2; // 10% or 20% more expensive

          const newProduct = {
            id: newProductId++,
            name: `${product.name} ${suffix}`,
            sku: `${product.sku}-${suffix.toUpperCase()}`,
            category_id: product.category_id,
            price: Math.round(product.price * priceMultiplier * 100) / 100,
            stock: Math.max(10, product.stock - 10 * i), // Slightly less stock
            weight: product.weight,
            description: `${suffix} version of ${product.description}`,
            image: product.image,
            created_at: new Date(),
            updated_at: new Date()
          };

          newProducts.push(newProduct);

          // Find images for this product
          const productImgs = existingImages.filter(img => img.product_id === product.id);
          
          // Create new images for the new product
          for (const img of productImgs) {
            const newImage = {
              id: newImageId++,
              product_id: newProduct.id,
              url: img.url,
              key: `products/${newProduct.id}-image-${img.position}`,
              alt_text: `${newProduct.name} ${img.is_primary ? 'main image' : `variant ${img.position}`}`,
              position: img.position,
              is_primary: img.is_primary,
              created_at: new Date(),
              updated_at: new Date()
            };

            newImages.push(newImage);
          }
        }
      }
    }

    console.log(chalk.blue(`Created ${newProducts.length} new products and ${newImages.length} new images`));

    // Insert new products in batches
    const BATCH_SIZE = 50;
    for (let i = 0; i < newProducts.length; i += BATCH_SIZE) {
      const batch = newProducts.slice(i, i + BATCH_SIZE);
      await db.insert(products).values(batch);
      console.log(chalk.green(`Inserted products batch ${i / BATCH_SIZE + 1} of ${Math.ceil(newProducts.length / BATCH_SIZE)}`));
    }

    // Insert new images in batches
    for (let i = 0; i < newImages.length; i += BATCH_SIZE) {
      const batch = newImages.slice(i, i + BATCH_SIZE);
      await db.insert(productImages).values(batch);
      console.log(chalk.green(`Inserted images batch ${i / BATCH_SIZE + 1} of ${Math.ceil(newImages.length / BATCH_SIZE)}`));
    }

    console.log(chalk.green('Successfully tripled the number of products!'));
    console.log(chalk.blue(`Original products: ${existingProducts.length}`));
    console.log(chalk.blue(`New products added: ${newProducts.length}`));
    console.log(chalk.blue(`Total products now: ${existingProducts.length + newProducts.length}`));
    console.log(chalk.blue(`Original images: ${existingImages.length}`));
    console.log(chalk.blue(`New images added: ${newImages.length}`));
    console.log(chalk.blue(`Total images now: ${existingImages.length + newImages.length}`));

  } catch (error) {
    console.error(chalk.red('Error tripling products:'), error);
  } finally {
    // Close the database connection
    await pool.end();
  }
}

// Run the function
tripleProducts();
