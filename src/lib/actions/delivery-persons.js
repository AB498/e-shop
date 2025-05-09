'use server';

import { db } from '@/lib/db';
import { deliveryPersons, orders, courierTracking, couriers, users } from '@/db/schema';
import { eq, desc, sql, and, isNull } from 'drizzle-orm';
import { sendDeliveryOTP } from '@/lib/email-service';

/**
 * Get all delivery persons
 * @returns {Promise<Array>} - List of delivery persons
 */
export async function getAllDeliveryPersons() {
  try {
    const deliveryPersonsList = await db
      .select({
        id: deliveryPersons.id,
        name: deliveryPersons.name,
        phone: deliveryPersons.phone,
        email: deliveryPersons.email,
        address: deliveryPersons.address,
        city: deliveryPersons.city,
        area: deliveryPersons.area,
        status: deliveryPersons.status,
        current_orders: deliveryPersons.current_orders,
        total_orders: deliveryPersons.total_orders,
        rating: deliveryPersons.rating,
        profile_image: deliveryPersons.profile_image,
        notes: deliveryPersons.notes,
        created_at: deliveryPersons.created_at,
        updated_at: deliveryPersons.updated_at,
      })
      .from(deliveryPersons)
      .orderBy(desc(deliveryPersons.created_at));

    return deliveryPersonsList;
  } catch (error) {
    console.error('Error getting delivery persons:', error);
    throw new Error('Failed to get delivery persons');
  }
}

/**
 * Get delivery person by ID
 * @param {number} id - Delivery person ID
 * @returns {Promise<object|null>} - Delivery person data
 */
export async function getDeliveryPersonById(id) {
  try {
    const deliveryPersonData = await db
      .select({
        id: deliveryPersons.id,
        name: deliveryPersons.name,
        phone: deliveryPersons.phone,
        email: deliveryPersons.email,
        address: deliveryPersons.address,
        city: deliveryPersons.city,
        area: deliveryPersons.area,
        status: deliveryPersons.status,
        current_orders: deliveryPersons.current_orders,
        total_orders: deliveryPersons.total_orders,
        rating: deliveryPersons.rating,
        profile_image: deliveryPersons.profile_image,
        notes: deliveryPersons.notes,
        created_at: deliveryPersons.created_at,
        updated_at: deliveryPersons.updated_at,
      })
      .from(deliveryPersons)
      .where(eq(deliveryPersons.id, id))
      .limit(1);

    return deliveryPersonData.length ? deliveryPersonData[0] : null;
  } catch (error) {
    console.error(`Error getting delivery person ${id}:`, error);
    throw new Error('Failed to get delivery person');
  }
}

/**
 * Create a new delivery person
 * @param {object} data - Delivery person data
 * @returns {Promise<object|null>} - Created delivery person
 */
export async function createDeliveryPerson(data) {
  try {
    const result = await db.insert(deliveryPersons).values({
      name: data.name,
      phone: data.phone,
      email: data.email || null,
      address: data.address || null,
      city: data.city || null,
      area: data.area || null,
      status: data.status || 'active',
      profile_image: data.profile_image || null,
      notes: data.notes || null,
    }).returning();

    return result.length ? result[0] : null;
  } catch (error) {
    console.error('Error creating delivery person:', error);
    throw new Error('Failed to create delivery person');
  }
}

/**
 * Update a delivery person
 * @param {number} id - Delivery person ID
 * @param {object} data - Updated delivery person data
 * @returns {Promise<object|null>} - Updated delivery person
 */
export async function updateDeliveryPerson(id, data) {
  try {
    const result = await db.update(deliveryPersons)
      .set({
        name: data.name,
        phone: data.phone,
        email: data.email || null,
        address: data.address || null,
        city: data.city || null,
        area: data.area || null,
        status: data.status || 'active',
        profile_image: data.profile_image || null,
        notes: data.notes || null,
        updated_at: new Date(),
      })
      .where(eq(deliveryPersons.id, id))
      .returning();

    return result.length ? result[0] : null;
  } catch (error) {
    console.error(`Error updating delivery person ${id}:`, error);
    throw new Error('Failed to update delivery person');
  }
}

/**
 * Delete a delivery person
 * @param {number} id - Delivery person ID
 * @returns {Promise<object|null>} - Deleted delivery person
 */
