'use server';

// This file contains server actions for fetching order data

import { db } from '@/lib/db';
import { orders, orderItems, products, couriers, courierTracking } from '@/db/schema';
import { eq, desc, and } from 'drizzle-orm';

/**
 * Get orders for a specific user
 * @param {number} userId - User ID
 * @returns {Promise<Array>} - Array of orders with items
 */
export async function getUserOrders(userId) {
  try {
    console.log('getUserOrders called with userId:', userId, 'Type:', typeof userId);

    if (!userId) {
      console.log('No userId provided, returning empty array');
      return [];
    }

    // Ensure userId is a number
    const numericUserId = typeof userId === 'string' ? parseInt(userId, 10) : userId;

    if (isNaN(numericUserId)) {
      console.error('Invalid userId provided:', userId);
      return [];
    }

    // Get all orders for the user, ordered by most recent first
    console.log('Fetching orders for user ID:', numericUserId);
    const userOrders = await db
      .select({
        id: orders.id,
        status: orders.status,
        total: orders.total,
        courier_id: orders.courier_id,
        courier_tracking_id: orders.courier_tracking_id,
        courier_status: orders.courier_status,
        created_at: orders.created_at,
        updated_at: orders.updated_at,
      })
      .from(orders)
      .where(eq(orders.user_id, numericUserId))
      .orderBy(desc(orders.created_at));

    console.log('Found orders:', userOrders.length);

    // For each order, get the order items
    const ordersWithItems = await Promise.all(
      userOrders.map(async (order) => {
        // Get order items with product details
        const items = await db
          .select({
            id: orderItems.id,
            quantity: orderItems.quantity,
            price: orderItems.price,
            discount_price: orderItems.discount_price,
            product_id: orderItems.product_id,
            product_name: products.name,
            product_image: products.image,
          })
          .from(orderItems)
          .leftJoin(products, eq(orderItems.product_id, products.id))
          .where(eq(orderItems.order_id, order.id));

        return {
          ...order,
          items,
          // Format dates for display
          created_at: new Date(order.created_at).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'numeric',
            day: 'numeric',
          }),
          updated_at: new Date(order.updated_at).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'numeric',
            day: 'numeric',
          }),
          // Format status for display (capitalize first letter)
          status: order.status.charAt(0).toUpperCase() + order.status.slice(1),
        };
      })
    );

    console.log('Returning orders with items:', ordersWithItems.length);
    return ordersWithItems;
  } catch (error) {
    console.error('Error fetching user orders:', error);
    return [];
  }
}

/**
 * Get a specific order with its items
 * @param {number} orderId - Order ID
 * @param {number} userId - User ID (for security)
 * @returns {Promise<Object|null>} - Order with items or null if not found
 */
export async function getOrderDetails(orderId, userId) {
  try {
    console.log('getOrderDetails called with orderId:', orderId, 'userId:', userId);

    if (!orderId) {
      console.log('No orderId provided, returning null');
      return null;
    }

    // Ensure orderId is a number
    const numericOrderId = typeof orderId === 'string' ? parseInt(orderId, 10) : orderId;

    if (isNaN(numericOrderId)) {
      console.error('Invalid orderId provided:', orderId);
      return null;
    }

    // Ensure userId is a number if provided
    let numericUserId = null;
    if (userId) {
      numericUserId = typeof userId === 'string' ? parseInt(userId, 10) : userId;

      if (isNaN(numericUserId)) {
        console.error('Invalid userId provided:', userId);
        return null;
      }
    }

    // Get the order, ensuring it belongs to the user if userId is provided
    const query = numericUserId
      ? and(eq(orders.id, numericOrderId), eq(orders.user_id, numericUserId))
      : eq(orders.id, numericOrderId);

    const orderData = await db
      .select({
        id: orders.id,
        user_id: orders.user_id,
        status: orders.status,
        total: orders.total,
        payment_method: orders.payment_method,
        courier_id: orders.courier_id,
        courier_order_id: orders.courier_order_id,
        courier_tracking_id: orders.courier_tracking_id,
        courier_status: orders.courier_status,
        shipping_address: orders.shipping_address,
        shipping_city: orders.shipping_city,
        shipping_post_code: orders.shipping_post_code,
        shipping_phone: orders.shipping_phone,
        created_at: orders.created_at,
        updated_at: orders.updated_at,
      })
      .from(orders)
      .where(query)
      .limit(1);

    if (!orderData.length) {
      return null;
    }

    const order = orderData[0];

    // Get order items with product details
    const items = await db
      .select({
        id: orderItems.id,
        quantity: orderItems.quantity,
        price: orderItems.price,
        discount_price: orderItems.discount_price,
        product_id: orderItems.product_id,
        product_name: products.name,
        product_image: products.image,
      })
      .from(orderItems)
      .leftJoin(products, eq(orderItems.product_id, products.id))
      .where(eq(orderItems.order_id, order.id));

    // Get courier information if available
    let courierInfo = null;
    if (order.courier_id) {
      const courierData = await db
        .select({
          id: couriers.id,
          name: couriers.name,
          description: couriers.description,
        })
        .from(couriers)
        .where(eq(couriers.id, order.courier_id))
        .limit(1);

      if (courierData.length) {
        courierInfo = courierData[0];
      }
    }

    // Get tracking information if available
    let trackingInfo = [];
    if (order.courier_tracking_id) {
      trackingInfo = await db
        .select({
          id: courierTracking.id,
          status: courierTracking.status,
          details: courierTracking.details,
          location: courierTracking.location,
          timestamp: courierTracking.timestamp,
        })
        .from(courierTracking)
        .where(eq(courierTracking.tracking_id, order.courier_tracking_id))
        .orderBy(desc(courierTracking.timestamp));
    }

    return {
      ...order,
      items,
      courier: courierInfo,
      tracking: trackingInfo,
      // Format dates for display
      created_at: new Date(order.created_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
      }),
      updated_at: new Date(order.updated_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
      }),
      // Format status for display (capitalize first letter)
      status: order.status.charAt(0).toUpperCase() + order.status.slice(1),
      // Format courier status for display if available
      courier_status: order.courier_status
        ? order.courier_status.charAt(0).toUpperCase() + order.courier_status.slice(1)
        : null,
    };
  } catch (error) {
    console.error('Error fetching order details:', error);
    return null;
  }
}

