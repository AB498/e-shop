import { getActivePromotions } from '@/lib/actions/promotions';
import FeaturedCarousel from './FeaturedCarousel';

// This is a Server Component that fetches promotions data
export default async function FeaturedCarouselServer() {
  try {
    console.log('FeaturedCarouselServer: Fetching promotions from server component');

    // Fetch active carousel promotions for the home page
    const promotions = await getActivePromotions('carousel', 'home', 5);

    console.log(`FeaturedCarouselServer: Found ${promotions?.length || 0} promotions`);

    // If no promotions found, try fetching any type of promotions
    if (!promotions || promotions.length === 0) {
      console.log('FeaturedCarouselServer: No carousel promotions found, trying to fetch any promotions');
      const anyPromotions = await getActivePromotions(null, 'home', 5);

      if (anyPromotions && anyPromotions.length > 0) {
        console.log(`FeaturedCarouselServer: Found ${anyPromotions.length} promotions of any type`);
        return <FeaturedCarousel initialPromotions={anyPromotions} />;
      }
    }

    // Pass the fetched data to the client component
    return <FeaturedCarousel initialPromotions={promotions} />;
  } catch (error) {
    console.error('FeaturedCarouselServer: Error fetching promotions:', error);

    // Return the client component without initial promotions
    // It will handle fetching on the client side as a fallback
    return <FeaturedCarousel initialPromotions={[]} />;
  }
}
