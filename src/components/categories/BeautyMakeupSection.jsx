import { getProductsByCategories } from "@/lib/actions/products";
import ProductCarousel from "../ui/ProductCarousel";
// This is a Server Component that fetches data
async function BeautyMakeupSection() {
  // Fetch products directly in the server component
  const products = await getProductsByCategories([13, 14, 15], 9);
  // Pass the fetched data to the client component
  return (
    <ProductCarousel
      products={products}
      title="Beauty & Makeup"
      icon="/images/beauty-makeup/category-icon.png"
      // Optional custom breakpoints
      breakpoints={{
        640: { slidesPerView: 2 },
        768: { slidesPerView: 4 },
      }}
    />
  );
}

export default BeautyMakeupSection;
