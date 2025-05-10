import { getActivePromotions } from '@/lib/actions/promotions';
import WeeklyDeals from './WeeklyDeals';

// This is a Server Component that fetches weekly deals data
export default async function WeeklyDealsServer() {
  try {
    console.log('WeeklyDealsServer: Fetching deals from server component');
    
    // Fetch active deal promotions for the home page
    const deals = await getActivePromotions('deal', 'home', 4);
    
    console.log(`WeeklyDealsServer: Found ${deals?.length || 0} deals`);
    
    // If no deals found, try fetching any deals regardless of position
    if (!deals || deals.length === 0) {
      console.log('WeeklyDealsServer: No home deals found, trying to fetch any deals');
      const anyDeals = await getActivePromotions('deal', null, 4);
      
      if (anyDeals && anyDeals.length > 0) {
        console.log(`WeeklyDealsServer: Found ${anyDeals.length} deals from any position`);
        return <WeeklyDeals initialDeals={anyDeals} />;
      }
    }
    
    // Pass the fetched data to the client component
    return <WeeklyDeals initialDeals={deals} />;
  } catch (error) {
    console.error('WeeklyDealsServer: Error fetching deals:', error);
    
    // Return the client component without initial deals
    // It will handle fetching on the client side as a fallback
    return <WeeklyDeals initialDeals={[]} />;
  }
}
