import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { processWebhookEvent } from '@/lib/services/pathao-courier';
import { updateOrderFromWebhook } from '@/lib/actions/couriers';

/**
 * Test endpoint for Pathao webhook
 * This endpoint simulates a webhook event from Pathao
 * and processes it the same way the actual webhook would
 */
export async function POST(request) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { orderId, event } = body;

    if (!orderId) {
      return NextResponse.json({ error: 'Order ID is required' }, { status: 400 });
    }

    if (!event) {
      return NextResponse.json({ error: 'Event type is required' }, { status: 400 });
    }

    // Create a mock webhook event
    const mockWebhookData = {
      consignment_id: `DL${Date.now().toString().substring(0, 6)}VS${Math.floor(Math.random() * 1000)}`,
      merchant_order_id: `order-${orderId}`,
      updated_at: new Date().toISOString().replace('T', ' ').substring(0, 19),
      timestamp: new Date().toISOString(),
      store_id: 12345,
      event: event,
      delivery_fee: 83.46
    };

    console.log('Testing webhook with mock data:', JSON.stringify(mockWebhookData, null, 2));

    // Process the webhook event
    const processedData = await processWebhookEvent(mockWebhookData);
    
    // Update order status in database
    const result = await updateOrderFromWebhook(processedData);
    
    if (!result) {
      return NextResponse.json({ 
        error: 'Failed to update order',
        mockWebhookData,
        processedData
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: `Successfully updated order ${orderId} status to ${processedData.courierStatus}`,
      mockWebhookData,
      processedData,
      result
    });
  } catch (error) {
    console.error('Error testing webhook:', error);
    return NextResponse.json({ 
      error: 'Failed to test webhook',
      message: error.message,
      stack: error.stack,
    }, { status: 500 });
  }
}
