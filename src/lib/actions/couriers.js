'use server';

import { db } from '@/lib/db';
import { couriers, orders, courierTracking } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';
import * as pathaoCourier from '@/lib/services/pathao-courier';

/**
 * Get all couriers
 * @returns {Promise<Array>} - List of couriers
 */
export async function getAllCouriers() {
  try {
    const couriersList = await db
      .select({
        id: couriers.id,
        name: couriers.name,
        description: couriers.description,
        is_active: couriers.is_active,
        created_at: couriers.created_at,
        updated_at: couriers.updated_at,
      })
      .from(couriers)
      .orderBy(couriers.name);

    return couriersList;
  } catch (error) {
    console.error('Error fetching couriers:', error);
    return [];
  }
}

/**
 * Get courier by ID
 * @param {number} id - Courier ID
 * @returns {Promise<object|null>} - Courier information
 */
export async function getCourierById(id) {
  try {
    const courierData = await db
      .select({
        id: couriers.id,
        name: couriers.name,
        description: couriers.description,
        is_active: couriers.is_active,
        created_at: couriers.created_at,
        updated_at: couriers.updated_at,
      })
      .from(couriers)
      .where(eq(couriers.id, id))
      .limit(1);

    return courierData.length ? courierData[0] : null;
  } catch (error) {
    console.error(`Error fetching courier with ID ${id}:`, error);
    return null;
  }
}

/**
 * Create a new courier
 * @param {object} courierData - Courier data
 * @returns {Promise<object|null>} - Created courier
 */
export async function createCourier(courierData) {
  try {
    const result = await db.insert(couriers).values({
      name: courierData.name,
      description: courierData.description,
      is_active: courierData.is_active ?? true,
    }).returning();

    return result.length ? result[0] : null;
  } catch (error) {
    console.error('Error creating courier:', error);
    return null;
  }
}

/**
 * Update a courier
 * @param {number} id - Courier ID
 * @param {object} courierData - Updated courier data
 * @returns {Promise<object|null>} - Updated courier
 */
export async function updateCourier(id, courierData) {
  try {
    const result = await db.update(couriers)
      .set({
        name: courierData.name,
        description: courierData.description,
        is_active: courierData.is_active,
        updated_at: new Date(),
      })
      .where(eq(couriers.id, id))
      .returning();

    return result.length ? result[0] : null;
  } catch (error) {
    console.error(`Error updating courier with ID ${id}:`, error);
    return null;
  }
}

/**
 * Delete a courier
 * @param {number} id - Courier ID
 * @returns {Promise<boolean>} - Success status
 */
export async function deleteCourier(id) {
  try {
    await db.delete(couriers).where(eq(couriers.id, id));
    return true;
  } catch (error) {
    console.error(`Error deleting courier with ID ${id}:`, error);
    return false;
  }
}

/**
 * Assign a courier to an order
 * @param {number} orderId - Order ID
 * @param {number} courierId - Courier ID
 * @param {object} deliveryInfo - Delivery information
 * @returns {Promise<object|null>} - Updated order
 */
export async function assignCourierToOrder(orderId, courierId, deliveryInfo) {
  try {
    // Get courier information
    const courier = await getCourierById(courierId);
    if (!courier) {
      throw new Error(`Courier with ID ${courierId} not found`);
    }

    // Update order with courier information
    const result = await db.update(orders)
      .set({
        courier_id: courierId,
        shipping_address: deliveryInfo.address,
        shipping_city: deliveryInfo.city,
        shipping_post_code: deliveryInfo.post_code,
        shipping_phone: deliveryInfo.phone,
        updated_at: new Date(),
      })
      .where(eq(orders.id, orderId))
      .returning();

    return result.length ? result[0] : null;
  } catch (error) {
    console.error(`Error assigning courier to order ${orderId}:`, error);
    return null;
  }
}

/**
 * Create a courier order with Pathao
 * @param {number} orderId - Order ID
 * @param {object} pathaoOrderData - Pathao order data
 * @returns {Promise<object|null>} - Created courier order
 */
export async function createCourierOrder(orderId, pathaoOrderData) {
  try {
    // Create order with Pathao API
    const pathaoResponse = await pathaoCourier.createOrder(pathaoOrderData);

    if (!pathaoResponse || !pathaoResponse.consignment_id) {
      throw new Error('Failed to create Pathao courier order');
    }

    // Update order with courier order information
    const result = await db.update(orders)
      .set({
        courier_order_id: pathaoResponse.consignment_id,
        courier_tracking_id: pathaoResponse.consignment_id,
        courier_status: 'pending',
        status: 'processing', // Update main order status
        updated_at: new Date(),
      })
      .where(eq(orders.id, orderId))
      .returning();

    // Create initial tracking entry
    await db.insert(courierTracking).values({
      order_id: orderId,
      courier_id: result[0].courier_id,
      tracking_id: pathaoResponse.consignment_id,
      status: 'pending',
      details: 'Order created with courier',
      location: 'Merchant',
      timestamp: new Date(),
    });

    return result.length ? result[0] : null;
  } catch (error) {
    console.error(`Error creating courier order for order ${orderId}:`, error);
    return null;
  }
}

