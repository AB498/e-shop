import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import * as schema from '@/db/schema';
import { eq } from 'drizzle-orm';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { resetSequence } from '@/lib/utils/db-utils';

export async function POST() {
  try {
    console.log('Starting order test process...');

    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const results = {
      user: null,
      products: [],
      order: null,
      items: []
    };

    // Step 1: Get a test user (first customer in the database)
    console.log('Finding test user...');
    const users = await db
      .select()
      .from(schema.users)
      .where(eq(schema.users.role, 'customer'))
      .limit(1);

    if (!users || users.length === 0) {
      return NextResponse.json(
        { error: 'No customer users found in the database. Please seed the database first.' },
        { status: 400 }
      );
    }

    const testUser = users[0];
    results.user = {
      id: testUser.id,
      first_name: testUser.first_name,
      last_name: testUser.last_name,
      email: testUser.email
    };

    // Step 2: Get some products to add to cart
    console.log('Finding products...');
    const products = await db
      .select()
      .from(schema.products)
      .limit(3);

    if (!products || products.length === 0) {
      return NextResponse.json(
        { error: 'No products found in the database. Please seed the database first.' },
        { status: 400 }
      );
    }

    results.products = products.map(product => ({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image
    }));

    // Step 3: Create cart items (simulate adding to cart)
    console.log('Creating cart items...');
    const cartItems = products.map((product, index) => ({
      id: product.id,
      name: product.name,
      price: parseFloat(product.price),
      quantity: index + 1, // 1, 2, 3 items respectively
      image: product.image
    }));

    // Step 4: Calculate order total
    const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const deliveryFee = 5.00;
    const total = subtotal + deliveryFee;

    // Step 5: Create order
    console.log('Creating order...');

    // Reset the sequence for the orders table to avoid primary key conflicts
    await resetSequence('orders');

    // Ensure phone number is in the correct format for Bangladesh
    let shippingPhone = testUser.phone;

    // If user phone is not in Bangladesh format or doesn't exist, use a valid default
    if (!shippingPhone || !shippingPhone.startsWith('01')) {
      // Use a valid Bangladesh phone number format (11 digits starting with 01)
      shippingPhone = '01712345678';
    }

    const orderData = {
      user_id: testUser.id,
      status: 'pending',
      total: total,
      shipping_address: testUser.address || '123 Test Street',
      shipping_city: testUser.city || 'Dhaka',
      shipping_post_code: testUser.post_code || '1000',
      shipping_phone: shippingPhone,
      delivery_otp: null,
      delivery_otp_verified: false,
      delivery_otp_sent_at: null,
      created_at: new Date(),
      updated_at: new Date()
    };

    const insertedOrder = await db.insert(schema.orders).values(orderData).returning();
    const order = insertedOrder[0];
    results.order = {
      id: order.id,
      status: order.status,
      total: parseFloat(order.total),
      created_at: order.created_at
    };

    // Step 6: Create order items
    console.log('Creating order items...');

    // Reset the sequence for the order_items table to avoid primary key conflicts
    await resetSequence('order_items');

    for (const item of cartItems) {
      const orderItemData = {
        order_id: order.id,
        product_id: item.id,
        quantity: item.quantity,
        price: item.price
      };

      const insertedOrderItem = await db.insert(schema.orderItems).values(orderItemData).returning();
      results.items.push({
        id: insertedOrderItem[0].id,
        product_id: item.id,
        name: item.name,
        quantity: item.quantity,
        price: parseFloat(item.price)
      });
    }

    // Step 7: Update order status to simulate completed payment
    console.log('Updating order status...');
    await db.update(schema.orders)
      .set({
        status: 'processing',
        updated_at: new Date()
      })
      .where(eq(schema.orders.id, order.id));

    results.order.status = 'processing';

    console.log('Order test completed successfully!');

    return NextResponse.json({
      success: true,
      message: 'Order test completed successfully!',
      results
    });
  } catch (error) {
    console.error('Error in order test process:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to complete order test: ' + error.message },
      { status: 500 }
    );
  }
}
