import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { orders, deliveryPersons } from '@/db/schema';
import { eq, and, desc, isNotNull, sql } from 'drizzle-orm';

/**
 * API endpoint to search for orders by ID with fuzzy matching
 * This endpoint is used by the delivery verification page to provide autocomplete suggestions
 */
export async function GET(request) {
  try {
    // Get search term from query parameters
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query');

    // Validate query
    if (!query) {
      return NextResponse.json({
        success: false,
        message: 'Search query is required'
      }, { status: 400 });
    }

    // Get limit from query parameters (default to 5)
    const limitParam = searchParams.get('limit');
    const limit = limitParam ? parseInt(limitParam, 10) : 5;

    // Search for orders with internal delivery that match the query
    // We're looking for orders that:
    // 1. Have a delivery person assigned (internal delivery)
    // 2. Have an ID that contains the query
    // 3. Are not already verified

    // We'll use SQL CAST to convert the ID to a string for comparison

    // Use SQL CAST to convert ID to string for LIKE operation
    const matchingOrders = await db
      .select({
        id: orders.id,
        status: orders.status,
        courier_status: orders.courier_status,
        delivery_person_id: orders.delivery_person_id,
        delivery_otp_verified: orders.delivery_otp_verified,
        created_at: orders.created_at,
      })
      .from(orders)
      .where(
        and(
          isNotNull(orders.delivery_person_id),
          sql`CAST(${orders.id} AS TEXT) LIKE ${'%' + query + '%'}`,
          eq(orders.delivery_otp_verified, false)
        )
      )
      .orderBy(desc(orders.created_at))
      .limit(limit);

    console.log('Matching orders:', matchingOrders.length, query, (await db.select().from(orders)).map(order => order.id));

    // Get delivery person details for each order
    const ordersWithDeliveryPerson = await Promise.all(
      matchingOrders.map(async (order) => {
        if (!order.delivery_person_id) {
          return order;
        }

        const deliveryPersonData = await db
          .select({
            name: deliveryPersons.name,
          })
          .from(deliveryPersons)
          .where(eq(deliveryPersons.id, order.delivery_person_id))
          .limit(1);

        const deliveryPersonName = deliveryPersonData.length ? deliveryPersonData[0].name : 'Unknown';

        return {
          ...order,
          delivery_person_name: deliveryPersonName,
        };
      })
    );

    return NextResponse.json({
      success: true,
      orders: ordersWithDeliveryPerson,
    });
  } catch (error) {
    console.error('Error searching orders:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to search orders'
    }, { status: 500 });
  }
}
