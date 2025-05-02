import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { orders, courierTracking } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import * as pathaoCourier from '@/lib/services/pathao-courier';

export async function POST(request, { params }) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const orderId = parseInt(params.id);
    if (isNaN(orderId)) {
      return NextResponse.json({ error: 'Invalid order ID' }, { status: 400 });
    }

    // Get order information
    const orderData = await db
      .select({
        id: orders.id,
        courier_id: orders.courier_id,
        courier_tracking_id: orders.courier_tracking_id,
      })
      .from(orders)
      .where(eq(orders.id, orderId))
      .limit(1);

    if (!orderData.length) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    const order = orderData[0];

    if (!order.courier_tracking_id) {
      return NextResponse.json({ error: 'Order has no tracking ID' }, { status: 400 });
    }

    // Get tracking information from Pathao API
    const trackingInfo = await pathaoCourier.trackOrder(order.courier_tracking_id);

    if (!trackingInfo || !trackingInfo.data) {
      return NextResponse.json({ error: 'Failed to get tracking information from Pathao' }, { status: 500 });
    }

    // Map Pathao status to our internal status using the utility function
    const courierStatus = await pathaoCourier.mapPathaoStatus(trackingInfo.data.order_status);

    // Update order with latest status
    await db.update(orders)
      .set({
        courier_status: courierStatus,
        // Update main order status based on courier status
        status: courierStatus === 'delivered' ? 'delivered' :
                courierStatus === 'returned' ? 'cancelled' :
                courierStatus === 'cancelled' ? 'cancelled' :
                'shipped',
        updated_at: new Date(),
      })
      .where(eq(orders.id, orderId));

    // Create tracking entry
    const trackingEntry = await db.insert(courierTracking).values({
      order_id: orderId,
      courier_id: order.courier_id,
      tracking_id: order.courier_tracking_id,
      status: courierStatus,
      details: trackingInfo.data.order_status_text || trackingInfo.data.order_status,
      location: trackingInfo.data.current_location || 'Unknown',
      timestamp: new Date(trackingInfo.data.updated_at) || new Date(),
    }).returning();

    return NextResponse.json({
      success: true,
      tracking: trackingEntry[0],
      status: courierStatus,
      pathao_status: trackingInfo.data.order_status,
      details: trackingInfo.data.order_status_text || trackingInfo.data.order_status,
    });
  } catch (error) {
    console.error(`Error refreshing tracking for order ${params.id}:`, error);
    return NextResponse.json({ error: 'Failed to refresh tracking' }, { status: 500 });
  }
}
