import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { orders } from '@/db/schema';
import { eq } from 'drizzle-orm';

// Common handler function for both GET and POST requests
async function handlePaymentCancel(request, isPost = false) {
  try {
    // Log the full request URL for debugging
    console.log(`Payment cancel callback URL (${isPost ? 'POST' : 'GET'}):`, request.url);

    // Get parameters from either query string or form data
    let orderId;

    if (isPost) {
      // For POST requests, try to get data from form data
      try {
        const formData = await request.formData();
        console.log('Payment cancel POST data:', Object.fromEntries(formData.entries()));

        orderId = formData.get('order_id');
      } catch (formError) {
        console.error('Error parsing form data, trying JSON:', formError);

        // If form data fails, try JSON
        try {
          const jsonData = await request.json();
          console.log('Payment cancel POST JSON data:', jsonData);

          orderId = jsonData.order_id;
        } catch (jsonError) {
          console.error('Error parsing JSON, falling back to URL params:', jsonError);
        }
      }
    }

    // If we couldn't get data from POST body or as fallback, use URL parameters
    if (!orderId) {
      const { searchParams } = new URL(request.url);
      console.log('Payment cancel parameters from URL:', Object.fromEntries(searchParams.entries()));

      orderId = searchParams.get('order_id');
    }

    // Ensure we have a valid app URL
    const appUrl = process.env.NEXT_PUBLIC_APP_URL;
    // Make sure appUrl is not null or undefined before using it
    // Always default to localhost if appUrl is falsy
    const baseUrl = appUrl ? (appUrl.endsWith('/') ? appUrl.slice(0, -1) : appUrl) : process.env.NEXT_PUBLIC_APP_URL;

    // Log the baseUrl for debugging
    console.log('Base URL for redirects:', baseUrl);

    if (!orderId) {
      console.error('Missing order_id in payment cancel callback');
      try {
        const errorRedirectUrl = `${baseUrl}/payment/error?message=Invalid order reference`;
        // Validate the URL before redirecting
        new URL(errorRedirectUrl); // This will throw if the URL is invalid
        return NextResponse.redirect(errorRedirectUrl, { status: 303 });
      } catch (urlError) {
        console.error('Invalid error redirect URL:', urlError);
        // Fallback to a hardcoded URL if there's an issue
        return NextResponse.redirect(`${baseUrl}/payment/error?message=Invalid order reference`, { status: 303 });
      }
    }

    // Update order status to cancelled
    try {
      console.log(`Updating order ${orderId} status to 'cancelled'`);
      await db.update(orders)
        .set({
          status: 'cancelled',
          updated_at: new Date()
        })
        .where(eq(orders.id, parseInt(orderId)));
      console.log(`Order ${orderId} status updated successfully`);
    } catch (dbError) {
      console.error('Error updating order status:', dbError);
      // Continue anyway, as we still want to show the cancellation page
    }

    // Redirect to cancellation page
    try {
      const redirectUrl = `${baseUrl}/payment/cancelled?order_id=${orderId}`;
      console.log(`Redirecting to cancellation page: ${redirectUrl}`);

      // Validate the URL before redirecting
      new URL(redirectUrl); // This will throw if the URL is invalid

      // Use 303 status code to convert POST to GET
      return NextResponse.redirect(redirectUrl, { status: 303 });
    } catch (urlError) {
      console.error('Invalid redirect URL:', urlError);
      // Fallback to a hardcoded URL if there's an issue
      return NextResponse.redirect(`${baseUrl}/payment/cancelled?order_id=${orderId}`, { status: 303 });
    }

  } catch (error) {
    console.error('Payment cancellation error:', error);

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
  return handlePaymentCancel(request, false);
}

// POST handler
export async function POST(request) {
  return handlePaymentCancel(request, true);
}
