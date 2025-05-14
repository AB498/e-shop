'use client';
import React, { useState, useEffect } from 'react';
import { useProductQuickView } from '@/context/ProductQuickViewContext';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import ModalProductImages from './ModalProductImages';
import ModalProductDetails from './ModalProductDetails';
import ProductListSection from './ProductListSection';

const ProductQuickViewModal = () => {
  const {
    isOpen,
    product: initialProduct,
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
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch complete product data when modal is opened
  useEffect(() => {
    if (isOpen && initialProduct && initialProduct.id) {
      setIsLoading(true);

      const fetchCompleteProduct = async () => {
        try {
          const response = await fetch(`/api/products/${initialProduct.id}`);
          if (!response.ok) {
            throw new Error('Failed to fetch complete product data');
          }
          const data = await response.json();
          setProduct(data);
        } catch (error) {
          console.error('Error fetching complete product data:', error);
          // Fall back to the initial product data if fetch fails
          setProduct(initialProduct);
        } finally {
          setIsLoading(false);
        }
      };

      fetchCompleteProduct();
    } else if (!isOpen) {
      // Reset product when modal is closed
      setProduct(null);
    }
  }, [isOpen, initialProduct]);

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

  if (!isOpen) return null;

  // Show loading state or wait for product data
  if (isLoading || !product) {
    return (
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex items-center justify-center min-h-screen p-2 sm:p-2 md:p-3">
          {/* Backdrop */}
          <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={closeQuickView}></div>

          {/* Loading Modal */}
          <div className="relative w-full max-w-[95%] sm:max-w-[80%] md:max-w-3xl lg:max-w-4xl mx-auto">
            <div className="flex flex-col bg-[#E0DCD6] rounded-md overflow-hidden relative p-3 sm:p-1.5 md:p-2 min-h-[300px] items-center justify-center">
              <div className="animate-pulse flex flex-col items-center">
                <div className="h-12 w-12 border-4 border-t-[#4A3F35] border-r-[#4A3F35] border-b-[#4A3F35] border-l-transparent rounded-full animate-spin"></div>
                <p className="mt-4 text-[#4A3F35] font-medium">Loading product details...</p>
              </div>

              {/* Close button */}
              <div className="absolute top-3 right-3 sm:top-1.5 sm:right-1.5 md:top-2 md:right-2 z-10">
                <button
                  onClick={closeQuickView}
                  className="bg-white rounded-full p-1.5 sm:p-1 shadow-sm hover:bg-gray-100 transition-colors"
                >
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1 1L13 13M1 13L13 1" stroke="#666666" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen p-2 sm:p-2 md:p-3">
        {/* Backdrop */}
        <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={closeQuickView}></div>

        {/* Modal Container */}
        <div className="relative w-full max-w-[95%] sm:max-w-[80%] md:max-w-3xl lg:max-w-4xl mx-auto">
          {/* Modal Content */}
          <div className="flex flex-col bg-[#E0DCD6] rounded-md overflow-hidden relative p-3 sm:p-1.5 md:p-2">
            {/* Close button */}
            <div className="absolute top-3 right-3 sm:top-1.5 sm:right-1.5 md:top-2 md:right-2 z-10">
              <button
                onClick={closeQuickView}
                className="bg-white rounded-full p-1.5 sm:p-1 shadow-sm hover:bg-gray-100 transition-colors"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1 1L13 13M1 13L13 1" stroke="#666666" strokeWidth="1.5" strokeLinecap="round" />
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

            <div className="w-full p-2 sm:p-1.5 md:p-2">
              {/* Related Products Section - Spans full width */}
              <ProductListSection
                products={relatedProducts}
                fetchUrl={`/api/products`}
                category={product.category || 'Products'}
                title="Related Products"
                viewType="grid"
                showWishlist={true}
                titleIcon="/images/deals/discount-coupon-icon.png"
                allItemsLink="/products"
                allItemsText={`All ${product.category || 'Products'}`}
                emptyStateText="No related products found."
                gridCols={{
                  default: 2,
                  xs: 2,
                  sm: 3,
                  lg: 4,
                  xl: 5
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductQuickViewModal;
