import { getProductsByCategories } from "@/lib/actions/products";
import ProductCarousel from "../ui/ProductCarousel";

// Server Component that fetches data with async/await
export default async function WeeklyDiscountsClient() {
  // Fetch products directly in the server component using async/await
  const products = await getProductsByCategories([3, 4, 5, 6, 7, 8], 30);

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
