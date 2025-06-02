import { getProductsByCategories } from "@/lib/actions/products";
import ProductCarousel from "../ui/ProductCarousel";

// Server Component that fetches data with async/await
export default async function HairCareSectionClient() {
  // Fetch products directly in the server component using async/await
  const products = await getProductsByCategories([2], 30);

  return (
    <ProductCarousel
      products={products}
      title="Hair Care"
      icon="/images/categories/hair-care.png"
      // Optional custom breakpoints
      breakpoints={{
        640: { slidesPerView: 4 },
        768: { slidesPerView: 6 },
      }}
    />
  );
}
