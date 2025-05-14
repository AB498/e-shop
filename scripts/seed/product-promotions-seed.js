// Sample data for product_promotions junction table
const productPromotionsSeed = [
  // Summer Sale promotion (id: 1) - Apply to first 10 products with 15% discount
  ...Array.from({ length: 10 }, (_, i) => ({
    product_id: i + 1,
    promotion_id: 1,
    discount_percentage: 15.00,
  })),

  // Fresh Vegetables promotion (id: 2) - Apply to products 11-20 with 10% discount
  ...Array.from({ length: 10 }, (_, i) => ({
    product_id: i + 11,
    promotion_id: 2,
    discount_percentage: 10.00,
  })),

  // Bakery Special promotion (id: 3) - Apply to products 21-30 with 20% discount
  ...Array.from({ length: 10 }, (_, i) => ({
    product_id: i + 21,
    promotion_id: 3,
    discount_percentage: 20.00,
  })),

  // Weekend Deal promotion (id: 4) - Apply to products 31-40 with 25% discount
  ...Array.from({ length: 10 }, (_, i) => ({
    product_id: i + 31,
    promotion_id: 4,
    discount_percentage: 25.00,
  })),

  // Fresh Fruits promotion (id: 5) - Apply to products 41-50 with 25% discount
  ...Array.from({ length: 10 }, (_, i) => ({
    product_id: i + 41,
    promotion_id: 5,
    discount_percentage: 25.00,
  })),

  // Organic Vegetables promotion (id: 6) - Apply to products 51-60 with 50% discount
  ...Array.from({ length: 10 }, (_, i) => ({
    product_id: i + 51,
    promotion_id: 6,
    discount_percentage: 50.00,
  })),

  // Bakery Products promotion (id: 7) - Apply to products 61-70 with 30% discount
  ...Array.from({ length: 10 }, (_, i) => ({
    product_id: i + 61,
    promotion_id: 7,
    discount_percentage: 30.00,
  })),

  // Dairy Products promotion (id: 8) - Apply to products 71-80 with 20% discount
  ...Array.from({ length: 10 }, (_, i) => ({
    product_id: i + 71,
    promotion_id: 8,
    discount_percentage: 20.00,
  })),

  // New Arrivals promotion (id: 9) - Apply to products 81-90 with 5% discount
  ...Array.from({ length: 10 }, (_, i) => ({
    product_id: i + 81,
    promotion_id: 9,
    discount_percentage: 5.00,
  })),
];

export default productPromotionsSeed;
