import ProductDetail from '@/components/products/ProductDetail';
import Topbar from '@/components/layout/Topbar';
import Navigation from '@/components/layout/Navigation';
import Footer from '@/components/layout/Footer';
import Copyright from '@/components/layout/Copyright';

export const dynamic = 'force-dynamic';

// This is a Server Component that fetches data
export default async function ProductDetailPage({ params }) {
  const { id } = params;

  return (
    <div className="min-h-screen flex flex-col">
      <Topbar />
      <Navigation />
      <ProductDetail productId={id} />
      <Footer />
      <Copyright />
    </div>
  );
}
