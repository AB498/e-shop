import ProductDetail from '@/components/products/ProductDetail';
import Topbar from '@/components/layout/Topbar';
import Navigation from '@/components/layout/Navigation';
import Footer from '@/components/layout/Footer';
import Copyright from '@/components/layout/Copyright';

export default function ProductDetailPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Topbar />
      <Navigation />
      <ProductDetail />
      <Footer />
      <Copyright />
    </div>
  );
}
