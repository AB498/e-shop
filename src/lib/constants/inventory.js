/**
 * Inventory-related constants
 */

// Fixed threshold for determining low stock status
export const STOCK_THRESHOLD = 10;

// Stock status values
export const STOCK_STATUS = {
  IN_STOCK: 'In Stock',
  LOW_STOCK: 'Low Stock',
  OUT_OF_STOCK: 'Out of Stock'
};

/**
 * Determine stock status based on current stock level
 * @param {number} stock - Current stock level
 * @returns {string} Stock status
 */
export function getStockStatus(stock) {
  if (stock <= 0) {
    return STOCK_STATUS.OUT_OF_STOCK;
  } else if (stock <= STOCK_THRESHOLD) {
    return STOCK_STATUS.LOW_STOCK;
  }
  return STOCK_STATUS.IN_STOCK;
}
