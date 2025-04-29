import React from 'react';
import Link from 'next/link';

const ProductBreadcrumbDetail = ({ productName, category, categorySlug }) => {
  return (
    <div className="container mx-auto px-4 py-4 border-b border-[#ECECEC]">
      <div className="flex items-center flex-wrap">
        <Link href="/" className="flex items-center text-[#3BB77E] font-semibold text-sm uppercase hover:text-[#2A9D6E] transition-colors">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-1">
            <path d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Home
        </Link>

        <svg width="6" height="10" viewBox="0 0 6 10" fill="none" xmlns="http://www.w3.org/2000/svg" className="mx-2">
          <path d="M1 9L5 5L1 1" stroke="#7E7E7E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>

        <Link
          href="/products"
          className="text-[#3BB77E] font-semibold text-sm uppercase hover:text-[#2A9D6E] transition-colors"
        >
          Products
        </Link>

        <svg width="6" height="10" viewBox="0 0 6 10" fill="none" xmlns="http://www.w3.org/2000/svg" className="mx-2">
          <path d="M1 9L5 5L1 1" stroke="#7E7E7E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>

        <Link
          href={`/products?categoryId=${categorySlug}`}
          className="text-[#3BB77E] font-semibold text-sm uppercase hover:text-[#2A9D6E] transition-colors"
        >
          {category || 'Category'}
        </Link>

        <svg width="6" height="10" viewBox="0 0 6 10" fill="none" xmlns="http://www.w3.org/2000/svg" className="mx-2">
          <path d="M1 9L5 5L1 1" stroke="#7E7E7E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>

        <span className="text-[#7E7E7E] font-semibold text-sm uppercase truncate max-w-xs">
          {productName || 'Product'}
        </span>
      </div>
    </div>
  );
};

export default ProductBreadcrumbDetail;
