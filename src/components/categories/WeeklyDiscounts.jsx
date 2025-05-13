import { getProductsByCategories } from "@/lib/actions/products";
import ProductCarousel from "../ui/ProductCarousel";
// This is a Server Component that fetches data
async function WeeklyDiscounts() {
  // Fetch products directly in the server component
  const products = await getProductsByCategories([1, 2, 3, 4, 5, 6, 7, 8], 10);
  // Pass the fetched data to the client component
  return (
    <ProductCarousel
      products={products}
      title="Weekly Discounts"
      icon="/images/deals/discount-coupon-icon.png"
      // Optional custom breakpoints
      breakpoints={{
        640: { slidesPerView: 4 },
        768: { slidesPerView: 6 },
      }}
    />
  );
}

export default WeeklyDiscounts;
