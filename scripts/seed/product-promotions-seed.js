// Sample data for product_promotions junction table
// The discount values are taken from the promotions-seed.js file
const productPromotionsSeed = [
  // Promotion 1 (Summer Sale) - 15% discount
  { product_id: 1, promotion_id: 1, discount_percentage: 15.00 },
  { product_id: 2, promotion_id: 1, discount_percentage: 15.00 },
  { product_id: 3, promotion_id: 1, discount_percentage: 15.00 },
  { product_id: 4, promotion_id: 1, discount_percentage: 15.00 },
  { product_id: 5, promotion_id: 1, discount_percentage: 15.00 },
  { product_id: 6, promotion_id: 1, discount_percentage: 15.00 },
  { product_id: 7, promotion_id: 1, discount_percentage: 15.00 },
  { product_id: 8, promotion_id: 1, discount_percentage: 15.00 },
  { product_id: 9, promotion_id: 1, discount_percentage: 15.00 },
  { product_id: 10, promotion_id: 1, discount_percentage: 15.00 },

  // Promotion 2 (Fresh Vegetables) - 10% discount
  { product_id: 11, promotion_id: 2, discount_percentage: 10.00 },
  { product_id: 12, promotion_id: 2, discount_percentage: 10.00 },
  { product_id: 13, promotion_id: 2, discount_percentage: 10.00 },
  { product_id: 14, promotion_id: 2, discount_percentage: 10.00 },
  { product_id: 15, promotion_id: 2, discount_percentage: 10.00 },
  { product_id: 16, promotion_id: 2, discount_percentage: 10.00 },
  { product_id: 17, promotion_id: 2, discount_percentage: 10.00 },
  { product_id: 18, promotion_id: 2, discount_percentage: 10.00 },
  { product_id: 19, promotion_id: 2, discount_percentage: 10.00 },
  { product_id: 20, promotion_id: 2, discount_percentage: 10.00 },

  // Promotion 3 (Bakery Special) - 20% discount
  { product_id: 21, promotion_id: 3, discount_percentage: 20.00 },
  { product_id: 22, promotion_id: 3, discount_percentage: 20.00 },
  { product_id: 23, promotion_id: 3, discount_percentage: 20.00 },
  { product_id: 24, promotion_id: 3, discount_percentage: 20.00 },
  { product_id: 25, promotion_id: 3, discount_percentage: 20.00 },
  { product_id: 26, promotion_id: 3, discount_percentage: 20.00 },
  { product_id: 27, promotion_id: 3, discount_percentage: 20.00 },
  { product_id: 28, promotion_id: 3, discount_percentage: 20.00 },
  { product_id: 29, promotion_id: 3, discount_percentage: 20.00 },
  { product_id: 30, promotion_id: 3, discount_percentage: 20.00 },

  // Promotion 4 (Weekend Deal) - 25% discount
  { product_id: 31, promotion_id: 4, discount_percentage: 25.00 },
  { product_id: 32, promotion_id: 4, discount_percentage: 25.00 },
  { product_id: 33, promotion_id: 4, discount_percentage: 25.00 },
  { product_id: 34, promotion_id: 4, discount_percentage: 25.00 },
  { product_id: 35, promotion_id: 4, discount_percentage: 25.00 },
  { product_id: 36, promotion_id: 4, discount_percentage: 25.00 },
  { product_id: 37, promotion_id: 4, discount_percentage: 25.00 },
  { product_id: 38, promotion_id: 4, discount_percentage: 25.00 },
  { product_id: 39, promotion_id: 4, discount_percentage: 25.00 },
  { product_id: 40, promotion_id: 4, discount_percentage: 25.00 },

  // Promotion 5 (Fresh Fruits) - 25% discount
  { product_id: 41, promotion_id: 5, discount_percentage: 25.00 },
  { product_id: 42, promotion_id: 5, discount_percentage: 25.00 },
  { product_id: 43, promotion_id: 5, discount_percentage: 25.00 },
  { product_id: 44, promotion_id: 5, discount_percentage: 25.00 },
  { product_id: 45, promotion_id: 5, discount_percentage: 25.00 },
  { product_id: 46, promotion_id: 5, discount_percentage: 25.00 },
  { product_id: 47, promotion_id: 5, discount_percentage: 25.00 },
  { product_id: 48, promotion_id: 5, discount_percentage: 25.00 },
  { product_id: 49, promotion_id: 5, discount_percentage: 25.00 },
  { product_id: 50, promotion_id: 5, discount_percentage: 25.00 },

  // Promotion 6 (Organic Vegetables) - 50% discount
  { product_id: 51, promotion_id: 6, discount_percentage: 50.00 },
  { product_id: 52, promotion_id: 6, discount_percentage: 50.00 },
  { product_id: 53, promotion_id: 6, discount_percentage: 50.00 },
  { product_id: 54, promotion_id: 6, discount_percentage: 50.00 },
  { product_id: 55, promotion_id: 6, discount_percentage: 50.00 },
  { product_id: 56, promotion_id: 6, discount_percentage: 50.00 },
  { product_id: 57, promotion_id: 6, discount_percentage: 50.00 },
  { product_id: 58, promotion_id: 6, discount_percentage: 50.00 },
  { product_id: 59, promotion_id: 6, discount_percentage: 50.00 },
  { product_id: 60, promotion_id: 6, discount_percentage: 50.00 },

  // Promotion 7 (Bakery Products) - 30% discount
  { product_id: 61, promotion_id: 7, discount_percentage: 30.00 },
  { product_id: 62, promotion_id: 7, discount_percentage: 30.00 },
  { product_id: 63, promotion_id: 7, discount_percentage: 30.00 },
  { product_id: 64, promotion_id: 7, discount_percentage: 30.00 },
  { product_id: 65, promotion_id: 7, discount_percentage: 30.00 },
  { product_id: 66, promotion_id: 7, discount_percentage: 30.00 },
  { product_id: 67, promotion_id: 7, discount_percentage: 30.00 },
  { product_id: 68, promotion_id: 7, discount_percentage: 30.00 },
  { product_id: 69, promotion_id: 7, discount_percentage: 30.00 },
  { product_id: 70, promotion_id: 7, discount_percentage: 30.00 },

  // Promotion 8 (Dairy Products) - 20% discount
  { product_id: 71, promotion_id: 8, discount_percentage: 20.00 },
  { product_id: 72, promotion_id: 8, discount_percentage: 20.00 },
  { product_id: 73, promotion_id: 8, discount_percentage: 20.00 },
  { product_id: 74, promotion_id: 8, discount_percentage: 20.00 },
  { product_id: 75, promotion_id: 8, discount_percentage: 20.00 },
  { product_id: 76, promotion_id: 8, discount_percentage: 20.00 },
  { product_id: 77, promotion_id: 8, discount_percentage: 20.00 },
  { product_id: 78, promotion_id: 8, discount_percentage: 20.00 },
  { product_id: 79, promotion_id: 8, discount_percentage: 20.00 },
  { product_id: 80, promotion_id: 8, discount_percentage: 20.00 },

  // Promotion 9 (New Arrivals) - 5% discount
  { product_id: 81, promotion_id: 9, discount_percentage: 5.00 },
  { product_id: 82, promotion_id: 9, discount_percentage: 5.00 },
  { product_id: 83, promotion_id: 9, discount_percentage: 5.00 },
  { product_id: 84, promotion_id: 9, discount_percentage: 5.00 },
  { product_id: 85, promotion_id: 9, discount_percentage: 5.00 },
  { product_id: 86, promotion_id: 9, discount_percentage: 5.00 },
  { product_id: 87, promotion_id: 9, discount_percentage: 5.00 },
  { product_id: 88, promotion_id: 9, discount_percentage: 5.00 },
  { product_id: 89, promotion_id: 9, discount_percentage: 5.00 },
  { product_id: 90, promotion_id: 9, discount_percentage: 5.00 },
];

export default productPromotionsSeed;
