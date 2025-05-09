#!/usr/bin/env node

/**
 * Test Order Creation Script
 *
 * This script creates test orders using existing products and users.
 * It simulates the process of adding products to cart, checking out, and processing payment.
 *
 * Usage:
 *   node scripts/test-order.js [options]
 *
 * Options:
 *   --user <id|email>       Specify user by ID or email (default: first customer in database)
 *   --products <ids|skus>   Comma-separated list of product IDs or SKUs (default: 3 random products)
 *   --quantities <numbers>  Comma-separated list of quantities for each product (default: random 1-3)
 *   --status <status>       Order status (default: pending)
 *                           Valid values: pending, processing, in_transit, shipped, delivered, cancelled
 *   --count <number>        Number of test orders to create (default: 1)
 *   --parallel <number>     Maximum number of orders to process in parallel (default: 5)
 *   --help                  Show this help message
 *
 * Examples:
 *   node scripts/test-order.js
 *   node scripts/test-order.js --user customer@example.com
 *   node scripts/test-order.js --products 1,2,3 --quantities 2,1,3
 *   node scripts/test-order.js --status processing
 *   node scripts/test-order.js --count 10 --parallel 3
 *   node scripts/test-order.js --user 5 --products ABC123,XYZ789 --quantities 1,2 --status shipped
 *
 * Requirements:
 *   - DATABASE_URL environment variable must be set in .env file
 */

// Import required modules
import dotenv from 'dotenv';
import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import { eq } from 'drizzle-orm';
import chalk from 'chalk';
import { performance } from 'perf_hooks';

// Load environment variables first - must happen before any database connections
dotenv.config();

// Set NODE_TLS_REJECT_UNAUTHORIZED to 0 to allow self-signed certificates
// This is needed for connecting to Supabase
// WARNING: This makes TLS connections insecure by disabling certificate verification
// Only use this in development environments, never in production
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
console.log(chalk.yellow('WARNING: SSL certificate verification disabled for database connection.'));
console.log(chalk.yellow('This should only be used in development environments.'));

// Create our own database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false // Allow self-signed certificates for Supabase
  }
});

// Parse command line arguments
function parseArgs() {
  const args = process.argv.slice(2);
  const options = {
    user: null,
    products: null,
    quantities: null,
    status: 'pending',
    count: 1,
    parallel: 5
  };

  // Check for help flag
  if (args.includes('--help') || args.includes('-h')) {
    console.log(chalk.cyan('Test Order Creation Script'));
    console.log(chalk.cyan('========================='));
    console.log('');
    console.log('This script creates test orders using existing products and users.');
    console.log('');
    console.log(chalk.cyan('Options:'));
    console.log('  --user <id|email>       Specify user by ID or email (default: first customer in database)');
    console.log('  --products <ids|skus>   Comma-separated list of product IDs or SKUs (default: 3 random products)');
    console.log('  --quantities <numbers>  Comma-separated list of quantities for each product (default: random 1-3)');
    console.log('  --status <status>       Order status (default: pending)');
    console.log('                           Valid values: pending, processing, in_transit, shipped, delivered, cancelled');
    console.log('  --count <number>        Number of test orders to create (default: 1)');
    console.log('  --parallel <number>     Maximum number of orders to process in parallel (default: 5)');
    console.log('  --help                  Show this help message');
    console.log('');
    console.log(chalk.cyan('Examples:'));
    console.log('  node scripts/test-order.js');
    console.log('  node scripts/test-order.js --user customer@example.com');
    console.log('  node scripts/test-order.js --products 1,2,3 --quantities 2,1,3');
    console.log('  node scripts/test-order.js --status processing');
    console.log('  node scripts/test-order.js --count 10 --parallel 3');
    console.log('  node scripts/test-order.js --user 5 --products ABC123,XYZ789 --quantities 1,2 --status shipped');
    process.exit(0);
  }

  // Parse other arguments
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];

    if (arg === '--user' && i + 1 < args.length) {
      options.user = args[++i];
    } else if (arg === '--products' && i + 1 < args.length) {
      options.products = args[++i].split(',');
    } else if (arg === '--quantities' && i + 1 < args.length) {
      options.quantities = args[++i].split(',').map(q => parseInt(q, 10));
    } else if (arg === '--status' && i + 1 < args.length) {
      const status = args[++i];
      const validStatuses = ['pending', 'processing', 'in_transit', 'shipped', 'delivered', 'cancelled'];

      if (!validStatuses.includes(status)) {
        console.error(chalk.red(`Invalid status: ${status}`));
        console.error(chalk.red(`Valid statuses are: ${validStatuses.join(', ')}`));
        process.exit(1);
      }

      options.status = status;
    } else if (arg === '--count' && i + 1 < args.length) {
      const count = parseInt(args[++i], 10);

      if (isNaN(count) || count < 1) {
        console.error(chalk.red(`Invalid count: ${args[i]}`));
        console.error(chalk.red('Count must be a positive integer'));
        process.exit(1);
      }

      options.count = count;
    } else if (arg === '--parallel' && i + 1 < args.length) {
      const parallel = parseInt(args[++i], 10);

      if (isNaN(parallel) || parallel < 1) {
        console.error(chalk.red(`Invalid parallel value: ${args[i]}`));
        console.error(chalk.red('Parallel must be a positive integer'));
        process.exit(1);
      }

      options.parallel = parallel;
    }
  }

  return options;
}

