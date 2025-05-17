'use client';
import React, { useState } from 'react';
import Image from 'next/image';

// Image component with fallback
const ImageWithFallback = ({ src, fallbackSrc = '/images/product-image.png', alt, ...props }) => {
  const [imgSrc, setImgSrc] = useState(src);

  return (
    <Image
      {...props}
      src={imgSrc}
      alt={alt}
      onError={() => {
        setImgSrc(fallbackSrc);
      }}
    />
  );
};

export default ImageWithFallback;