export async function deleteDeliveryPerson(id) {
  try {
    // Check if delivery person has any assigned orders
    const assignedOrders = await db
      .select({ id: orders.id })
      .from(orders)
      .where(eq(orders.delivery_person_id, id))
      .limit(1);

    if (assignedOrders.length) {
      throw new Error('Cannot delete delivery person with assigned orders');
    }

    const result = await db.delete(deliveryPersons)
      .where(eq(deliveryPersons.id, id))
      .returning();

    return result.length ? result[0] : null;
  } catch (error) {
    console.error(`Error deleting delivery person ${id}:`, error);
    throw new Error(error.message || 'Failed to delete delivery person');
  }
}

/**
 * Generate a random OTP code
 * @param {number} length - Length of the OTP code
 * @returns {string} - Generated OTP code
 */
function generateOTP(length = 6) {
  const digits = '0123456789';
  let otp = '';
  for (let i = 0; i < length; i++) {
    otp += digits[Math.floor(Math.random() * 10)];
  }
  return otp;
}

/**
 * Assign a delivery person to an order
 * @param {number} orderId - Order ID
 * @param {number} deliveryPersonId - Delivery person ID
 * @returns {Promise<object|null>} - Updated order
 */
export async function assignDeliveryPerson(orderId, deliveryPersonId) {
  try {
    // Get delivery person
    const deliveryPerson = await getDeliveryPersonById(deliveryPersonId);
    if (!deliveryPerson) {
      throw new Error('Delivery person not found');
    }

    // Get internal courier ID (should be 2 based on seed data)
    const internalCourier = await db
      .select()
      .from(couriers)
      .where(and(
        eq(couriers.courier_type, 'internal'),
        eq(couriers.is_active, true)
      ))
      .limit(1);

    if (!internalCourier.length) {
      throw new Error('Internal courier not found');
    }

    const internalCourierId = internalCourier[0].id;

    // Generate OTP for delivery verification
    const otp = generateOTP();
    const now = new Date();

    // Update order with delivery person, internal courier, and OTP
    const result = await db.update(orders)
      .set({
        delivery_person_id: deliveryPersonId,
        courier_id: internalCourierId,
        courier_status: 'assigned',
        status: 'processing',
        delivery_otp: otp,
        delivery_otp_verified: false,
        delivery_otp_sent_at: now,
        updated_at: now,
      })
      .where(eq(orders.id, orderId))
      .returning();

    if (!result.length) {
      throw new Error('Failed to update order');
    }

    // Increment current_orders count for delivery person
    await db.update(deliveryPersons)
      .set({
        current_orders: sql`${deliveryPersons.current_orders} + 1`,
        total_orders: sql`${deliveryPersons.total_orders} + 1`,
        updated_at: new Date(),
      })
      .where(eq(deliveryPersons.id, deliveryPersonId));

    // Create tracking entry
    await db.insert(courierTracking).values({
      order_id: orderId,
      courier_id: internalCourierId,
      tracking_id: `INT-${orderId}`,
      status: 'assigned',
      details: `Order assigned to delivery person: ${deliveryPerson.name}`,
      location: 'Internal Delivery',
      timestamp: new Date(),
    });

    // Get user information to send OTP email
    const orderData = await db
      .select({
        user_id: orders.user_id,
      })
      .from(orders)
      .where(eq(orders.id, orderId))
      .limit(1);

    if (orderData.length) {
      const userData = await db
        .select({
          email: users.email,
          first_name: users.first_name,
          last_name: users.last_name,
        })
        .from(users)
        .where(eq(users.id, orderData[0].user_id))
        .limit(1);

      if (userData.length && userData[0].email) {
        // Send OTP email to customer
        try {
          await sendDeliveryOTP(userData[0].email, {
            orderId,
            otp,
            customerName: `${userData[0].first_name} ${userData[0].last_name}`.trim(),
          });
          console.log(`Delivery OTP sent to customer email: ${userData[0].email}`);
        } catch (emailError) {
          console.error(`Error sending OTP email for order ${orderId}:`, emailError);
          // Continue even if email fails, as the OTP is still stored in the database
        }
      }
    }

    return result[0];
  } catch (error) {
    console.error(`Error assigning delivery person to order ${orderId}:`, error);
    throw new Error('Failed to assign delivery person to order');
  }
}

