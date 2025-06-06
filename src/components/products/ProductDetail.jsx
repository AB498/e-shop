import React from 'react';
import ProductBreadcrumbDetail from './ProductBreadcrumbDetail';
import ProductImageGallery from './ProductImageGallery';
import ProductInfo from './ProductInfo';
import ProductTabs from './ProductTabs';
import RelatedProducts from './RelatedProducts';
import BottomBanner from './BottomBanner';
import { getProductById, getRelatedProducts } from '@/lib/actions/products';
import { notFound } from 'next/navigation';
import ProductLeftBarServer from './ProductLeftBarServer';

// This is a Server Component that fetches data
export default async function ProductDetail({ productId }) {
  // Fetch product data
  const product = await getProductById(Number(productId));

  // If product not found, show 404 page
  if (!product) {
    notFound();
  }

  // Fetch related products
  const relatedProducts = await getRelatedProducts(
    product.id,
    product.categoryId,
    4
  );

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5]">
      <ProductBreadcrumbDetail
        productName={product.name}
        category={product.category}
        categorySlug={product.categorySlug}
      />

      {/* Main Content */}
      <div className="container mx-auto px-3 py-3 sm:py-4 flex flex-col lg:flex-row gap-3 sm:gap-4">
        {/* Left Column - Main Content */}
        <div className="flex-1">
          {/* Product Images and Details Section */}
          <div className="bg-white rounded-md p-3 sm:p-4 shadow-sm mb-3 sm:mb-4 border border-[#ECECEC]">
            <div className="flex flex-col md:flex-row gap-3 sm:gap-4 md:gap-5">
              <ProductImageGallery
                images={product.images}
                image={product.image}
                name={product.name}
                discountPercentage={product.discountPercentage}
              />
              <ProductInfo
                product={product}
              />
            </div>
          </div>

          {/* Product Description Tabs */}
          <ProductTabs
            description={product.description}
            sku={product.sku}
            type={product.type}
            productId={product.id}
            product={product}
          />

          {/* Related Products Section */}
          <RelatedProducts
            products={relatedProducts}
            category={product.category}
          />
        </div>

        {/* Right Sidebar */}
        <div className="hidden lg:block">
          <ProductLeftBarServer />
        </div>
      </div>

      {/* Bottom Banner */}
      <BottomBanner />
    </div>
  );
}
