/**
 * Steadfast Courier API Service
 * Based on documentation: https://docs.google.com/document/u/0/d/e/2PACX-1vTi0sTyR353xu1AK0nR8E_WKe5onCkUXGEf8ch8uoJy9qxGfgGnboSIkNosjQ0OOdXkJhgGuAsWxnIh/pub
 */

// Constants
const STEADFAST_API_BASE_URL = process.env.STEADFAST_BASE_URL || 'https://portal.packzy.com/api/v1';

// API endpoints based on Steadfast documentation
const STEADFAST_CREATE_ORDER_ENDPOINT = `${STEADFAST_API_BASE_URL}/create_order`;
const STEADFAST_BULK_ORDER_ENDPOINT = `${STEADFAST_API_BASE_URL}/create_order/bulk-order`;
const STEADFAST_STATUS_BY_CID_ENDPOINT = `${STEADFAST_API_BASE_URL}/status_by_cid`;
const STEADFAST_STATUS_BY_INVOICE_ENDPOINT = `${STEADFAST_API_BASE_URL}/status_by_invoice`;
const STEADFAST_STATUS_BY_TRACKING_ENDPOINT = `${STEADFAST_API_BASE_URL}/status_by_trackingcode`;
const STEADFAST_BALANCE_ENDPOINT = `${STEADFAST_API_BASE_URL}/get_balance`;

/**
 * Make authenticated request to Steadfast API
 * @param {string} endpoint - API endpoint
 * @param {string} method - HTTP method
 * @param {object} body - Request body
 * @returns {Promise<object>} - API response
 */
async function makeAuthenticatedRequest(endpoint, method = 'GET', body = null) {
  try {
    // Get API credentials from environment variables
    const apiKey = process.env.STEADFAST_API_KEY;
    const secretKey = process.env.STEADFAST_SECRET_KEY;

    if (!apiKey || !secretKey) {
      throw new Error('Steadfast API credentials not configured');
    }

    const headers = {
      'Api-Key': apiKey,
      'Secret-Key': secretKey,
      'Accept': 'application/json',
    };

    if (body) {
      headers['Content-Type'] = 'application/json';
    }

    const requestOptions = {
      method,
      headers,
      cache: 'no-store'
    };

    if (body && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
      requestOptions.body = JSON.stringify(body);
    }

    console.log(`Making ${method} request to Steadfast API: ${endpoint}`);
    const response = await fetch(endpoint, requestOptions);

    if (!response.ok) {
      try {
        const errorData = await response.json();
        console.error(`Steadfast API error (${response.status}):`, JSON.stringify(errorData, null, 2));
        throw new Error(`Failed to make request to Steadfast API: ${JSON.stringify(errorData)}`);
      } catch (parseError) {
        throw new Error(`Failed to make request to Steadfast API: ${response.status} ${response.statusText}`);
      }
    }

    return await response.json();
  } catch (error) {
    console.error(`Error making request to ${endpoint}:`, error);
    throw error;
  }
}

/**
 * Create a new courier order
 * @param {object} orderData - Order data
 * @returns {Promise<object>} - Created order information
 */
export async function createOrder(orderData) {
  try {
    // Log the order data for debugging
    console.log('Creating Steadfast order with data:', JSON.stringify(orderData, null, 2));

    // Make the API request
    const response = await makeAuthenticatedRequest(STEADFAST_CREATE_ORDER_ENDPOINT, 'POST', orderData);
    console.log('Steadfast order created successfully:', JSON.stringify(response, null, 2));
    return response;
  } catch (error) {
    console.error('Error creating Steadfast order:', error);
    throw error;
  }
}

/**
 * Create multiple courier orders in bulk
 * @param {Array} ordersData - Array of order data objects
 * @returns {Promise<object>} - Created orders information
 */
export async function createBulkOrders(ordersData) {
  try {
    // Log the order data for debugging
    console.log(`Creating ${ordersData.length} Steadfast orders in bulk`);

    // Make the API request
    const response = await makeAuthenticatedRequest(STEADFAST_BULK_ORDER_ENDPOINT, 'POST', { data: ordersData });
    console.log('Steadfast bulk orders created successfully');
    return response;
  } catch (error) {
    console.error('Error creating Steadfast bulk orders:', error);
    throw error;
  }
}

