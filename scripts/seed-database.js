#!/usr/bin/env node

/**
 * Database Seeding Script
 *
 * This script performs the same database seeding operation as the dev UI,
 * but can be run directly from the terminal.
 *
 * Usage:
 *   node scripts/seed-database.js
 *
 * Requirements:
 *   - DATABASE_URL environment variable must be set in .env file
 */

// Import required modules
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs/promises';
import bcrypt from 'bcrypt';
import { eq } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { getProductsFromSheets } from './seed-products-from-sheets.js';

// Load environment variables first - must happen before any database connections
dotenv.config();

// Create our own database connection instead of importing from src/lib/db.js
// This ensures we have full control over the connection parameters
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false // Allow self-signed certificates for Supabase
  }
});

const db = drizzle(pool);

// Import schema
import * as schema from '../src/db/schema.js';

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Function to import seed data
async function importSeedData(filename) {
  try {
    const filePath = join(__dirname, '..', 'scripts', 'seed', filename);
    const fileContent = await fs.readFile(filePath, 'utf8');

    // Extract the default export from the file content
    const exportMatch = fileContent.match(/export\s+default\s+(\w+)/);
    if (!exportMatch) {
      throw new Error(`Could not find default export in ${filename}`);
    }

    const exportName = exportMatch[1];

    // Try different regex patterns to match the data array
    let dataMatch = fileContent.match(new RegExp(`const\\s+${exportName}\\s*=\\s*(\\[\\s*\\{.*?\\}\\s*\\]);`, 's'));

    if (!dataMatch) {
      // Try alternative pattern for arrays that span multiple lines
      dataMatch = fileContent.match(new RegExp(`const\\s+${exportName}\\s*=\\s*(\\[\\s*\\{[\\s\\S]*?\\}\\s*\\]);`, 's'));
    }

    if (!dataMatch) {
      // Try a more general pattern
      dataMatch = fileContent.match(new RegExp(`const\\s+${exportName}\\s*=\\s*(\\[[\\s\\S]*?\\]);`, 's'));
    }

    if (!dataMatch) {
      throw new Error(`Could not find data array in ${filename}`);
    }

    // Parse the data array
    try {
      // Replace 'new Date()' with actual date objects
      const processedContent = dataMatch[1].replace(/new Date\(\)/g, 'new Date()');

      // Replace date strings with actual date objects
      const processedContent2 = processedContent.replace(/new Date\((['"].*?['"])\)/g, (match, dateStr) => {
        return `new Date(${dateStr})`;
      });

      // Replace timestamp calculations
      const processedContent3 = processedContent2.replace(/new Date\(Date\.now\(\) - (\d+) \* (\d+) \* (\d+) \* (\d+)\)/g, (match, days, hours, minutes, seconds) => {
        const timestamp = Date.now() - (days * hours * minutes * seconds);
        return `new Date(${timestamp})`;
      });

      // Use Function constructor to evaluate the array
      const dataArray = new Function(`return ${processedContent3}`)();
      return dataArray;
    } catch (error) {
      console.error(`Error parsing data from ${filename}:`, error);
      console.error('Raw data:', dataMatch[1].substring(0, 200) + '...');
      throw error;
    }
  } catch (error) {
    console.error(`Error importing seed data from ${filename}:`, error);
    // Return an empty array as fallback
    console.log(`Using empty array for ${filename}`);
    return [];
  }
}

// Main function to seed the database
async function seedDatabase() {
  const startTime = Date.now();
  console.log('Starting database seeding process...');

  try {
    // Check if DATABASE_URL is set
    if (!process.env.DATABASE_URL) {
      throw new Error('DATABASE_URL environment variable is not set. Please check your .env file.');
    }

    // Test database connection
    try {
      console.log('Testing database connection...');
      console.log(`Connecting to: ${process.env.DATABASE_URL.replace(/:[^:]*@/, ':****@')}`);
      const result = await pool.query('SELECT NOW() as current_time');
      console.log(`Database connection successful! Server time: ${result.rows[0].current_time}`);
      console.log('Connection to Supabase PostgreSQL database established.');
    } catch (error) {
      console.error('Database connection failed!');
      console.error('Error details:', error.message);
      console.error('Please make sure:');
      console.error('1. Your DATABASE_URL is correct in the .env file');
      console.error('2. The Supabase database is accessible from your network');
      console.error('3. Your database user has the necessary permissions');
      console.error('\nTroubleshooting tips:');
      console.error('- Check if you can connect to the database using another tool');
      console.error('- Verify that your IP is allowed in Supabase network settings');
      console.error('- Make sure the sslmode=require parameter is in your connection string');
      throw new Error('Failed to connect to the database. See above for details.');
    }

    // Import seed data in parallel
    console.log('Importing seed data in parallel...');
    const [
      categoriesSeed,
      productsSeed,
      productImagesSeed,
      usersSeed,
      filesSeed,
      couriersSeed,
      storeLocationsSeed,
      deliveryPersonsSeed,
      wishlistItemsSeed,
      promotionsSeed,
      settingsSeed,
      contactMessagesSeed
    ] = await Promise.all([
      importSeedData('categories-seed.js'),
      importSeedData('products-seed.js'),
      importSeedData('product-images-seed.js'),
      importSeedData('users-seed.js'),
      importSeedData('files-seed.js'),
      importSeedData('couriers-seed.js'),
      importSeedData('store-locations-seed.js'),
      importSeedData('delivery-persons-seed.js'),
      importSeedData('wishlist-seed.js'),
      importSeedData('promotions-seed.js'),
      importSeedData('settings-seed.js'),
      importSeedData('contact-messages-seed.js')
    ]);

    // Drop existing tables if they exist (for clean seeding)
    console.log('Dropping existing tables if they exist...');
    try {
      // Drop tables in reverse order of dependencies using direct pool queries
      const dropQueries = [
        'DROP TABLE IF EXISTS payment_transactions CASCADE',
        'DROP TABLE IF EXISTS wishlist_items CASCADE',
        'DROP TABLE IF EXISTS store_locations CASCADE',
        'DROP TABLE IF EXISTS courier_tracking CASCADE',
        'DROP TABLE IF EXISTS order_items CASCADE',
        'DROP TABLE IF EXISTS orders CASCADE',
        'DROP TABLE IF EXISTS product_images CASCADE',
        'DROP TABLE IF EXISTS products CASCADE',
        'DROP TABLE IF EXISTS categories CASCADE',
        'DROP TABLE IF EXISTS promotions CASCADE',
        'DROP TABLE IF EXISTS delivery_persons CASCADE',
        'DROP TABLE IF EXISTS couriers CASCADE',
        'DROP TABLE IF EXISTS users CASCADE',
        'DROP TABLE IF EXISTS files CASCADE',
        'DROP TABLE IF EXISTS settings CASCADE',
        'DROP TABLE IF EXISTS contact_messages CASCADE',
        'DROP TYPE IF EXISTS user_role CASCADE',
        'DROP TYPE IF EXISTS order_status CASCADE',
        'DROP TYPE IF EXISTS contact_message_status CASCADE'
      ];

      // Execute drop queries in sequence to maintain dependency order
      for (const query of dropQueries) {
        await pool.query(query);
      }
    } catch (error) {
      console.error('Error dropping tables:', error);
      console.log('Continuing anyway, as some tables might not exist yet...');
    }

    // Create schema using direct pool queries
    console.log('Creating schema...');
    try {
      // Create enum types first
      await pool.query("CREATE TYPE user_role AS ENUM ('admin', 'customer')");
      await pool.query("CREATE TYPE order_status AS ENUM ('pending', 'processing', 'in_transit', 'shipped', 'delivered', 'cancelled')");
      await pool.query("CREATE TYPE contact_message_status AS ENUM ('new', 'read', 'replied', 'archived')");

      // Define table creation queries
      const tableQueries = [
        // Independent tables (no foreign key dependencies)
        `CREATE TABLE files (
          id SERIAL PRIMARY KEY,
          key TEXT NOT NULL,
          url TEXT NOT NULL,
          created_at TIMESTAMP DEFAULT NOW()
        )`,
        `CREATE TABLE contact_messages (
          id SERIAL PRIMARY KEY,
          name TEXT NOT NULL,
          email TEXT NOT NULL,
          phone TEXT,
          message TEXT NOT NULL,
          status contact_message_status DEFAULT 'new' NOT NULL,
          admin_notes TEXT,
          created_at TIMESTAMP DEFAULT NOW(),
          updated_at TIMESTAMP DEFAULT NOW()
        )`,
        `CREATE TABLE users (
          id SERIAL PRIMARY KEY,
          first_name TEXT NOT NULL,
          last_name TEXT NOT NULL,
          email TEXT NOT NULL UNIQUE,
          password_hash TEXT,
          phone TEXT,
          address TEXT,
          city TEXT,
          post_code TEXT,
          country TEXT,
          region TEXT,
          role user_role NOT NULL DEFAULT 'customer',
          created_at TIMESTAMP DEFAULT NOW(),
          updated_at TIMESTAMP DEFAULT NOW()
        )`,
        `CREATE TABLE categories (
          id SERIAL PRIMARY KEY,
          name TEXT NOT NULL,
          slug TEXT NOT NULL UNIQUE,
          image TEXT,
          display_order INTEGER DEFAULT 1 NOT NULL,
          created_at TIMESTAMP DEFAULT NOW(),
          updated_at TIMESTAMP DEFAULT NOW()
        )`,
        `CREATE TABLE couriers (
          id SERIAL PRIMARY KEY,
          name TEXT NOT NULL,
          description TEXT,
          courier_type TEXT DEFAULT 'external' NOT NULL,
          is_active BOOLEAN NOT NULL DEFAULT TRUE,
          created_at TIMESTAMP DEFAULT NOW(),
          updated_at TIMESTAMP DEFAULT NOW()
        )`,
        `CREATE TABLE delivery_persons (
          id SERIAL PRIMARY KEY,
          name TEXT NOT NULL,
          phone TEXT NOT NULL,
          email TEXT,
          address TEXT,
          city TEXT,
          area TEXT,
          status TEXT DEFAULT 'active' NOT NULL,
          current_orders INTEGER DEFAULT 0 NOT NULL,
          total_orders INTEGER DEFAULT 0 NOT NULL,
          rating DECIMAL(3, 2) DEFAULT 5.00,
          profile_image TEXT,
          notes TEXT,
          created_at TIMESTAMP DEFAULT NOW(),
          updated_at TIMESTAMP DEFAULT NOW()
        )`
      ];

      // Execute independent table creation queries in parallel
      await Promise.all(tableQueries.map(query => pool.query(query)));

      // Create dependent tables in sequence (respecting foreign key dependencies)
      // Products depends on categories
      await pool.query(`
        CREATE TABLE products (
          id SERIAL PRIMARY KEY,
          name TEXT NOT NULL,
          sku TEXT NOT NULL UNIQUE,
          category_id INTEGER REFERENCES categories(id),
          price DECIMAL(10, 2) NOT NULL,
          stock INTEGER NOT NULL DEFAULT 0,
          weight DECIMAL(5, 2) DEFAULT 0.5,
          description TEXT,
          image TEXT,
          created_at TIMESTAMP DEFAULT NOW(),
          updated_at TIMESTAMP DEFAULT NOW()
        )
      `);

      // Product images depends on products
      await pool.query(`
        CREATE TABLE product_images (
          id SERIAL PRIMARY KEY,
          product_id INTEGER REFERENCES products(id) NOT NULL,
          url TEXT NOT NULL,
          key TEXT NOT NULL,
          alt_text TEXT,
          position INTEGER DEFAULT 0 NOT NULL,
          is_primary BOOLEAN DEFAULT FALSE NOT NULL,
          created_at TIMESTAMP DEFAULT NOW(),
          updated_at TIMESTAMP DEFAULT NOW()
        )
      `);

      // Orders depends on users, couriers, and delivery_persons
      await pool.query(`
        CREATE TABLE orders (
          id SERIAL PRIMARY KEY,
          user_id INTEGER REFERENCES users(id),
          status order_status DEFAULT 'pending' NOT NULL,
          total DECIMAL(10, 2) NOT NULL,
          payment_method TEXT DEFAULT 'sslcommerz' NOT NULL,
          courier_id INTEGER REFERENCES couriers(id),
          delivery_person_id INTEGER REFERENCES delivery_persons(id),
          courier_order_id TEXT,
          courier_tracking_id TEXT,
          courier_status TEXT,
          shipping_address TEXT,
          shipping_city TEXT,
          shipping_post_code TEXT,
          shipping_phone TEXT,
          shipping_area TEXT,
          shipping_landmark TEXT,
          shipping_instructions TEXT,
          delivery_otp TEXT,
          delivery_otp_verified BOOLEAN DEFAULT FALSE,
          delivery_otp_sent_at TIMESTAMP,
          created_at TIMESTAMP DEFAULT NOW(),
          updated_at TIMESTAMP DEFAULT NOW()
        )
      `);

      // These tables depend on orders
      const orderDependentTables = [
        `CREATE TABLE order_items (
          id SERIAL PRIMARY KEY,
          order_id INTEGER REFERENCES orders(id),
          product_id INTEGER REFERENCES products(id),
          quantity INTEGER NOT NULL,
          price DECIMAL(10, 2) NOT NULL,
          created_at TIMESTAMP DEFAULT NOW()
        )`,
        `CREATE TABLE courier_tracking (
          id SERIAL PRIMARY KEY,
          order_id INTEGER REFERENCES orders(id),
          courier_id INTEGER REFERENCES couriers(id),
          tracking_id TEXT NOT NULL,
          status TEXT NOT NULL,
          details TEXT,
          location TEXT,
          timestamp TIMESTAMP DEFAULT NOW(),
          created_at TIMESTAMP DEFAULT NOW()
        )`
      ];

      // Execute order-dependent table creation queries in parallel
      await Promise.all(orderDependentTables.map(query => pool.query(query)));

      // Store locations table (independent)
      await pool.query(`
        CREATE TABLE store_locations (
          id SERIAL PRIMARY KEY,
          name TEXT NOT NULL,
          contact_name TEXT NOT NULL,
          contact_number TEXT NOT NULL,
          secondary_contact TEXT,
          address TEXT NOT NULL,
          city_id INTEGER NOT NULL,
          zone_id INTEGER NOT NULL,
          area_id INTEGER NOT NULL,
          pathao_store_id TEXT,
          is_default BOOLEAN DEFAULT false,
          is_active BOOLEAN DEFAULT true,
          created_at TIMESTAMP DEFAULT NOW(),
          updated_at TIMESTAMP DEFAULT NOW()
        )
      `);

      // Wishlist items table (depends on users and products)
      await pool.query(`
        CREATE TABLE wishlist_items (
          id SERIAL PRIMARY KEY,
          user_id INTEGER REFERENCES users(id) NOT NULL,
          product_id INTEGER REFERENCES products(id) NOT NULL,
          created_at TIMESTAMP DEFAULT NOW()
        )
      `);

      // Promotions table
      await pool.query(`
        CREATE TABLE promotions (
          id SERIAL PRIMARY KEY,
          title TEXT NOT NULL,
          description TEXT,
          image_url TEXT NOT NULL,
          link_url TEXT,
          type TEXT DEFAULT 'banner' NOT NULL,
          position TEXT DEFAULT 'home',
          start_date TIMESTAMP,
          end_date TIMESTAMP,
          is_active BOOLEAN DEFAULT TRUE,
          priority INTEGER DEFAULT 0,
          discount TEXT,
          created_at TIMESTAMP DEFAULT NOW(),
          updated_at TIMESTAMP DEFAULT NOW()
        )
      `);

      // Payment transactions table (depends on orders)
      await pool.query(`
        CREATE TABLE payment_transactions (
          id SERIAL PRIMARY KEY,
          order_id INTEGER REFERENCES orders(id),
          transaction_id TEXT NOT NULL,
          val_id TEXT,
          amount DECIMAL(10, 2) NOT NULL,
          status TEXT NOT NULL,
          currency TEXT NOT NULL,
          tran_date TIMESTAMP,
          card_type TEXT,
          card_no TEXT,
          bank_tran_id TEXT,
          card_issuer TEXT,
          card_brand TEXT,
          card_issuer_country TEXT,
          card_issuer_country_code TEXT,
          store_amount DECIMAL(10, 2),
          verify_sign TEXT,
          verify_key TEXT,
          risk_level TEXT,
          risk_title TEXT,
          payment_method TEXT,
          gateway_url TEXT,
          response_data JSONB,
          created_at TIMESTAMP DEFAULT NOW(),
          updated_at TIMESTAMP DEFAULT NOW()
        )
      `);

      // Settings table for system-wide configuration
      await pool.query(`
        CREATE TABLE settings (
          id SERIAL PRIMARY KEY,
          key TEXT NOT NULL UNIQUE,
          value TEXT,
          description TEXT,
          created_at TIMESTAMP DEFAULT NOW(),
          updated_at TIMESTAMP DEFAULT NOW()
        )
      `);
    } catch (error) {
      console.error('Error creating schema:', error);
      throw error;
    }

    // Insert sample data
    console.log('Inserting sample data...');
    try {
      // Helper function to insert data with progress tracking
      async function insertData(tableName, schemaTable, data, transformFn = null) {
        console.log(`Inserting ${data.length} records into ${tableName}...`);
        const startTime = Date.now();

        // If transformFn is provided, use it to transform the data before insertion
        if (transformFn) {
          const promises = data.map(async (item) => {
            try {
              const transformedItem = await transformFn(item);
              if (transformedItem) {
                await db.insert(schemaTable).values(transformedItem);
              }
            } catch (error) {
              console.error(`Error inserting into ${tableName}:`, error);
            }
          });

          await Promise.all(promises);
        } else {
          // Batch insert for better performance
          const batchSize = 50;
          for (let i = 0; i < data.length; i += batchSize) {
            const batch = data.slice(i, i + batchSize);
            await Promise.all(batch.map(item => db.insert(schemaTable).values(item).catch(error => {
              console.error(`Error inserting into ${tableName}:`, error);
            })));
          }
        }

        const duration = ((Date.now() - startTime) / 1000).toFixed(2);
        console.log(`✓ Completed inserting ${data.length} records into ${tableName} in ${duration}s`);
      }

      // Transform function for users to handle password hashing
      async function transformUser(user) {
        try {
          // Check if user already exists
          const existingUser = await db
            .select()
            .from(schema.users)
            .where(eq(schema.users.email, user.email))
            .limit(1);

          if (existingUser && existingUser.length > 0) {
            console.log(`User ${user.email} already exists, skipping...`);
            return null;
          }

          // Hash the password
          const hashedPassword = await bcrypt.hash(user.password, 10);

          // Create user object with hashed password - don't specify ID
          return {
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            password_hash: hashedPassword,
            phone: user.phone || null,
            address: user.address || null,
            city: user.city || null,
            post_code: user.post_code || null,
            country: user.country || null,
            region: user.region || null,
            role: user.role
          };
        } catch (error) {
          console.error(`Error processing user ${user.email}:`, error);
          return null;
        }
      }

      // Transform function for categories to handle local image paths
      async function transformCategory(category) {
        try {
          // If the image path starts with '/images/categories/', it's a local image
          if (category.image && category.image.startsWith('/images/categories/')) {
            // Keep the path as is - it's already in the correct format for the frontend
            console.log(`Using local image for category ${category.name}: ${category.image}`);
          }

          return {
            id: category.id,
            name: category.name,
            slug: category.slug,
            image: category.image,
            display_order: category.display_order || 1
          };
        } catch (error) {
          console.error(`Error processing category ${category.name}:`, error);
          return null;
        }
      }

      // Insert independent tables in parallel
      await Promise.all([
        insertData('categories', schema.categories, categoriesSeed, transformCategory),
        insertData('users', schema.users, usersSeed, transformUser),
        insertData('files', schema.files, filesSeed),
        insertData('couriers', schema.couriers, couriersSeed),
        insertData('delivery_persons', schema.deliveryPersons, deliveryPersonsSeed),
        insertData('store_locations', schema.storeLocations, storeLocationsSeed),
        insertData('promotions', schema.promotions, promotionsSeed),
        insertData('settings', schema.settings, settingsSeed),
        insertData('contact_messages', schema.contactMessages, contactMessagesSeed)
      ]);

      // Fetch products from Google Sheets
      console.log('Fetching products from Google Sheets...');
      const sheetsData = await getProductsFromSheets();
      console.log(`Fetched ${sheetsData.products.length} products from Google Sheets`);

      // Adjust IDs of hardcoded products to start after Google Sheets products
      const sheetProductsCount = sheetsData.products.length;
      if (sheetProductsCount > 0) {
        console.log(`Adjusting IDs of ${productsSeed.length} hardcoded products to start after Google Sheets products`);
        productsSeed.forEach((product, index) => {
          product.id = sheetProductsCount + index + 1;
        });

        // Also adjust product_id in product images
        productImagesSeed.forEach(image => {
          image.product_id = sheetProductsCount + image.product_id;
        });
      }

      // Combine Google Sheets products with hardcoded products
      let combinedProducts = [...sheetsData.products, ...productsSeed];

      // Triple the number of products by creating variations
      console.log(`Original product count: ${combinedProducts.length}`);
      console.log('Tripling the number of products per category...');

      // Group products by category
      const productsByCategory = {};
      combinedProducts.forEach(product => {
        if (!productsByCategory[product.category_id]) {
          productsByCategory[product.category_id] = [];
        }
        productsByCategory[product.category_id].push(product);
      });

      // Create additional product variations
      const additionalProducts = [];
      const additionalImages = [];
      let nextProductId = Math.max(...combinedProducts.map(p => p.id)) + 1;

      // Make sure we have a high enough starting ID for images to avoid conflicts
      let nextImageId = 1000; // Start from a high number to avoid conflicts

      // For each category
      for (const categoryId in productsByCategory) {
        const categoryProducts = productsByCategory[categoryId];
        console.log(`Processing category ${categoryId} with ${categoryProducts.length} products`);

        // For each product in the category
        for (const product of categoryProducts) {
          // Create two variations of the product
          for (let i = 1; i <= 2; i++) {
            const suffix = i === 1 ? 'Premium' : 'Deluxe';
            const priceMultiplier = i === 1 ? 1.1 : 1.2; // 10% or 20% more expensive

            const newProduct = {
              id: nextProductId++,
              name: `${product.name} ${suffix}`,
              sku: `${product.sku}-${suffix.toUpperCase()}`,
              category_id: product.category_id,
              price: Math.round(product.price * priceMultiplier * 100) / 100,
              stock: Math.max(10, product.stock - 10 * i), // Slightly less stock
              weight: product.weight || 0.5,
              description: `${suffix} version of ${product.description || 'No description available'}`,
              image: product.image,
              created_at: new Date(),
              updated_at: new Date()
            };

            additionalProducts.push(newProduct);

            // Create images for the new product
            // Find original product images
            const originalImages = [...sheetsData.productImages, ...productImagesSeed].filter(img =>
              img.product_id === product.id
            );

            if (originalImages.length > 0) {
              // Create new images based on original ones
              for (const img of originalImages) {
                const newImage = {
                  id: nextImageId++,
                  product_id: newProduct.id,
                  url: img.url,
                  key: `products/${newProduct.id}-image-${img.position || 0}`,
                  alt_text: `${newProduct.name} ${img.is_primary ? 'main image' : `variant ${img.position || 0}`}`,
                  position: img.position || 0,
                  is_primary: img.is_primary || false,
                  created_at: new Date(),
                  updated_at: new Date()
                };

                additionalImages.push(newImage);
              }
            } else {
              // Create a default primary image if no original images exist
              const newImage = {
                id: nextImageId++,
                product_id: newProduct.id,
                url: newProduct.image,
                key: `products/${newProduct.id}-image-0`,
                alt_text: `${newProduct.name} main image`,
                position: 0,
                is_primary: true,
                created_at: new Date(),
                updated_at: new Date()
              };

              additionalImages.push(newImage);
            }
          }
        }
      }

      // Add the additional products to the combined products
      combinedProducts = [...combinedProducts, ...additionalProducts];
      console.log(`Added ${additionalProducts.length} additional product variations`);
      console.log(`Total products to insert: ${combinedProducts.length}`);

      // Insert products
      await insertData('products', schema.products, combinedProducts);

      // Combine all product images
      const combinedProductImages = [...sheetsData.productImages, ...productImagesSeed, ...additionalImages];
      console.log(`Added ${additionalImages.length} additional product images`);
      console.log(`Total product images to insert: ${combinedProductImages.length}`);

      // Store these for stats at the end
      global.totalProducts = combinedProducts.length;
      global.totalProductImages = combinedProductImages.length;
      global.sheetsProductCount = sheetsData.products.length;

      // Insert product images
      await insertData('product_images', schema.productImages, combinedProductImages);

      // Insert wishlist items after products and users are inserted
      await insertData('wishlist_items', schema.wishlistItems, wishlistItemsSeed);
    } catch (error) {
      console.error('Error inserting sample data:', error);
      throw error;
    }

    // Calculate execution time
    const endTime = Date.now();
    const totalDuration = ((endTime - startTime) / 1000).toFixed(2);

    console.log('Database seeding completed successfully!');
    console.log(`Total execution time: ${totalDuration} seconds`);
    console.log('Stats:');
    console.log(`  Products from Google Sheets: ${global.sheetsProductCount || 0}`);
    console.log(`  Products from seed file: ${productsSeed.length}`);
    console.log(`  Total Products: ${global.totalProducts || productsSeed.length}`);
    console.log(`  Product Images: ${global.totalProductImages || productImagesSeed.length}`);
    console.log(`  Categories: ${categoriesSeed.length}`);
    console.log(`  Users: ${usersSeed.length}`);
    console.log(`  Files: ${filesSeed.length}`);
    console.log(`  Couriers: ${couriersSeed.length}`);
    console.log(`  Store Locations: ${storeLocationsSeed.length}`);
    console.log(`  Delivery Persons: ${deliveryPersonsSeed.length}`);
    console.log(`  Wishlist Items: ${wishlistItemsSeed.length}`);
    console.log(`  Promotions: ${promotionsSeed.length}`);
    console.log(`  Settings: ${settingsSeed.length}`);
    console.log(`  Contact Messages: ${contactMessagesSeed.length}`);
    console.log(`  Payment Transactions: 0 (table created but no seed data)`);

    // Close the database connection
    await pool.end();

    return {
      success: true,
      message: `Database seeded successfully in ${totalDuration}s!`,
      stats: {
        products: productsSeed.length,
        productImages: productImagesSeed.length,
        categories: categoriesSeed.length,
        users: usersSeed.length,
        files: filesSeed.length,
        couriers: couriersSeed.length,
        storeLocations: storeLocationsSeed.length,
        deliveryPersons: deliveryPersonsSeed.length,
        wishlistItems: wishlistItemsSeed.length,
        promotions: promotionsSeed.length,
        settings: settingsSeed.length,
        contactMessages: contactMessagesSeed.length,
        paymentTransactions: 0
      }
    };
  } catch (error) {
    console.error('Error seeding database:', error);

    // Close the database connection
    try {
      await pool.end();
    } catch (err) {
      console.error('Error closing database connection:', err);
    }

    process.exit(1);
  }
}

// Run the seeding function
seedDatabase();
