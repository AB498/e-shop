import React from 'react';
import ProductBreadcrumbDetail from './ProductBreadcrumbDetail';
import ProductImageGallery from './ProductImageGallery';
import ProductInfo from './ProductInfo';
import ProductTabs from './ProductTabs';
import RelatedProducts from './RelatedProducts';
import ProductSidebar from './ProductSidebar';
import BottomBanner from './BottomBanner';

const ProductDetail = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5]">
      <ProductBreadcrumbDetail />

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6 flex flex-col lg:flex-row gap-6">
        {/* Left Column - Main Content */}
        <div className="flex-1">
          {/* Product Images and Details Section */}
          <div className="bg-white rounded-[15px] p-6 shadow-[5px_5px_15px_0px_rgba(0,0,0,0.05)] mb-6 border border-[#ECECEC]">
            <div className="flex flex-col md:flex-row gap-8">
              <ProductImageGallery />
              <ProductInfo />
            </div>
          </div>

          {/* Product Description Tabs */}
          <ProductTabs />

          {/* Related Products Section */}
          <RelatedProducts />
        </div>

        {/* Right Sidebar */}
        <div className="hidden lg:block">
          <ProductSidebar />
        </div>
      </div>

      {/* Bottom Banner */}
      <BottomBanner />
    </div>
  );
};

export default ProductDetail;
