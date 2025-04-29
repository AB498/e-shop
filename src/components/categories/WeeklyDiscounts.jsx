import { getProductsByCategories } from "@/lib/actions/products";
import ProductCarousel from "../ui/ProductCarousel";
// This is a Server Component that fetches data
async function WeeklyDiscounts() {
  // Fetch products directly in the server component
  const products = await getProductsByCategories([3, 4, 5, 6, 7, 8, 9, 10, 11, 12], 10);
  console.log(products);
  // Pass the fetched data to the client component
  return (
    <ProductCarousel
      products={products}
      title="Weekly Discounts"
      icon="/images/sidebar/weekly-discounts.png"
      // Optional custom breakpoints
      breakpoints={{
        640: { slidesPerView: 2 },
        768: { slidesPerView: 4 },
      }}
    />
  );
}

export default WeeklyDiscounts;
