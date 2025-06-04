'use client';

import React from 'react';
import { jsonToSlateValue, textToSlateValue } from './SlateUtils';

// Text component that handles formatting
const FormattedText = ({ node, className = '' }) => {
  let content = node.text || '';
  
  if (node.bold) {
    content = <strong className="font-semibold">{content}</strong>;
  }
  
  if (node.italic) {
    content = <em className="italic">{content}</em>;
  }
  
  if (node.underline) {
    content = <u className="underline">{content}</u>;
  }
  
  return <span className={className}>{content}</span>;
};

// Element renderer that matches your website's styling
const RenderElement = ({ element, className = '' }) => {
  const renderChildren = () => {
    if (!element.children || !Array.isArray(element.children)) {
      return null;
    }
    
    return element.children.map((child, index) => {
      if (child.text !== undefined) {
        // This is a text node
        return <FormattedText key={index} node={child} className={className} />;
      } else {
        // This is an element node
        return <RenderElement key={index} element={child} className={className} />;
      }
    });
  };

  switch (element.type) {
    case 'heading-one':
      return (
        <h1 className={`text-lg sm:text-xl font-bold mb-2 sm:mb-3 text-[#253D4E] ${className}`}>
          {renderChildren()}
        </h1>
      );
      
    case 'heading-two':
      return (
        <h2 className={`text-base sm:text-lg font-semibold mb-2 text-[#253D4E] ${className}`}>
          {renderChildren()}
        </h2>
      );
      
    case 'bulleted-list':
      return (
        <ul className={`list-disc pl-4 sm:pl-6 mb-2 sm:mb-3 space-y-1 ${className}`}>
          {renderChildren()}
        </ul>
      );
      
    case 'numbered-list':
      return (
        <ol className={`list-decimal pl-4 sm:pl-6 mb-2 sm:mb-3 space-y-1 ${className}`}>
          {renderChildren()}
        </ol>
      );
      
    case 'list-item':
      return (
        <li className={`text-[#7E7E7E] text-sm sm:text-base ${className}`}>
          {renderChildren()}
        </li>
      );
      
    case 'paragraph':
    default:
      return (
        <p className={`mb-2 sm:mb-3 text-[#7E7E7E] text-sm sm:text-base leading-relaxed ${className}`}>
          {renderChildren()}
        </p>
      );
  }
};

// Main SlateRenderer component
const SlateRenderer = ({ content, className = '' }) => {
  // Handle empty or null content
  if (!content) {
    return (
      <p className={`text-[#7E7E7E] text-sm sm:text-base ${className}`}>
        No description available.
      </p>
    );
  }

  let slateValue;
  
  try {
    if (typeof content === 'string') {
      // Try to parse as JSON first
      try {
        const parsed = JSON.parse(content);
        if (Array.isArray(parsed) && parsed.length > 0) {
          slateValue = parsed;
        } else {
          // If it's not a valid Slate array, treat as plain text
          slateValue = textToSlateValue(content);
        }
      } catch {
        // If JSON parsing fails, treat as plain text
        slateValue = textToSlateValue(content);
      }
    } else if (Array.isArray(content)) {
      slateValue = content;
    } else {
      // Fallback for any other type
      slateValue = textToSlateValue(String(content));
    }
  } catch (error) {
    console.error('Error processing Slate content:', error);
    return (
      <p className={`text-[#7E7E7E] text-sm sm:text-base ${className}`}>
        Error displaying content.
      </p>
    );
  }

  // Render the Slate content
  return (
    <div className={`slate-content ${className}`}>
      {slateValue.map((element, index) => (
        <RenderElement key={index} element={element} className="" />
      ))}
    </div>
  );
};

export default SlateRenderer;
