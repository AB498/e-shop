import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { db } from '@/lib/db';
import { orders, courierTracking, couriers } from '@/db/schema';
import { eq, desc, and } from 'drizzle-orm';
import * as pathaoCourier from '@/lib/services/pathao-courier';

// POST handler to refresh tracking information without altering tracking history
export async function POST(request) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get request body
    const body = await request.json();
    
    // Validate required fields
    if (!body.orderId) {
      return NextResponse.json({ error: 'Order ID is required' }, { status: 400 });
    }

    // Convert orderId to number if it's a string
    const orderId = typeof body.orderId === 'string' ? parseInt(body.orderId, 10) : body.orderId;
    
    if (isNaN(orderId)) {
      return NextResponse.json({ error: 'Invalid Order ID' }, { status: 400 });
    }

    // Get order information
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

    if (!orderData.length || !orderData[0].courier_tracking_id) {
      return NextResponse.json({ error: 'Order not found or has no tracking ID' }, { status: 404 });
    }

    const order = orderData[0];

    // Get tracking information from Pathao API
    const trackingInfo = await pathaoCourier.trackOrder(order.courier_tracking_id);

    if (!trackingInfo || !trackingInfo.data) {
      return NextResponse.json({ error: 'Failed to get tracking information from Pathao' }, { status: 500 });
    }

    // Map Pathao status to our internal status
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

    // Get existing tracking entries
    const trackingEntries = await db
      .select({
        id: courierTracking.id,
        status: courierTracking.status,
        details: courierTracking.details,
        location: courierTracking.location,
        timestamp: courierTracking.timestamp,
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
    console.error('Error refreshing tracking information:', error);
    return NextResponse.json({ error: 'Failed to refresh tracking information' }, { status: 500 });
  }
}
