'use client';
import React from 'react';
import Image from 'next/image';
import { useProductQuickView } from '@/context/ProductQuickViewContext';
import { useCart } from '@/context/CartContext';

const ProductQuickViewModal = () => {
  const {
    isOpen,
    product,
    quantity,
    selectedSize,
    closeQuickView,
    increaseQuantity,
    decreaseQuantity,
    changeSize
  } = useProductQuickView();

  const { addToCart } = useCart();

  if (!isOpen || !product) return null;

  // Calculate discount percentage
  const discountPercentage = Math.round((1 - (parseFloat(product.discountPrice) / parseFloat(product.price))) * 100);

  // Handle add to cart
  const handleAddToCart = () => {
    const cartItem = {
      ...product,
      quantity,
      size: selectedSize
    };
    addToCart(cartItem);
    closeQuickView();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen p-4 md:p-6">
        {/* Backdrop */}
        <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={closeQuickView}></div>

        {/* Modal Container */}
        <div className="relative w-full max-w-7xl mx-auto">
          {/* Modal Content */}
          <div className="flex flex-col md:flex-row bg-[#E0DCD6] rounded-md overflow-hidden relative">
            {/* Close button */}
            <div className="absolute top-4 right-4 z-10">
              <button
                onClick={closeQuickView}
                className="bg-white rounded-full p-2 shadow-md hover:bg-gray-100 transition-colors"
              >
                <img src="/images/popup/close-icon.svg" alt="Close" className="w-4 h-4" />
              </button>
            </div>

            {/* Left side - Product image */}
            <div className="w-full md:w-2/5 p-4 md:p-5">
              <div className="border border-[#E7ECF0] rounded-md bg-white p-1">
                <div className="relative aspect-square rounded-md overflow-hidden">
                  <Image
                    src={product.image || "/images/product-image.png"}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            </div>

            {/* Right side - Product details */}
            <div className="w-full md:w-3/5 p-6 md:p-10">
              {/* Product title */}
              <h2 className="text-xl md:text-2xl font-semibold text-black mb-4 md:mb-5 leading-snug">
                {product.name || "Product Quick View Title Goes To Here"}
                {product.name && product.name.length < 30 && <br />}
                {!product.name && <br />}
                {!product.name && "Product Title 2nd Line"}
              </h2>

              {/* Price */}
              <div className="mb-4 md:mb-6">
                <p className="text-[#006B51] text-lg md:text-[22px] font-bold">
                  {product.discountPrice !== product.price && (
                    <span className="text-[#E12625] text-base md:text-lg line-through mr-2">৳{parseFloat(product.price).toFixed(2)}</span>
                  )}
                  ৳{parseFloat(product.discountPrice).toFixed(2)}
                </p>
              </div>

              {/* Available sizes */}
              <div className="mb-4 md:mb-6">
                <p className="text-[rgba(0,0,0,0.7)] text-sm md:text-[15px] mb-2 md:mb-3">available in:</p>
                <div className="flex flex-wrap gap-2">
                  {['small', 'medium', 'large'].map((size) => (
                    <button
                      key={size}
                      onClick={() => changeSize(size)}
                      className={`px-3 md:px-4 py-2 border rounded-full text-sm md:text-[15px] font-semibold ${
                        selectedSize === size
                          ? 'border-[#006B51] bg-[#006B51] text-white'
                          : 'border-[#B1AEA9] text-black'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Add to cart section */}
              <div className="flex flex-col gap-4 mt-4">
                <div className="flex flex-wrap items-center gap-4">
                  {/* Quantity selector */}
                  <div className="flex items-center bg-[#F3F5F9] rounded-full h-12">
                    <button
                      onClick={decreaseQuantity}
                      className="p-2 md:p-2.5 rounded-full"
                    >
                      <img src="/images/popup/minus-icon.svg" alt="Decrease" className="w-4 h-4 md:w-5 md:h-5" />
                    </button>
                    <span className="px-4 md:px-6 font-semibold text-base md:text-lg">{quantity}</span>
                    <button
                      onClick={increaseQuantity}
                      className="p-2 md:p-2.5 rounded-full"
                    >
                      <img src="/images/popup/plus-icon.svg" alt="Increase" className="w-4 h-4 md:w-5 md:h-5" />
                    </button>
                  </div>

                  {/* Add to cart button */}
                  <button
                    onClick={handleAddToCart}
                    className="flex items-center justify-center gap-2 md:gap-3 bg-[#006B51] text-white py-3 md:py-4 px-6 md:px-8 w-full md:w-auto rounded-full font-semibold hover:bg-[#005541] transition-colors tracking-wider text-sm md:text-base"
                  >
                    <img src="/images/popup/cart-icon.svg" alt="Cart" className="w-5 h-5 md:w-6 md:h-6" />
                    Add to Cart
                  </button>
                </div>

                {/* Wishlist and Share buttons */}
                <div className="flex flex-wrap gap-3 md:gap-4 mt-4">
                  <button className="flex items-center justify-center gap-2 border border-[#B1AEA9] rounded-full py-3 px-4 md:px-6 font-bold tracking-wider text-sm md:text-base flex-1 md:flex-none">
                    <img src="/images/popup/wishlist-icon.svg" alt="Wishlist" className="w-5 h-5 md:w-6 md:h-6" />
                    Wishlist
                  </button>
                  <button className="flex items-center justify-center gap-2 border border-[#B1AEA9] rounded-full py-3 px-4 md:px-6 font-bold tracking-wider text-sm md:text-base flex-1 md:flex-none">
                    <img src="/images/popup/share-icon.svg" alt="Share" className="w-5 h-5 md:w-6 md:h-6" />
                    Share
                  </button>
                </div>
              </div>

              {/* Tags */}
              <div className="mt-6 md:mt-8 flex flex-col">
                <div className="flex items-center gap-2 mb-2 md:mb-3">
                  <img src="/images/popup/tag-icon.svg" alt="Tags" className="w-4 h-4 md:w-5 md:h-5" />
                  <span className="text-[rgba(0,0,0,0.8)] text-sm md:text-[15px]">Tags:</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {['Beauty & Care', 'Hair Treatment', 'Tag Name', 'Tag Name', 'Tag Name'].map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 md:px-3 py-1 border border-[#B1AEA9] rounded-full text-xs md:text-sm text-[#595959] font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Product details */}
              <div className="mt-6 md:mt-8">
                <h3 className="font-semibold text-black mb-2 md:mb-3 text-base md:text-[16px]">Product Details:</h3>
                <p className="text-[#595959] text-xs md:text-sm leading-relaxed md:leading-loose">
                  One bottle of this multipurpose toner, a cult favorite, is sold every three seconds!
                  As the name implies, the recipe successfully increases cell turnover. It maintains
                  smooth, healthy skin by combining three different chemical exfoliants (AHAs, BHAs, and PHAs)
                  with papaya and witch hazel..
                  <span className="text-[#006B51] font-medium cursor-pointer ml-1">Read More</span>
                </p>
              </div>

              {/* Related Products */}
              <div className="mt-6 md:mt-8">
                <div className="bg-[#A4A4A4] text-white py-2 px-4 rounded-md mb-4">
                  <h3 className="font-semibold">Related Products</h3>
                </div>
                {/* We would add related products carousel here in a real implementation */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductQuickViewModal;
