import ProductListingPage from '@/components/products/ProductListingPage';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Products - Thai Bangla Store',
  description: 'Browse our wide selection of premium Thai beauty, health, and lifestyle products. Filter by category, price, and more to find exactly what you need.',
  keywords: 'products, Thai products, beauty products, health products, online shopping, e-commerce, Thai Bangla Store',
  openGraph: {
    title: 'Products - Thai Bangla Store',
    description: 'Browse our wide selection of premium Thai beauty, health, and lifestyle products. Filter by category, price, and more to find exactly what you need.',
    type: 'website',
    url: 'https://thaibanglastore.com/products',
    siteName: 'Thai Bangla Store',
    images: [
      {
        url: '/images/logo.png',
        width: 800,
        height: 600,
        alt: 'Thai Bangla Store Logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Products - Thai Bangla Store',
    description: 'Browse our wide selection of premium Thai beauty, health, and lifestyle products. Filter by category, price, and more to find exactly what you need.',
    images: ['/images/logo.png'],
  },
};

export default async function ProductsPage(props) {
  const searchParams = await props.searchParams;
  await searchParams;
  return <ProductListingPage searchParams={searchParams} />;
}
