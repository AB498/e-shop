// Navigation is imported in the layout.js file
import Hero from "../components/layout/Hero";
import FeatureIcons from "../components/layout/FeatureIcons";
import PopularCategories from "../components/categories/PopularCategories";
import PopularCategoriesServer from "../components/categories/PopularCategoriesServer";
import CategoryChips from "../components/categories/CategoryChips";
import BannerSection from "../components/landing/BannerSection";
import ProductShowcase from "../components/landing/ProductShowcase";
import Footer from "../components/layout/Footer";
import Copyright from "../components/layout/Copyright";
import FeaturedCarousel from "@/components/layout/FeaturedCarousel";
import WeeklyDeals from "@/components/layout/WeeklyDeals";
import DealsOfTheDay from "@/components/deals/DealsOfTheDay";
import WeeklyDiscountsClient from "@/components/categories/WeeklyDiscountsClient";
import GroomingSectionClient from "@/components/categories/GroomingSectionClient";
import BeautyMakeupSectionClient from "@/components/categories/BeautyMakeupSectionClient";
import HairCareSectionClient from "@/components/categories/HairCareSectionClient";
import HotOffersSectionClient from "@/components/categories/HotOffersSectionClient";
import KidsBabySectionClient from "@/components/categories/KidsBabySectionClient";
import PerfumeSectionClient from "@/components/categories/PerfumeSectionClient";
import TopBrandsSectionClient from "@/components/categories/TopBrandsSectionClient";

/**
 * Landing page component that uses responsive design system
 *
 * @param {Object} props - Component props
 * @param {Array} props.categories - Categories fetched server-side
 * @param {JSX.Element} props.featuredCarouselComponent - Optional featured carousel component
 * @param {JSX.Element} props.weeklyDealsComponent - Optional weekly deals component
 * @param {JSX.Element} props.popularCategoriesComponent - Optional popular categories component
 * @returns {JSX.Element}
 */
export default async function LandingPage({ categories = [], featuredCarouselComponent, weeklyDealsComponent, popularCategoriesComponent }) {
    return (
        <>
            {/* Hero Section */}
            <Hero />

            {/* Category Chips - Desktop Only */}
            <div className="hidden md:block w-full px-6 md:px-12 container mx-auto pt-4">
                <CategoryChips
                    categories={categories}
                    size="large"
                    showOnMobile={false}
                    showOnDesktop={true}
                />
            </div>

            <div className="relative z-0 w-full px-6 md:px-12 container mx-auto flex flex-col py-6 gap-6">

                {/* Feature Icons */}
                <FeatureIcons />

                {/* Popular Categories */}
                {popularCategoriesComponent || <PopularCategories categories={categories} />}

                {/* Featured Carousel */}
                {featuredCarouselComponent || <FeaturedCarousel />}

                {/* Grooming Products */}
                <GroomingSectionClient />

                {/* Hair Care Products */}
                <HairCareSectionClient />

                {/* Health and Beauty Products */}
                <BeautyMakeupSectionClient />

                {/* Hot Offers */}
                <HotOffersSectionClient />

                {/* Banner Section */}
                <BannerSection />

                {/* Kids & Baby Products */}
                <KidsBabySectionClient />

                {/* Makeup Products */}
                <WeeklyDiscountsClient />

                {/* Perfume Products */}
                <PerfumeSectionClient />

                {/* Top Brands */}
                <TopBrandsSectionClient />

                {/* Deals Of The Day */}
                <DealsOfTheDay />

                {/* Product Showcase */}
                <ProductShowcase />

            </div>
        </>
    );
}
