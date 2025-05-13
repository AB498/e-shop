'use client';
import { useState, useEffect } from 'react';
import ProductCarousel from "../ui/ProductCarousel";

export default function HairCareSectionClient() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      try {
        // Fetch products from category ID 2 (Hair Care)
        const response = await fetch('/api/products?categoryId=2&limit=30');
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        const data = await response.json();
        setProducts(data.products || []);
      } catch (error) {
        console.error('Error fetching hair care products:', error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  return (
    <ProductCarousel
      products={products}
      title="Hair Care"
      icon="/images/categories/hair-care.png"
      // Optional custom breakpoints
      breakpoints={{
        640: { slidesPerView: 4 },
        768: { slidesPerView: 6 },
      }}
    />
  );
}
