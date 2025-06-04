import React from 'react';
import ProductListSection from '@/components/products/ProductListSection';
import { getAllProducts } from '@/lib/actions/products';

// Server Component that fetches deals data with async/await
const DealsOfTheDay = async () => {
  // Fetch products with discounts/promotions directly in the server component
  const { products } = await getAllProducts({
    page: 1,
    limit: 5,
    sortBy: 'created_at',
    sortOrder: 'desc'
  });

  // Filter products that have discounts (discountPercentage > 0)
  const dealsProducts = products;

  return (
    <ProductListSection
      products={dealsProducts}
      title="Deals Of The Day"
      viewType="scroll"
      showWishlist={true}
      showOverlays={true}
      titleIcon="/images/deals/discount-coupon-icon.png"
      allItemsLink="/products"
      allItemsText="All Deals"
      emptyStateText="No deals found."
    />
  );
};

export default DealsOfTheDay;
