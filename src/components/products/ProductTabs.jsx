'use client';
import React from 'react';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { toast } from 'react-hot-toast';
import SlateRenderer from '@/components/ui/slate/SlateRenderer';

const ProductTabs = ({ description, sku, type, productId, product }) => {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState('description');
  const [reviews, setReviews] = useState([]);
  const [reviewStats, setReviewStats] = useState({ averageRating: 0.0, totalReviews: 0 });
  const [userCanReview, setUserCanReview] = useState(false);
  const [hasReviewed, setHasReviewed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [reviewFormData, setReviewFormData] = useState({
    rating: 0,
    title: '',
    reviewText: ''
  });
  const [submitting, setSubmitting] = useState(false);



  // Product specifications using real data - only show fields with actual values
  const specifications = [
    ...(sku ? [{ label: "SKU", value: sku }] : []),
    ...(type || product?.type ? [{ label: "Type", value: type || product?.type }] : []),
    ...(product?.brand ? [{ label: "Brand", value: product?.brand }] : []),
    ...(product?.material ? [{ label: "Material", value: product?.material }] : []),
    ...(product?.originCountry ? [{ label: "Origin Country", value: product?.originCountry }] : []),
    ...(product?.mfgDate ? [{ label: "Manufacturing Date", value: product?.mfgDate }] : []),
    ...(product?.lifespan ? [{ label: "Lifespan", value: product?.lifespan }] : []),
    ...(product?.sizes && product.sizes.length > 0 ? [{ label: "Available Sizes", value: product.sizes.join(", ") }] : []),
    ...(product?.colors && product.colors.length > 0 ? [{ label: "Available Colors", value: product.colors.join(", ") }] : []),
    ...(product?.tags && product.tags.length > 0 ? [{ label: "Tags", value: product.tags.join(", ") }] : []),
  ];

  // Fetch reviews when the component mounts or when the productId changes
  useEffect(() => {
    if (productId) {
      fetchReviews();
    }
  }, [productId]);

  // Fetch reviews from the API
  const fetchReviews = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/products/${productId}/reviews`);
      if (!response.ok) {
        throw new Error('Failed to fetch reviews');
      }

      const data = await response.json();
      setReviews(data.reviews || []);

      // Ensure we have the correct data types for reviewStats
      const stats = data.stats || { averageRating: 0.0, totalReviews: 0 };
      setReviewStats({
        averageRating: typeof stats.averageRating === 'number' ? stats.averageRating : parseFloat(stats.averageRating || 0),
        totalReviews: typeof stats.totalReviews === 'number' ? stats.totalReviews : parseInt(stats.totalReviews || 0),
        distribution: stats.distribution || {}
      });

      setUserCanReview(data.userCanReview || false);
      setHasReviewed(data.hasReviewed || false);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      toast.error('Failed to load reviews');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle review form input changes
  const handleReviewInputChange = (e) => {
    const { name, value } = e.target;
    setReviewFormData({
      ...reviewFormData,
      [name]: value
    });
  };

  // Handle star rating click
  const handleRatingClick = (rating) => {
    setReviewFormData({
      ...reviewFormData,
      rating
    });
  };

  // Submit a review
  const submitReview = async (e) => {
    e.preventDefault();

    if (!session) {
      toast.error('Please sign in to leave a review');
      return;
    }

    if (reviewFormData.rating === 0) {
      toast.error('Please select a rating');
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch(`/api/products/${productId}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(reviewFormData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to submit review');
      }

      // Reset form and refresh reviews
      setReviewFormData({
        rating: 0,
        title: '',
        reviewText: ''
      });

      toast.success('Review submitted successfully');
      fetchReviews();
    } catch (error) {
      console.error('Error submitting review:', error);
      toast.error(error.message || 'Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="bg-white rounded-md p-3 sm:p-4 shadow-sm mb-3 sm:mb-4 border border-[#DEDEDE]">
      {/* Tab Navigation */}
      <div className="flex flex-wrap gap-2 mb-4 sm:mb-5">
        <button
          onClick={() => setActiveTab('description')}
          className={`py-1.5 sm:py-2 px-3 sm:px-4 rounded-full bg-white font-semibold text-sm sm:text-base border border-[#ECECEC] transition-all ${
            activeTab === 'description'
              ? 'text-[#3BB77E] shadow-sm'
              : 'text-[#7E7E7E] hover:bg-[#F9F9F9]'
          }`}
        >
          Description
        </button>
        <button
          onClick={() => setActiveTab('additional')}
          className={`py-1.5 sm:py-2 px-3 sm:px-4 rounded-full bg-white font-semibold text-sm sm:text-base border border-[#ECECEC] transition-all ${
            activeTab === 'additional'
              ? 'text-[#3BB77E] shadow-sm'
              : 'text-[#7E7E7E] hover:bg-[#F9F9F9]'
          }`}
        >
          Additional info
        </button>
        <button
          onClick={() => setActiveTab('vendor')}
          className={`py-1.5 sm:py-2 px-3 sm:px-4 rounded-full bg-white font-semibold text-sm sm:text-base border border-[#ECECEC] transition-all ${
            activeTab === 'vendor'
              ? 'text-[#3BB77E] shadow-sm'
              : 'text-[#7E7E7E] hover:bg-[#F9F9F9]'
          }`}
        >
          Vendor
        </button>
        <button
          onClick={() => setActiveTab('reviews')}
          className={`py-1.5 sm:py-2 px-3 sm:px-4 rounded-full bg-white font-semibold text-sm sm:text-base border border-[#ECECEC] transition-all ${
            activeTab === 'reviews'
              ? 'text-[#3BB77E] shadow-sm'
              : 'text-[#7E7E7E] hover:bg-[#F9F9F9]'
          }`}
        >
          Reviews ({reviewStats.totalReviews || 0})
        </button>
      </div>

      {/* Description Tab */}
      {activeTab === 'description' && (
        <div className="text-[#7E7E7E]">
          <div className="mb-2 sm:mb-3">
            <SlateRenderer content={description} />
          </div>

          {/* Product Specifications */}
          <div className="mb-3 sm:mb-4 border-t border-[#7E7E7E] border-opacity-25 pt-3 sm:pt-4 ">
            {specifications.map((spec, index) => (
              <div key={index} className="flex mb-1.5">
                <span className="text-[#7E7E7E] text-xs sm:text-sm font-normal w-1/3">{spec.label}</span>
                <span className="text-[#7E7E7E] text-xs sm:text-sm font-normal bg-[#9B9B9B] bg-opacity-10 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded">{spec.value}</span>
              </div>
            ))}
          </div>

        </div>
      )}

      {/* Additional Info Tab */}
      {activeTab === 'additional' && (
        <div className="text-[#7E7E7E]">
          <h3 className="text-[#253D4E] text-lg sm:text-xl font-semibold mb-2 sm:mb-3">Additional Information</h3>
          <div className="mb-3 sm:mb-4">
            {specifications.map((spec, index) => (
              <div key={index} className="flex mb-1.5 border-b border-[#ECECEC] pb-1.5">
                <span className="text-[#7E7E7E] text-xs sm:text-sm font-semibold w-1/3">{spec.label}</span>
                <span className="text-[#7E7E7E] text-xs sm:text-sm">{spec.value}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Vendor Tab */}
      {activeTab === 'vendor' && (
        <div className="text-[#7E7E7E]">
          <h3 className="text-[#253D4E] text-lg sm:text-xl font-semibold mb-2 sm:mb-3">Vendor Information</h3>
          <div className="mb-3 sm:mb-4">
            {product?.brand && (
              <div className="flex mb-1.5 border-b border-[#ECECEC] pb-1.5">
                <span className="text-[#7E7E7E] text-xs sm:text-sm font-semibold w-1/3">Brand</span>
                <span className="text-[#7E7E7E] text-xs sm:text-sm">{product.brand}</span>
              </div>
            )}
            <div className="flex mb-1.5 border-b border-[#ECECEC] pb-1.5">
              <span className="text-[#7E7E7E] text-xs sm:text-sm font-semibold w-1/3">Store Name</span>
              <span className="text-[#7E7E7E] text-xs sm:text-sm">Thai Bangla Store</span>
            </div>
            {product?.originCountry && (
              <div className="flex mb-1.5 border-b border-[#ECECEC] pb-1.5">
                <span className="text-[#7E7E7E] text-xs sm:text-sm font-semibold w-1/3">Origin Country</span>
                <span className="text-[#7E7E7E] text-xs sm:text-sm">{product.originCountry}</span>
              </div>
            )}
            {product?.material && (
              <div className="flex mb-1.5 border-b border-[#ECECEC] pb-1.5">
                <span className="text-[#7E7E7E] text-xs sm:text-sm font-semibold w-1/3">Material</span>
                <span className="text-[#7E7E7E] text-xs sm:text-sm">{product.material}</span>
              </div>
            )}
            {product?.mfgDate && (
              <div className="flex mb-1.5 border-b border-[#ECECEC] pb-1.5">
                <span className="text-[#7E7E7E] text-xs sm:text-sm font-semibold w-1/3">Manufacturing Date</span>
                <span className="text-[#7E7E7E] text-xs sm:text-sm">{product.mfgDate}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Reviews Tab */}
      {activeTab === 'reviews' && (
        <div className="text-[#7E7E7E]">
          <h3 className="text-[#253D4E] text-lg sm:text-xl font-semibold mb-2 sm:mb-3">Customer Reviews</h3>

          {/* Review Stats */}
          <div className="mb-4 bg-[#F9F9F9] p-3 sm:p-4 rounded-md">
            <div className="flex items-center mb-2">
              <div className="text-2xl font-bold text-[#253D4E] mr-2">
                {reviewStats.averageRating ? parseFloat(reviewStats.averageRating).toFixed(1) : '0.0'}
              </div>
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill={i < Math.round(parseFloat(reviewStats.averageRating || 0)) ? "#FDC040" : "none"}
                    stroke="#FDC040"
                    className="mr-0.5"
                  >
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                ))}
              </div>
              <div className="ml-2 text-sm text-[#7E7E7E]">
                ({reviewStats.totalReviews || 0} {reviewStats.totalReviews === 1 ? 'review' : 'reviews'})
              </div>
            </div>
          </div>

          {/* Reviews List */}
          <div className="mb-3 sm:mb-4">
            {isLoading ? (
              <div className="flex justify-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#3BB77E]"></div>
              </div>
            ) : reviews.length > 0 ? (
              reviews.map((review) => (
                <div key={review.id} className="mb-3 border-b border-[#ECECEC] pb-2 sm:pb-3">
                  <div className="flex justify-between mb-1">
                    <span className="text-[#253D4E] text-xs sm:text-sm font-semibold">{review.userName}</span>
                    <span className="text-[#B6B6B6] text-[10px] sm:text-xs">{formatDate(review.createdAt)}</span>
                  </div>
                  {review.title && (
                    <div className="text-[#253D4E] text-xs sm:text-sm font-medium mb-1">{review.title}</div>
                  )}
                  <div className="flex mb-1">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                        fill={i < review.rating ? "#FDC040" : "none"}
                        stroke="#FDC040"
                        className="mr-0.5"
                      >
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    ))}
                    {review.verifiedPurchase && (
                      <span className="ml-2 text-[10px] text-[#3BB77E] bg-[#E8F8F1] px-1 py-0.5 rounded">Verified Purchase</span>
                    )}
                  </div>
                  <p className="text-[#7E7E7E] text-xs sm:text-sm">{review.reviewText}</p>
                </div>
              ))
            ) : (
              <div className="text-center py-4 text-[#7E7E7E]">
                No reviews yet. Be the first to review this product!
              </div>
            )}
          </div>

          {/* Review Form */}
          {userCanReview ? (
            <div className="bg-[#F9F9F9] p-3 sm:p-4 rounded-md">
              <h4 className="text-[#253D4E] text-sm sm:text-base font-semibold mb-2 sm:mb-3">Add a review</h4>
              <p className="text-[#7E7E7E] text-xs sm:text-sm mb-2 sm:mb-3">
                Share your experience with this product. Required fields are marked *
              </p>

              <form onSubmit={submitReview}>
                <div className="flex items-center mb-2 sm:mb-3">
                  <span className="text-[#7E7E7E] text-xs sm:text-sm mr-1.5">Your rating *</span>
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill={i < reviewFormData.rating ? "#FDC040" : "none"}
                        stroke="#FDC040"
                        className="mr-0.5 cursor-pointer hover:fill-[#FDC040]"
                        onClick={() => handleRatingClick(i + 1)}
                      >
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    ))}
                  </div>
                </div>

                <div className="mb-2 sm:mb-3">
                  <label className="block text-[#7E7E7E] text-xs sm:text-sm mb-1">Review title</label>
                  <input
                    type="text"
                    name="title"
                    value={reviewFormData.title}
                    onChange={handleReviewInputChange}
                    className="w-full border border-[#ECECEC] rounded text-xs sm:text-sm p-1.5 sm:p-2 focus:outline-none focus:border-[#3BB77E]"
                    placeholder="Give your review a title"
                  />
                </div>

                <div className="mb-2 sm:mb-3">
                  <label className="block text-[#7E7E7E] text-xs sm:text-sm mb-1">Your review *</label>
                  <textarea
                    name="reviewText"
                    value={reviewFormData.reviewText}
                    onChange={handleReviewInputChange}
                    className="w-full border border-[#ECECEC] rounded text-xs sm:text-sm p-2 focus:outline-none focus:border-[#3BB77E]"
                    rows="3"
                    placeholder="What did you like or dislike? What did you use this product for?"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className={`bg-[#3BB77E] text-white text-xs sm:text-sm font-semibold py-1.5 sm:py-2 px-3 sm:px-4 rounded-full hover:bg-[#2A9D6E] transition-colors ${submitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                  {submitting ? 'Submitting...' : 'Submit Review'}
                </button>
              </form>
            </div>
          ) : hasReviewed ? (
            <div className="bg-[#F9F9F9] p-3 sm:p-4 rounded-md text-center">
              <p className="text-[#3BB77E] font-medium">Thank you! You've already reviewed this product.</p>
            </div>
          ) : !session ? (
            <div className="bg-[#F9F9F9] p-3 sm:p-4 rounded-md text-center">
              <p className="text-[#7E7E7E] mb-2">Please sign in to leave a review.</p>
              <a href="/auth/login" className="text-[#3BB77E] font-medium hover:underline">Sign in</a>
            </div>
          ) : (
            <div className="bg-[#F9F9F9] p-3 sm:p-4 rounded-md text-center">
              <p className="text-[#7E7E7E]">Only customers who have purchased this product can leave a review.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProductTabs;
