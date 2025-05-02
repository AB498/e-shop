import { NextResponse } from 'next/server';
import { processWebhookEvent } from '@/lib/services/pathao-courier';
import { updateOrderFromWebhook } from '@/lib/actions/couriers';

/**
 * Pathao webhook handler for status updates
 * This endpoint receives status updates from Pathao courier service
 * and updates the order status in the database
 */
export async function POST(request) {
  try {
    // Verify webhook signature
    const webhookSecret = process.env.PATHAO_WEBHOOK_SECRET;
    const signature = request.headers.get('X-PATHAO-Signature');

    // Log headers for debugging
    console.log('Webhook request headers:', {
      signature,
      contentType: request.headers.get('Content-Type'),
    });

    // Webhook integration verification
    if (request.headers.get('Content-Type')?.includes('application/json')) {
      const webhookData = await request.json();
      console.log('Received webhook data:', JSON.stringify(webhookData, null, 2));

      // Handle webhook integration verification
      if (webhookData.event === 'webhook_integration') {
        console.log('Webhook integration verification received');

        // Return 202 Accepted with the required header
        return new NextResponse(null, {
          status: 202,
          headers: {
            'X-Pathao-Merchant-Webhook-Integration-Secret': webhookSecret
          }
        });
      }

      // Process the webhook event
      const processedData = processWebhookEvent(webhookData);

      // Always try to update the order, even if we don't have an orderId
      // The updateOrderFromWebhook function will try to find the order by consignment ID
      const result = await updateOrderFromWebhook(processedData);

      if (result) {
        console.log(`Successfully updated order status to ${processedData.courierStatus}`);
        if (processedData.orderId) {
          console.log(`Order ID: ${processedData.orderId}`);
        } else if (result.order_id) {
          console.log(`Found and updated order ID: ${result.order_id}`);
        }
      } else {
        console.error('Failed to update order from webhook data');
        console.warn('Could not find matching order for webhook data');
      }

      // Return 202 Accepted with the required header
      return new NextResponse(null, {
        status: 202,
        headers: {
          'X-Pathao-Merchant-Webhook-Integration-Secret': webhookSecret
        }
      });
    }

    // Invalid request
    console.error('Invalid webhook request: Content-Type not application/json');
    return new NextResponse(JSON.stringify({ error: 'Invalid request' }), {
      status: 400,
      headers: {
        'Content-Type': 'application/json',
        'X-Pathao-Merchant-Webhook-Integration-Secret': webhookSecret
      }
    });
  } catch (error) {
    console.error('Error processing webhook:', error);

    // Even in case of error, return 202 with the required header to prevent Pathao from retrying
    return new NextResponse(null, {
      status: 202,
      headers: {
        'X-Pathao-Merchant-Webhook-Integration-Secret': process.env.PATHAO_WEBHOOK_SECRET
      }
    });
  }
}
