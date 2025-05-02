import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { orders, orderItems, products } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function POST(request) {
  try {
    // Get the order ID from the request
    const { orderId } = await request.json();
    
    if (!orderId) {
      return NextResponse.json(
        { error: 'Order ID is required' },
        { status: 400 }
      );
    }
    
    // Get the current user session
    const session = await getServerSession(authOptions);
    
    // Build the query to get the order
    let query = eq(orders.id, parseInt(orderId));
    
    // If user is logged in, ensure the order belongs to them
    if (session?.user?.id) {
      query = and(query, eq(orders.user_id, session.user.id));
    }
    
    // Get the order
    const orderData = await db
      .select({
        id: orders.id,
        status: orders.status,
      })
      .from(orders)
      .where(query)
      .limit(1);
    
    if (!orderData.length) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }
    
    const order = orderData[0];
    
    // Only allow restoring cart for cancelled or failed orders
    if (order.status !== 'cancelled' && order.status !== 'pending') {
      return NextResponse.json(
        { error: 'Cannot restore cart for orders that are not cancelled or pending' },
        { status: 400 }
      );
    }
    
    // Get order items with product details
    const items = await db
      .select({
        id: orderItems.id,
        quantity: orderItems.quantity,
        price: orderItems.price,
        product_id: orderItems.product_id,
        product_name: products.name,
        product_image: products.image,
      })
      .from(orderItems)
      .leftJoin(products, eq(orderItems.product_id, products.id))
      .where(eq(orderItems.order_id, order.id));
    
    if (!items.length) {
      return NextResponse.json(
        { error: 'No items found in this order' },
        { status: 404 }
      );
    }
    
    // Format items for cart
    const cartItems = items.map(item => ({
      id: item.product_id,
      name: item.product_name,
      price: item.price,
      quantity: item.quantity,
      image: item.product_image,
    }));
    
    return NextResponse.json({
      success: true,
      message: 'Cart items retrieved successfully',
      items: cartItems,
    });
    
  } catch (error) {
    console.error('Error restoring cart:', error);
    return NextResponse.json(
      { error: 'Failed to restore cart: ' + error.message },
      { status: 500 }
    );
  }
}
