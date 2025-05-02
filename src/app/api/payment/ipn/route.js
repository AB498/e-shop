import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { orders } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { createAutomaticCourierOrder } from '@/lib/services/auto-courier';

export async function POST(request) {
  try {
    console.log('IPN callback received');

    // Parse the IPN notification
    const formData = await request.formData();

    // Convert formData to object for logging
    const formDataObj = {};
    for (const [key, value] of formData.entries()) {
      formDataObj[key] = value;
    }

    // Log all form data for debugging
    console.log('IPN Notification full data:', formDataObj);

    const status = formData.get('status');
    const valId = formData.get('val_id');
    const valueA = formData.get('value_a'); // Order ID

    // Log the key IPN notification fields for debugging
    console.log('IPN Notification key fields:', {
      status,
      valId,
      valueA,
    });

    if (!status || !valId || !valueA) {
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
    }

    // Validate the payment with SSL Commerz
    const validationEndpoint = process.env.SSLCOMMERZ_VALIDATION_ENDPOINT;

    const validationParams = new URLSearchParams({
      val_id: valId,
      store_id: process.env.SSLCOMMERZ_STORE_ID,
      store_passwd: process.env.SSLCOMMERZ_STORE_PASSWORD,
      format: 'json',
    });

    console.log('Validating IPN payment with endpoint:', `${validationEndpoint}?${validationParams.toString()}`);

    const validationResponse = await fetch(`${validationEndpoint}?${validationParams.toString()}`);
    const validationData = await validationResponse.json();

    console.log('IPN payment validation response:', validationData);

    // Update order status based on validation result
    try {
      const orderId = parseInt(valueA);
      console.log(`Processing IPN for order ID: ${orderId}`);

      if (validationData.status === 'VALID') {
        console.log(`Updating order ${orderId} status to 'processing'`);
        await db.update(orders)
          .set({
            status: 'processing',
            updated_at: new Date()
          })
          .where(eq(orders.id, orderId));

        console.log(`Order ${orderId} status updated successfully to 'processing'`);

        // Automatically create a courier order with Pathao
        console.log(`Creating automatic courier order for order ${orderId}`);
        const courierResult = await createAutomaticCourierOrder(orderId);

        if (courierResult) {
          console.log(`Courier order created successfully for order ${orderId}`, {
            consignment_id: courierResult.consignment_id
          });
          return NextResponse.json({
            success: true,
            message: 'Payment verified, order updated, and courier order created',
            courier: {
              consignment_id: courierResult.consignment_id
            }
          });
        } else {
          console.error(`Failed to create courier order for order ${orderId}`);
          return NextResponse.json({
            success: true,
            message: 'Payment verified and order updated, but courier order creation failed'
          });
        }
      } else {
        console.log(`Updating order ${orderId} status to 'cancelled'`);
        await db.update(orders)
          .set({
            status: 'cancelled',
            updated_at: new Date()
          })
          .where(eq(orders.id, orderId));

        console.log(`Order ${orderId} status updated successfully to 'cancelled'`);
        return NextResponse.json({ success: false, message: 'Payment validation failed' });
      }
    } catch (dbError) {
      console.error('Error updating order status in IPN handler:', dbError);
      return NextResponse.json({ error: 'Database error', details: dbError.message }, { status: 500 });
    }

  } catch (error) {
    console.error('IPN processing error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
