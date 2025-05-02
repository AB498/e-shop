import { NextResponse } from 'next/server';
import { createAutomaticCourierOrder } from '@/lib/services/auto-courier';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function POST(request) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { orderId } = body;

    if (!orderId) {
      return NextResponse.json({ error: 'Order ID is required' }, { status: 400 });
    }

    console.log(`Testing courier order creation for order ID: ${orderId}`);

    // Create courier order
    let result;
    try {
      result = await createAutomaticCourierOrder(parseInt(orderId));

      if (!result) {
        return NextResponse.json({
          error: 'Failed to create courier order. Check server logs for details.'
        }, { status: 500 });
      }
    } catch (courierError) {
      console.error('Error in createAutomaticCourierOrder:', courierError);
      return NextResponse.json({
        error: `Courier order creation failed: ${courierError.message}`
      }, { status: 500 });
    }

    // Log the full result for debugging
    console.log('Courier order creation result:', JSON.stringify(result, null, 2));

    return NextResponse.json({
      success: true,
      message: `Courier order created successfully for order ${orderId}`,
      data: result
    });
  } catch (error) {
    console.error('Error creating test courier order:', error);
    return NextResponse.json({ error: error.message || 'Failed to create courier order' }, { status: 500 });
  }
}
