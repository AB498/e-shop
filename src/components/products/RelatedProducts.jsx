'use client';
import React, { memo } from 'react';
import ProductListSection from './ProductListSection';

// Create a memoized version of ProductListSection
const MemoizedProductListSection = memo(ProductListSection);

const RelatedProducts = ({ products = [], category = 'Products' }) => {
  // Create memoized grid columns configuration
  const gridCols = React.useMemo(() => ({
    default: 2,
    xs: 2,
    sm: 3,
    lg: 4,
    xl: 5
  }), []);

  return (
    <MemoizedProductListSection
      products={products}
      category={category}
      title="Related Products"
      viewType="grid"
      showWishlist={true}
      titleIcon="/images/deals/discount-coupon-icon.png"
      allItemsLink="/products"
      allItemsText={`All ${category}`}
      emptyStateText="No related products found."
      gridCols={gridCols}
    />
  );
};

export default memo(RelatedProducts);
