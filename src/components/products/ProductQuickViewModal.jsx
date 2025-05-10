'use client';
import React, { useState, useEffect } from 'react';
import { useProductQuickView } from '@/context/ProductQuickViewContext';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import ModalProductImages from './ModalProductImages';
import ModalProductDetails from './ModalProductDetails';
import ModalRelatedProducts from './ModalRelatedProducts';
import RelatedProducts from './RelatedProducts';
import { GridCloseIcon } from '@mui/x-data-grid';

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
  const [isLoadingRelated, setIsLoadingRelated] = useState(false);

  // Check if product is in wishlist
  const productInWishlist = product ? isInWishlist(product.id) : false;

  // Fetch related products when product changes
  useEffect(() => {
    if (product && product.id && product.categoryId) {
      const fetchRelatedProducts = async () => {
        setIsLoadingRelated(true);
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
        } finally {
          setIsLoadingRelated(false);
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
    addToCart(cartItem);
    closeQuickView();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen p-2 sm:p-3 md:p-6">
        {/* Backdrop */}
        <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={closeQuickView}></div>

        {/* Modal Container */}
        <div className="relative w-full max-w-[95%] sm:max-w-[90%] md:max-w-7xl mx-auto">
          {/* Modal Content */}
          <div className="flex flex-col bg-[#E0DCD6] rounded-md overflow-hidden relative p-4">
            {/* Close button */}
            <div className="absolute top-2 right-2 sm:top-3 sm:right-3 md:top-4 md:right-4 z-10">
              <button
                onClick={closeQuickView}
                className="bg-white rounded-full p-1.5 sm:p-2 shadow-md hover:bg-gray-100 transition-colors"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1 1L13 13M1 13L13 1" stroke="#666666" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </button>
            </div>

            {/* Product Info Section */}
            <div className="flex flex-col md:flex-row">
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

            <div className="w-full p-2 sm:p-3 md:p-5">
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
