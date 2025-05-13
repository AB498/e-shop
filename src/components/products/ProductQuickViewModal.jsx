'use client';
import React, { useState, useEffect } from 'react';
import { useProductQuickView } from '@/context/ProductQuickViewContext';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import ModalProductImages from './ModalProductImages';
import ModalProductDetails from './ModalProductDetails';
import RelatedProducts from './RelatedProducts';

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
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const [relatedProducts, setRelatedProducts] = useState([]);

  // Check if product is in wishlist
  const productInWishlist = product ? isInWishlist(product.id) : false;

  // Fetch related products when product changes
  useEffect(() => {
    if (product && product.id && product.categoryId) {
      const fetchRelatedProducts = async () => {
        try {
          const response = await fetch(`/api/products/related?productId=${product.id}&categoryId=${product.categoryId}&limit=4`);
          if (!response.ok) {
            throw new Error('Failed to fetch related products');
          }
          const data = await response.json();
          setRelatedProducts(data.products || []);
        } catch (error) {
          console.error('Error fetching related products:', error);
          setRelatedProducts([]);
        }
      };

      fetchRelatedProducts();
    }
  }, [product]);

  if (!isOpen || !product) return null;

  // Format price range for display
  const formatPrice = (price) => {
    return `৳${parseFloat(price).toFixed(2)}`;
  };

  // Handle add to cart
  const handleAddToCart = () => {
    const cartItem = {
      ...product,
      quantity,
      size: selectedSize
    };
    // Use the showToast parameter to control toast notifications
    addToCart(cartItem, quantity);
    closeQuickView();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen p-1 sm:p-2 md:p-3">
        {/* Backdrop */}
        <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={closeQuickView}></div>

        {/* Modal Container */}
        <div className="relative w-full max-w-[95%] sm:max-w-[80%] md:max-w-3xl lg:max-w-4xl mx-auto">
          {/* Modal Content */}
          <div className="flex flex-col bg-[#E0DCD6] rounded-md overflow-hidden relative p-1 sm:p-1.5 md:p-2">
            {/* Close button */}
            <div className="absolute top-1 right-1 sm:top-1.5 sm:right-1.5 md:top-2 md:right-2 z-10">
              <button
                onClick={closeQuickView}
                className="bg-white rounded-full p-0.5 sm:p-1 shadow-sm hover:bg-gray-100 transition-colors"
              >
                <svg width="10" height="10" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1 1L13 13M1 13L13 1" stroke="#666666" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </button>
            </div>

            {/* Product Info Section */}
            <div className="flex flex-col md:flex-row md:gap-1 lg:gap-2">
              {/* Left side - Product image */}
              <ModalProductImages product={product} />

              {/* Right side - Product details */}
              <ModalProductDetails
                product={product}
                quantity={quantity}
                selectedSize={selectedSize}
                formatPrice={formatPrice}
                increaseQuantity={increaseQuantity}
                decreaseQuantity={decreaseQuantity}
                changeSize={changeSize}
                handleAddToCart={handleAddToCart}
                productInWishlist={productInWishlist}
                addToWishlist={addToWishlist}
                removeFromWishlist={removeFromWishlist}
              />
            </div>

            <div className="w-full p-1 sm:p-1.5 md:p-2">
              {/* Related Products Section - Spans full width */}
              <RelatedProducts
                products={relatedProducts}
                category={product.category}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductQuickViewModal;