const options = parseArgs();

// Initialize Drizzle ORM
const db = drizzle(pool);

// Import schema
import * as schema from '../src/db/schema.js';

// Main function to create a test order
async function createTestOrder(options, orderIndex = 1) {
  // Use the batch database connection if provided, otherwise use the global one
  const orderDb = options.batchDb || db;

  const orderPrefix = orderIndex ? `[Order ${orderIndex}/${options.count}] ` : '';
  console.log(chalk.blue(`${orderPrefix}Starting test order creation process...`));

  if (!orderIndex) {
    console.log(chalk.blue('Using options:'), options);
  }

  try {
    // Check if DATABASE_URL is set
    if (!process.env.DATABASE_URL) {
      throw new Error('DATABASE_URL environment variable is not set. Please check your .env file.');
    }

    // Test database connection only for single order mode
    if (!options.batchDb) {
      try {
        console.log(chalk.blue('Testing database connection...'));
        console.log(`Connecting to: ${process.env.DATABASE_URL.replace(/:[^:]*@/, ':****@')}`);
        const result = await pool.query('SELECT NOW() as current_time');
        console.log(chalk.green(`Database connection successful! Server time: ${result.rows[0].current_time}`));
      } catch (error) {
        console.error(chalk.red('Database connection failed!'));
        console.error(chalk.red('Error details:'), error.message);
        throw new Error('Failed to connect to the database. See above for details.');
      }
    }

    // Step 1: Get the specified user or a default test user
    console.log(chalk.blue(`${orderPrefix}Finding user...`));
    let testUser;

    if (options.user) {
      // Check if the user parameter is an email or an ID
      const isEmail = options.user.includes('@');
      const query = isEmail
        ? eq(schema.users.email, options.user)
        : eq(schema.users.id, parseInt(options.user, 10));

      const users = await orderDb
        .select()
        .from(schema.users)
        .where(query)
        .limit(1);

      if (!users || users.length === 0) {
        throw new Error(`User not found with ${isEmail ? 'email' : 'ID'}: ${options.user}`);
      }

      testUser = users[0];
    } else {
      // Get the first customer in the database (default behavior)
      const users = await orderDb
        .select()
        .from(schema.users)
        .where(eq(schema.users.role, 'customer'))
        .limit(1);

      if (!users || users.length === 0) {
        throw new Error('No customer users found in the database. Please seed the database first.');
      }

      testUser = users[0];
    }

    console.log(chalk.green(`${orderPrefix}Found user: ${testUser.first_name} ${testUser.last_name} (${testUser.email})`));

    // Step 2: Get the specified products or random products
    console.log(chalk.blue(`${orderPrefix}Finding products...`));
    let products = [];

    if (options.products && options.products.length > 0) {
      // Get products by ID or SKU
      for (const productIdentifier of options.products) {
        // Check if the product identifier is a number (ID) or string (SKU)
        const isId = !isNaN(parseInt(productIdentifier, 10));
        const query = isId
          ? eq(schema.products.id, parseInt(productIdentifier, 10))
          : eq(schema.products.sku, productIdentifier);

        const productResults = await orderDb
          .select()
          .from(schema.products)
          .where(query)
          .limit(1);

        if (!productResults || productResults.length === 0) {
          throw new Error(`Product not found with ${isId ? 'ID' : 'SKU'}: ${productIdentifier}`);
        }

        products.push(productResults[0]);
      }
    } else {
      // Get random products (default behavior)
      products = await orderDb
        .select()
        .from(schema.products)
        .limit(3);

      if (!products || products.length === 0) {
        throw new Error('No products found in the database. Please seed the database first.');
      }
    }

    console.log(chalk.green(`${orderPrefix}Found ${products.length} products for the test order`));

    // Only show detailed product info for single orders to reduce log noise
    if (!orderIndex || orderIndex === 1) {
      products.forEach(product => {
        console.log(chalk.green(`${orderPrefix}- ${product.name} (${product.sku}) - $${product.price}`));
      });
    }

    // Step 3: Create an order
    console.log(chalk.blue(`${orderPrefix}Creating order...`));

    // Calculate total
    let total = 0;
    const orderItems = products.map((product, index) => {
      // Use specified quantities or generate random ones
      let quantity;

      if (options.quantities && options.quantities[index] !== undefined) {
        quantity = options.quantities[index];
      } else {
        quantity = Math.floor(Math.random() * 3) + 1; // Random quantity between 1 and 3
      }

      const itemTotal = parseFloat(product.price) * quantity;
      total += itemTotal;

      return {
        product_id: product.id,
        quantity,
        price: product.price
      };
    });

    // Insert order
    const [order] = await orderDb.insert(schema.orders).values({
      user_id: testUser.id,
      status: options.status,
      total: total.toFixed(2),
      shipping_address: testUser.address || '123 Test Street',
      shipping_city: testUser.city || 'Test City',
      shipping_post_code: testUser.post_code || '12345',
      shipping_phone: testUser.phone || '+8801712345678'
    }).returning();

    console.log(chalk.green(`${orderPrefix}Created order #${order.id} with total $${order.total}`));

    // Step 4: Create order items
    console.log(chalk.blue(`${orderPrefix}Adding items to order...`));
    const items = [];

    for (const item of orderItems) {
      const [orderItem] = await orderDb.insert(schema.orderItems).values({
        order_id: order.id,
        product_id: item.product_id,
        quantity: item.quantity,
        price: item.price
      }).returning();

      // Get product details for display
      const product = products.find(p => p.id === item.product_id);

      items.push({
        id: orderItem.id,
        name: product.name,
        quantity: item.quantity,
        price: item.price
      });
    }

    console.log(chalk.green(`${orderPrefix}Added ${items.length} items to order #${order.id}`));

    // Only show detailed item info for single orders to reduce log noise
    if (!orderIndex || orderIndex === 1) {
      items.forEach(item => {
        console.log(chalk.green(`${orderPrefix}- ${item.quantity}x ${item.name} @ $${item.price} each`));
      });
    }

    // Step 5: Update product stock
    console.log(chalk.blue(`${orderPrefix}Updating product stock...`));

    for (const item of orderItems) {
      const product = products.find(p => p.id === item.product_id);
      const newStock = parseInt(product.stock) - item.quantity;

      await orderDb.update(schema.products)
        .set({ stock: newStock })
        .where(eq(schema.products.id, item.product_id));

      // Only show detailed stock updates for single orders to reduce log noise
      if (!orderIndex || orderIndex === 1) {
        console.log(chalk.green(`${orderPrefix}Updated stock for ${product.name}: ${product.stock} → ${newStock}`));
      }
    }

    console.log(chalk.green.bold(`\n${orderPrefix}Test order created successfully!`));
    console.log(chalk.yellow(`${orderPrefix}Order Summary:`));
    console.log(chalk.yellow(`${orderPrefix}Order ID: ${order.id}`));
    console.log(chalk.yellow(`${orderPrefix}Customer: ${testUser.first_name} ${testUser.last_name}`));
    console.log(chalk.yellow(`${orderPrefix}Total: $${order.total}`));
    console.log(chalk.yellow(`${orderPrefix}Status: ${order.status}`));
    console.log(chalk.yellow(`${orderPrefix}Items: ${items.length}`));

    // Don't close the database connection here if we're processing multiple orders
    // It will be closed by the parent function
    if (!options.batchDb) {
      await pool.end();
    }

    return {
      success: true,
      order,
      user: testUser,
      items
    };
  } catch (error) {
    console.error(chalk.red(`${orderPrefix}Error creating test order:`), error);

    // Close the database connection if not in batch mode
    if (!options.batchDb) {
      try {
        await pool.end();
      } catch (err) {
        console.error(chalk.red('Error closing database connection:'), err);
      }
    }

    throw error;
  }
}

