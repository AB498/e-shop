import dotenv from 'dotenv';

// Load environment variables if not already loaded
dotenv.config();

// SendPulse API credentials from environment variables
const CLIENT_ID = process.env.SENDPULSE_CLIENT_ID;
const CLIENT_SECRET = process.env.SENDPULSE_CLIENT_SECRET;

/**
 * Get OAuth token from SendPulse API
 * @returns {Promise<string>} Access token
 */
async function getAccessToken() {
  try {
    const formData = new URLSearchParams();
    formData.append('grant_type', 'client_credentials');
    formData.append('client_id', CLIENT_ID);
    formData.append('client_secret', CLIENT_SECRET);

    const response = await fetch('https://api.sendpulse.com/oauth/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: formData
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    return data.access_token;
  } catch (error) {
    console.error('Error getting SendPulse access token:', error.message);
    throw new Error('Failed to authenticate with email service');
  }
}

/**
 * Send an email using SendPulse API
 * @param {string} to - Recipient email address
 * @param {string} subject - Email subject
 * @param {string} htmlContent - HTML content of the email
 * @param {string} textContent - Plain text content of the email
 * @returns {Promise<Object>} Response from SendPulse API
 */
export async function sendEmail(to, subject, htmlContent, textContent) {
  if (!to) {
    console.log('No recipient email provided, skipping email send');
    return;
  }

  try {
    // Get access token
    const accessToken = await getAccessToken();

    // Prepare email payload
    const emailPayload = {
      email: {
        html: htmlContent,
        text: textContent || htmlContent.replace(/<[^>]*>/g, ''), // Strip HTML tags for text version if not provided
        subject: subject,
        from: {
          name: "Thai Bangla Store",
          email: "info@perk.ink"
        },
        to: [
          {
            name: "User",
            email: to
          }
        ]
      }
    };

    // Send the email
    const response = await fetch('https://api.sendpulse.com/smtp/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      },
      body: JSON.stringify(emailPayload)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`API error: ${response.status}, ${JSON.stringify(errorData)}`);
    }

    const data = await response.json();
    console.log('Email sent successfully to:', to);
    return data;
  } catch (error) {
    console.error('Error sending email:', error.message);
    throw new Error('Failed to send email');
  }
}

/**
 * Send a delivery OTP email to the customer
 * @param {string} to - Customer email address
 * @param {Object} orderData - Order data including OTP
 * @returns {Promise<Object>} Response from SendPulse API
 */
export async function sendDeliveryOTP(to, orderData) {
  const subject = `Your Delivery OTP Code for Order #${orderData.orderId}`;

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background-color: #4CAF50; padding: 20px; text-align: center; color: white;">
        <h1>Delivery OTP Code</h1>
      </div>
      <div style="padding: 20px; border: 1px solid #ddd; border-top: none;">
        <p>Dear Customer,</p>
        <p>Your order #${orderData.orderId} is out for delivery!</p>

        <div style="background-color: #f9f9f9; padding: 15px; margin: 20px 0; border-left: 4px solid #4CAF50;">
          <h2 style="margin-top: 0;">Your OTP Code</h2>
          <p style="font-size: 24px; font-weight: bold; text-align: center; letter-spacing: 5px; padding: 10px; background-color: #e9f7ef; border-radius: 5px;">${orderData.otp}</p>
          <p>Please provide this code to our delivery person when you receive your order.</p>
        </div>

        <p>For security reasons, please do not share this code with anyone except our delivery person.</p>

        <p>If you have any questions or need assistance, please contact our customer support team.</p>

        <p>Thank you for shopping with us!</p>

        <p>Best regards,<br>E-Shop Team</p>
      </div>
      <div style="background-color: #f1f1f1; padding: 10px; text-align: center; font-size: 12px; color: #666;">
        <p>This is an automated email. Please do not reply to this message.</p>
      </div>
    </div>
  `;

  const textContent = `
    Delivery OTP Code

    Dear Customer,

    Your order #${orderData.orderId} is out for delivery!

    Your OTP Code: ${orderData.otp}

    Please provide this code to our delivery person when you receive your order.

    For security reasons, please do not share this code with anyone except our delivery person.

    If you have any questions or need assistance, please contact our customer support team.

    Thank you for shopping with us!

    Best regards,
    E-Shop Team

    This is an automated email. Please do not reply to this message.
  `;

  return sendEmail(to, subject, htmlContent, textContent);
}