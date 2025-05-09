import { NextResponse } from 'next/server';
import { verifyDeliveryOTP } from '@/lib/actions/delivery-persons';

/**
 * API endpoint to verify delivery OTP
 * This endpoint is used by delivery persons to verify the OTP provided by the customer
 */
export async function POST(request) {
  try {
    // Get request body
    const body = await request.json();
    
    // Validate required fields
    if (!body.orderId || !body.otp) {
      return NextResponse.json({ 
        success: false, 
        message: 'Order ID and OTP are required' 
      }, { status: 400 });
    }

    // Convert orderId to number if it's a string
    const orderId = typeof body.orderId === 'string' ? parseInt(body.orderId, 10) : body.orderId;
    
    if (isNaN(orderId)) {
      return NextResponse.json({ 
        success: false, 
        message: 'Invalid Order ID' 
      }, { status: 400 });
    }

    // Verify OTP
    const result = await verifyDeliveryOTP(orderId, body.otp);
    
    if (!result.success) {
      return NextResponse.json({ 
        success: false, 
        message: result.message 
      }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      message: 'OTP verified successfully',
    });
  } catch (error) {
    console.error('Error verifying delivery OTP:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Failed to verify OTP' 
    }, { status: 500 });
  }
}
