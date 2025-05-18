import { NextResponse } from 'next/server';
import { updateOrderFromWebhook } from '@/lib/actions/couriers';

/**
 * POST handler for Steadfast webhook
 * Handles both delivery_status and tracking_update webhook types
 */
export async function POST(request) {
  try {
    // Check authentication if required
    // const authHeader = request.headers.get('Authorization');
    // if (!authHeader || !authHeader.startsWith('Bearer ') || authHeader !== `Bearer ${process.env.STEADFAST_WEBHOOK_TOKEN}`) {
    //   console.error('Unauthorized webhook request');
    //   return NextResponse.json({ status: 'error', message: 'Unauthorized' }, { status: 401 });
    // }

    // Get webhook data
    const webhookData = await request.json();

    console.log('Received Steadfast webhook:', JSON.stringify(webhookData, null, 2));

    // Validate webhook data
    if (!webhookData || !webhookData.notification_type || !webhookData.consignment_id) {
      console.error('Invalid webhook data:', webhookData);
      return NextResponse.json({
        status: 'error',
        message: 'Invalid webhook data'
      }, { status: 400 });
    }

    // Process webhook data based on notification type
    let processedData;

    if (webhookData.notification_type === 'delivery_status') {
      // Handle delivery status update
      if (!webhookData.status) {
        console.error('Missing status in delivery_status webhook');
        return NextResponse.json({
          status: 'error',
          message: 'Missing status in webhook data'
        }, { status: 400 });
      }

      processedData = {
        consignmentId: webhookData.consignment_id,
        merchantOrderId: webhookData.invoice,
        courierStatus: webhookData.status.toLowerCase(), // Normalize status to lowercase
        details: webhookData.tracking_message || webhookData.status,
        location: 'Steadfast Courier',
        timestamp: webhookData.updated_at || new Date().toISOString()
      };
    } else if (webhookData.notification_type === 'tracking_update') {
      // Handle tracking update
      processedData = {
        consignmentId: webhookData.consignment_id,
        merchantOrderId: webhookData.invoice,
        // No status change for tracking updates, just add a tracking entry
        courierStatus: null, // Will use existing status
        details: webhookData.tracking_message,
        location: 'Steadfast Courier',
        timestamp: webhookData.updated_at || new Date().toISOString(),
        isTrackingUpdate: true // Flag to indicate this is just a tracking update
      };
    } else {
      console.error('Unknown notification type:', webhookData.notification_type);
      return NextResponse.json({
        status: 'error',
        message: 'Unknown notification type'
      }, { status: 400 });
    }

    // Update order status
    const result = await updateOrderFromWebhook(processedData);

    if (!result) {
      console.warn('Order not found or could not be updated from webhook');
      // Return 200 anyway to acknowledge receipt as per documentation
      return NextResponse.json({
        status: 'success',
        message: 'Webhook received but order not found'
      });
    }

    return NextResponse.json({
      status: 'success',
      message: 'Webhook received successfully.'
    });
  } catch (error) {
    console.error('Error processing Steadfast webhook:', error);
    return NextResponse.json({
      status: 'error',
      message: 'Failed to process webhook'
    }, { status: 500 });
  }
}

/**
 * GET handler for Steadfast webhook (for testing)
 */
export async function GET() {
  return NextResponse.json({
    status: 'success',
    message: 'Steadfast webhook endpoint is active'
  });
}