/**
 * Get tracking information for an order
 * @param {number} orderId - Order ID
 * @param {number} userId - User ID (for security)
 * @returns {Promise<Object|null>} - Tracking information or null if not found
 */
export async function getOrderTracking(orderId, userId) {
  try {
    console.log('getOrderTracking called with orderId:', orderId, 'userId:', userId);

    if (!orderId) {
      console.log('No orderId provided, returning null');
      return null;
    }

    // Ensure orderId is a number
    const numericOrderId = typeof orderId === 'string' ? parseInt(orderId, 10) : orderId;

    if (isNaN(numericOrderId)) {
      console.error('Invalid orderId provided:', orderId);
      return null;
    }

    // Ensure userId is a number if provided
    let numericUserId = null;
    if (userId) {
      numericUserId = typeof userId === 'string' ? parseInt(userId, 10) : userId;

      if (isNaN(numericUserId)) {
        console.error('Invalid userId provided:', userId);
        return null;
      }
    }

    // Get the order, ensuring it belongs to the user if userId is provided
    const query = numericUserId
      ? and(eq(orders.id, numericOrderId), eq(orders.user_id, numericUserId))
      : eq(orders.id, numericOrderId);

    const orderData = await db
      .select({
        id: orders.id,
        courier_id: orders.courier_id,
        courier_tracking_id: orders.courier_tracking_id,
        courier_status: orders.courier_status,
        payment_method: orders.payment_method,
      })
      .from(orders)
      .where(query)
      .limit(1);

    if (!orderData.length) {
      return null;
    }

    const order = orderData[0];

    // If no courier or tracking ID, return empty tracking
    if (!order.courier_id || !order.courier_tracking_id) {
      // Special handling for COD orders without tracking
      if (order.payment_method === 'cod') {
        return {
          order_id: order.id,
          has_tracking: false,
          payment_method: 'cod',
          tracking: []
        };
      }

      return {
        order_id: order.id,
        has_tracking: false,
        tracking: []
      };
    }

    // Get courier information
    const courierData = await db
      .select({
        id: couriers.id,
        name: couriers.name,
      })
      .from(couriers)
      .where(eq(couriers.id, order.courier_id))
      .limit(1);

    // Get tracking information
    const trackingInfo = await db
      .select({
        id: courierTracking.id,
        status: courierTracking.status,
        details: courierTracking.details,
        location: courierTracking.location,
        timestamp: courierTracking.timestamp,
      })
      .from(courierTracking)
      .where(eq(courierTracking.tracking_id, order.courier_tracking_id))
      .orderBy(desc(courierTracking.timestamp));

    return {
      order_id: order.id,
      has_tracking: true,
      courier: courierData.length ? courierData[0] : null,
      tracking_id: order.courier_tracking_id,
      payment_method: order.payment_method,
      current_status: order.courier_status
        ? order.courier_status.charAt(0).toUpperCase() + order.courier_status.slice(1)
        : 'Pending',
      tracking: trackingInfo.map(item => {
        // Create a consistent date object
        const date = new Date(item.timestamp);

        return {
          ...item,
          // Format status for display (capitalize first letter)
          status: item.status.charAt(0).toUpperCase() + item.status.slice(1),
          // Format timestamp for display with proper timezone handling
          // Use a consistent format that respects the local timezone
          timestamp: date.toLocaleString(),
        };
      })
    };
  } catch (error) {
    console.error('Error fetching order tracking:', error);
    return null;
  }
}
