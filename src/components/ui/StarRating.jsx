import React from 'react';
import { getResponsiveTextClass } from '@/utils/responsiveUtils';

/**
 * A reusable star rating component that displays stars based on a rating value
 * 
 * @param {Object} props - Component props
 * @param {number} props.rating - Rating value (0-5)
 * @param {number} props.reviewCount - Number of reviews (optional)
 * @param {string} props.size - Size of stars ('xs', 'sm', 'md', 'lg')
 * @param {boolean} props.showCount - Whether to show the review count
 * @returns {JSX.Element}
 */
const StarRating = ({ 
  rating = 0, 
  reviewCount = 0, 
  size = 'md', 
  showCount = true 
}) => {
  // Ensure rating is between 0 and 5
  const normalizedRating = Math.min(5, Math.max(0, rating));
  
  // Determine star size based on the size prop
  const starSizes = {
    'xs': { width: 12, height: 12 },
    'sm': { width: 14, height: 14 },
    'md': { width: 16, height: 16 },
    'lg': { width: 20, height: 20 }
  };
  
  const { width, height } = starSizes[size] || starSizes.md;
  
  // Generate 5 stars
  const stars = Array.from({ length: 5 }).map((_, index) => {
    // Determine if star should be filled, half-filled, or empty
    let fill = 'none';
    if (index + 1 <= normalizedRating) {
      fill = '#FDC040'; // Fully filled
    } else if (index + 0.5 <= normalizedRating) {
      fill = 'url(#half-fill)'; // Half filled
    }
    
    return (
      <svg
        key={index}
        width={width}
        height={height}
        viewBox="0 0 24 24"
        fill={fill}
        stroke="#FDC040"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="mr-0.5"
      >
        <defs>
          <linearGradient id="half-fill" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="50%" stopColor="#FDC040" />
            <stop offset="50%" stopColor="transparent" />
          </linearGradient>
        </defs>
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
      </svg>
    );
  });

  return (
    <div className="flex items-center gap-1 sm:gap-2">
      <div className="flex">{stars}</div>
      {showCount && reviewCount > 0 && (
        <span className={`text-[#B6B6B6] ${getResponsiveTextClass('xs')}`}>
          ({normalizedRating.toFixed(1)})
        </span>
      )}
    </div>
  );
};

export default StarRating;
