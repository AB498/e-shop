#!/usr/bin/env node

/**
 * Test Order Creation Script
 *
 * This script creates a test order using existing products and users.
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
 *   --help                  Show this help message
 *
 * Examples:
 *   node scripts/test-order.js
 *   node scripts/test-order.js --user customer@example.com
 *   node scripts/test-order.js --products 1,2,3 --quantities 2,1,3
 *   node scripts/test-order.js --status processing
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
    status: 'pending'
  };

  // Check for help flag
  if (args.includes('--help') || args.includes('-h')) {
    console.log(chalk.cyan('Test Order Creation Script'));
    console.log(chalk.cyan('========================='));
    console.log('');
    console.log('This script creates a test order using existing products and users.');
    console.log('');
    console.log(chalk.cyan('Options:'));
    console.log('  --user <id|email>       Specify user by ID or email (default: first customer in database)');
    console.log('  --products <ids|skus>   Comma-separated list of product IDs or SKUs (default: 3 random products)');
    console.log('  --quantities <numbers>  Comma-separated list of quantities for each product (default: random 1-3)');
    console.log('  --status <status>       Order status (default: pending)');
    console.log('                           Valid values: pending, processing, in_transit, shipped, delivered, cancelled');
    console.log('  --help                  Show this help message');
    console.log('');
    console.log(chalk.cyan('Examples:'));
    console.log('  node scripts/test-order.js');
    console.log('  node scripts/test-order.js --user customer@example.com');
    console.log('  node scripts/test-order.js --products 1,2,3 --quantities 2,1,3');
    console.log('  node scripts/test-order.js --status processing');
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
async function createTestOrder(options) {
  console.log(chalk.blue('Starting test order creation process...'));
  console.log(chalk.blue('Using options:'), options);

  try {
    // Check if DATABASE_URL is set
    if (!process.env.DATABASE_URL) {
      throw new Error('DATABASE_URL environment variable is not set. Please check your .env file.');
    }

    // Test database connection
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

    // Step 1: Get the specified user or a default test user
    console.log(chalk.blue('Finding user...'));
    let testUser;

    if (options.user) {
      // Check if the user parameter is an email or an ID
      const isEmail = options.user.includes('@');
      const query = isEmail
        ? eq(schema.users.email, options.user)
        : eq(schema.users.id, parseInt(options.user, 10));

      const users = await db
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
      const users = await db
        .select()
        .from(schema.users)
        .where(eq(schema.users.role, 'customer'))
        .limit(1);

      if (!users || users.length === 0) {
        throw new Error('No customer users found in the database. Please seed the database first.');
      }

      testUser = users[0];
    }

    console.log(chalk.green(`Found user: ${testUser.first_name} ${testUser.last_name} (${testUser.email})`));

    // Step 2: Get the specified products or random products
    console.log(chalk.blue('Finding products...'));
    let products = [];

    if (options.products && options.products.length > 0) {
      // Get products by ID or SKU
      for (const productIdentifier of options.products) {
        // Check if the product identifier is a number (ID) or string (SKU)
        const isId = !isNaN(parseInt(productIdentifier, 10));
        const query = isId
          ? eq(schema.products.id, parseInt(productIdentifier, 10))
          : eq(schema.products.sku, productIdentifier);

        const productResults = await db
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
      products = await db
        .select()
        .from(schema.products)
        .limit(3);

      if (!products || products.length === 0) {
        throw new Error('No products found in the database. Please seed the database first.');
      }
    }

    console.log(chalk.green(`Found ${products.length} products for the test order`));
    products.forEach(product => {
      console.log(chalk.green(`- ${product.name} (${product.sku}) - $${product.price}`));
    });

    // Step 3: Create an order
    console.log(chalk.blue('Creating order...'));

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
    const [order] = await db.insert(schema.orders).values({
      user_id: testUser.id,
      status: options.status,
      total: total.toFixed(2),
      shipping_address: testUser.address || '123 Test Street',
      shipping_city: testUser.city || 'Test City',
      shipping_post_code: testUser.post_code || '12345',
      shipping_phone: testUser.phone || '+8801712345678'
    }).returning();

    console.log(chalk.green(`Created order #${order.id} with total $${order.total}`));

    // Step 4: Create order items
    console.log(chalk.blue('Adding items to order...'));
    const items = [];

    for (const item of orderItems) {
      const [orderItem] = await db.insert(schema.orderItems).values({
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

    console.log(chalk.green(`Added ${items.length} items to order #${order.id}`));
    items.forEach(item => {
      console.log(chalk.green(`- ${item.quantity}x ${item.name} @ $${item.price} each`));
    });

    // Step 5: Update product stock
    console.log(chalk.blue('Updating product stock...'));

    for (const item of orderItems) {
      const product = products.find(p => p.id === item.product_id);
      const newStock = parseInt(product.stock) - item.quantity;

      await db.update(schema.products)
        .set({ stock: newStock })
        .where(eq(schema.products.id, item.product_id));

      console.log(chalk.green(`Updated stock for ${product.name}: ${product.stock} → ${newStock}`));
    }

    console.log(chalk.green.bold('\nTest order created successfully!'));
    console.log(chalk.yellow('Order Summary:'));
    console.log(chalk.yellow(`Order ID: ${order.id}`));
    console.log(chalk.yellow(`Customer: ${testUser.first_name} ${testUser.last_name}`));
    console.log(chalk.yellow(`Total: $${order.total}`));
    console.log(chalk.yellow(`Status: ${order.status}`));
    console.log(chalk.yellow(`Items: ${items.length}`));

    // Close the database connection
    await pool.end();

    return {
      success: true,
      order,
      user: testUser,
      items
    };
  } catch (error) {
    console.error(chalk.red('Error creating test order:'), error);

    // Close the database connection
    try {
      await pool.end();
    } catch (err) {
      console.error(chalk.red('Error closing database connection:'), err);
    }

    process.exit(1);
  }
}

// Run the function with the parsed options
createTestOrder(options);
