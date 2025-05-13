'use client';
import { useState, useEffect } from 'react';
import ProductCarousel from "../ui/ProductCarousel";

export default function GroomingSectionClient() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      try {
        // Fetch products from category ID 1 (Grooming)
        const response = await fetch('/api/products?categoryId=1&limit=8');
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        const data = await response.json();
        setProducts(data.products || []);
      } catch (error) {
        console.error('Error fetching grooming products:', error);
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
      title="Grooming Products"
      icon="/images/categories/grooming.png"
      // Optional custom breakpoints
      breakpoints={{
        640: { slidesPerView: 4 },
        768: { slidesPerView: 6 },
      }}
    />
  );
}
