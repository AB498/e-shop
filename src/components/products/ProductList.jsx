import React from 'react';
import ProductCard from './ProductCard';
import ProductListControlsWrapper from './ProductListControlsWrapper';
import PaginationWrapper from './PaginationWrapper';
import EmptyProductState from './EmptyProductState';
import { getAllProducts } from '@/lib/actions/products';

// This is a Server Component that fetches data
export default async function ProductList({
  page = 1,
  limit = 24,
  sortBy = 'created_at',
  sortOrder = 'desc',
  categoryId = null,
  search = '',
  minPrice = null,
  maxPrice = null,
  color = null,
  condition = null,
  rating = null,
  promotionId = null
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
    condition,
    rating,
    promotionId: promotionId ? Number(promotionId) : null
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
    <div className="w-full">
      {/* Product List Controls (Sort and Limit) */}
      <ProductListControlsWrapper totalProducts={pagination.totalProducts} />

      {/* Product Grid - Improved mobile responsiveness */}
      <div className="grid grid-cols-2 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 xs:gap-3 sm:gap-4 md:gap-5 lg:gap-6 mb-4 md:mb-8 mx-auto">
        {products.length > 0 ? (
          products.map((product) => (
            <div key={product.id} className="flex justify-stretch">
              <ProductCard
                product={product}
                showAddToCart={true}
              />
            </div>
          ))
        ) : (
          <div className="col-span-2 sm:col-span-2 md:col-span-3 lg:col-span-4">
            <EmptyProductState search={search} />
          </div>
        )}
      </div>

      {/* Pagination */}
      <div className="mt-4 md:mt-6">
        <PaginationWrapper pagination={pagination} />
      </div>
    </div>
  );
}
