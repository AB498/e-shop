import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { updateCourierTracking } from '@/lib/actions/couriers';

// POST handler to update tracking information for an order
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

    // Update tracking information
    const trackingInfo = await updateCourierTracking(orderId);
    
    if (!trackingInfo) {
      return NextResponse.json({ error: 'Failed to update tracking information' }, { status: 500 });
    }

    return NextResponse.json(trackingInfo);
  } catch (error) {
    console.error('Error updating tracking information:', error);
    return NextResponse.json({ error: 'Failed to update tracking information' }, { status: 500 });
  }
}
