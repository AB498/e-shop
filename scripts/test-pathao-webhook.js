#!/usr/bin/env node

/**
 * Pathao Webhook Tester Script
 *
 * This script simulates Pathao webhook events for an existing order.
 * It updates the order status and creates tracking entries in the database.
 *
 * Usage:
 *   node scripts/test-webhook.js <order_id> <event_type>
 *
 * Example:
 *   node scripts/test-webhook.js 123 order.pickup
 *   node scripts/test-webhook.js 123 order.delivered
 *
 * Available event types:
 *   - order.created
 *   - order.pickup_requested
 *   - order.assigned_for_pickup
 *   - order.pickup
 *   - order.pickup_failed
 *   - order.pickup_cancelled
 *   - order.at_sorting_hub
 *   - order.in_transit
 *   - order.received_at_last_mile_hub
 *   - order.assigned_for_delivery
 *   - order.delivered
 *   - order.partial_delivery
 *   - order.return
 *   - order.delivery_failed
 *   - order.on_hold
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

// Create our own database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false // Allow self-signed certificates for Supabase
  }
});

// Initialize Drizzle ORM
const db = drizzle(pool);

// Import schema
import * as schema from '../src/db/schema.js';

// Import Pathao webhook processing functions
import { processWebhookEvent } from '../src/lib/services/pathao-courier.js';
import { updateOrderFromWebhook } from '../src/lib/actions/couriers.js';

// List of valid event types
const validEventTypes = [
  'order.created',
  'order.pickup_requested',
  'order.assigned_for_pickup',
  'order.pickup',
  'order.pickup_failed',
  'order.pickup_cancelled',
  'order.at_sorting_hub',
  'order.in_transit',
  'order.received_at_last_mile_hub',
  'order.assigned_for_delivery',
  'order.delivered',
  'order.partial_delivery',
  'order.return',
  'order.delivery_failed',
  'order.on_hold'
];

// Main function to test Pathao webhook
async function testPathaoWebhook(orderId, eventType) {
  console.log(chalk.blue(`Starting Pathao webhook test for order #${orderId} with event ${eventType}...`));

  try {
    // Check if DATABASE_URL is set
    if (!process.env.DATABASE_URL) {
      throw new Error('DATABASE_URL environment variable is not set. Please check your .env file.');
    }

    // Validate input parameters
    if (!orderId) {
      throw new Error('Order ID is required. Usage: node scripts/test-webhook.js <order_id> <event_type>');
    }

    if (!eventType) {
      throw new Error('Event type is required. Usage: node scripts/test-webhook.js <order_id> <event_type>');
    }

    if (!validEventTypes.includes(eventType)) {
      throw new Error(`Invalid event type: ${eventType}. Valid event types are: ${validEventTypes.join(', ')}`);
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

    // Check if the order exists
    console.log(chalk.blue(`Checking if order #${orderId} exists...`));
    const orders = await db
      .select()
      .from(schema.orders)
      .where(eq(schema.orders.id, orderId))
      .limit(1);

    if (!orders || orders.length === 0) {
      throw new Error(`Order #${orderId} not found in the database.`);
    }

    const order = orders[0];
    console.log(chalk.green(`Found order #${order.id} with status ${order.status}`));

    // Create mock webhook data
    console.log(chalk.blue('Creating mock webhook data...'));
    const mockWebhookData = {
      event: eventType,
      data: {
        order_id: order.courier_order_id || `PATHAO-${order.id}`,
        merchant_order_id: order.id.toString(),
        consignment_id: order.courier_tracking_id || `TRACK-${order.id}`,
        status: eventType.replace('order.', ''),
        timestamp: new Date().toISOString(),
        city_id: 1,
        zone_id: 1,
        area_id: 1
      }
    };

    console.log(chalk.blue('Processing webhook event...'));
    console.log(chalk.yellow('Mock webhook data:'), JSON.stringify(mockWebhookData, null, 2));

    // Process the webhook event
    const processedData = await processWebhookEvent(mockWebhookData);
    console.log(chalk.green('Webhook event processed successfully.'));
    console.log(chalk.yellow('Processed data:'), JSON.stringify(processedData, null, 2));
    
    // Update order status in database
    console.log(chalk.blue('Updating order status in database...'));
    const result = await updateOrderFromWebhook(processedData);
    
    if (!result) {
      throw new Error(`Failed to update order #${orderId}`);
    }

    console.log(chalk.green.bold(`Successfully updated order #${orderId} status to ${processedData.courierStatus}`));
    
    // Get updated order details
    const updatedOrders = await db
      .select()
      .from(schema.orders)
      .where(eq(schema.orders.id, orderId))
      .limit(1);
      
    const updatedOrder = updatedOrders[0];
    
    // Get tracking entries
    const trackingEntries = await db
      .select()
      .from(schema.courierTracking)
      .where(eq(schema.courierTracking.order_id, orderId))
      .orderBy(schema.courierTracking.timestamp, 'desc')
      .limit(5);
    
    console.log(chalk.yellow('\nUpdated Order Details:'));
    console.log(chalk.yellow(`Order ID: ${updatedOrder.id}`));
    console.log(chalk.yellow(`Status: ${updatedOrder.status}`));
    console.log(chalk.yellow(`Courier Status: ${updatedOrder.courier_status}`));
    
    console.log(chalk.yellow('\nRecent Tracking Entries:'));
    trackingEntries.forEach((entry, index) => {
      console.log(chalk.yellow(`${index + 1}. ${entry.status} - ${entry.timestamp}`));
      console.log(chalk.gray(`   Details: ${entry.details || 'N/A'}`));
    });
    
    // Close the database connection
    await pool.end();
    
    return {
      success: true,
      message: `Successfully updated order #${orderId} status to ${processedData.courierStatus}`,
      mockWebhookData,
      processedData,
      result
    };
  } catch (error) {
    console.error(chalk.red('Error testing Pathao webhook:'), error);
    
    // Close the database connection
    try {
      await pool.end();
    } catch (err) {
      console.error(chalk.red('Error closing database connection:'), err);
    }
    
    process.exit(1);
  }
}

// Get command line arguments
const orderId = process.argv[2];
const eventType = process.argv[3];

// Run the function
testPathaoWebhook(orderId, eventType);
