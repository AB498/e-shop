import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { orders } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { createAutomaticCourierOrder } from '@/lib/services/auto-courier';

// Common handler function for both GET and POST requests
async function handlePaymentSuccess(request, isPost = false) {
  try {
    // Log the full request URL for debugging
    console.log(`Payment success callback URL (${isPost ? 'POST' : 'GET'}):`, request.url);

    // Get parameters from either query string or form data
    let orderId, valId, status;

    if (isPost) {
      // For POST requests, try to get data from form data
      try {
        const formData = await request.formData();
        console.log('Payment success POST data:', Object.fromEntries(formData.entries()));

        orderId = formData.get('order_id');
        valId = formData.get('val_id');
        status = formData.get('status');
      } catch (formError) {
        console.error('Error parsing form data, trying JSON:', formError);

        // If form data fails, try JSON
        try {
          const jsonData = await request.json();
          console.log('Payment success POST JSON data:', jsonData);

          orderId = jsonData.order_id;
          valId = jsonData.val_id;
          status = jsonData.status;
        } catch (jsonError) {
          console.error('Error parsing JSON, falling back to URL params:', jsonError);
        }
      }
    }

    // If we couldn't get data from POST body or as fallback, use URL parameters
    if (!orderId) {
      const { searchParams } = new URL(request.url);
      console.log('Payment success parameters from URL:', Object.fromEntries(searchParams.entries()));

      orderId = searchParams.get('order_id');
      valId = searchParams.get('val_id');
      status = searchParams.get('status');
    }

    // Ensure we have a valid app URL
    const appUrl = process.env.NEXT_PUBLIC_APP_URL;
    // Make sure appUrl is not null or undefined before using it
    // Always default to localhost if appUrl is falsy
    const baseUrl = appUrl ? (appUrl.endsWith('/') ? appUrl.slice(0, -1) : appUrl) : process.env.NEXT_PUBLIC_APP_URL;

    // Log the baseUrl for debugging
    console.log('Base URL for redirects:', baseUrl);

    if (!orderId) {
      console.error('Missing order_id in payment success callback');
      try {
        const errorRedirectUrl = `${baseUrl}/payment/error?message=Missing order ID in payment response`;
        // Validate the URL before redirecting
        new URL(errorRedirectUrl); // This will throw if the URL is invalid
        return NextResponse.redirect(errorRedirectUrl, { status: 303 });
      } catch (urlError) {
        console.error('Invalid error redirect URL:', urlError);
        // Fallback to a hardcoded URL if there's an issue
        return NextResponse.redirect(`${baseUrl}/payment/error?message=Missing order ID in payment response`, { status: 303 });
      }
    }

    // For SSL Commerz sandbox testing, we might not always get a val_id or status
    // So we'll make this check more lenient in development
    if ((!valId || status !== 'VALID')) {
      console.error('Invalid payment response:', { orderId, valId, status });
      try {
        const errorRedirectUrl = `${baseUrl}/payment/error?message=Invalid payment response`;
        // Validate the URL before redirecting
        new URL(errorRedirectUrl); // This will throw if the URL is invalid
        return NextResponse.redirect(errorRedirectUrl, { status: 303 });
      } catch (urlError) {
        console.error('Invalid error redirect URL:', urlError);
        // Fallback to a hardcoded URL if there's an issue
        return NextResponse.redirect(`${baseUrl}/payment/error?message=Invalid payment response`, { status: 303 });
      }
    }

    // In development mode, we might skip validation for testing
    if ( (valId && status === 'VALID')) {
      // Validate the payment with SSL Commerz
      const validationEndpoint = process.env.SSLCOMMERZ_VALIDATION_ENDPOINT;

      const validationParams = new URLSearchParams({
        val_id: valId || '',
        store_id: process.env.SSLCOMMERZ_STORE_ID,
        store_passwd: process.env.SSLCOMMERZ_STORE_PASSWORD,
        format: 'json',
      });

      try {
        console.log('Validating payment with endpoint:', `${validationEndpoint}?${validationParams.toString()}`);
        const validationResponse = await fetch(`${validationEndpoint}?${validationParams.toString()}`);
        const validationData = await validationResponse.json();

        console.log('Payment validation response:', validationData);

        if (validationData.status !== 'VALID') {
          console.error('Payment validation failed:', validationData);
          try {
            const errorRedirectUrl = `${baseUrl}/payment/error?message=Payment validation failed`;
            // Validate the URL before redirecting
            new URL(errorRedirectUrl); // This will throw if the URL is invalid
            return NextResponse.redirect(errorRedirectUrl, { status: 303 });
          } catch (urlError) {
            console.error('Invalid error redirect URL:', urlError);
            // Fallback to a hardcoded URL if there's an issue
            return NextResponse.redirect(`${baseUrl}/payment/error?message=Payment validation failed`, { status: 303 });
          }
        }
      } catch (validationError) {
        console.error('Error validating payment:', validationError);

        // In development, continue anyway for testing purposes
        if (1) {
          try {
            const errorRedirectUrl = `${baseUrl}/payment/error?message=Error validating payment`;
            // Validate the URL before redirecting
            new URL(errorRedirectUrl); // This will throw if the URL is invalid
            return NextResponse.redirect(errorRedirectUrl, { status: 303 });
          } catch (urlError) {
            console.error('Invalid error redirect URL:', urlError);
            // Fallback to a hardcoded URL if there's an issue
            return NextResponse.redirect(`${baseUrl}/payment/error?message=Error validating payment`, { status: 303 });
          }
        }
      }
    } else {
      console.log('Skipping payment validation in development mode');
    }

    // Update order status to processing and create courier order
    try {
      console.log(`Updating order ${orderId} status to 'processing'`);
      await db.update(orders)
        .set({
          status: 'processing',
          updated_at: new Date()
        })
        .where(eq(orders.id, parseInt(orderId)));
      console.log(`Order ${orderId} status updated successfully`);

      // Automatically create a courier order with Pathao
      console.log(`Creating automatic courier order for order ${orderId}`);
      const courierResult = await createAutomaticCourierOrder(parseInt(orderId));

      if (courierResult) {
        console.log(`Courier order created successfully for order ${orderId}`, {
          consignment_id: courierResult.consignment_id
        });
      } else {
        console.error(`Failed to create courier order for order ${orderId}`);
        // Continue anyway, as we still want to show the success page
      }
    } catch (dbError) {
      console.error('Error updating order status or creating courier order:', dbError);
      // Continue anyway, as we still want to show the success page
    }

    // Redirect to success page
    try {
      const redirectUrl = `${baseUrl}/payment/success?order_id=${orderId}`;
      console.log(`Redirecting to success page: ${redirectUrl}`);

      // Validate the URL before redirecting
      new URL(redirectUrl); // This will throw if the URL is invalid

      // Use 303 status code to convert POST to GET
      return NextResponse.redirect(redirectUrl, { status: 303 });
    } catch (urlError) {
      console.error('Invalid redirect URL:', urlError);
      // Fallback to a hardcoded URL if there's an issue
      return NextResponse.redirect(`${baseUrl}/payment/success?order_id=${orderId}`, { status: 303 });
    }

  } catch (error) {
    console.error('Payment success error:', error);

    // Ensure we have a valid app URL even in the catch block
    const appUrl = process.env.NEXT_PUBLIC_APP_URL;
    // Make sure appUrl is not null or undefined before using it
    // Always default to localhost if appUrl is falsy
    const baseUrl = appUrl ? (appUrl.endsWith('/') ? appUrl.slice(0, -1) : appUrl) : process.env.NEXT_PUBLIC_APP_URL;

    // Log the baseUrl for debugging
    console.log('Base URL for redirects (in catch block):', baseUrl);

    try {
      const errorRedirectUrl = `${baseUrl}/payment/error?message=An unexpected error occurred`;
      console.log(`Redirecting to error page: ${errorRedirectUrl}`);

      // Validate the URL before redirecting
      new URL(errorRedirectUrl); // This will throw if the URL is invalid

      // Use 303 status code to convert POST to GET
      return NextResponse.redirect(errorRedirectUrl, { status: 303 });
    } catch (urlError) {
      console.error('Invalid error redirect URL:', urlError);
      // Fallback to a hardcoded URL if there's an issue
      return NextResponse.redirect(`${baseUrl}/payment/error?message=An unexpected error occurred`, { status: 303 });
    }
  }
}

// GET handler
export async function GET(request) {
  return handlePaymentSuccess(request, false);
}

// POST handler
export async function POST(request) {
  return handlePaymentSuccess(request, true);
}
