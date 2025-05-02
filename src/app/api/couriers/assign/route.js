import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { assignCourierToOrder, createCourierOrder } from '@/lib/actions/couriers';
import { getOrderDetails } from '@/lib/actions/orders';
import { formatOrderForPathao } from '@/lib/services/pathao-courier';
import { db } from '@/lib/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';

// POST handler to assign a courier to an order
export async function POST(request) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get request body
    const body = await request.json();
    
    // Validate required fields
    if (!body.orderId || !body.courierId || !body.deliveryInfo) {
      return NextResponse.json({ 
        error: 'Order ID, courier ID, and delivery information are required' 
      }, { status: 400 });
    }

    // Convert IDs to numbers if they're strings
    const orderId = typeof body.orderId === 'string' ? parseInt(body.orderId, 10) : body.orderId;
    const courierId = typeof body.courierId === 'string' ? parseInt(body.courierId, 10) : body.courierId;
    
    if (isNaN(orderId) || isNaN(courierId)) {
      return NextResponse.json({ error: 'Invalid Order ID or Courier ID' }, { status: 400 });
    }

    // Validate delivery info
    const { deliveryInfo } = body;
    if (!deliveryInfo.address || !deliveryInfo.city || !deliveryInfo.phone) {
      return NextResponse.json({ 
        error: 'Delivery address, city, and phone are required' 
      }, { status: 400 });
    }

    // Assign courier to order
    const updatedOrder = await assignCourierToOrder(orderId, courierId, deliveryInfo);
    
    if (!updatedOrder) {
      return NextResponse.json({ error: 'Failed to assign courier to order' }, { status: 500 });
    }

    // If Pathao integration is requested, create courier order
    if (body.createPathaoOrder && courierId === 1) { // Assuming Pathao has ID 1
      // Get order details
      const orderDetails = await getOrderDetails(orderId);
      if (!orderDetails) {
        return NextResponse.json({ error: 'Order not found' }, { status: 404 });
      }

      // Get user details
      const userData = await db
        .select()
        .from(users)
        .where(eq(users.id, orderDetails.user_id))
        .limit(1);
      
      if (!userData.length) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }

      // Format order for Pathao
      const pathaoOrderData = formatOrderForPathao(
        orderDetails,
        userData[0],
        orderDetails.items,
        body.storeInfo,
        deliveryInfo
      );

      // Create courier order
      const courierOrder = await createCourierOrder(orderId, pathaoOrderData);
      
      if (!courierOrder) {
        return NextResponse.json({ 
          error: 'Failed to create Pathao courier order',
          order: updatedOrder 
        }, { status: 500 });
      }

      return NextResponse.json({
        order: courierOrder,
        courier_order: true
      });
    }

    return NextResponse.json(updatedOrder);
  } catch (error) {
    console.error('Error assigning courier to order:', error);
    return NextResponse.json({ error: 'Failed to assign courier to order' }, { status: 500 });
  }
}
