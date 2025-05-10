/**
 * Utility functions for responsive design
 */

/**
 * Returns responsive text size classes based on the desired size
 * Uses smaller text on mobile and scales up for larger screens
 * 
 * @param {string} size - The base size: 'xs', 'sm', 'base', 'lg', 'xl', '2xl', '3xl', '4xl'
 * @param {Object} options - Additional options
 * @param {boolean} options.fluid - Whether to use fluid sizing with clamp (default: true)
 * @param {string} options.color - Optional text color class
 * @param {string} options.weight - Optional font weight class
 * @param {string} options.additionalClasses - Optional additional classes
 * @returns {string} - Tailwind classes for responsive text
 */
export function getResponsiveTextClass(size = 'base', options = {}) {
  const { fluid = true, color = '', weight = '', additionalClasses = '' } = options;
  
  // Mobile-first approach with smaller text on mobile
  const sizeMap = {
    'xs': fluid ? 'text-xs' : 'text-mobile-xs md:text-xs',
    'sm': fluid ? 'text-sm' : 'text-mobile-sm md:text-sm',
    'base': fluid ? 'text-base' : 'text-mobile-base md:text-base',
    'lg': fluid ? 'text-lg' : 'text-mobile-lg md:text-lg',
    'xl': 'text-lg md:text-xl',
    '2xl': 'text-xl md:text-2xl',
    '3xl': 'text-2xl md:text-3xl',
    '4xl': 'text-3xl md:text-4xl',
  };
  
  const textSizeClass = sizeMap[size] || sizeMap.base;
  const textColorClass = color ? `${color}` : '';
  const fontWeightClass = weight ? `${weight}` : '';
  
  return `${textSizeClass} ${textColorClass} ${fontWeightClass} ${additionalClasses}`.trim();
}

/**
 * Returns responsive spacing classes based on the desired size
 * Uses smaller spacing on mobile and scales up for larger screens
 * 
 * @param {string} type - The type of spacing: 'p' (padding), 'm' (margin), 'gap'
 * @param {string} size - The size: 'xs', 'sm', 'md', 'lg', 'xl', '2xl'
 * @param {string} direction - Optional direction: 'x', 'y', 't', 'r', 'b', 'l'
 * @returns {string} - Tailwind classes for responsive spacing
 */
export function getResponsiveSpacingClass(type = 'p', size = 'md', direction = '') {
  // Mobile-first approach with smaller spacing on mobile
  const sizeMap = {
    'xs': {
      'p': 'p-1 md:p-2',
      'm': 'm-1 md:m-2',
      'gap': 'gap-1 md:gap-2',
    },
    'sm': {
      'p': 'p-2 md:p-3',
      'm': 'm-2 md:m-3',
      'gap': 'gap-2 md:gap-3',
    },
    'md': {
      'p': 'p-3 md:p-4',
      'm': 'm-3 md:m-4',
      'gap': 'gap-3 md:gap-4',
    },
    'lg': {
      'p': 'p-4 md:p-6',
      'm': 'm-4 md:m-6',
      'gap': 'gap-4 md:gap-6',
    },
    'xl': {
      'p': 'p-6 md:p-8',
      'm': 'm-6 md:m-8',
      'gap': 'gap-6 md:gap-8',
    },
    '2xl': {
      'p': 'p-8 md:p-10',
      'm': 'm-8 md:m-10',
      'gap': 'gap-8 md:gap-10',
    },
  };
  
  // If direction is specified, modify the class names
  if (direction && (type === 'p' || type === 'm')) {
    const baseClasses = sizeMap[size]?.[type] || '';
    return baseClasses.replace(new RegExp(`${type}-`, 'g'), `${type}${direction}-`);
  }
  
  return sizeMap[size]?.[type] || '';
}
