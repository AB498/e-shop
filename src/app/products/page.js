import ProductListingPage from '@/components/products/ProductListingPage';

export const dynamic = 'force-dynamic';

export default async function ProductsPage(props) {
  const searchParams = await props.searchParams;
  await searchParams;
  return <ProductListingPage searchParams={searchParams} />;
}
