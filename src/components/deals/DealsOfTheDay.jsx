'use client';
import React, { memo } from 'react';
import ProductListSection from '@/components/products/ProductListSection';

// Create a memoized version of ProductListSection with fixed props
const MemoizedProductListSection = memo(ProductListSection);

const DealsOfTheDay = () => {
  // Use fixed values for props to prevent unnecessary re-renders
  const fetchUrl = "/api/products";
  const fetchLimit = 3;

  return (
    <MemoizedProductListSection
      fetchUrl={fetchUrl}
      fetchLimit={fetchLimit}
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

export default memo(DealsOfTheDay);
