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
        created_at: orders.created_at,
        updated_at: orders.updated_at,
      })
      .from(orders)
      .where(isNotNull(orders.courier_id))
      .orderBy(orders.created_at);

    // Get user information for each order
    const userIds = courierOrders.map(order => order.user_id);
    const courierIds = courierOrders.map(order => order.courier_id);

    // Debug information
    const debug = {
      courierOrders: courierOrders.length,
      userIds: userIds,
      courierIds: courierIds,
    };

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
          })
          .from(users)
          .where(inArray(users.id, userIds));
      } catch (userError) {
        debug.userError = userError.message;
      }
    }

    // Get courier information if there are any couriers
    if (courierIds.length > 0) {
      try {
        couriersData = await db
          .select({
            id: couriers.id,
            name: couriers.name,
          })
          .from(couriers)
          .where(inArray(couriers.id, courierIds));
      } catch (courierError) {
        debug.courierError = courierError.message;
      }
    }

    // Add debug information
    debug.usersData = usersData.length;
    debug.couriersData = couriersData.length;

    return NextResponse.json({
      success: true,
      debug,
      courierOrders,
      usersData,
      couriersData,
    });
  } catch (error) {
    console.error('Error testing courier API:', error);
    return NextResponse.json({ 
      error: 'Failed to test courier API',
      message: error.message,
      stack: error.stack,
    }, { status: 500 });
  }
}
