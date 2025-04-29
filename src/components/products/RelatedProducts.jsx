import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

const RelatedProducts = ({ products = [], category = 'Products' }) => {
  // If no products provided, show empty state
  if (!products || products.length === 0) {
    return (
      <div className="mb-10">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-semibold text-black">Related Products</h2>
            <Image
              src="/images/deals/discount-coupon-icon.png"
              alt="Discount"
              width={30}
              height={30}
              className="object-contain"
            />
          </div>
          <div className="flex items-center text-[#7E7E7E]">
            <Link href="/products" className="flex items-center hover:text-[#3BB77E] transition-colors">
              <span className="text-base font-normal">All Products</span>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="ml-1"
              >
                <path
                  d="M9 6L15 12L9 18"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-[15px] p-8 text-center shadow-[5px_5px_15px_0px_rgba(0,0,0,0.05)]">
          <p className="text-[#7E7E7E] text-lg">No related products found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-10">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <h2 className="text-2xl font-semibold text-black">Related Products</h2>
          <Image
            src="/images/deals/discount-coupon-icon.png"
            alt="Discount"
            width={30}
            height={30}
            className="object-contain"
          />
        </div>
        <div className="flex items-center text-[#7E7E7E]">
          <Link href={`/products?category=${category}`} className="flex items-center hover:text-[#3BB77E] transition-colors">
            <span className="text-base font-normal">All {category}</span>
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="ml-1"
            >
              <path
                d="M9 6L15 12L9 18"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Link>
        </div>
      </div>

      {/* Related Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <div key={product.id} className="bg-white rounded-[15px] overflow-hidden shadow-[5px_5px_15px_0px_rgba(0,0,0,0.05)]">
            <Link href={`/products/${product.id}`}>
              <div className="relative h-64 transition-transform duration-300 hover:scale-105">
                <Image
                  src={product.image || "/images/product-image.png"}
                  alt={product.name}
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                />
              </div>
            </Link>
            <div className="p-4">
              <Link href={`/products/${product.id}`}>
                <h3 className="text-[#253D4E] font-bold text-base mb-2 line-clamp-2 hover:text-[#3BB77E] transition-colors">
                  {product.name}
                </h3>
              </Link>
              <div className="flex items-center gap-2 mb-2">
                <Image src="/images/star-rating.png" alt="Rating" width={80} height={16} className="object-contain" />
                <span className="text-[#B6B6B6] text-sm">(4.0)</span>
              </div>
              <div className="flex justify-between items-center mt-2">
                <div>
                  <span className="text-[#006B51] text-sm mr-2">{product.category}</span>
                  <div className="mt-1">
                    <span className="text-[#006B51] font-bold text-lg">৳{parseFloat(product.discountPrice).toFixed(2)}</span>
                    {product.discountPrice !== product.price && (
                      <span className="text-[#ADADAD] font-bold text-sm ml-2 line-through">৳{parseFloat(product.price).toFixed(2)}</span>
                    )}
                  </div>
                </div>
                <button className="bg-[#006B51] text-white text-sm font-bold py-1 px-3 rounded-md flex items-center hover:bg-[#005541] transition-colors">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="mr-1"
                  >
                    <path
                      d="M12 5V19M5 12H19"
                      stroke="white"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  Add
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RelatedProducts;
