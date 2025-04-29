import { getProductsByCategories } from "@/lib/actions/products";
import ProductCarousel from "../ui/ProductCarousel";
// Re-export the server component as the default export
export default async function VegetableAndFruitsServer() {
  // Fetch products directly in the server component
  const products = await getProductsByCategories([1, 2], 8);
  // Pass the fetched data to the client component
  return (
    <ProductCarousel
      products={products}
      title="Vegetable & Fruits"
      icon="/images/sidebar/vegetables-fruits.png"
      // Optional custom breakpoints
      breakpoints={{
        640: { slidesPerView: 2 },
        768: { slidesPerView: 4 },
      }}
    />
  );
}