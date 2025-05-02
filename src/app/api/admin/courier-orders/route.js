import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { orders, users, couriers } from '@/db/schema';
import { eq, isNotNull, inArray } from 'drizzle-orm';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function GET() {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get all orders with courier information
    const courierOrders = await db
      .select({
        id: orders.id,
        user_id: orders.user_id,
        status: orders.status,
        total: orders.total,
        courier_id: orders.courier_id,
        courier_order_id: orders.courier_order_id,
        courier_tracking_id: orders.courier_tracking_id,
        courier_status: orders.courier_status,
        shipping_address: orders.shipping_address,
        shipping_city: orders.shipping_city,
        shipping_post_code: orders.shipping_post_code,
        shipping_phone: orders.shipping_phone,
        shipping_area: orders.shipping_area,
        shipping_landmark: orders.shipping_landmark,
        shipping_instructions: orders.shipping_instructions,
        created_at: orders.created_at,
        updated_at: orders.updated_at,
      })
      .from(orders)
      .where(isNotNull(orders.courier_id))
      .orderBy(orders.created_at);

    // Get user information for each order
    const orderIds = courierOrders.map(order => order.id);
    const userIds = courierOrders.map(order => order.user_id);
    const courierIds = courierOrders.map(order => order.courier_id);

    // Initialize empty arrays for user and courier data
    let usersData = [];
    let couriersData = [];

    // Get user information if there are any users
    if (userIds.length > 0) {
      try {
        usersData = await db
          .select({
            id: users.id,
            first_name: users.first_name,
            last_name: users.last_name,
            email: users.email,
            phone: users.phone,
          })
          .from(users)
          .where(inArray(users.id, userIds));
      } catch (userError) {
        console.error('Error fetching user data:', userError);
        // Continue with empty users data
      }
    }

    // Get courier information if there are any couriers
    if (courierIds.length > 0) {
      try {
        couriersData = await db
          .select({
            id: couriers.id,
            name: couriers.name,
            description: couriers.description,
          })
          .from(couriers)
          .where(inArray(couriers.id, courierIds));
      } catch (courierError) {
        console.error('Error fetching courier data:', courierError);
        // Continue with empty couriers data
      }
    }

    // Create maps for quick lookup
    const userMap = {};
    usersData.forEach(user => {
      userMap[user.id] = user;
    });

    const courierMap = {};
    couriersData.forEach(courier => {
      courierMap[courier.id] = courier;
    });

    // Enrich orders with user and courier information
    const enrichedOrders = courierOrders.map(order => ({
      ...order,
      customer_name: userMap[order.user_id]
        ? `${userMap[order.user_id].first_name} ${userMap[order.user_id].last_name}`.trim()
        : 'Unknown Customer',
      customer_email: userMap[order.user_id]?.email || 'unknown@example.com',
      courier_name: courierMap[order.courier_id]?.name || 'Unknown Courier',
      // Format the courier status for display
      courier_status_display: order.courier_status
        ? order.courier_status.charAt(0).toUpperCase() + order.courier_status.slice(1).replace('_', ' ')
        : 'Pending',
    }));

    return NextResponse.json(enrichedOrders);
  } catch (error) {
    console.error('Error fetching courier orders:', error);
    return NextResponse.json({ error: 'Failed to fetch courier orders' }, { status: 500 });
  }
}
