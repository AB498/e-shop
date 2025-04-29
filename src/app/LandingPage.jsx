"use client";
import { useState } from "react";
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

            {/* Hero Section */}
            <div className="max-w-7xl mx-auto">
                <Hero />
            </div>

            {/* Feature Icons */}
            <div className="max-w-7xl mx-auto">
                <FeatureIcons />
            </div>

            {/* Popular Categories */}
            <div className="max-w-7xl mx-auto">
                <PopularCategories />
            </div>

            <div className="max-w-7xl mx-auto">
                <FeaturedCarousel />
            </div>

            {/* Discounted Products */}
            <div className="max-w-7xl mx-auto">
                <WeeklyDiscounts />
            </div>
            {/* Discounted Products */}
            <div className="max-w-7xl mx-auto">
                <VegetableAndFruits />
            </div>

            {/* Banner Section */}
            <div className="max-w-7xl mx-auto">
                <BannerSection />
            </div>

            {/* Beauty & Makeup Section */}
            <div className="max-w-7xl mx-auto">
                <BeautyMakeupSection />
            </div>

            <div className="max-w-7xl mx-auto">
                <DealsOfTheDay />
            </div>

            {/* Product Showcase */}
            <div className="max-w-7xl mx-auto">
                <ProductShowcase />
            </div>

            {/* Footer */}
            <Footer />

            {/* Copyright */}
            <Copyright />
        </div>
    );
}
