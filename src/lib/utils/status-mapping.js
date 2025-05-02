'use server';

/**
 * Maps courier status to order status
 * @param {string} courierStatus - Courier status from the courier_status enum
 * @param {string} currentOrderStatus - Current order status (optional)
 * @returns {string} - Order status (can be dynamic, not limited to enum values)
 */
export async function mapCourierStatusToOrderStatus(courierStatus, currentOrderStatus = null) {
  // If courier status is empty, return the current status or processing
  if (!courierStatus) {
    return currentOrderStatus || 'processing';
  }

  // Normalize the courier status to handle case differences
  const normalizedStatus = courierStatus.toLowerCase();

  // For these specific statuses, we want to use standard order statuses
  const standardStatusMap = {
    'pending': 'processing',
    'delivered': 'delivered',
    'returned': 'cancelled',
    'cancelled': 'cancelled',
  };

  // For these statuses, we want to use the exact courier status (dynamic)
  // This allows for more detailed order status display
  if (normalizedStatus === 'in_transit' ||
      normalizedStatus === 'picked') {
    // Format the status for display (capitalize and replace underscores with spaces)
    return formatStatusForDisplay(courierStatus);
  }

  // Check if we have a standard mapping for this status
  if (standardStatusMap[normalizedStatus]) {
    return standardStatusMap[normalizedStatus];
  }

  // For other statuses, we'll use the original courier status if it's meaningful
  // This allows for dynamic order statuses beyond the standard enum

  // For certain patterns, use the formatted courier status directly
  if (normalizedStatus.includes('transit') ||
      normalizedStatus.includes('pickup') ||
      normalizedStatus.includes('sorting') ||
      normalizedStatus.includes('hub') ||
      normalizedStatus.includes('assign') ||
      normalizedStatus.includes('pick')) {
    // Log that we're using a dynamic status
    console.log(`Using dynamic order status: ${courierStatus}`);
    return formatStatusForDisplay(courierStatus);
  }

  // For other patterns, map to standard statuses
  if (normalizedStatus.includes('deliver')) {
    return 'delivered';
  } else if (normalizedStatus.includes('cancel') ||
             normalizedStatus.includes('return') ||
             normalizedStatus.includes('fail')) {
    return 'cancelled';
  } else if (normalizedStatus.includes('ship')) {
    return 'shipped';
  }

  // If we have a current order status, use it for certain transitions
  if (currentOrderStatus) {
    // Don't downgrade from delivered or cancelled
    if (currentOrderStatus === 'delivered' || currentOrderStatus === 'cancelled') {
      return currentOrderStatus;
    }

    // Don't downgrade from shipped or dynamic statuses to processing
    if (currentOrderStatus === 'shipped' ||
        currentOrderStatus.includes('transit') ||
        currentOrderStatus.includes('pick')) {
      return currentOrderStatus;
    }
  }

  // Final fallback to processing if we can't determine a better status
  return 'processing';
}

/**
 * Format a status string for display
 * @param {string} status - The status string to format
 * @returns {string} - Formatted status string
 */
function formatStatusForDisplay(status) {
  if (!status) return '';

  // Replace underscores with spaces
  let formatted = status.replace(/_/g, ' ');

  // Capitalize each word
  formatted = formatted
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');

  return formatted;
}