/**
 * Track a courier order by consignment ID
 * @param {string} consignmentId - Consignment ID
 * @returns {Promise<object>} - Tracking information
 */
export async function trackOrderByConsignmentId(consignmentId) {
  return makeAuthenticatedRequest(`${STEADFAST_STATUS_BY_CID_ENDPOINT}/${consignmentId}`);
}

/**
 * Track a courier order by invoice ID
 * @param {string} invoiceId - Invoice ID
 * @returns {Promise<object>} - Tracking information
 */
export async function trackOrderByInvoiceId(invoiceId) {
  return makeAuthenticatedRequest(`${STEADFAST_STATUS_BY_INVOICE_ENDPOINT}/${invoiceId}`);
}

/**
 * Track a courier order by tracking code
 * @param {string} trackingCode - Tracking code
 * @returns {Promise<object>} - Tracking information
 */
export async function trackOrderByTrackingCode(trackingCode) {
  return makeAuthenticatedRequest(`${STEADFAST_STATUS_BY_TRACKING_ENDPOINT}/${trackingCode}`);
}

/**
 * Get current balance
 * @returns {Promise<object>} - Balance information
 */
export async function getBalance() {
  return makeAuthenticatedRequest(STEADFAST_BALANCE_ENDPOINT);
}

/**
 * Map Steadfast courier status to our internal status
 * @param {string} steadfastStatus - Steadfast courier status
 * @returns {string} - Internal courier status
 */
export async function mapSteadfastStatus(steadfastStatus) {
  const statusMap = {
    'pending': 'pending',
    'delivered_approval_pending': 'in_transit',
    'partial_delivered_approval_pending': 'in_transit',
    'cancelled_approval_pending': 'in_transit',
    'unknown_approval_pending': 'in_transit',
    'delivered': 'delivered',
    'partial_delivered': 'delivered',
    'cancelled': 'cancelled',
    'hold': 'in_transit',
    'in_review': 'processing',
    'unknown': 'processing'
  };

  return statusMap[steadfastStatus] || 'processing';
}

/**
 * Format order data for Steadfast API
 * @param {object} order - Order from our database
 * @param {object} user - User from our database
 * @param {Array} items - Order items from our database
 * @param {object} deliveryInfo - Delivery information
 * @returns {object} - Formatted order data for Steadfast API
 */
export async function formatOrderForSteadfast(order, user, items, deliveryInfo) {
  // Format recipient name
  const recipientName = `${user.first_name} ${user.last_name}`.trim();

  // Format phone number
  const recipientPhone = deliveryInfo.phone || user.phone || '';
  
  // Format phone number to ensure it's 11 digits
  const formattedPhone = formatBangladeshPhoneNumber(recipientPhone);

  // Calculate COD amount (0 for non-COD orders)
  const isCOD = order.payment_method === 'cod';
  const codAmount = isCOD ? parseFloat(order.total) : 0;

  // Create item description
  const itemDescription = items.map(item => item.product_name).join(', ').substring(0, 200);

  return {
    invoice: `order-${order.id}`,
    recipient_name: recipientName,
    recipient_phone: formattedPhone,
    recipient_address: deliveryInfo.address,
    cod_amount: codAmount,
    note: deliveryInfo.special_instructions || '',
    item_description: itemDescription
  };
}

/**
 * Format Bangladesh phone number
 * @param {string} phoneStr - Phone number string
 * @returns {string} - Formatted phone number
 */
export function formatBangladeshPhoneNumber(phoneStr) {
  if (!phoneStr) return '01712345678';

  // Remove any non-digit characters
  let digits = phoneStr.replace(/\D/g, '');

  // Handle different formats
  if (digits.startsWith('880')) {
    // Remove country code 880 and add 0
    digits = '0' + digits.substring(3);
  } else if (!digits.startsWith('0')) {
    // Add leading 0 if not present
    digits = '0' + digits;
  }

  // For Steadfast, we need a valid Bangladesh number format (11 digits starting with 01)
  // If the number doesn't look like a Bangladesh number after formatting,
  // return a default valid number
  if (!digits.startsWith('01') || digits.length !== 11) {
    console.warn(`Phone number ${digits} is not in Bangladesh format. Using default.`);
    return '01712345678';
  }

  console.log('Formatted phone number:', digits);
  return digits;
}