// Function to create multiple test orders in parallel
async function createMultipleTestOrders(options) {
  const startTime = performance.now();
  console.log(chalk.blue(`Starting creation of ${options.count} test orders...`));
  console.log(chalk.blue(`Processing up to ${options.parallel} orders in parallel`));

  // Create an array of order indices to process
  const orderIndices = Array.from({ length: options.count }, (_, i) => i + 1);
  const results = [];
  const errors = [];

  // Process orders in batches to limit concurrency
  for (let i = 0; i < orderIndices.length; i += options.parallel) {
    const batch = orderIndices.slice(i, i + options.parallel);
    console.log(chalk.blue(`Processing batch ${Math.floor(i / options.parallel) + 1} of ${Math.ceil(orderIndices.length / options.parallel)} (${batch.length} orders)...`));

    // Create a new database connection pool for each batch
    const batchPool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: {
        rejectUnauthorized: false
      }
    });

    const batchDb = drizzle(batchPool);

    try {
      // Process orders in this batch concurrently
      const batchPromises = batch.map(async (index) => {
        // Clone options for this specific order
        const orderOptions = { ...options, batchDb };

        // Add a unique identifier to each order for logging
        console.log(chalk.blue(`Starting order ${index}/${options.count}...`));

        try {
          const result = await createTestOrder(orderOptions, index);
          console.log(chalk.green(`✓ Completed order ${index}/${options.count}`));
          results.push(result);
          return result;
        } catch (error) {
          console.error(chalk.red(`✗ Failed order ${index}/${options.count}:`), error);
          errors.push({ index, error });
          return null;
        }
      });

      await Promise.all(batchPromises);

      // Close the batch pool
      await batchPool.end();
    } catch (error) {
      console.error(chalk.red(`Error processing batch ${Math.floor(i / options.parallel) + 1}:`), error);

      // Close the batch pool
      try {
        await batchPool.end();
      } catch (err) {
        console.error(chalk.red('Error closing batch database connection:'), err);
      }
    }
  }

  const endTime = performance.now();
  const duration = ((endTime - startTime) / 1000).toFixed(2);

  console.log(chalk.green.bold(`\nTest order creation completed!`));
  console.log(chalk.yellow(`Created ${results.length} of ${options.count} orders in ${duration} seconds`));
  console.log(chalk.yellow(`Average time per order: ${(duration / results.length).toFixed(2)} seconds`));

  if (errors.length > 0) {
    console.log(chalk.red(`Failed to create ${errors.length} orders`));
  }

  return {
    success: results.length > 0,
    totalOrders: options.count,
    successfulOrders: results.length,
    failedOrders: errors.length,
    duration: parseFloat(duration),
    results
  };
}



// Run the appropriate function based on the count parameter
if (options.count === 1) {
  // For a single order, use the original function
  createTestOrder(options)
    .then(() => {
      // Database connection is closed in the function
      console.log(chalk.green('Database connection closed.'));
    })
    .catch(error => {
      console.error(chalk.red('Error creating test order:'), error);
      process.exit(1);
    });
} else {
  // For multiple orders, use the parallel processing function
  createMultipleTestOrders(options)
    .then(() => {
      // All database connections are closed in the function
      console.log(chalk.green('All database connections closed.'));
    })
    .catch(error => {
      console.error(chalk.red('Error creating multiple test orders:'), error);
      process.exit(1);
    });
}
