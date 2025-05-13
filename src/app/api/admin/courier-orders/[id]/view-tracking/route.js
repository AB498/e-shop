import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { orders, courierTracking, couriers } from '@/db/schema';
import { eq, and, desc } from 'drizzle-orm';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import * as pathaoCourier from '@/lib/services/pathao-courier';

export async function POST(request, props) {
  const params = await props.params;
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

    // Get order information including current status
    const orderData = await db
      .select({
        id: orders.id,
        courier_id: orders.courier_id,
        courier_tracking_id: orders.courier_tracking_id,
        courier_status: orders.courier_status,
        status: orders.status,
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
    
    // Get courier information
    const courierData = await db
      .select({
        id: couriers.id,
        name: couriers.name,
      })
      .from(couriers)
      .where(eq(couriers.id, order.courier_id))
      .limit(1);

    // Get all existing tracking entries for this order
    const trackingEntries = await db
      .select({
        id: courierTracking.id,
        status: courierTracking.status,
        details: courierTracking.details,
        location: courierTracking.location,
        timestamp: courierTracking.timestamp
      })
      .from(courierTracking)
      .where(
        and(
          eq(courierTracking.order_id, orderId),
          eq(courierTracking.tracking_id, order.courier_tracking_id)
        )
      )
      .orderBy(desc(courierTracking.timestamp));

    // Return the tracking information without creating new entries
    return NextResponse.json({
      success: true,
      order_id: order.id,
      has_tracking: true,
      tracking_id: order.courier_tracking_id,
      current_status: courierStatus,
      courier: courierData.length ? courierData[0] : null,
      tracking: trackingEntries,
      pathao_status: trackingInfo.data.order_status,
      pathao_details: trackingInfo.data.order_status_text || trackingInfo.data.order_status
    });
  } catch (error) {
    console.error(`Error viewing tracking for order ${params.id}:`, error);
    return NextResponse.json({ error: 'Failed to view tracking' }, { status: 500 });
  }
}
