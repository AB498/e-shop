'use client';
import React from 'react';
import { toast } from 'react-hot-toast';

const ModalProductDetails = ({
  product,
  quantity,
  selectedSize,
  formatPrice,
  increaseQuantity,
  decreaseQuantity,
  changeSize,
  handleAddToCart,
  productInWishlist,
  addToWishlist,
  removeFromWishlist
}) => {
  // State to track wishlist operation in progress
  const [isWishlistLoading, setIsWishlistLoading] = React.useState(false);
  return (
    <div className="w-full md:w-3/5 p-2 sm:p-3 md:p-4">
      {/* Product title */}
      <h2 className="text-responsive-lg sm:text-responsive-xl md:text-responsive-xl lg:text-responsive-2xl font-semibold text-black mb-2 sm:mb-2.5 md:mb-3 leading-snug">
        {product.name || "Product Quick View Title Goes To Here"}
        {product.name && product.name.length < 30 && <br />}
        {!product.name && <br />}
        {!product.name && "Product Title 2nd Line"}
      </h2>

      {/* Price */}
      <div className="mb-2 sm:mb-3 md:mb-4">
        <p className="text-[#006B51] text-responsive md:text-responsive-lg font-bold">
          {product.discountPrice !== product.price ? (
            <>
              <span className="text-[#E12625] text-responsive-xs sm:text-responsive line-through mr-1 sm:mr-2">
                {formatPrice(product.price)}
              </span>
              {formatPrice(product.discountPrice)}
            </>
          ) : (
            `${formatPrice(product.price)} - ${formatPrice(parseFloat(product.price) * 1.5)}`
          )}
        </p>
      </div>

      {/* Available sizes */}
      <div className="mb-2 sm:mb-3 md:mb-4 border-b border-gray-200 pb-2 sm:pb-3 md:pb-4">
        <p className="text-[rgba(0,0,0,0.7)] text-responsive-xs mb-1.5 sm:mb-2 uppercase">available in:</p>
        <div className="flex flex-wrap gap-1.5 sm:gap-2">
          {['small', 'medium', 'large'].map((size) => (
            <button
              key={size}
              onClick={() => changeSize(size)}
              className={`px-2 py-0.5 sm:px-2.5 sm:py-1 md:px-3 md:py-1.5 border rounded-full text-responsive-xs font-semibold ${
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
      <div className="flex flex-col gap-1.5 sm:gap-2 md:gap-3">
        <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
          {/* Quantity selector */}
          <div className="flex items-center bg-[#F3F5F9] rounded-full h-7 sm:h-8 md:h-9">
            <button
              onClick={decreaseQuantity}
              className="p-1 sm:p-1 md:p-1.5 rounded-full"
              aria-label="Decrease quantity"
            >
              <svg width="16" height="16" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-2.5 h-2.5 sm:w-3 sm:h-3 md:w-4 md:h-4">
                <path d="M4 10H16" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <span className="px-2 sm:px-2.5 md:px-3 lg:px-4 font-semibold text-responsive-xs sm:text-responsive">{quantity}</span>
            <button
              onClick={increaseQuantity}
              className="p-1 sm:p-1 md:p-1.5 rounded-full"
              aria-label="Increase quantity"
            >
              <svg width="16" height="16" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-2.5 h-2.5 sm:w-3 sm:h-3 md:w-4 md:h-4">
                <path d="M10 4V16M4 10H16" stroke="#006B51" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>

          {/* Add to cart button */}
          <button
            onClick={handleAddToCart}
            className="flex items-center justify-center gap-1 sm:gap-1.5 bg-[#006B51] text-white flex-1 rounded-full font-semibold hover:bg-[#005541] transition-colors tracking-widest h-7 sm:h-8 md:h-9 px-2 sm:px-3 md:px-4"
          >
            <svg width="16" height="16" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-2.5 h-2.5 sm:w-3 sm:h-3 md:w-4 md:h-4">
              <path d="M8.25 20.1667C8.25 20.1667 4.58333 20.1667 2.75 20.1667C0.916667 20.1667 0.916667 18.3333 0.916667 18.3333V3.66667C0.916667 3.66667 0.916667 1.83333 2.75 1.83333H19.25C19.25 1.83333 21.0833 1.83333 21.0833 3.66667V18.3333C21.0833 18.3333 21.0833 20.1667 19.25 20.1667H13.75" stroke="#E0DCD6" strokeWidth="0.1" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M0.916667 5.5H21.0833M5.5 9.16667H16.5M5.5 12.8333H12.8333" stroke="#E0DCD6" strokeWidth="0.1" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className="text-responsive-xs">Add to Cart</span>
          </button>
        </div>

        {/* Wishlist and Share buttons */}
        <div className="flex flex-wrap gap-1.5 sm:gap-2 mt-1.5 sm:mt-2">
          <button
            onClick={() => {
              // Prevent multiple clicks
              if (isWishlistLoading) return;

              setIsWishlistLoading(true);

              if (productInWishlist) {
                removeFromWishlist(product.id).then(result => {
                  if (result.success) {
                    toast.success('Removed from wishlist');
                  } else {
                    toast.error(result.message || 'Failed to remove from wishlist');
                  }
                }).finally(() => {
                  setIsWishlistLoading(false);
                });
              } else {
                addToWishlist(product).then(result => {
                  if (result.success) {
                    toast.success('Added to wishlist');
                  } else {
                    toast.error(result.message || 'Failed to add to wishlist');
                  }
                }).finally(() => {
                  setIsWishlistLoading(false);
                });
              }
            }}
            className={`flex items-center justify-center gap-1 sm:gap-1.5 border border-[#B1AEA9] rounded-full flex-1 h-7 sm:h-8 md:h-9 px-2 sm:px-3 md:px-4 ${
              productInWishlist ? 'bg-[#F0F7F5]' : 'bg-white'
            }`}
            aria-label={productInWishlist ? "Remove from wishlist" : "Add to wishlist"}
          >
            {isWishlistLoading ? (
              <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 md:w-4 md:h-4 border-2 border-[#FF3E3E] border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <svg width="16" height="16" viewBox="0 0 22 21" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-2.5 h-2.5 sm:w-3 sm:h-3 md:w-4 md:h-4">
                <path d="M15.96 0H15.9075C13.8232 0 11.9805 1.1025 10.92 2.73C9.8595 1.1025 8.01675 0 5.9325 0H5.88C2.63025 0.0315 0 2.67225 0 5.9325C0 7.875 0.8505 10.6313 2.5095 12.8993C5.67 17.22 10.92 21 10.92 21C10.92 21 16.17 17.22 19.3305 12.8993C20.9895 10.6313 21.84 7.875 21.84 5.9325C21.84 2.67225 19.2098 0.0315 15.96 0Z" fill={productInWishlist ? "#FF3E3E" : "none"} stroke={productInWishlist ? "#FF3E3E" : "#FF3E3E"} strokeWidth="1.5"/>
              </svg>
            )}
            <span className="text-responsive-xs font-semibold">Wishlist</span>
          </button>
          <button
            className="flex items-center justify-center gap-1 sm:gap-1.5 border border-[#B1AEA9] rounded-full flex-1 bg-white h-7 sm:h-8 md:h-9 px-2 sm:px-3 md:px-4"
            aria-label="Share product"
          >
            <svg width="16" height="16" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-2.5 h-2.5 sm:w-3 sm:h-3 md:w-4 md:h-4">
              <path d="M19.5 8.9375C21.3594 8.9375 22.75 7.54688 22.75 5.6875C22.75 3.82812 21.3594 2.4375 19.5 2.4375C17.6406 2.4375 16.25 3.82812 16.25 5.6875C16.25 7.54688 17.6406 8.9375 19.5 8.9375Z" stroke="black" strokeWidth="1.625" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M6.5 16.25C8.35938 16.25 9.75 14.8594 9.75 13C9.75 11.1406 8.35938 9.75 6.5 9.75C4.64062 9.75 3.25 11.1406 3.25 13C3.25 14.8594 4.64062 16.25 6.5 16.25Z" stroke="black" strokeWidth="1.625" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M19.5 23.5625C21.3594 23.5625 22.75 22.1719 22.75 20.3125C22.75 18.4531 21.3594 17.0625 19.5 17.0625C17.6406 17.0625 16.25 18.4531 16.25 20.3125C16.25 22.1719 17.6406 23.5625 19.5 23.5625Z" stroke="black" strokeWidth="1.625" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M9.34375 14.7812L16.6562 18.5312" stroke="black" strokeWidth="1.625" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M16.6562 7.46875L9.34375 11.2188" stroke="black" strokeWidth="1.625" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className="text-responsive-xs font-semibold">Share</span>
          </button>
        </div>
      </div>

      {/* Tags */}
      <div className="mt-3 sm:mt-4 md:mt-5 flex flex-col">
        <div className="flex items-center gap-1 mb-1.5 sm:mb-2">
          <svg width="16" height="16" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-2.5 h-2.5 sm:w-3 sm:h-3 md:w-4 md:h-4">
            <path d="M17.2583 11.175L11.1833 17.25C11.0285 17.4045 10.8447 17.5281 10.6424 17.6142C10.4401 17.7003 10.2232 17.7473 10.0042 17.7528C9.78515 17.7584 9.56609 17.7225 9.35949 17.6468C9.15289 17.5711 8.96274 17.4571 8.79998 17.3108L2.69165 11.2025C2.54586 11.0568 2.43033 10.8822 2.35248 10.6896C2.27463 10.497 2.23615 10.2905 2.23999 10.0825V4.16667C2.23999 3.72464 2.41559 3.30072 2.72815 2.98816C3.04071 2.67559 3.46464 2.5 3.90665 2.5H9.82248C10.0304 2.49616 10.237 2.53464 10.4296 2.61249C10.6222 2.69034 10.7968 2.80587 10.9425 2.95167L17.05 9.05917C17.3625 9.37168 17.5359 9.79558 17.5359 10.2371C17.5359 10.6786 17.3625 11.1025 17.05 11.415L17.2583 11.175Z" stroke="#999999" strokeWidth="0.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M6.40002 7.5C6.62093 7.5 6.80002 7.32091 6.80002 7.1C6.80002 6.87909 6.62093 6.7 6.40002 6.7C6.1791 6.7 6.00002 6.87909 6.00002 7.1C6.00002 7.32091 6.1791 7.5 6.40002 7.5Z" stroke="#999999" strokeWidth="0.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span className="text-[rgba(0,0,0,0.8)] text-responsive-xs">Tags:</span>
        </div>
        <div className="flex flex-wrap gap-1 sm:gap-1.5">
          {['Beauty & Care', 'Hair Treatment', 'Tag Name', 'Tag Name', 'Tag Name'].map((tag, index) => (
            <span
              key={index}
              className="px-1.5 py-0.5 sm:px-2 sm:py-0.5 border border-[#B1AEA9] rounded-full text-responsive-xs text-[#595959] font-medium text-xs"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Product details */}
      <div className="mt-3 sm:mt-4 md:mt-5">
        <h3 className="font-semibold text-black mb-1 sm:mb-1.5 text-responsive-xs">Product Details:</h3>
        <p className="text-[#595959] text-responsive-xs leading-relaxed text-xs">
          One bottle of this multipurpose toner, a cult favorite, is sold every three seconds!
          As the name implies, the recipe successfully increases cell turnover. It maintains
          smooth, healthy skin by combining three different chemical exfoliants...
          <span className="text-[#006B51] font-medium cursor-pointer ml-1">Read More</span>
        </p>
      </div>
    </div>
  );
};

export default ModalProductDetails;
