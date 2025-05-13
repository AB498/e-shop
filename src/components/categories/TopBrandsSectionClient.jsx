'use client';
import { useState, useEffect } from 'react';
import ProductCarousel from "../ui/ProductCarousel";

export default function TopBrandsSectionClient() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      try {
        // Fetch products from category ID 8 (Top Brands)
        const response = await fetch('/api/products?categoryId=8&limit=30');
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        const data = await response.json();
        setProducts(data.products || []);
      } catch (error) {
        console.error('Error fetching top brands products:', error);
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
      title="Top Brands"
      icon="/images/categories/Top Brands.png"
      // Optional custom breakpoints
      breakpoints={{
        640: { slidesPerView: 4 },
        768: { slidesPerView: 6 },
      }}
    />
  );
}
