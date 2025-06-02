import { getProductsByCategories } from "@/lib/actions/products";
import ProductCarousel from "../ui/ProductCarousel";

// Server Component that fetches data with async/await
export default async function KidsBabySectionClient() {
  // Fetch products directly in the server component using async/await
  const products = await getProductsByCategories([5], 30);

  return (
    <ProductCarousel
      products={products}
      title="Kids & Baby"
      icon="/images/categories/Kids and baby.png"
      // Optional custom breakpoints
      breakpoints={{
        640: { slidesPerView: 4 },
        768: { slidesPerView: 6 },
      }}
    />
  );
}
