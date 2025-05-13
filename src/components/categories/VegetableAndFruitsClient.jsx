'use client';
import { useState, useEffect } from 'react';
import ProductCarousel from "../ui/ProductCarousel";

export default function VegetableAndFruitsClient() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await fetch('/api/products?categoryId=4,8&limit=30');
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        const data = await response.json();
        setProducts(data.products || []);
      } catch (error) {
        console.error('Error fetching featured products:', error);
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
      title="Featured Products"
      icon="/images/sidebar/vegetables-fruits.png"
      // Optional custom breakpoints
      breakpoints={{
        640: { slidesPerView: 4 },
        768: { slidesPerView: 6 },
      }}
    />
  );
}
