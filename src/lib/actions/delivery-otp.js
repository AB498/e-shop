'use server';

import { db } from '@/lib/db';
import { orders, users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { sendDeliveryOTP } from '@/lib/email-service';

/**
 * Generate a random OTP code
 * @param {number} length - Length of the OTP code
 * @returns {string} - Generated OTP code
 */
function generateOTP(length = 6) {
  const digits = '0123456789';
  let otp = '';
  for (let i = 0; i < length; i++) {
    otp += digits[Math.floor(Math.random() * 10)];
  }
  return otp;
}

/**
 * Resend delivery OTP for an order
 * @param {number} orderId - Order ID
 * @returns {Promise<object>} - Result of the operation
 */
export async function resendDeliveryOTP(orderId) {
  try {
    // Get order
    const orderData = await db
      .select({
        id: orders.id,
        user_id: orders.user_id,
        delivery_otp_verified: orders.delivery_otp_verified,
      })
      .from(orders)
      .where(eq(orders.id, orderId))
      .limit(1);

    if (!orderData.length) {
      return { success: false, message: 'Order not found' };
    }

    const order = orderData[0];

    // Check if OTP is already verified
    if (order.delivery_otp_verified) {
      return { success: false, message: 'OTP already verified' };
    }

    // Generate new OTP
    const otp = generateOTP();
    const now = new Date();

    // Update order with new OTP
    await db.update(orders)
      .set({
        delivery_otp: otp,
        delivery_otp_sent_at: now,
        updated_at: now,
      })
      .where(eq(orders.id, orderId));

    // Get user information to send OTP email
    const userData = await db
      .select({
        email: users.email,
        first_name: users.first_name,
        last_name: users.last_name,
      })
      .from(users)
      .where(eq(users.id, order.user_id))
      .limit(1);

    if (!userData.length || !userData[0].email) {
      return { success: false, message: 'User email not found' };
    }

    // Send OTP email to customer
    await sendDeliveryOTP(userData[0].email, {
      orderId,
      otp,
      customerName: `${userData[0].first_name} ${userData[0].last_name}`.trim(),
    });

    return { success: true, message: 'OTP resent successfully' };
  } catch (error) {
    console.error(`Error resending OTP for order ${orderId}:`, error);
    return { success: false, message: 'Failed to resend OTP' };
  }
}