/**
 * Update courier tracking information
 * @param {number} orderId - Order ID
 * @returns {Promise<object|null>} - Updated tracking information
 */
export async function updateCourierTracking(orderId) {
  try {
    // Get order information
    const orderData = await db
      .select({
        id: orders.id,
        courier_id: orders.courier_id,
        courier_tracking_id: orders.courier_tracking_id,
      })
      .from(orders)
      .where(eq(orders.id, orderId))
      .limit(1);

    if (!orderData.length || !orderData[0].courier_tracking_id) {
      throw new Error(`Order ${orderId} not found or has no tracking ID`);
    }

    const order = orderData[0];

    // Get tracking information from Pathao API
    const trackingInfo = await pathaoCourier.trackOrder(order.courier_tracking_id);

    if (!trackingInfo || !trackingInfo.data) {
      throw new Error('Failed to get tracking information from Pathao');
    }

    // Map Pathao status to our internal status
    const courierStatus = pathaoCourier.mapPathaoStatus(trackingInfo.data.order_status);

    // Update order with latest status
    await db.update(orders)
      .set({
        courier_status: courierStatus,
        // Update main order status based on courier status
        status: courierStatus === 'delivered' ? 'delivered' :
                courierStatus === 'returned' ? 'cancelled' :
                courierStatus === 'cancelled' ? 'cancelled' :
                'shipped',
        updated_at: new Date(),
      })
      .where(eq(orders.id, orderId));

    // Create tracking entry
    const trackingEntry = await db.insert(courierTracking).values({
      order_id: orderId,
      courier_id: order.courier_id,
      tracking_id: order.courier_tracking_id,
      status: courierStatus,
      details: trackingInfo.data.order_status_text || trackingInfo.data.order_status,
      location: trackingInfo.data.current_location || 'Unknown',
      timestamp: new Date(trackingInfo.data.updated_at) || new Date(),
    }).returning();

    return trackingEntry.length ? trackingEntry[0] : null;
  } catch (error) {
    console.error(`Error updating courier tracking for order ${orderId}:`, error);
    return null;
  }
}

/**
 * Get tracking history for an order
 * @param {number} orderId - Order ID
 * @returns {Promise<Array>} - Tracking history
 */
export async function getTrackingHistory(orderId) {
  try {
    const trackingHistory = await db
      .select({
        id: courierTracking.id,
        tracking_id: courierTracking.tracking_id,
        status: courierTracking.status,
        details: courierTracking.details,
        location: courierTracking.location,
        timestamp: courierTracking.timestamp,
        created_at: courierTracking.created_at,
      })
      .from(courierTracking)
      .where(eq(courierTracking.order_id, orderId))
      .orderBy(desc(courierTracking.timestamp));

    return trackingHistory;
  } catch (error) {
    console.error(`Error fetching tracking history for order ${orderId}:`, error);
    return [];
  }
}

/**
 * Update order status from webhook data
 * @param {object} webhookData - Processed webhook data
 * @returns {Promise<object|null>} - Updated tracking entry
 */
export async function updateOrderFromWebhook(webhookData) {
  try {
    if (!webhookData.orderId || !webhookData.consignmentId) {
      throw new Error('Missing required webhook data: orderId or consignmentId');
    }

    console.log(`Updating order ${webhookData.orderId} from webhook:`, JSON.stringify(webhookData, null, 2));

    // Get order information
    const orderData = await db
      .select({
        id: orders.id,
        courier_id: orders.courier_id,
      })
      .from(orders)
      .where(eq(orders.id, webhookData.orderId))
      .limit(1);

    if (!orderData.length) {
      throw new Error(`Order ${webhookData.orderId} not found`);
    }

    const order = orderData[0];

    // Update order with latest status
    await db.update(orders)
      .set({
        courier_status: webhookData.courierStatus,
        status: webhookData.orderStatus,
        updated_at: new Date(),
      })
      .where(eq(orders.id, webhookData.orderId));

    // Create tracking entry
    const trackingEntry = await db.insert(courierTracking).values({
      order_id: webhookData.orderId,
      courier_id: order.courier_id,
      tracking_id: webhookData.consignmentId,
      status: webhookData.courierStatus,
      details: webhookData.details,
      location: 'Pathao Courier',
      timestamp: new Date(webhookData.timestamp),
    }).returning();

    return trackingEntry.length ? trackingEntry[0] : null;
  } catch (error) {
    console.error(`Error updating order from webhook:`, error);
    return null;
  }
}

/**
 * Initialize Pathao courier in the database
 * @returns {Promise<object|null>} - Created courier
 */
export async function initializePathaoCourier() {
  try {
    // Check if Pathao courier already exists
    const existingCourier = await db
      .select({ id: couriers.id })
      .from(couriers)
      .where(eq(couriers.name, 'Pathao'))
      .limit(1);

    if (existingCourier.length) {
      console.log('Pathao courier already exists');
      return existingCourier[0];
    }

    // Create Pathao courier
    const result = await db.insert(couriers).values({
      name: 'Pathao',
      description: 'Pathao Courier Service',
      is_active: true,
    }).returning();

    return result.length ? result[0] : null;
  } catch (error) {
    console.error('Error initializing Pathao courier:', error);
    return null;
  }
}
