import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { orders, courierTracking } from '@/db/schema';
import { eq, and, desc } from 'drizzle-orm';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import * as pathaoCourier from '@/lib/services/pathao-courier';
import { mapCourierStatusToOrderStatus } from '@/lib/utils/status-mapping';

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
    console.log(`Courier status: ${courierStatus}, Pathao status: ${trackingInfo.data.order_status}`);

    // Only update the order status if the courier status has actually changed
    // First, get the current courier status
    const currentStatus = order.courier_status || 'pending';

    // Only update if the status has changed
    if (courierStatus !== currentStatus) {
      // Map courier status to order status using our utility function
      // Pass the current order status to ensure proper transitions
      const newOrderStatus = await mapCourierStatusToOrderStatus(courierStatus, order.status);

      console.log(`Updating order status from ${order.status} to ${newOrderStatus} based on courier status ${courierStatus}`);

      // Update order with latest status
      await db.update(orders)
        .set({
          courier_status: courierStatus,
          status: newOrderStatus,
          updated_at: new Date(),
        })
        .where(eq(orders.id, orderId));
    }

    // Get all existing tracking entries for this order
    const allTrackingEntries = await db
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

    // Check if a tracking entry with the same status already exists
    const existingEntries = allTrackingEntries.filter(entry =>
      entry.status === courierStatus &&
      entry.details === (trackingInfo.data.order_status_text || trackingInfo.data.order_status)
    );

    // Check if we should skip creating a new entry
    // If the status is still "pending" and the details are generic, and we already have an initial entry
    const shouldSkipGenericPending = false;


    let trackingEntry;

    // Only create a new entry if:
    // 1. One doesn't already exist with the same status and details, AND
    // 2. We're not dealing with a generic "Pending" status when we already have an initial entry
    if (existingEntries.length === 0 && !shouldSkipGenericPending) {
      trackingEntry = await db.insert(courierTracking).values({
        order_id: orderId,
        courier_id: order.courier_id,
        tracking_id: order.courier_tracking_id,
        status: courierStatus,
        details: trackingInfo.data.order_status_text || trackingInfo.data.order_status,
        location: trackingInfo.data.current_location || 'Unknown',
        timestamp: trackingInfo.data.updated_at ? new Date(trackingInfo.data.updated_at) : new Date(),
      }).returning();
    } else {
      // Return the existing entry or the initial "Order created with courier" entry
      if (existingEntries.length > 0) {
        trackingEntry = existingEntries;
      } else {
        // Find the initial entry
        const initialEntry = allTrackingEntries.find(entry =>
          entry.status === 'pending' &&
          entry.details === 'Order created with courier'
        );
        trackingEntry = initialEntry ? [initialEntry] : [];
      }
    }

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
