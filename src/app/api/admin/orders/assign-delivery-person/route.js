import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { assignDeliveryPerson } from '@/lib/actions/delivery-persons';
import { initializeInternalCourier } from '@/lib/actions/couriers';

// POST handler to assign a delivery person to an order
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
    if (!body.orderId || !body.deliveryPersonId) {
      return NextResponse.json({ error: 'Order ID and delivery person ID are required' }, { status: 400 });
    }

    // First, ensure there's an internal courier record
    await initializeInternalCourier();
    
    // Then assign delivery person to order
    const result = await assignDeliveryPerson(body.orderId, body.deliveryPersonId);
    
    if (!result) {
      return NextResponse.json({ error: 'Failed to assign delivery person to order' }, { status: 500 });
    }

    return NextResponse.json({ success: true, order: result });
  } catch (error) {
    console.error('Error assigning delivery person to order:', error);
    return NextResponse.json({ error: error.message || 'Failed to assign delivery person to order' }, { status: 500 });
  }
}
