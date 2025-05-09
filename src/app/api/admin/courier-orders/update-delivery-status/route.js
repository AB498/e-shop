import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { updateDeliveryStatus } from '@/lib/actions/delivery-persons';

// POST handler to update delivery status
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
    if (!body.orderId || !body.status) {
      return NextResponse.json({ error: 'Order ID and status are required' }, { status: 400 });
    }

    // Update delivery status
    const result = await updateDeliveryStatus(body.orderId, body.status, body.details || '');
    
    if (!result) {
      return NextResponse.json({ error: 'Failed to update delivery status' }, { status: 500 });
    }

    return NextResponse.json({ success: true, tracking: result });
  } catch (error) {
    console.error('Error updating delivery status:', error);
    return NextResponse.json({ error: error.message || 'Failed to update delivery status' }, { status: 500 });
  }
}
