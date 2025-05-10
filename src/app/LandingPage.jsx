'use client';


import Navigation from "../components/layout/Navigation";
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

export default function LandingPage() {
    return (
        <ProductQuickViewProvider>
            <div className="w-full">
                <div className="container mx-auto">
                    {/* Hero Section */}
                    <Hero />

                    {/* Feature Icons */}
                    <FeatureIcons />

                    {/* Popular Categories */}
                    <PopularCategories />

                    <FeaturedCarousel />

                    {/* Discounted Products */}
                    <WeeklyDiscountsClient />
                    {/* Discounted Products */}
                    <VegetableAndFruitsClient />

                    {/* Banner Section */}
                    <BannerSection />

                    {/* Beauty & Makeup Section */}
                    <BeautyMakeupSectionClient />

                    <DealsOfTheDay />

                    {/* Product Showcase */}
                    <ProductShowcase />
                </div>
                {/* Footer */}
                <Footer />

                {/* Copyright */}
                <Copyright />

                {/* Product Quick View Modal */}
                <ProductQuickViewModal />
            </div>
        </ProductQuickViewProvider>
    );
}
