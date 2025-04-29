import ProductListingPage from '@/components/products/ProductListingPage';

export const dynamic = 'force-dynamic';

export default function ProductsPage({ searchParams }) {
  return <ProductListingPage searchParams={searchParams} />;
}
