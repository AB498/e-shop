// Sample product reviews for seeding the database
const productReviewsSeed = [
  {
    product_id: 1,
    user_id: 2, // Regular customer
    rating: 4.5,
    review_text: "This product exceeded my expectations. The quality is excellent and it works exactly as described. I've been using it for a few weeks now and can already see the results.",
    title: "Great product, highly recommend!",
    verified_purchase: true,
    status: "published",
    created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
    updated_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
  },
  {
    product_id: 1,
    user_id: 3, // Another customer
    rating: 5.0,
    review_text: "Absolutely love this! The packaging is beautiful and the product itself is amazing. Will definitely purchase again.",
    title: "Perfect in every way",
    verified_purchase: true,
    status: "published",
    created_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000), // 15 days ago
    updated_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000)
  },
  {
    product_id: 2,
    user_id: 2,
    rating: 3.5,
    review_text: "Good product, but a bit pricey for what you get. The results are decent but not as dramatic as I expected.",
    title: "Good but overpriced",
    verified_purchase: true,
    status: "published",
    created_at: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000), // 20 days ago
    updated_at: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000)
  },
  {
    product_id: 3,
    user_id: 3,
    rating: 5.0,
    review_text: "This is the best skincare product I've ever used! My skin feels so much smoother and looks brighter after just a week of use.",
    title: "Amazing results!",
    verified_purchase: true,
    status: "published",
    created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
    updated_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000)
  },
  {
    product_id: 4,
    user_id: 2,
    rating: 4.0,
    review_text: "Very nice product. The scent is pleasant and not too strong. It absorbs quickly and doesn't leave a greasy feeling.",
    title: "Pleasant experience",
    verified_purchase: true,
    status: "published",
    created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
    updated_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
  },
  {
    product_id: 5,
    user_id: 3,
    rating: 2.5,
    review_text: "I was disappointed with this product. It didn't work as well as advertised and caused some irritation on my sensitive skin.",
    title: "Not for sensitive skin",
    verified_purchase: true,
    status: "published",
    created_at: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000), // 25 days ago
    updated_at: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000)
  },
  {
    product_id: 6,
    user_id: 2,
    rating: 5.0,
    review_text: "This product is a game-changer! I've tried many similar products but this one stands out. The results were visible within days.",
    title: "Best in its category",
    verified_purchase: true,
    status: "published",
    created_at: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000), // 12 days ago
    updated_at: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000)
  },
  {
    product_id: 7,
    user_id: 3,
    rating: 4.0,
    review_text: "Good quality product that delivers on its promises. The only downside is that it runs out quickly if used daily.",
    title: "Good but small quantity",
    verified_purchase: true,
    status: "published",
    created_at: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000), // 8 days ago
    updated_at: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000)
  }
];

module.exports = productReviewsSeed;
