import { Suspense } from 'react';
import LandingPage from './LandingPage';
import FeaturedCarouselServer from '@/components/layout/FeaturedCarouselServer';
import FeaturedCarousel from '@/components/layout/FeaturedCarousel';
import WeeklyDealsServer from '@/components/layout/WeeklyDealsServer';
import WeeklyDeals from '@/components/layout/WeeklyDeals';
import PopularCategoriesServer from '@/components/categories/PopularCategoriesServer';
import PopularCategories from '@/components/categories/PopularCategories';

// This is a Server Component that serves as the entry point for the landing page
export default function Home() {
  return (
    <Suspense fallback={<LandingPageWithFallback />}>
      <LandingPageWithServerComponents />
    </Suspense>
  );
}

// Landing page with server components
function LandingPageWithServerComponents() {
  return (
    <LandingPage
      featuredCarouselComponent={
        <Suspense fallback={<FeaturedCarousel />}>
          <FeaturedCarouselServer />
        </Suspense>
      }
      weeklyDealsComponent={
        <Suspense fallback={<WeeklyDeals />}>
          <WeeklyDealsServer />
        </Suspense>
      }
      popularCategoriesComponent={
        <Suspense fallback={<PopularCategories categories={[]} />}>
          <PopularCategoriesServer />
        </Suspense>
      }
    />
  );
}

// Fallback version with client-only components
function LandingPageWithFallback() {
  return <LandingPage />;
}
