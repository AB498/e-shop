'use client';
import React, { useState, useEffect } from 'react';
import { useProductQuickView } from '@/context/ProductQuickViewContext';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import ModalProductImages from './ModalProductImages';
import ModalProductDetails from './ModalProductDetails';
import ModalRelatedProducts from './ModalRelatedProducts';

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
      <div className="flex items-center justify-center min-h-screen p-4 md:p-6">
        {/* Backdrop */}
        <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={closeQuickView}></div>

        {/* Modal Container */}
        <div className="relative w-full max-w-7xl mx-auto">
          {/* Modal Content */}
          <div className="flex flex-col bg-[#E0DCD6] rounded-md overflow-hidden relative">
            {/* Close button */}
            <div className="absolute top-4 right-4 z-10">
              <button
                onClick={closeQuickView}
                className="bg-white rounded-full p-2 shadow-md hover:bg-gray-100 transition-colors"
              >
                <img src="/images/popup/close-icon.svg" alt="Close" className="w-4 h-4" />
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

            {/* Related Products Section - Spans full width */}
            <ModalRelatedProducts
              products={relatedProducts}
              isLoading={isLoadingRelated}
              formatPrice={formatPrice}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductQuickViewModal;
