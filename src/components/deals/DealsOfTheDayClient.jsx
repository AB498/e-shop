'use client';
import React, { useState, useEffect } from 'react';
import ProductListSection from '@/components/products/ProductListSection';
import { getAllProducts } from '@/lib/actions/products';

// Client Component version for use in client components like CartPage
const DealsOfTheDayClient = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDealsProducts() {
      try {
        setLoading(true);
        // Fetch products with discounts/promotions
        const { products: allProducts } = await getAllProducts({
          page: 1,
          limit: 10, // Get more products to filter from
          sortBy: 'created_at',
          sortOrder: 'desc'
        });

        // Filter products that have discounts (discountPercentage > 0)
        const dealsProducts = allProducts;
        
        // Take only the first 3 deals
        setProducts(dealsProducts.slice(0, 3));
      } catch (error) {
        console.error('Error fetching deals products:', error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    }

    fetchDealsProducts();
  }, []);

  if (loading) {
    return (
      <ProductListSection
        products={[]}
        title="Deals Of The Day"
        viewType="scroll"
        showWishlist={true}
        showOverlays={true}
        titleIcon="/images/deals/discount-coupon-icon.png"
        allItemsLink="/products"
        allItemsText="All Deals"
        emptyStateText="Loading deals..."
        fetchUrl={null} // Don't use fetchUrl since we're handling loading ourselves
        fetchLimit={3}
      />
    );
  }

  return (
    <ProductListSection
      products={products}
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

export default DealsOfTheDayClient;
