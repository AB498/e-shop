'use client';
import React from 'react';

/**
 * A responsive spacer component that adds vertical or horizontal space
 * 
 * @param {Object} props
 * @param {string} props.size - Space size: 'xs', 'sm', 'md', 'lg', 'xl', '2xl' (default: 'md')
 * @param {string} props.axis - Direction of spacing: 'vertical' or 'horizontal' (default: 'vertical')
 * @param {string} props.className - Additional CSS classes
 * @param {string} props.style - Additional inline styles
 * @returns {JSX.Element}
 */
export default function Spacer({
  size = 'md',
  axis = 'vertical',
  className = '',
  style = {},
  ...props
}) {
  // CSS variables for responsive spacing
  const getSpacerSize = () => {
    switch (size) {
      case 'xs':
        return 'var(--space-xs)';
      case 'sm':
        return 'var(--space-sm)';
      case 'md':
        return 'var(--space-md)';
      case 'lg':
        return 'var(--space-lg)';
      case 'xl':
        return 'var(--space-xl)';
      case '2xl':
        return 'var(--space-2xl)';
      default:
        return 'var(--space-md)';
    }
  };

  const width = axis === 'vertical' ? '1px' : getSpacerSize();
  const height = axis === 'horizontal' ? '1px' : getSpacerSize();
  
  return (
    <div
      className={`block ${className}`}
      style={{
        width,
        height,
        minWidth: width,
        minHeight: height,
        ...style,
      }}
      {...props}
    />
  );
}
