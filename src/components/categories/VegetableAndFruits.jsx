import { getProductsByCategories } from "@/lib/actions/products";
import ProductCarousel from "../ui/ProductCarousel";
// Re-export the server component as the default export
export default async function VegetableAndFruitsServer() {
  // Fetch products directly in the server component
  const products = await getProductsByCategories([4, 8], 8);
  // Pass the fetched data to the client component
  return (
    <ProductCarousel
      products={products}
      title="Featured Products"
      icon="/images/sidebar/vegetables-fruits.png"
      // Optional custom breakpoints
      breakpoints={{
        640: { slidesPerView: 4 },
        768: { slidesPerView: 6 },
      }}
    />
  );
}