'use server';

import { db } from '@/lib/db';
import { orders, users, orderItems, products, couriers, courierTracking } from '@/db/schema';
import { eq, inArray } from 'drizzle-orm';
import * as pathaoCourier from '@/lib/services/pathao-courier';
import * as steadfastCourier from '@/lib/services/steadfast-courier';
import { isAutoCourierOrderEnabled } from '@/lib/actions/settings';

/**
 * Automatically create a courier order after successful payment
 * @param {number} orderId - Order ID
 * @param {boolean} forceCreate - Force creation even if automatic creation is disabled
 * @param {string} courierType - Courier type ('pathao' or 'steadfast')
 * @returns {Promise<object|null>} - Created courier order details
 */
export async function createAutomaticCourierOrder(orderId, forceCreate = false, courierType = 'pathao') {
  try {
    console.log(`Creating automatic courier order for order ID: ${orderId}`);

    // Check if automatic courier order creation is enabled
    if (!forceCreate) {
      const isEnabled = await isAutoCourierOrderEnabled();
      if (!isEnabled) {
        console.log('Automatic courier order creation is disabled. Skipping.');
        return {
          success: false,
          message: 'Automatic courier order creation is disabled',
          skipped: true
        };
      }
    }

    // 1. Get order details
    const orderData = await db
      .select({
        id: orders.id,
        user_id: orders.user_id,
        total: orders.total,
        payment_method: orders.payment_method,
        shipping_address: orders.shipping_address,
        shipping_city: orders.shipping_city,
        shipping_post_code: orders.shipping_post_code,
        shipping_phone: orders.shipping_phone,
        shipping_area: orders.shipping_area,
        shipping_landmark: orders.shipping_landmark,
        shipping_instructions: orders.shipping_instructions,
        status: orders.status,
        created_at: orders.created_at,
      })
      .from(orders)
      .where(eq(orders.id, orderId))
      .limit(1);

    if (!orderData.length) {
      throw new Error(`Order with ID ${orderId} not found`);
    }

    const order = orderData[0];
    console.log('Order details:', {
      id: order.id,
      user_id: order.user_id,
      shipping_phone: order.shipping_phone,
      shipping_address: order.shipping_address,
      shipping_city: order.shipping_city,
    });

    // 2. Get user details
    const userData = await db
      .select({
        id: users.id,
        first_name: users.first_name,
        last_name: users.last_name,
        email: users.email,
        phone: users.phone,
        address: users.address,
        city: users.city,
        post_code: users.post_code,
      })
      .from(users)
      .where(eq(users.id, order.user_id))
      .limit(1);

    if (!userData.length) {
      throw new Error(`User with ID ${order.user_id} not found`);
    }

    const user = userData[0];
    console.log('User details:', {
      id: user.id,
      name: `${user.first_name} ${user.last_name}`,
      phone: user.phone,
    });

    // 3. Get order items
    const orderItemsData = await db
      .select({
        id: orderItems.id,
        product_id: orderItems.product_id,
        quantity: orderItems.quantity,
        price: orderItems.price,
      })
      .from(orderItems)
      .where(eq(orderItems.order_id, orderId));

    if (!orderItemsData.length) {
      throw new Error(`No items found for order ID ${orderId}`);
    }

    // 4. Get product details for each item
    const productIds = orderItemsData.map(item => item.product_id);
    console.log(`Product IDs for order ${orderId}:`, productIds);

    // If there are no product IDs, use an empty array for products
    let productsData = [];

    if (productIds.length > 0) {
      try {
        productsData = await db
          .select({
            id: products.id,
            name: products.name,
            weight: products.weight || 0.5, // Default weight if not specified
          })
          .from(products)
          .where(inArray(products.id, productIds));

        console.log(`Retrieved ${productsData.length} products for order ${orderId}`);
      } catch (dbError) {
        console.error(`Error fetching products for order ${orderId}:`, dbError);
        // Continue with empty products data
      }
    } else {
      console.log(`No product IDs found for order ${orderId}`);
    }

    const productMap = {};
    productsData.forEach(product => {
      productMap[product.id] = product;
    });

    // 5. Enrich order items with product details
    const enrichedItems = orderItemsData.map(item => ({
      ...item,
      product_name: productMap[item.product_id]?.name || 'Product',
      weight: productMap[item.product_id]?.weight || 0.5,
    }));

    // 6. Get the appropriate courier from database or create if not exists
    let courierData;

    if (courierType === 'steadfast') {
      courierData = await db
        .select({
          id: couriers.id,
        })
        .from(couriers)
        .where(eq(couriers.name, 'Steadfast'))
        .limit(1);

      if (!courierData.length) {
        // Create Steadfast courier if it doesn't exist
        const newCourier = await db.insert(couriers).values({
          name: 'Steadfast',
          description: 'Steadfast Courier Limited',
          courier_type: 'external',
          is_active: true,
        }).returning();

        courierData = [{ id: newCourier[0].id }];
      }
    } else if (courierType === 'pathao') {
      // Use Pathao
      courierData = await db
        .select({
          id: couriers.id,
        })
        .from(couriers)
        .where(eq(couriers.name, 'Pathao'))
        .limit(1);

      if (!courierData.length) {
        // Create Pathao courier if it doesn't exist
        const newCourier = await db.insert(couriers).values({
          name: 'Pathao',
          description: 'Pathao Courier Service',
          courier_type: 'external',
          is_active: true,
        }).returning();

        courierData = [{ id: newCourier[0].id }];
      }
    } else {
      // Handle unknown courier type - default to Steadfast
      console.warn(`Unknown courier type: ${courierType}, defaulting to Steadfast`);
      courierData = await db
        .select({
          id: couriers.id,
        })
        .from(couriers)
        .where(eq(couriers.name, 'Steadfast'))
        .limit(1);

      if (!courierData.length) {
        // Create Steadfast courier if it doesn't exist
        const newCourier = await db.insert(couriers).values({
          name: 'Steadfast',
          description: 'Steadfast Courier Limited',
          courier_type: 'external',
          is_active: true,
        }).returning();

        courierData = [{ id: newCourier[0].id }];
      }
    }

    const courierId = courierData[0].id;

    // 7. Get Pathao stores
    const storesResponse = await pathaoCourier.getStores();
    if (!storesResponse || !storesResponse.data || !storesResponse.data.data || !storesResponse.data.data.length) {
      throw new Error('No Pathao stores found');
    }

    // Use the first store (or default store if available)
    const defaultStore = storesResponse.data.data.find(store => store.is_default_store) || storesResponse.data.data[0];

    // 8. Get city, zone, and area information
    // For simplicity, we'll use Dhaka as default city (ID: 1) if not specified
    // In a real implementation, you would map the user's city to Pathao city IDs
    const cityId = 1; // Default to Dhaka

    // Get zones for the city
    const zonesResponse = await pathaoCourier.getZones(cityId);
    if (!zonesResponse || !zonesResponse.data || !zonesResponse.data.data || !zonesResponse.data.data.length) {
      throw new Error('No zones found for the selected city');
    }

    // Use the first zone for simplicity
    // In a real implementation, you would map the user's area to the correct zone
    const zoneId = zonesResponse.data.data[0].zone_id;

    // Get areas for the zone
    const areasResponse = await pathaoCourier.getAreas(zoneId);
    if (!areasResponse || !areasResponse.data || !areasResponse.data.data || !areasResponse.data.data.length) {
      throw new Error('No areas found for the selected zone');
    }

    // Use the first area for simplicity
    const areaId = areasResponse.data.data[0].area_id;

    // 9. Prepare delivery information
    const deliveryInfo = {
      address: order.shipping_address || user.address,
      city: order.shipping_city || user.city,
      city_id: cityId,
      zone_id: zoneId,
      area_id: areaId,
      post_code: order.shipping_post_code || user.post_code,
      phone: order.shipping_phone || user.phone,
      area: order.shipping_area || '',
      landmark: order.shipping_landmark || '',
      special_instructions: order.shipping_instructions || '',
    };

    console.log('Delivery information:', {
      address: deliveryInfo.address,
      city: deliveryInfo.city,
      city_id: deliveryInfo.city_id,
      zone_id: deliveryInfo.zone_id,
      area_id: deliveryInfo.area_id,
      post_code: deliveryInfo.post_code,
      phone: deliveryInfo.phone,
    });

    // 10. Format order data for Pathao
    // Format phone number for Bangladesh (remove +880 prefix if present, ensure starts with 0)
    console.log('Original phone number:', deliveryInfo.phone);

    // Check if phone number is null or undefined
    if (!deliveryInfo.phone) {
      console.error('Phone number is missing in delivery info');
      throw new Error('Phone number is required for courier delivery');
    }

    // Use the formatBangladeshPhoneNumber function from pathao-courier.js
    let formattedPhone;
    try {
      formattedPhone = await pathaoCourier.formatBangladeshPhoneNumber(deliveryInfo.phone);
      console.log('Formatted phone number:', formattedPhone);

      // Ensure formattedPhone is a string
      if (typeof formattedPhone !== 'string') {
        console.warn(`Formatted phone is not a string, converting to string: ${formattedPhone}`);
        formattedPhone = String(formattedPhone || '01712345678');
      }

      // Ensure phone number is in the correct format (11 digits starting with 01)
      try {
        if (typeof formattedPhone === 'string' && !formattedPhone.match(/^01\d{9}$/)) {
          console.warn(`Phone number ${formattedPhone} may not be in the correct Bangladesh format. Expected format: 01XXXXXXXXX`);
          // Force a valid format if needed
          formattedPhone = '01712345678';
        }
      } catch (matchError) {
        console.error('Error checking phone format:', matchError);
        formattedPhone = '01712345678';
      }
    } catch (phoneError) {
      console.error('Error formatting phone number:', phoneError);
      // Use a default phone number as fallback
      formattedPhone = '01712345678';
    }

    // Check if this is a Cash on Delivery order
    const isCOD = order.payment_method === 'cod';
    console.log(`Order payment method: ${order.payment_method}, isCOD: ${isCOD}`);

    // 10. Create the courier order based on the selected courier type
    let courierOrderData;
    let courierResponse;
    let consignmentId;
    let trackingCode;
    let merchantOrderId;

    if (courierType === 'steadfast') {
      // Format order data for Steadfast
      courierOrderData = {
        invoice: `order-${order.id}`,
        recipient_name: `${user.first_name} ${user.last_name}`.trim(),
        recipient_phone: formattedPhone,
        recipient_address: deliveryInfo.address,
        cod_amount: isCOD ? parseFloat(order.total) : 0,
        note: deliveryInfo.special_instructions || '',
        item_description: enrichedItems.map(item => item.product_name).join(', ').substring(0, 200)
      };

      // Create the Steadfast order
      courierResponse = await steadfastCourier.createOrder(courierOrderData);

      if (!courierResponse || !courierResponse.consignment || !courierResponse.consignment.consignment_id) {
        throw new Error('Failed to create Steadfast courier order');
      }

      consignmentId = courierResponse.consignment.consignment_id;
      trackingCode = courierResponse.consignment.tracking_code;
      merchantOrderId = courierOrderData.invoice;

      // Log the full Steadfast response for debugging
      console.log('Steadfast order created successfully:', JSON.stringify(courierResponse, null, 2));
    } else {
      // Format order data for Pathao
      courierOrderData = {
        store_id: defaultStore.store_id,
        merchant_order_id: `order-${order.id}`,
        recipient_name: `${user.first_name} ${user.last_name}`.trim(),
        recipient_phone: formattedPhone,
        recipient_address: deliveryInfo.address,
        recipient_city: deliveryInfo.city_id,
        recipient_zone: deliveryInfo.zone_id,
        recipient_area: deliveryInfo.area_id,
        delivery_type: 48, // Standard delivery (48 hours)
        item_type: 2, // Non-food items
        special_instruction: deliveryInfo.special_instructions || '',
        item_quantity: enrichedItems.reduce((total, item) => total + item.quantity, 0),
        item_weight: enrichedItems.reduce((total, item) => total + (item.weight * item.quantity), 0),
        // For COD orders, set the amount to collect to the order total
        // For non-COD orders, set it to 0 as payment is already made
        amount_to_collect: isCOD ? Math.round(parseFloat(order.total) * 100) : 0,
        item_description: enrichedItems.map(item => item.product_name).join(', ').substring(0, 255)
      };

      // Create the Pathao order
      courierResponse = await pathaoCourier.createOrder(courierOrderData);

      if (!courierResponse || !courierResponse.data || !courierResponse.data.consignment_id) {
        throw new Error('Failed to create Pathao courier order');
      }

      consignmentId = courierResponse.data.consignment_id;
      trackingCode = consignmentId; // For Pathao, consignment_id is used as tracking code
      merchantOrderId = courierOrderData.merchant_order_id;

      // Log the full Pathao response for debugging
      console.log('Pathao order created successfully:', JSON.stringify(courierResponse, null, 2));
    }

    // Extract delivery fee from Pathao response if available (only for Pathao)
    const deliveryFee = courierType === 'pathao' ? (courierResponse.data?.delivery_fee || null) : null;

    // 12. Update order with courier information
    console.log(`Using merchant_order_id: ${merchantOrderId} and tracking_code: ${trackingCode}`);

    const updatedOrder = await db.update(orders)
      .set({
        courier_id: courierId,
        courier_order_id: merchantOrderId,
        courier_tracking_id: trackingCode,
        courier_status: 'pending',
        status: 'processing', // Update main order status
        shipping_instructions: deliveryFee ? `Delivery Fee: ${deliveryFee}` : null, // Store delivery fee in shipping_instructions field
        updated_at: new Date(),
      })
      .where(eq(orders.id, orderId))
      .returning();

    // 13. Create initial tracking entry with a consistent timestamp
    const timestamp = new Date();
    const trackingEntry = await db.insert(courierTracking).values({
      order_id: orderId,
      courier_id: courierId,
      tracking_id: trackingCode,
      status: 'pending',
      details: 'Order created with courier',
      location: 'Merchant',
      timestamp: timestamp,
    }).returning();

    // Return appropriate response based on courier type
    if (courierType === 'steadfast') {
      return {
        order: updatedOrder[0],
        tracking: trackingEntry[0],
        consignment_id: consignmentId,
        tracking_code: trackingCode,
        steadfast_response: courierResponse.consignment
      };
    } else {
      return {
        order: updatedOrder[0],
        tracking: trackingEntry[0],
        consignment_id: consignmentId,
        pathao_response: courierResponse.data
      };
    }
  } catch (error) {
    console.error(`Error creating automatic courier order for order ${orderId}:`, error);
    return null;
  }
}