/**
 * Verify delivery OTP
 * @param {number} orderId - Order ID
 * @param {string} otp - OTP code to verify
 * @returns {Promise<object>} - Verification result
 */
export async function verifyDeliveryOTP(orderId, otp) {
  try {
    // Get order with OTP
    const orderData = await db
      .select({
        id: orders.id,
        delivery_otp: orders.delivery_otp,
        delivery_otp_verified: orders.delivery_otp_verified,
        delivery_person_id: orders.delivery_person_id,
        courier_id: orders.courier_id,
      })
      .from(orders)
      .where(eq(orders.id, orderId))
      .limit(1);

    if (!orderData.length) {
      return { success: false, message: 'Order not found' };
    }

    const order = orderData[0];

    // Check if order has a delivery person assigned
    if (!order.delivery_person_id) {
      return { success: false, message: 'Order does not have a delivery person assigned' };
    }

    // Check if OTP is already verified
    if (order.delivery_otp_verified) {
      return { success: false, message: 'OTP already verified' };
    }

    // Check if OTP matches
    if (order.delivery_otp !== otp) {
      return { success: false, message: 'Invalid OTP' };
    }

    // Update order status to delivered and mark OTP as verified
    await db.update(orders)
      .set({
        delivery_otp_verified: true,
        courier_status: 'delivered',
        status: 'delivered',
        updated_at: new Date(),
      })
      .where(eq(orders.id, orderId));

    // Create tracking entry
    await db.insert(courierTracking).values({
      order_id: orderId,
      courier_id: order.courier_id,
      tracking_id: `INT-${orderId}`,
      status: 'delivered',
      details: 'Order delivered and verified with OTP',
      location: 'Customer Location',
      timestamp: new Date(),
    });

    // Decrement current_orders count for delivery person
    await db.update(deliveryPersons)
      .set({
        current_orders: sql`GREATEST(${deliveryPersons.current_orders} - 1, 0)`,
        updated_at: new Date(),
      })
      .where(eq(deliveryPersons.id, order.delivery_person_id));

    return { success: true, message: 'OTP verified successfully' };
  } catch (error) {
    console.error(`Error verifying OTP for order ${orderId}:`, error);
    return { success: false, message: 'Failed to verify OTP' };
  }
}

/**
 * Update order delivery status
 * @param {number} orderId - Order ID
 * @param {string} status - New status
 * @param {string} details - Status details
 * @returns {Promise<object|null>} - Updated tracking entry
 */
export async function updateDeliveryStatus(orderId, status, details = '') {
  try {
    // Get order
    const orderData = await db
      .select({
        id: orders.id,
        courier_id: orders.courier_id,
        delivery_person_id: orders.delivery_person_id,
        status: orders.status,
      })
      .from(orders)
      .where(eq(orders.id, orderId))
      .limit(1);

    if (!orderData.length) {
      throw new Error('Order not found');
    }

    const order = orderData[0];

    // Check if order has a delivery person assigned
    if (!order.delivery_person_id) {
      throw new Error('Order does not have a delivery person assigned');
    }

    // Update order status
    let newOrderStatus = order.status;
    if (status === 'delivered') {
      newOrderStatus = 'delivered';
    } else if (status === 'in_transit') {
      newOrderStatus = 'in_transit';
    } else if (status === 'picked') {
      newOrderStatus = 'processing';
    }

    await db.update(orders)
      .set({
        courier_status: status,
        status: newOrderStatus,
        updated_at: new Date(),
      })
      .where(eq(orders.id, orderId));

    // Create tracking entry
    const trackingEntry = await db.insert(courierTracking).values({
      order_id: orderId,
      courier_id: order.courier_id,
      tracking_id: `INT-${orderId}`,
      status: status,
      details: details,
      location: 'Internal Delivery',
      timestamp: new Date(),
    }).returning();

    // If delivered, decrement current_orders count for delivery person
    if (status === 'delivered') {
      await db.update(deliveryPersons)
        .set({
          current_orders: sql`GREATEST(${deliveryPersons.current_orders} - 1, 0)`,
          updated_at: new Date(),
        })
        .where(eq(deliveryPersons.id, order.delivery_person_id));
    }

    return trackingEntry.length ? trackingEntry[0] : null;
  } catch (error) {
    console.error(`Error updating delivery status for order ${orderId}:`, error);
    throw new Error('Failed to update delivery status');
  }
}
