import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { orders } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { createAutomaticCourierOrder } from '@/lib/services/auto-courier';
import { storePaymentTransaction } from '@/lib/actions/payments';

// Common handler function for both GET and POST requests
async function handlePaymentSuccess(request, isPost = false) {
  try {
    // Log the full request URL for debugging
    console.log(`Payment success callback URL (${isPost ? 'POST' : 'GET'}):`, request.url);

    // Get parameters from either query string or form data
    let orderId, valId, status, orderIdInt;

    if (isPost) {
      // For POST requests, get the content type to determine how to parse the body
      const contentType = request.headers.get('content-type') || '';
      console.log('Content-Type:', contentType);

      // Clone the request to avoid consuming the body stream
      const clonedRequest = request.clone();

      // Try to get the raw text of the request body for debugging
      try {
        const rawBody = await clonedRequest.text();
        console.log('Raw request body:', rawBody);

        // SSLCommerz typically sends form-urlencoded data, not JSON
        if (contentType.includes('application/x-www-form-urlencoded')) {
          // Parse the form data manually
          const formData = new URLSearchParams(rawBody);
          const formDataObj = Object.fromEntries(formData.entries());
          console.log('Parsed form data:', formDataObj);

          // Try value_a, order_id, or tran_id fields for the order ID
          orderId = formDataObj.value_a || formDataObj.order_id || formDataObj.tran_id;
          valId = formDataObj.val_id;
          status = formDataObj.status;

          // Log transaction ID for debugging
          console.log('Transaction ID:', formDataObj.tran_id);
        }
        // If it's JSON content type
        else if (contentType.includes('application/json')) {
          try {
            const jsonData = JSON.parse(rawBody);
            console.log('Parsed JSON data:', jsonData);

            // SSLCommerz stores the order_id in value_a field
            orderId = jsonData.value_a || jsonData.order_id || jsonData.tran_id;
            valId = jsonData.val_id;
            status = jsonData.status;

            // Log transaction ID for debugging
            console.log('Transaction ID:', jsonData.tran_id);
          } catch (jsonParseError) {
            console.error('Error parsing JSON:', jsonParseError);
          }
        }
        // If we couldn't determine the content type or it's something else
        else {
          console.log('Unknown content type, attempting to parse as form data');
          // Try to parse as form data anyway
          const formData = new URLSearchParams(rawBody);
          const formDataObj = Object.fromEntries(formData.entries());
          console.log('Attempted form data parse:', formDataObj);

          orderId = formDataObj.value_a || formDataObj.order_id || formDataObj.tran_id;
          valId = formDataObj.val_id;
          status = formDataObj.status;

          // Log transaction ID for debugging
          console.log('Transaction ID:', formDataObj.tran_id);
        }

        console.log('Extracted from request body:', { orderId, valId, status });
      } catch (bodyError) {
        console.error('Error reading request body:', bodyError);
      }
    }

    // If we couldn't get data from POST body or as fallback, use URL parameters
    if (!orderId) {
      const { searchParams } = new URL(request.url);
      console.log('Payment success parameters from URL:', Object.fromEntries(searchParams.entries()));

      orderId = searchParams.get('order_id');
      valId = searchParams.get('val_id');
      status = searchParams.get('status');

      console.log('Extracted from URL params:', { orderId, valId, status });
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

    // For SSL Commerz, we need to check if we have a valid payment
    // Always require both val_id and status to be VALID or VALIDATED
    console.log('Environment: Production (strict validation)');

    // Always validate the payment
    // VALID / FAILED / CANCELLED
    if (!valId || (status !== 'VALID' && status !== 'VALIDATED')) {
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

    // Always validate with SSL Commerz
    // We've already checked that val_id and status are valid above, so this will always run
    {
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

        // VALID / FAILED / CANCELLED
        if (validationData.status !== 'VALID' && validationData.status !== 'VALIDATED') {
          console.error('Payment validation failed:', validationData);

          // Store the failed transaction data
          try {
            await storePaymentTransaction({
              order_id: parseInt(orderId),
              transaction_id: validationData.tran_id || 'unknown',
              val_id: validationData.val_id || valId,
              amount: validationData.amount || 0,
              status: validationData.status || 'FAILED',
              currency: validationData.currency || 'BDT',
              tran_date: validationData.tran_date,
              card_type: validationData.card_type,
              card_no: validationData.card_no,
              bank_tran_id: validationData.bank_tran_id,
              card_issuer: validationData.card_issuer,
              card_brand: validationData.card_brand,
              card_issuer_country: validationData.card_issuer_country,
              card_issuer_country_code: validationData.card_issuer_country_code,
              store_amount: validationData.store_amount,
              verify_sign: validationData.verify_sign,
              verify_key: validationData.verify_key,
              risk_level: validationData.risk_level,
              risk_title: validationData.risk_title,
              payment_method: validationData.card_type,
              response_data: validationData,
            });
            console.log('Failed transaction data stored successfully');
          } catch (storeError) {
            console.error('Error storing failed transaction data:', storeError);
          }

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

        // Store the successful transaction data
        try {
          await storePaymentTransaction({
            order_id: parseInt(orderId),
            transaction_id: validationData.tran_id,
            val_id: validationData.val_id,
            amount: validationData.amount,
            status: validationData.status,
            currency: validationData.currency,
            tran_date: validationData.tran_date,
            card_type: validationData.card_type,
            card_no: validationData.card_no,
            bank_tran_id: validationData.bank_tran_id,
            card_issuer: validationData.card_issuer,
            card_brand: validationData.card_brand,
            card_issuer_country: validationData.card_issuer_country,
            card_issuer_country_code: validationData.card_issuer_country_code,
            store_amount: validationData.store_amount,
            verify_sign: validationData.verify_sign,
            verify_key: validationData.verify_key,
            risk_level: validationData.risk_level,
            risk_title: validationData.risk_title,
            payment_method: validationData.card_type,
            response_data: validationData,
          });
          console.log('Transaction data stored successfully');
        } catch (storeError) {
          console.error('Error storing transaction data:', storeError);
          // Continue anyway, as we still want to show the success page
        }
      } catch (validationError) {
        console.error('Error validating payment:', validationError);

        // Always redirect to error page on validation error
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

    // Update order status to processing and create courier order
    try {
      // Ensure we have a valid order ID
      if (!orderId) {
        throw new Error('Missing order ID for database update');
      }

      // Parse the order ID to an integer
      const orderIdInt = parseInt(orderId, 10);
      if (isNaN(orderIdInt)) {
        throw new Error(`Invalid order ID format: ${orderId}`);
      }

      console.log(`Updating order ${orderIdInt} status to 'processing'`);
      await db.update(orders)
        .set({
          status: 'processing',
          updated_at: new Date()
        })
        .where(eq(orders.id, orderIdInt));
      console.log(`Order ${orderIdInt} status updated successfully`);

      // Automatically create a courier order with Pathao
      console.log(`Creating automatic courier order for order ${orderIdInt}`);
      const courierResult = await createAutomaticCourierOrder(orderIdInt);

      if (courierResult) {
        console.log(`Courier order created successfully for order ${orderIdInt}`, {
          consignment_id: courierResult.consignment_id
        });
      } else {
        console.error(`Failed to create courier order for order ${orderIdInt}`);
        // Continue anyway, as we still want to show the success page
      }
    } catch (dbError) {
      console.error('Error updating order status or creating courier order:', dbError);
      console.error('Error details:', dbError.message);
      // Continue anyway, as we still want to show the success page
    }

    // Redirect to success page
    try {
      // Use the orderIdInt if available, otherwise fall back to the original orderId
      const finalOrderId = orderIdInt || orderId;
      const redirectUrl = `${baseUrl}/payment/success?order_id=${finalOrderId}`;
      console.log(`Redirecting to success page: ${redirectUrl}`);

      // Validate the URL before redirecting
      new URL(redirectUrl); // This will throw if the URL is invalid

      // Use 303 status code to convert POST to GET
      return NextResponse.redirect(redirectUrl, { status: 303 });
    } catch (urlError) {
      console.error('Invalid redirect URL:', urlError);
      // Fallback to a hardcoded URL if there's an issue
      return NextResponse.redirect(`${baseUrl}/payment/success?order_id=${orderId || ''}`, { status: 303 });
    }

  } catch (error) {
    console.error('Payment success error:', error);
    console.error('Error details:', error.message);
    console.error('Error stack:', error.stack);

    // Ensure we have a valid app URL even in the catch block
    const appUrl = process.env.NEXT_PUBLIC_APP_URL;
    // Make sure appUrl is not null or undefined before using it
    // Always default to localhost if appUrl is falsy
    const baseUrl = appUrl ? (appUrl.endsWith('/') ? appUrl.slice(0, -1) : appUrl) : process.env.NEXT_PUBLIC_APP_URL;

    // Log the baseUrl for debugging
    console.log('Base URL for redirects (in catch block):', baseUrl);

    try {
      // Include error message in the redirect for better debugging
      const errorMessage = encodeURIComponent(error.message || 'An unexpected error occurred');
      const errorRedirectUrl = `${baseUrl}/payment/error?message=${errorMessage}`;
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
