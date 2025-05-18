'use server';

import { db } from '@/lib/db';
import { couriers, orders, courierTracking, deliveryPersons } from '@/db/schema';
import { eq, desc, sql, and, isNull } from 'drizzle-orm';
import * as pathaoCourier from '@/lib/services/pathao-courier';
import * as steadfastCourier from '@/lib/services/steadfast-courier';
import { mapCourierStatusToOrderStatus } from '@/lib/utils/status-mapping';

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
        courier_type: couriers.courier_type,
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
        courier_type: couriers.courier_type,
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
      courier_type: courierData.courier_type || 'external',
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
        courier_type: courierData.courier_type,
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
 * Create a courier order with Pathao or Steadfast
 * @param {number} orderId - Order ID
 * @param {object} courierOrderData - Courier order data
 * @param {string} courierType - Courier type ('pathao' or 'steadfast')
 * @returns {Promise<object|null>} - Created courier order
 */
export async function createCourierOrder(orderId, courierOrderData, courierType = 'pathao') {
  try {
    let courierResponse;
    let merchantOrderId;
    let trackingId;

    // Create order with the appropriate courier API
    if (courierType === 'steadfast') {
      courierResponse = await steadfastCourier.createOrder(courierOrderData);

      if (!courierResponse || !courierResponse.consignment || !courierResponse.consignment.consignment_id) {
        throw new Error('Failed to create Steadfast courier order');
      }

      // Log the Steadfast response for debugging
      console.log('Steadfast response for createCourierOrder:', JSON.stringify(courierResponse, null, 2));

      // Extract tracking information
      merchantOrderId = courierOrderData.invoice;
      trackingId = courierResponse.consignment.tracking_code;
    } else {
      // Default to Pathao
      courierResponse = await pathaoCourier.createOrder(courierOrderData);

      if (!courierResponse || !courierResponse.consignment_id) {
        throw new Error('Failed to create Pathao courier order');
      }

      // Log the Pathao response for debugging
      console.log('Pathao response for createCourierOrder:', JSON.stringify(courierResponse, null, 2));

      // Extract tracking information
      merchantOrderId = courierOrderData.merchant_order_id;
      trackingId = courierResponse.consignment_id;
    }

    console.log(`Using merchant_order_id: ${merchantOrderId}, tracking_id: ${trackingId}`);

    // Update order with courier order information
    const result = await db.update(orders)
      .set({
        courier_order_id: merchantOrderId,
        courier_tracking_id: trackingId,
        courier_status: 'pending',
        status: 'processing', // Update main order status
        updated_at: new Date(),
      })
      .where(eq(orders.id, orderId))
      .returning();

    // Create initial tracking entry with a consistent timestamp
    const timestamp = new Date();
    await db.insert(courierTracking).values({
      order_id: orderId,
      courier_id: result[0].courier_id,
      tracking_id: trackingId,
      status: 'pending',
      details: 'Order created with courier',
      location: 'Merchant',
      timestamp: timestamp,
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
    // Get order information including current status
    const orderData = await db
      .select({
        id: orders.id,
        courier_id: orders.courier_id,
        courier_tracking_id: orders.courier_tracking_id,
        courier_order_id: orders.courier_order_id,
        courier_status: orders.courier_status,
        status: orders.status,
      })
      .from(orders)
      .where(eq(orders.id, orderId))
      .limit(1);

    if (!orderData.length || !orderData[0].courier_tracking_id) {
      throw new Error(`Order ${orderId} not found or has no tracking ID`);
    }

    const order = orderData[0];

    // Get courier information
    const courierInfo = await db
      .select({
        id: couriers.id,
        name: couriers.name,
      })
      .from(couriers)
      .where(eq(couriers.id, order.courier_id))
      .limit(1);

    if (!courierInfo.length) {
      throw new Error(`Courier with ID ${order.courier_id} not found`);
    }

    const courier = courierInfo[0];
    let trackingInfo;
    let courierStatus;
    let statusDetails;
    let statusLocation;
    let statusTimestamp;

    // Get tracking information from the appropriate courier API
    if (courier.name === 'Steadfast') {
      // Use Steadfast API
      trackingInfo = await steadfastCourier.trackOrderByTrackingCode(order.courier_tracking_id);

      if (!trackingInfo || !trackingInfo.delivery_status) {
        throw new Error('Failed to get tracking information from Steadfast');
      }

      // Map Steadfast status to our internal status
      courierStatus = await steadfastCourier.mapSteadfastStatus(trackingInfo.delivery_status);
      console.log(`Courier status: ${courierStatus}, Steadfast status: ${trackingInfo.delivery_status}`);

      statusDetails = trackingInfo.delivery_status;
      statusLocation = 'Steadfast Courier';
      statusTimestamp = new Date();
    } else {
      // Default to Pathao API
      trackingInfo = await pathaoCourier.trackOrder(order.courier_tracking_id);

      if (!trackingInfo || !trackingInfo.data) {
        throw new Error('Failed to get tracking information from Pathao');
      }

      // Map Pathao status to our internal status
      courierStatus = await pathaoCourier.mapPathaoStatus(trackingInfo.data.order_status);
      console.log(`Courier status: ${courierStatus}, Pathao status: ${trackingInfo.data.order_status}`);

      statusDetails = trackingInfo.data.order_status_text || trackingInfo.data.order_status;
      statusLocation = trackingInfo.data.current_location || 'Unknown';
      statusTimestamp = trackingInfo.data.updated_at ? new Date(trackingInfo.data.updated_at) : new Date();
    }

    // Only update the order status if the courier status has actually changed
    // First, get the current courier status
    const currentStatus = order.courier_status || 'pending';

    // Only update if the status has changed
    if (courierStatus !== currentStatus) {
      // Map courier status to order status using our utility function
      // Pass the current order status to ensure proper transitions
      const newOrderStatus = await mapCourierStatusToOrderStatus(courierStatus, order.status);

      console.log(`Updating order status from ${order.status} to ${newOrderStatus} based on courier status ${courierStatus}`);

      // Update order with latest status
      await db.update(orders)
        .set({
          courier_status: courierStatus,
          status: newOrderStatus,
          updated_at: new Date(),
        })
        .where(eq(orders.id, orderId));
    }

    // Get all existing tracking entries for this order
    const allTrackingEntries = await db
      .select({
        id: courierTracking.id,
        status: courierTracking.status,
        details: courierTracking.details,
        location: courierTracking.location,
      })
      .from(courierTracking)
      .where(
        and(
          eq(courierTracking.order_id, orderId),
          eq(courierTracking.tracking_id, order.courier_tracking_id)
        )
      )
      .orderBy(desc(courierTracking.timestamp));

    // Check if a tracking entry with the same status already exists
    const existingEntries = allTrackingEntries.filter(entry =>
      entry.status === courierStatus &&
      entry.details === statusDetails
    );

    // Check if we should skip creating a new entry
    // If the status is still "pending" and the details are generic, and we already have an initial entry
    const shouldSkipGenericPending = false;

    let trackingEntry;

    // Only create a new entry if:
    // 1. One doesn't already exist with the same status and details, AND
    // 2. We're not dealing with a generic "Pending" status when we already have an initial entry
    if (existingEntries.length === 0 && !shouldSkipGenericPending) {
      trackingEntry = await db.insert(courierTracking).values({
        order_id: orderId,
        courier_id: order.courier_id,
        tracking_id: order.courier_tracking_id,
        status: courierStatus,
        details: statusDetails,
        location: statusLocation,
        timestamp: statusTimestamp,
      }).returning();
    } else {
      // Return the existing entry or the initial "Order created with courier" entry
      if (existingEntries.length > 0) {
        trackingEntry = existingEntries;
      } else {
        // Find the initial entry
        const initialEntry = allTrackingEntries.find(entry =>
          entry.status === 'pending' &&
          entry.details === 'Order created with courier'
        );
        trackingEntry = initialEntry ? [initialEntry] : [];
      }
    }

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
    // Check if we have a consignment ID at minimum
    if (!webhookData.consignmentId) {
      throw new Error('Missing required webhook data: consignmentId');
    }

    let orderId = webhookData.orderId;
    let orderData = [];

    // If we don't have an order ID but we have a consignment ID or merchant_order_id, try to look up the order
    if (!orderId) {
      // First, try to find the order by merchant_order_id
      if (webhookData.merchantOrderId) {
        console.log(`Looking up order by merchant_order_id: ${webhookData.merchantOrderId}`);

        // Try to find the order by merchant_order_id directly
        orderData = await db
          .select({
            id: orders.id,
            courier_id: orders.courier_id,
          })
          .from(orders)
          .where(eq(orders.courier_order_id, webhookData.merchantOrderId))
          .limit(1);

        if (!orderData.length) {
          // Try with courier_tracking_id as well
          orderData = await db
            .select({
              id: orders.id,
              courier_id: orders.courier_id,
            })
            .from(orders)
            .where(eq(orders.courier_tracking_id, webhookData.merchantOrderId))
            .limit(1);
        }

        if (orderData.length) {
          orderId = orderData[0].id;
          console.log(`Found order ID ${orderId} by merchant_order_id ${webhookData.merchantOrderId}`);
        } else {
          console.log(`Could not find order by merchant_order_id ${webhookData.merchantOrderId}, trying consignment_id`);
        }
      }

      // If we still don't have an order, try by consignment_id
      if (!orderData.length && webhookData.consignmentId) {
        console.log(`Looking up order by consignment_id: ${webhookData.consignmentId}`);

        // Try to find the order by consignment ID (courier_order_id or courier_tracking_id)
        orderData = await db
          .select({
            id: orders.id,
            courier_id: orders.courier_id,
          })
          .from(orders)
          .where(eq(orders.courier_order_id, webhookData.consignmentId))
          .limit(1);

        if (!orderData.length) {
          // Try with courier_tracking_id as well
          orderData = await db
            .select({
              id: orders.id,
              courier_id: orders.courier_id,
            })
            .from(orders)
            .where(eq(orders.courier_tracking_id, webhookData.consignmentId))
            .limit(1);
        }

        if (orderData.length) {
          orderId = orderData[0].id;
          console.log(`Found order ID ${orderId} by consignment_id ${webhookData.consignmentId}`);
        } else {
          console.error(`Could not find order by consignment_id ${webhookData.consignmentId}`);
        }
      }

      // If we still don't have an order, try a broader search
      if (!orderData.length) {
        console.log(`Trying to find any order with courier tracking information...`);

        // Get all orders with courier tracking information
        const allOrdersWithTracking = await db
          .select({
            id: orders.id,
            courier_id: orders.courier_id,
            courier_order_id: orders.courier_order_id,
            courier_tracking_id: orders.courier_tracking_id,
          })
          .from(orders)
          .where(
            sql`${orders.courier_order_id} IS NOT NULL OR ${orders.courier_tracking_id} IS NOT NULL`
          )
          .limit(10);

        console.log(`Found ${allOrdersWithTracking.length} orders with tracking information:`);
        allOrdersWithTracking.forEach(order => {
          console.log(`Order ID: ${order.id}, courier_order_id: ${order.courier_order_id}, courier_tracking_id: ${order.courier_tracking_id}`);
        });

        // If we still can't find the order, return null
        if (!orderData.length) {
          console.error(`Could not find any matching order for webhook data`);
          return null;
        }
      }
    } else {
      // We have an order ID, get the order information
      console.log(`Updating order ${orderId} from webhook:`, JSON.stringify(webhookData, null, 2));

      orderData = await db
        .select({
          id: orders.id,
          courier_id: orders.courier_id,
        })
        .from(orders)
        .where(eq(orders.id, orderId))
        .limit(1);

      if (!orderData.length) {
        console.error(`Order ${orderId} not found`);
        return null;
      }
    }

    const order = orderData[0];

    // Get the current order status
    const currentOrderData = await db
      .select({
        status: orders.status,
      })
      .from(orders)
      .where(eq(orders.id, order.id))
      .limit(1);

    const currentOrderStatus = currentOrderData.length ? currentOrderData[0].status : null;

    // Only update order status if this is not just a tracking update
    // and we have a courier status
    if (!webhookData.isTrackingUpdate && webhookData.courierStatus) {
      // Map courier status to order status using our utility function
      // Pass the current order status to ensure proper transitions
      const newOrderStatus = await mapCourierStatusToOrderStatus(webhookData.courierStatus, currentOrderStatus);

      console.log(`Webhook: Updating order status from ${currentOrderStatus} to ${newOrderStatus} based on courier status ${webhookData.courierStatus}`);

      // Update order with latest status
      await db.update(orders)
        .set({
          courier_status: webhookData.courierStatus,
          status: newOrderStatus,
          updated_at: new Date(),
        })
        .where(eq(orders.id, order.id));
    } else if (webhookData.isTrackingUpdate) {
      console.log(`Webhook: Processing tracking update without changing order status`);
    } else {
      console.log(`Webhook: No courier status provided, skipping order status update`);
    }

    // Always create a new tracking entry for webhook events
    // This ensures that the tracking history is properly updated with each webhook event

    // For tracking updates without status change, use the current status
    const entryStatus = webhookData.courierStatus || currentOrderStatus || 'pending';

    // Use consignmentId for tracking_id if available, otherwise use merchantOrderId
    const trackingId = webhookData.consignmentId || webhookData.merchantOrderId;

    const trackingEntry = await db.insert(courierTracking).values({
      order_id: order.id,
      courier_id: order.courier_id,
      tracking_id: trackingId,
      status: entryStatus,
      details: webhookData.details,
      location: webhookData.location || 'Courier Service',
      timestamp: webhookData.timestamp ? new Date(webhookData.timestamp) : new Date(),
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
      courier_type: 'external',
      is_active: true,
    }).returning();

    return result.length ? result[0] : null;
  } catch (error) {
    console.error('Error initializing Pathao courier:', error);
    return null;
  }
}

/**
 * Initialize internal courier in the database
 * @returns {Promise<object|null>} - Created courier
 */
export async function initializeInternalCourier() {
  try {
    // Check if internal courier already exists
    const existingCourier = await db
      .select({ id: couriers.id })
      .from(couriers)
      .where(eq(couriers.name, 'Internal Delivery'))
      .limit(1);

    if (existingCourier.length) {
      console.log('Internal courier already exists');
      return existingCourier[0];
    }

    // Create internal courier
    const result = await db.insert(couriers).values({
      name: 'Internal Delivery',
      description: 'Our own delivery service',
      courier_type: 'internal',
      is_active: false, // Disabled by default as per requirements
    }).returning();

    return result.length ? result[0] : null;
  } catch (error) {
    console.error('Error initializing internal courier:', error);
    return null;
  }
}

/**
 * Initialize Steadfast courier in the database
 * @returns {Promise<object|null>} - Created courier
 */
export async function initializeSteadfastCourier() {
  try {
    // Check if Steadfast courier already exists
    const existingCourier = await db
      .select({ id: couriers.id })
      .from(couriers)
      .where(eq(couriers.name, 'Steadfast'))
      .limit(1);

    if (existingCourier.length) {
      console.log('Steadfast courier already exists');
      return existingCourier[0];
    }

    // Create Steadfast courier
    const result = await db.insert(couriers).values({
      name: 'Steadfast',
      description: 'Steadfast Courier Limited',
      courier_type: 'external',
      is_active: true,
    }).returning();

    return result.length ? result[0] : null;
  } catch (error) {
    console.error('Error initializing Steadfast courier:', error);
    return null;
  }
}
