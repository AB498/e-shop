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

      // Log important webhook data fields
      console.log('Important webhook data fields:');
      console.log(`- consignment_id: ${webhookData.consignment_id}`);
      console.log(`- merchant_order_id: ${webhookData.merchant_order_id}`);
      console.log(`- event: ${webhookData.event}`);

      // Process the webhook event
      const processedData = processWebhookEvent(webhookData);

      console.log('Processed webhook data:');
      console.log(`- orderId: ${processedData.orderId}`);
      console.log(`- consignmentId: ${processedData.consignmentId}`);
      console.log(`- merchantOrderId: ${processedData.merchantOrderId}`);
      console.log(`- courierStatus: ${processedData.courierStatus}`);
      console.log(`- orderStatus: ${processedData.orderStatus}`);

      // Always try to update the order, even if we don't have an orderId
      // The updateOrderFromWebhook function will try to find the order by consignment ID or merchant_order_id
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

        // Log additional debug information
        console.log('Please check the following:');
        console.log('1. Verify that the order exists in the database');
        console.log('2. Verify that courier_order_id or courier_tracking_id in the database matches either consignment_id or merchant_order_id from the webhook');
        console.log('3. Check if there are any orders with courier tracking information in the database');
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
