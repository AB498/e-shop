import { getAllCategories, getProductCountsByCategory } from '@/lib/actions/categories';
import { getNewProducts, getRatingFilterStats } from '@/lib/actions/products';
import ProductLeftBarWrapper from './ProductLeftBarWrapper';

// This is a Server Component that fetches categories, product counts, and new products
export default async function ProductLeftBarServer({ isMobile = false }) {
  // Fetch data in parallel for better performance
  const [categories, categoryCounts, newProducts, ratingStats] = await Promise.all([
    getAllCategories(),
    getProductCountsByCategory(),
    // Only fetch new products if not on mobile
    !isMobile ? getNewProducts(3) : [],
    // Fetch rating filter statistics
    getRatingFilterStats()
  ]);

  // Pass the fetched data to the client component wrapper
  return (
    <ProductLeftBarWrapper
      categories={categories}
      categoryCounts={categoryCounts}
      newProducts={newProducts}
      ratingStats={ratingStats}
      isMobile={isMobile}
    />
  );
}
