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
  return (
    <div className="w-full md:w-3/5 p-6 md:p-10">
      {/* Product title */}
      <h2 className="text-xl md:text-2xl font-semibold text-black mb-4 md:mb-5 leading-snug ">
        {product.name || "Product Quick View Title Goes To Here"}
        {product.name && product.name.length < 30 && <br />}
        {!product.name && <br />}
        {!product.name && "Product Title 2nd Line"}
      </h2>

      {/* Price */}
      <div className="mb-6">
        <p className="text-[#006B51] text-xl md:text-[22px] font-bold ">
          {product.discountPrice !== product.price ? (
            <>
              <span className="text-[#E12625] text-base md:text-lg line-through mr-2">
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
      <div className="mb-6 border-b border-gray-200 pb-6">
        <p className="text-[rgba(0,0,0,0.7)] text-[15px] mb-3  uppercase">available in:</p>
        <div className="flex flex-wrap gap-2">
          {['small', 'medium', 'large'].map((size) => (
            <button
              key={size}
              onClick={() => changeSize(size)}
              className={`px-4 py-2.5 border rounded-full text-[15px] font-semibold ${
                selectedSize === size
                  ? 'border-[#006B51] bg-[#006B51] text-white'
                  : 'border-[#B1AEA9] text-black'
              } `}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      {/* Add to cart section */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-4 flex-wrap">
          {/* Quantity selector */}
          <div className="flex items-center bg-[#F3F5F9] rounded-full h-12">
            <button
              onClick={decreaseQuantity}
              className="p-2.5 rounded-full"
              aria-label="Decrease quantity"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 10H16" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <span className="px-6 font-semibold text-lg ">{quantity}</span>
            <button
              onClick={increaseQuantity}
              className="p-2.5 rounded-full"
              aria-label="Increase quantity"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10 4V16M4 10H16" stroke="#006B51" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>

          {/* Add to cart button */}
          <button
            onClick={handleAddToCart}
            className="flex items-center justify-center gap-3 bg-[#006B51] text-white py-4 px-8 flex-1 rounded-full font-semibold hover:bg-[#005541] transition-colors tracking-widest text-base "
          >
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8.25 20.1667C8.25 20.1667 4.58333 20.1667 2.75 20.1667C0.916667 20.1667 0.916667 18.3333 0.916667 18.3333V3.66667C0.916667 3.66667 0.916667 1.83333 2.75 1.83333H19.25C19.25 1.83333 21.0833 1.83333 21.0833 3.66667V18.3333C21.0833 18.3333 21.0833 20.1667 19.25 20.1667H13.75" stroke="#E0DCD6" strokeWidth="0.1" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M0.916667 5.5H21.0833M5.5 9.16667H16.5M5.5 12.8333H12.8333" stroke="#E0DCD6" strokeWidth="0.1" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Add to Cart
          </button>
        </div>

        {/* Wishlist and Share buttons */}
        <div className="flex flex-wrap gap-4 mt-4">
          <button
            onClick={() => {
              if (productInWishlist) {
                removeFromWishlist(product.id).then(result => {
                  if (result.success) {
                    toast.success('Removed from wishlist');
                  } else {
                    toast.error(result.message || 'Failed to remove from wishlist');
                  }
                });
              } else {
                addToWishlist(product).then(result => {
                  if (result.success) {
                    toast.success('Added to wishlist');
                  } else {
                    toast.error(result.message || 'Failed to add to wishlist');
                  }
                });
              }
            }}
            className={`flex items-center justify-center gap-2 border border-[#B1AEA9] rounded-full py-3.5 px-6 font-bold tracking-widest text-base flex-1  ${
              productInWishlist ? 'bg-[#F0F7F5]' : 'bg-white'
            }`}
          >
            <svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M13 22.75C13 22.75 2.4375 16.25 2.4375 8.9375C2.4375 7.5625 2.92188 6.23438 3.80078 5.19531C4.67969 4.15625 5.89844 3.5 7.3125 3.5C9.5 3.5 11.375 4.8125 13 7C14.625 4.8125 16.5 3.5 18.6875 3.5C20.1016 3.5 21.3203 4.15625 22.1992 5.19531C23.0781 6.23438 23.5625 7.5625 23.5625 8.9375C23.5625 16.25 13 22.75 13 22.75Z" fill={productInWishlist ? "#006B51" : "#000000"} stroke={productInWishlist ? "#006B51" : "#000000"} strokeWidth="0.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Wishlist
          </button>
          <button className="flex items-center justify-center gap-2 border border-[#B1AEA9] rounded-full py-3.5 px-6 font-bold tracking-widest text-base flex-1  bg-white">
            <svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M19.5 8.9375C21.3594 8.9375 22.75 7.54688 22.75 5.6875C22.75 3.82812 21.3594 2.4375 19.5 2.4375C17.6406 2.4375 16.25 3.82812 16.25 5.6875C16.25 7.54688 17.6406 8.9375 19.5 8.9375Z" stroke="black" strokeWidth="1.625" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M6.5 16.25C8.35938 16.25 9.75 14.8594 9.75 13C9.75 11.1406 8.35938 9.75 6.5 9.75C4.64062 9.75 3.25 11.1406 3.25 13C3.25 14.8594 4.64062 16.25 6.5 16.25Z" stroke="black" strokeWidth="1.625" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M19.5 23.5625C21.3594 23.5625 22.75 22.1719 22.75 20.3125C22.75 18.4531 21.3594 17.0625 19.5 17.0625C17.6406 17.0625 16.25 18.4531 16.25 20.3125C16.25 22.1719 17.6406 23.5625 19.5 23.5625Z" stroke="black" strokeWidth="1.625" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M9.34375 14.7812L16.6562 18.5312" stroke="black" strokeWidth="1.625" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M16.6562 7.46875L9.34375 11.2188" stroke="black" strokeWidth="1.625" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Share
          </button>
        </div>
      </div>

      {/* Tags */}
      <div className="mt-8 flex flex-col">
        <div className="flex items-center gap-2 mb-3">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M17.2583 11.175L11.1833 17.25C11.0285 17.4045 10.8447 17.5281 10.6424 17.6142C10.4401 17.7003 10.2232 17.7473 10.0042 17.7528C9.78515 17.7584 9.56609 17.7225 9.35949 17.6468C9.15289 17.5711 8.96274 17.4571 8.79998 17.3108L2.69165 11.2025C2.54586 11.0568 2.43033 10.8822 2.35248 10.6896C2.27463 10.497 2.23615 10.2905 2.23999 10.0825V4.16667C2.23999 3.72464 2.41559 3.30072 2.72815 2.98816C3.04071 2.67559 3.46464 2.5 3.90665 2.5H9.82248C10.0304 2.49616 10.237 2.53464 10.4296 2.61249C10.6222 2.69034 10.7968 2.80587 10.9425 2.95167L17.05 9.05917C17.3625 9.37168 17.5359 9.79558 17.5359 10.2371C17.5359 10.6786 17.3625 11.1025 17.05 11.415L17.2583 11.175Z" stroke="#999999" strokeWidth="0.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M6.40002 7.5C6.62093 7.5 6.80002 7.32091 6.80002 7.1C6.80002 6.87909 6.62093 6.7 6.40002 6.7C6.1791 6.7 6.00002 6.87909 6.00002 7.1C6.00002 7.32091 6.1791 7.5 6.40002 7.5Z" stroke="#999999" strokeWidth="0.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span className="text-[rgba(0,0,0,0.8)] text-[15px] ">Tags:</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {['Beauty & Care', 'Hair Treatment', 'Tag Name', 'Tag Name', 'Tag Name'].map((tag, index) => (
            <span
              key={index}
              className="px-3 py-1.5 border border-[#B1AEA9] rounded-full text-sm text-[#595959] font-medium "
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Product details */}
      <div className="mt-8">
        <h3 className="font-semibold text-black mb-3 text-[16px] ">Product Details:</h3>
        <p className="text-[#595959] text-sm leading-[1.85] ">
          One bottle of this multipurpose toner, a cult favorite, is sold every three seconds!
          As the name implies, the recipe successfully increases cell turnover. It maintains
          smooth, healthy skin by combining three different chemical exfoliants (AHAs, BHAs, and PHAs)
          with papaya and witch hazel..
          <span className="text-[#006B51] font-medium cursor-pointer ml-1">Read More</span>
        </p>
      </div>
    </div>
  );
};

export default ModalProductDetails;
