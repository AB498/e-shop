import { getProductsByCategories } from "@/lib/actions/products";
import ProductCarousel from "../ui/ProductCarousel";

// Server Component that fetches data with async/await
export default async function BeautyMakeupSectionClient() {
  // Fetch products directly in the server component using async/await
  const products = await getProductsByCategories([3, 6], 30);

  return (
    <ProductCarousel
      products={products}
      title="Beauty & Makeup"
      icon="/images/beauty-makeup/category-icon.png"
      // Optional custom breakpoints
      breakpoints={{
        640: { slidesPerView: 4 },
        768: { slidesPerView: 6 },
      }}
    />
  );
}
