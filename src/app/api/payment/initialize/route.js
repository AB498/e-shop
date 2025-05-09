import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { db } from '@/lib/db';
import { orders, orderItems } from '@/db/schema';
import { v4 as uuidv4 } from 'uuid';
import { resetSequence, handleDuplicateKeyError } from '@/lib/utils/db-utils';

export async function POST(request) {
  try {
    // Get session to check if user is authenticated
    const session = await getServerSession(authOptions);

    // Log session for debugging
    console.log('Session in payment initialize:',
      session ? {
        user: {
          id: session.user?.id,
          email: session.user?.email,
          name: session.user?.name
        }
      } : 'No session');

    // Parse request body
    const body = await request.json();

    // Validate required fields
    if (!body.customer || !body.items || !body.items.length || !body.payment) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Generate a unique transaction ID
    const tranId = `TXN-${Date.now()}-${uuidv4().substring(0, 8)}`;

    // Create order in database
    // Ensure user_id is a number if it exists
    let userId = null;
    if (session?.user?.id) {
      userId = typeof session.user.id === 'string'
        ? parseInt(session.user.id, 10)
        : session.user.id;

      if (isNaN(userId)) {
        console.error('Invalid user ID in session:', session.user.id);
        userId = null;
      }
    }

    const orderData = {
      user_id: userId, // If user is logged in, associate order with user
      status: 'pending',
      total: body.payment.total,
      shipping_address: body.customer.address,
      shipping_city: body.customer.city,
      shipping_post_code: body.customer.postCode,
      shipping_phone: body.customer.phone,
      shipping_area: body.customer.area,
      shipping_landmark: body.customer.landmark,
      shipping_instructions: body.customer.specialInstructions,
      // Initialize OTP fields as null since they'll be set when a delivery person is assigned
      delivery_otp: null,
      delivery_otp_verified: false,
      delivery_otp_sent_at: null,
    };

    // Log user ID for debugging
    console.log('Creating order with user_id:', userId);

    // Reset the sequence for the orders table to avoid primary key conflicts
    await resetSequence('orders');

    // Insert order into database
    let orderId;
    try {
      // Define the operation to create an order
      const createOrder = async () => {
        const result = await db.insert(orders).values(orderData).returning({ id: orders.id });
        return result[0].id;
      };

      try {
        // Try to create the order
        orderId = await createOrder();
      } catch (error) {
        // If it's a duplicate key error, try to handle it with our utility
        if (error.code === '23505' && error.constraint === 'orders_pkey') {
          console.log('Handling duplicate key error for orders table');
          orderId = await handleDuplicateKeyError(error, 'orders', createOrder);
        } else {
          throw error; // Re-throw if it's not a duplicate key error
        }
      }
    } catch (error) {
      console.error('Error creating order:', error);

      // Check if it's a duplicate key error
      if (error.code === '23505' && error.constraint === 'orders_pkey') {
        return NextResponse.json({
          error: 'Database sequence issue detected. Please try again or contact support.',
          details: 'Duplicate key violation on orders table'
        }, { status: 500 });
      }

      return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
    }

    // Reset the sequence for the order_items table to avoid primary key conflicts
    await resetSequence('order_items');

    // Insert order items
    try {
      const orderItemsData = body.items.map(item => ({
        order_id: orderId,
        product_id: item.id,
        quantity: item.quantity,
        price: item.price,
      }));

      // Define the operation to create order items
      const createOrderItems = async () => {
        return await db.insert(orderItems).values(orderItemsData);
      };

      try {
        // Try to create the order items
        await createOrderItems();
      } catch (error) {
        // If it's a duplicate key error, try to handle it with our utility
        if (error.code === '23505' && error.constraint === 'order_items_pkey') {
          console.log('Handling duplicate key error for order_items table');
          await handleDuplicateKeyError(error, 'order_items', createOrderItems);
        } else {
          throw error; // Re-throw if it's not a duplicate key error
        }
      }
    } catch (error) {
      console.error('Error creating order items:', error);

      // Check if it's a duplicate key error
      if (error.code === '23505' && error.constraint === 'order_items_pkey') {
        return NextResponse.json({
          error: 'Database sequence issue detected. Please try again or contact support.',
          details: 'Duplicate key violation on order_items table'
        }, { status: 500 });
      }

      return NextResponse.json({ error: 'Failed to create order items' }, { status: 500 });
    }

    // Ensure we have a valid app URL
    const appUrl = process.env.NEXT_PUBLIC_APP_URL;

    // Make sure the URL doesn't have trailing slashes
    const baseUrl = appUrl.endsWith('/') ? appUrl.slice(0, -1) : appUrl;

    // Prepare SSL Commerz parameters
    const sslParams = {
      store_id: process.env.SSLCOMMERZ_STORE_ID,
      store_passwd: process.env.SSLCOMMERZ_STORE_PASSWORD,
      total_amount: body.payment.total,
      currency: 'BDT',
      tran_id: tranId,
      success_url: `${baseUrl}/api/payment/success?order_id=${orderId}`,
      fail_url: `${baseUrl}/api/payment/fail?order_id=${orderId}`,
      cancel_url: `${baseUrl}/api/payment/cancel?order_id=${orderId}`,
      ipn_url: `${baseUrl}/api/payment/ipn`,
      shipping_method: 'YES',
      product_name: body.items.map(item => item.name).join(', '),
      product_category: 'general',
      product_profile: 'physical-goods',
      cus_name: `${body.customer.firstName} ${body.customer.lastName}`,
      cus_email: body.customer.email,
      cus_add1: body.customer.address,
      cus_city: body.customer.city,
      cus_state: body.customer.city,
      cus_postcode: body.customer.postCode,
      cus_country: body.customer.country,
      cus_phone: body.customer.phone,
      ship_name: `${body.customer.firstName} ${body.customer.lastName}`,
      ship_add1: body.customer.address,
      ship_city: body.customer.city,
      ship_state: body.customer.city,
      ship_postcode: body.customer.postCode,
      ship_country: body.customer.country,
      value_a: orderId.toString(), // Store order ID for reference
    };

    // Log the callback URLs for debugging
    console.log('Success URL:', sslParams.success_url);
    console.log('Fail URL:', sslParams.fail_url);
    console.log('Cancel URL:', sslParams.cancel_url);

    // Determine API endpoint based on environment
    const apiEndpoint = process.env.SSLCOMMERZ_API_URL;

    // Call SSL Commerz API to initialize payment
    const response = await fetch(apiEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams(sslParams),
    });

    const data = await response.json();

    // Log the full response for debugging
    console.log('SSL Commerz API response:', JSON.stringify(data, null, 2));

    if (data.status !== 'SUCCESS') {
      console.error('SSL Commerz initialization failed:', data);
      return NextResponse.json({ error: data.failedreason || 'Payment initialization failed' }, { status: 400 });
    }

    // Return the GatewayPageURL for redirection
    return NextResponse.json({
      success: true,
      redirectUrl: data.GatewayPageURL,
      sessionKey: data.sessionkey,
    });

  } catch (error) {
    console.error('Payment initialization error:', error);

    // Provide more specific error messages based on error type
    if (error.code === '23505') {
      return NextResponse.json({
        error: 'Database constraint violation. Please try again or contact support.',
        details: error.detail || 'Duplicate key error'
      }, { status: 500 });
    }

    return NextResponse.json({
      error: 'Internal server error',
      message: error.message || 'An unexpected error occurred'
    }, { status: 500 });
  }
}
