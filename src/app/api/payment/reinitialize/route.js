import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { db } from '@/lib/db';
import { orders, orderItems, products, settings } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request) {
  try {
    // Get session to check if user is authenticated
    const session = await getServerSession(authOptions);

    // Log session for debugging
    console.log('Session in payment reinitialize:',
      session ? {
        user: {
          id: session.user?.id,
          email: session.user?.email,
          name: session.user?.name
        }
      } : 'No session');

    // Parse request body
    const { orderId } = await request.json();

    if (!orderId) {
      return NextResponse.json({ error: 'Order ID is required' }, { status: 400 });
    }

    // Ensure orderId is a number
    const numericOrderId = typeof orderId === 'string' ? parseInt(orderId, 10) : orderId;

    if (isNaN(numericOrderId)) {
      return NextResponse.json({ error: 'Invalid order ID' }, { status: 400 });
    }

    // Ensure user is authenticated
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    // Ensure userId is a number
    const numericUserId = typeof session.user.id === 'string'
      ? parseInt(session.user.id, 10)
      : session.user.id;

    if (isNaN(numericUserId)) {
      return NextResponse.json({ error: 'Invalid user ID' }, { status: 400 });
    }

    // Get the order, ensuring it belongs to the user
    const orderData = await db
      .select({
        id: orders.id,
        status: orders.status,
        total: orders.total,
        user_id: orders.user_id,
      })
      .from(orders)
      .where(
        and(
          eq(orders.id, numericOrderId),
          eq(orders.user_id, numericUserId)
        )
      )
      .limit(1);

    if (!orderData.length) {
      return NextResponse.json({ error: 'Order not found or does not belong to user' }, { status: 404 });
    }

    const order = orderData[0];

    // Check if order is in pending status
    console.log('Order status:', order.status);

    // Convert status to lowercase for case-insensitive comparison
    const orderStatus = order.status.toLowerCase();
    if (orderStatus !== 'pending') {
      return NextResponse.json({
        error: 'Cannot reinitialize payment for this order',
        details: `Order status is ${order.status}, must be pending`
      }, { status: 400 });
    }

    console.log('Order is in pending status, proceeding with payment reinitialization');

    // Get order items with product details
    const items = await db
      .select({
        id: products.id,
        name: products.name,
        price: products.price,
        quantity: orderItems.quantity,
      })
      .from(orderItems)
      .leftJoin(products, eq(orderItems.product_id, products.id))
      .where(eq(orderItems.order_id, order.id));

    if (!items.length) {
      return NextResponse.json({ error: 'No items found in this order' }, { status: 400 });
    }

    // Generate a unique transaction ID
    const tranId = `TXN-${Date.now()}-${uuidv4().substring(0, 8)}`;

    // Check if SSLCommerz is enabled
    const sslcommerzSetting = await db.select().from(settings).where(eq(settings.key, 'sslcommerz_enabled')).limit(1);
    const sslcommerzEnabled = sslcommerzSetting.length > 0 ? sslcommerzSetting[0].value === 'true' : true;

    if (!sslcommerzEnabled) {
      console.error('SSLCommerz payment attempted but SSLCommerz is disabled');
      return NextResponse.json({
        error: 'Online payment is currently unavailable. Please use Cash on Delivery instead.',
        code: 'SSLCOMMERZ_DISABLED'
      }, { status: 400 });
    }

    // Ensure we have a valid app URL
    const appUrl = process.env.NEXT_PUBLIC_APP_URL;

    // Make sure the URL doesn't have trailing slashes
    const baseUrl = appUrl.endsWith('/') ? appUrl.slice(0, -1) : appUrl;

    // Get user details
    console.log('Fetching user details for ID:', numericUserId);
    let user = {};

    try {
      const userResult = await db
        .execute(
          `SELECT
            first_name as "firstName",
            last_name as "lastName",
            email,
            phone,
            address,
            city,
            post_code as "postCode",
            country
          FROM users
          WHERE id = $1
          LIMIT 1`,
          [numericUserId]
        );

      user = userResult.rows?.[0] || {};
      console.log('User details retrieved:', user);
    } catch (error) {
      console.error('Error fetching user details:', error);
      // Continue with empty user object
    }

    // Use session data as fallback if available
    if (!user.email && session?.user?.email) {
      user.email = session.user.email;
    }

    if (!user.firstName && session?.user?.name) {
      const nameParts = session.user.name.split(' ');
      user.firstName = nameParts[0] || '';
      user.lastName = nameParts.slice(1).join(' ') || '';
    }

    // Prepare SSL Commerz parameters
    const sslParams = {
      store_id: process.env.SSLCOMMERZ_STORE_ID,
      store_passwd: process.env.SSLCOMMERZ_STORE_PASSWORD,
      total_amount: order.total,
      currency: 'BDT',
      tran_id: tranId,
      success_url: `${baseUrl}/api/payment/success?order_id=${order.id}`,
      fail_url: `${baseUrl}/api/payment/fail?order_id=${order.id}`,
      cancel_url: `${baseUrl}/api/payment/cancel?order_id=${order.id}`,
      ipn_url: `${baseUrl}/api/payment/ipn`,
      shipping_method: 'YES',
      product_name: items.map(item => item.name).join(', '),
      product_category: 'general',
      product_profile: 'physical-goods',
      cus_name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Customer',
      cus_email: user.email || 'customer@example.com',
      cus_add1: user.address || 'N/A',
      cus_city: user.city || 'N/A',
      cus_state: user.city || 'N/A',
      cus_postcode: user.postCode || 'N/A',
      cus_country: user.country || 'Bangladesh',
      cus_phone: user.phone || 'N/A',
      ship_name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Customer',
      ship_add1: user.address || 'N/A',
      ship_city: user.city || 'N/A',
      ship_state: user.city || 'N/A',
      ship_postcode: user.postCode || 'N/A',
      ship_country: user.country || 'Bangladesh',
      value_a: order.id.toString(), // Store order ID for reference
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
    console.error('Payment reinitialization error:', error);

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
