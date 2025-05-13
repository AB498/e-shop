'use client';
import React from 'react';

/**
 * A responsive container component that adapts to different screen sizes
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - The content to be rendered inside the container
 * @param {string} props.className - Additional CSS classes
 * @param {string} props.as - The HTML element to render as (default: 'div')
 * @param {string} props.size - Container size variant: 'narrow', 'content', 'wide', or 'full' (default: 'content')
 * @param {boolean} props.fluid - Whether the container should have fluid padding
 * @param {string} props.id - Optional ID for the container
 * @returns {JSX.Element}
 */
export default function ResponsiveContainer({
  children,
  className = '',
  as: Component = 'div',
  size = 'content',
  fluid = true,
  id,
  ...props
}) {
  // Determine max-width based on size prop
  const sizeClasses = {
    narrow: 'max-w-narrow',
    content: 'max-w-content',
    wide: 'max-w-wide',
    full: 'max-w-full',
  };

  // Combine classes - more compact padding on all screens
  const containerClasses = `
    w-full
    mx-auto
    ${fluid ? 'px-2 sm:px-3 md:px-4 lg:px-6' : ''}
    ${sizeClasses[size] || sizeClasses.content}
    ${className}
  `.trim();

  return (
    <Component id={id} className={containerClasses} {...props}>
      {children}
    </Component>
  );
}
