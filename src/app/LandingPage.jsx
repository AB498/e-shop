'use client';

// Navigation is imported in the layout.js file
import Hero from "../components/layout/Hero";
import FeatureIcons from "../components/layout/FeatureIcons";
import PopularCategories from "../components/categories/PopularCategories";
import BannerSection from "../components/landing/BannerSection";
import ProductShowcase from "../components/landing/ProductShowcase";
import Footer from "../components/layout/Footer";
import Copyright from "../components/layout/Copyright";
import FeaturedCarousel from "@/components/layout/FeaturedCarousel";
import DealsOfTheDay from "@/components/deals/DealsOfTheDay";
import WeeklyDiscountsClient from "@/components/categories/WeeklyDiscountsClient";
import VegetableAndFruitsClient from "@/components/categories/VegetableAndFruitsClient";
import BeautyMakeupSectionClient from "@/components/categories/BeautyMakeupSectionClient";
import ProductQuickViewModal from "@/components/products/ProductQuickViewModal";
import { ProductQuickViewProvider } from "@/context/ProductQuickViewContext";
import ResponsiveContainer from "@/components/ui/ResponsiveContainer";

/**
 * Landing page component that uses responsive design system
 *
 * @returns {JSX.Element}
 */
export default function LandingPage() {
    return (
        <ProductQuickViewProvider>
            <div className="w-full px-6 md:px-12 container mx-auto">
                {/* Hero Section */}
                <Hero />

                {/* Feature Icons */}
                <FeatureIcons />

                {/* Popular Categories */}
                <PopularCategories />

                {/* Featured Carousel */}
                <FeaturedCarousel />

                {/* Discounted Products */}
                <WeeklyDiscountsClient />

                {/* Vegetables & Fruits */}
                <VegetableAndFruitsClient />

                {/* Banner Section */}
                <BannerSection />

                {/* Beauty & Makeup Section */}
                <BeautyMakeupSectionClient />

                {/* Deals Of The Day */}
                <DealsOfTheDay />

                {/* Product Showcase */}
                <ProductShowcase />


                {/* Product Quick View Modal */}
                <ProductQuickViewModal />
            </div>
            {/* Footer */}
            <Footer />

            {/* Copyright */}
            <Copyright />
        </ProductQuickViewProvider>
    );
}
