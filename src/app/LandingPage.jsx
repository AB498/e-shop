import Topbar from "../components/layout/Topbar";
import Navigation from "../components/layout/Navigation";
import Hero from "../components/layout/Hero";
import FeatureIcons from "../components/layout/FeatureIcons";
import PopularCategories from "../components/categories/PopularCategories";
import BannerSection from "../components/landing/BannerSection";
import BeautyMakeupSection from "../components/categories/BeautyMakeupSection";
import ProductShowcase from "../components/landing/ProductShowcase";
import Footer from "../components/layout/Footer";
import Copyright from "../components/layout/Copyright";
import WeeklyDiscounts from "@/components/categories/WeeklyDiscounts";
import FeaturedCarousel from "@/components/layout/FeaturedCarousel";
import DealsOfTheDay from "@/components/deals/DealsOfTheDay";
import VegetableAndFruits from "@/components/categories/VegetableAndFruits";

export default function LandingPage() {
    return (
        <div className="w-full">
            {/* Topbar - Full width at the top */}
            <Topbar />

            {/* Navigation */}
            <Navigation />


            <div className="container mx-auto">
                {/* Hero Section */}
                <Hero />

                {/* Feature Icons */}
                <FeatureIcons />

                {/* Popular Categories */}
                <PopularCategories />

                <FeaturedCarousel />

                {/* Discounted Products */}
                <WeeklyDiscounts />
                {/* Discounted Products */}
                <VegetableAndFruits />

                {/* Banner Section */}
                <BannerSection />

                {/* Beauty & Makeup Section */}
                <BeautyMakeupSection />

                <DealsOfTheDay />

                {/* Product Showcase */}
                <ProductShowcase />
            </div>
            {/* Footer */}
            <Footer />

            {/* Copyright */}
            <Copyright />
        </div>
    );
}
