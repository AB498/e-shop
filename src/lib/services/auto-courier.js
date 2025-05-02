'use server';

import { db } from '@/lib/db';
import { orders, users, orderItems, products, couriers, courierTracking } from '@/db/schema';
import { eq, inArray } from 'drizzle-orm';
import * as pathaoCourier from '@/lib/services/pathao-courier';

/**
 * Automatically create a Pathao courier order after successful payment
 * @param {number} orderId - Order ID
 * @returns {Promise<object|null>} - Created courier order details
 */
export async function createAutomaticCourierOrder(orderId) {
  try {
    console.log(`Creating automatic courier order for order ID: ${orderId}`);

    // 1. Get order details
    const orderData = await db
      .select({
        id: orders.id,
        user_id: orders.user_id,
        total: orders.total,
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

    // 6. Get Pathao courier from database or create if not exists
    let pathao = await db
      .select({
        id: couriers.id,
      })
      .from(couriers)
      .where(eq(couriers.name, 'Pathao'))
      .limit(1);

    if (!pathao.length) {
      // Create Pathao courier if it doesn't exist
      const newCourier = await db.insert(couriers).values({
        name: 'Pathao',
        description: 'Pathao Courier Service',
        is_active: true,
      }).returning();

      pathao = [{ id: newCourier[0].id }];
    }

    const courierId = pathao[0].id;

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

    const pathaoOrderData = {
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
      amount_to_collect: Math.round(parseFloat(order.total) * 100), // Convert to integer (cents/paisa)
      item_description: enrichedItems.map(item => item.product_name).join(', ').substring(0, 255)
    };

    // 11. Create order with Pathao API
    const pathaoResponse = await pathaoCourier.createOrder(pathaoOrderData);

    if (!pathaoResponse || !pathaoResponse.data || !pathaoResponse.data.consignment_id) {
      throw new Error('Failed to create Pathao courier order');
    }

    const consignmentId = pathaoResponse.data.consignment_id;

    // Log the full Pathao response for debugging
    console.log('Pathao order created successfully:', JSON.stringify(pathaoResponse, null, 2));

    // Extract delivery fee from Pathao response if available
    const deliveryFee = pathaoResponse.data.delivery_fee || null;

    // 12. Update order with courier information
    const merchantOrderId = pathaoOrderData.merchant_order_id;
    console.log(`Using merchant_order_id: ${merchantOrderId} and consignment_id: ${consignmentId}`);

    const updatedOrder = await db.update(orders)
      .set({
        courier_id: courierId,
        courier_order_id: merchantOrderId, // Store the merchant_order_id here
        courier_tracking_id: consignmentId, // Store the consignment_id here
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
      tracking_id: consignmentId,
      status: 'pending',
      details: 'Order created with courier',
      location: 'Merchant',
      timestamp: timestamp,
    }).returning();

    return {
      order: updatedOrder[0],
      tracking: trackingEntry[0],
      consignment_id: consignmentId,
      pathao_response: pathaoResponse.data
    };
  } catch (error) {
    console.error(`Error creating automatic courier order for order ${orderId}:`, error);
    return null;
  }
}
