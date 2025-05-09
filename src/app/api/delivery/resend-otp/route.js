import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { resendDeliveryOTP } from '@/lib/actions/delivery-otp';

/**
 * API endpoint to resend delivery OTP
 * This endpoint is used by admin to resend the OTP to the customer
 */
export async function POST(request) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ 
        success: false, 
        message: 'Unauthorized' 
      }, { status: 401 });
    }

    // Get request body
    const body = await request.json();
    
    // Validate required fields
    if (!body.orderId) {
      return NextResponse.json({ 
        success: false, 
        message: 'Order ID is required' 
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

    // Resend OTP
    const result = await resendDeliveryOTP(orderId);
    
    if (!result.success) {
      return NextResponse.json({ 
        success: false, 
        message: result.message 
      }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      message: 'OTP resent successfully',
    });
  } catch (error) {
    console.error('Error resending delivery OTP:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Failed to resend OTP' 
    }, { status: 500 });
  }
}
