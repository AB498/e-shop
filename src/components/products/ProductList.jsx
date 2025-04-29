import React from 'react';
import ProductCard from './ProductCard';
import ProductListControls from './ProductListControls';
import Pagination from './Pagination';
import EmptyProductState from './EmptyProductState';
import { getAllProducts } from '@/lib/actions/products';

// This is a Server Component that fetches data
export default async function ProductList({
  page = 1,
  limit = 12,
  sortBy = 'id',
  sortOrder = 'asc',
  categoryId = null,
  search = '',
  minPrice = null,
  maxPrice = null,
  color = null,
  condition = null
}) {
  // Fetch products with pagination and all filters
  const { products, pagination } = await getAllProducts({
    page: Number(page),
    limit: Number(limit),
    sortBy,
    sortOrder,
    categoryId: categoryId ? Number(categoryId) : null,
    search,
    minPrice: minPrice ? Number(minPrice) : null,
    maxPrice: maxPrice ? Number(maxPrice) : null,
    color,
    condition
  });

  console.log('Search term:', search);
  console.log('Products count:', products.length);
  console.log('Filters:', {
    categoryId,
    search,
    minPrice,
    maxPrice,
    color,
    condition,
  });

  return (
    <div>
      {/* Product List Controls (Sort and Limit) */}
      <ProductListControls totalProducts={pagination.totalProducts} />

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
        {products.length > 0 ? (
          products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              showAddToCart={true}
            />
          ))
        ) : (
          <EmptyProductState search={search} />
        )}
      </div>

      {/* Pagination */}
      <Pagination pagination={pagination} />
    </div>
  );
}
