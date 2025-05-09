// Expanded order items seed data
const orderItemsSeed = [
  // Order 1 items
  { order_id: 1, product_id: 1, quantity: 2, price: 2.99 },
  { order_id: 1, product_id: 4, quantity: 1, price: 3.49 },
  { order_id: 1, product_id: 6, quantity: 1, price: 4.49 },
  { order_id: 1, product_id: 9, quantity: 2, price: 3.99 },

  // Order 2 items
  { order_id: 2, product_id: 2, quantity: 1, price: 4.99 },
  { order_id: 2, product_id: 5, quantity: 1, price: 5.99 },
  { order_id: 2, product_id: 8, quantity: 2, price: 1.49 },
  { order_id: 2, product_id: 7, quantity: 3, price: 2.99 },

  // Order 3 items
  { order_id: 3, product_id: 3, quantity: 2, price: 1.99 },
  { order_id: 3, product_id: 10, quantity: 1, price: 12.99 },
  { order_id: 3, product_id: 8, quantity: 4, price: 1.49 },

  // Order 4 items
  { order_id: 4, product_id: 11, quantity: 3, price: 3.49 },
  { order_id: 4, product_id: 19, quantity: 1, price: 4.99 },
  { order_id: 4, product_id: 24, quantity: 2, price: 4.99 },
  { order_id: 4, product_id: 35, quantity: 2, price: 3.49 },

  // Order 5 items
  { order_id: 5, product_id: 15, quantity: 2, price: 1.99 },
  { order_id: 5, product_id: 25, quantity: 1, price: 3.49 },
  { order_id: 5, product_id: 36, quantity: 3, price: 2.99 },

  // Order 6 items
  { order_id: 6, product_id: 27, quantity: 2, price: 7.99 },
  { order_id: 6, product_id: 32, quantity: 3, price: 2.49 },
  { order_id: 6, product_id: 34, quantity: 2, price: 2.99 },
  { order_id: 6, product_id: 38, quantity: 1, price: 24.99 },

  // Order 7 items
  { order_id: 7, product_id: 12, quantity: 2, price: 4.29 },
  { order_id: 7, product_id: 20, quantity: 1, price: 3.99 },
  { order_id: 7, product_id: 23, quantity: 2, price: 5.99 },
  { order_id: 7, product_id: 37, quantity: 1, price: 6.99 },

  // Order 8 items
  { order_id: 8, product_id: 13, quantity: 1, price: 5.99 },
  { order_id: 8, product_id: 22, quantity: 2, price: 3.49 },
  { order_id: 8, product_id: 25, quantity: 3, price: 3.49 },

  // Order 9 items
  { order_id: 9, product_id: 26, quantity: 1, price: 8.99 },
  { order_id: 9, product_id: 31, quantity: 1, price: 9.99 },
  { order_id: 9, product_id: 33, quantity: 2, price: 3.99 },
  { order_id: 9, product_id: 39, quantity: 2, price: 7.99 },

  // Order 10 items
  { order_id: 10, product_id: 14, quantity: 2, price: 2.49 },
  { order_id: 10, product_id: 18, quantity: 3, price: 3.29 },
  { order_id: 10, product_id: 21, quantity: 2, price: 2.99 },
  { order_id: 10, product_id: 40, quantity: 2, price: 5.99 },

  // Order 11 items
  { order_id: 11, product_id: 16, quantity: 1, price: 3.49 },
  { order_id: 11, product_id: 24, quantity: 1, price: 4.99 },
  { order_id: 11, product_id: 35, quantity: 3, price: 3.49 },

  // Order 12 items
  { order_id: 12, product_id: 29, quantity: 2, price: 14.99 },
  { order_id: 12, product_id: 30, quantity: 1, price: 15.99 },
  { order_id: 12, product_id: 38, quantity: 1, price: 24.99 },

  // Order 13 items
  { order_id: 13, product_id: 9, quantity: 1, price: 3.99 },
  { order_id: 13, product_id: 36, quantity: 4, price: 2.99 },

  // Order 14 items
  { order_id: 14, product_id: 17, quantity: 2, price: 2.99 },
  { order_id: 14, product_id: 19, quantity: 1, price: 4.99 },
  { order_id: 14, product_id: 25, quantity: 2, price: 3.49 },
  { order_id: 14, product_id: 37, quantity: 2, price: 6.99 },

  // Order 15 items
  { order_id: 15, product_id: 28, quantity: 1, price: 9.99 },
  { order_id: 15, product_id: 32, quantity: 2, price: 2.49 },
  { order_id: 15, product_id: 34, quantity: 3, price: 2.99 },
  { order_id: 15, product_id: 39, quantity: 3, price: 7.99 },

  // Order 16 items (Beauty products)
  { order_id: 16, product_id: 41, quantity: 1, price: 12.99 },
  { order_id: 16, product_id: 42, quantity: 1, price: 18.99 },
  { order_id: 16, product_id: 45, quantity: 1, price: 11.99 },
  { order_id: 16, product_id: 50, quantity: 1, price: 15.99 },

  // Order 17 items (Skincare products)
  { order_id: 17, product_id: 46, quantity: 1, price: 24.99 },
  { order_id: 17, product_id: 47, quantity: 2, price: 3.99 },
  { order_id: 17, product_id: 48, quantity: 1, price: 19.99 },
  { order_id: 17, product_id: 49, quantity: 1, price: 14.99 },

  // Order 18 items (Makeup products)
  { order_id: 18, product_id: 51, quantity: 1, price: 22.99 },
  { order_id: 18, product_id: 52, quantity: 1, price: 9.99 },
  { order_id: 18, product_id: 53, quantity: 1, price: 12.99 }
];

export default orderItemsSeed;
