import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { orders } from '@/db/schema';
import { eq } from 'drizzle-orm';

/**
 * API endpoint to check OTP status for a delivery
 * This endpoint is used by delivery persons to check if an order has an OTP and if it's verified
 */
export async function GET(request) {
  try {
    // Get order ID from query parameters
    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get('orderId');
    
    // Validate order ID
    if (!orderId) {
      return NextResponse.json({ 
        success: false, 
        message: 'Order ID is required' 
      }, { status: 400 });
    }

    // Convert orderId to number
    const orderIdNum = parseInt(orderId, 10);
    
    if (isNaN(orderIdNum)) {
      return NextResponse.json({ 
        success: false, 
        message: 'Invalid Order ID' 
      }, { status: 400 });
    }

    // Get order OTP status
    const orderData = await db
      .select({
        id: orders.id,
        delivery_otp: orders.delivery_otp,
        delivery_otp_verified: orders.delivery_otp_verified,
        delivery_otp_sent_at: orders.delivery_otp_sent_at,
      })
      .from(orders)
      .where(eq(orders.id, orderIdNum))
      .limit(1);

    if (!orderData.length) {
      return NextResponse.json({ 
        success: false, 
        message: 'Order not found' 
      }, { status: 404 });
    }

    const order = orderData[0];

    // Return OTP status (but not the actual OTP)
    return NextResponse.json({
      success: true,
      data: {
        orderId: order.id,
        hasOtp: !!order.delivery_otp,
        otpVerified: !!order.delivery_otp_verified,
        otpSentAt: order.delivery_otp_sent_at,
      }
    });
  } catch (error) {
    console.error('Error checking OTP status:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Failed to check OTP status' 
    }, { status: 500 });
  }
}
