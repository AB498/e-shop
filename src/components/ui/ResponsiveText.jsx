'use client';
import React from 'react';

/**
 * A responsive text component that adapts font size to different screen sizes
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - The content to be rendered
 * @param {string} props.className - Additional CSS classes
 * @param {string} props.as - The HTML element to render as (default: 'p')
 * @param {string} props.size - Text size variant: 'xs', 'sm', 'base', 'lg', 'xl', '2xl', '3xl', '4xl' (default: 'base')
 * @param {boolean} props.responsive - Whether to use responsive text sizing (default: true)
 * @param {string} props.id - Optional ID for the text element
 * @returns {JSX.Element}
 */
export default function ResponsiveText({
  children,
  className = '',
  as: Component = 'p',
  size = 'base',
  responsive = true,
  id,
  ...props
}) {
  // Determine text size classes based on size prop and responsive flag
  const getTextSizeClass = () => {
    if (!responsive) {
      return `text-${size}`;
    }
    
    // Use responsive text classes
    switch (size) {
      case 'xs':
        return 'text-responsive-xs';
      case 'sm':
        return 'text-responsive';
      case 'base':
        return 'text-responsive';
      case 'lg':
        return 'text-responsive-lg';
      case 'xl':
        return 'text-responsive-xl';
      case '2xl':
        return 'text-responsive-2xl';
      case '3xl':
        return 'text-responsive-3xl';
      case '4xl':
        return 'text-responsive-4xl';
      default:
        return 'text-responsive';
    }
  };

  // Combine classes
  const textClasses = `${getTextSizeClass()} ${className}`.trim();

  return (
    <Component id={id} className={textClasses} {...props}>
      {children}
    </Component>
  );
}
