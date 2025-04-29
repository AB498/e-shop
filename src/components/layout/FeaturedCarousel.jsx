"use client";

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';

const FeaturedCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(1); // Start with slide 1 active
  const totalSlides = 3;
  const autoPlayRef = useRef(null);
  const intervalTime = 5000; // 5 seconds

  // Define slides with actual images (16:9 aspect ratio)
  const slides = [
    {
      id: 0,
      image: '/images/carousel/slide-1.png',
      alt: 'Featured Slide 1'
    },
    {
      id: 1,
      image: '/images/carousel/slide-2.png',
      alt: 'Featured Slide 2'
    },
    {
      id: 2,
      image: '/images/carousel/slide-3.png',
      alt: 'Featured Slide 3'
    }
  ];

  // Auto play functionality
  useEffect(() => {
    autoPlayRef.current = nextSlide;
  });

  useEffect(() => {
    const play = () => {
      autoPlayRef.current();
    };

    const interval = setInterval(play, intervalTime);
    return () => clearInterval(interval);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === totalSlides - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? totalSlides - 1 : prev - 1));
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  // Calculate positions for all slides
  const getSlideStyle = (index) => {
    const isCurrent = index === currentSlide;

    // Calculate the distance from current slide (with wrapping)
    let distance = index - currentSlide;
    if (distance > totalSlides / 2) distance -= totalSlides;
    if (distance < -totalSlides / 2) distance += totalSlides;

    // Base styles
    const baseZIndex = 10;
    const baseScale = 0.85;
    const activeScale = 1.0;
    const baseOpacity = 0.7;

    // Calculate final values based on distance
    const zIndex = baseZIndex + (10 * (3 - Math.abs(distance)));
    let scale = isCurrent ? activeScale : baseScale;
    let opacity = isCurrent ? 1 : baseOpacity;

    // Only show 3 cards at most (current, 1 before, 1 after)
    if (Math.abs(distance) > 1) {
      opacity = 0;
      scale = 0;
    }

    // Position cards horizontally
    const translateX = distance * 350; // Wider spacing for 16:9 images

    return {
      zIndex,
      opacity,
      transform: `translateX(${translateX}px) scale(${scale})`,
      transition: 'all 0.5s ease-in-out'
    };
  };

  return (
    <div className="relative w-full h-[300px] mb-10 mt-6 overflow-visible">
      {/* Carousel Container */}
      <div className="absolute inset-0 flex items-center justify-center">
        {/* All Slides */}
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className="absolute"
            style={getSlideStyle(index)}
          >
            <div
              onClick={() => goToSlide(index)}
              className="relative w-[480px] h-[270px] rounded-lg shadow-lg overflow-hidden cursor-pointer"
              aria-label={`Go to slide ${index + 1}`}
            >
              <Image
                src={slide.image}
                alt={slide.alt}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 480px"
                priority={index === currentSlide}
              />
              {/* Optional overlay for inactive slides */}
              {index !== currentSlide && (
                <div className="absolute inset-0 bg-black bg-opacity-20"></div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows - Positioned outside the component */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 z-40 bg-white w-12 h-12 rounded-full flex items-center justify-center shadow-md hover:bg-gray-100 transition-colors"
        aria-label="Previous slide"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 z-40 bg-white w-12 h-12 rounded-full flex items-center justify-center shadow-md hover:bg-gray-100 transition-colors"
        aria-label="Next slide"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Pagination Indicators */}
      <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 z-40 flex space-x-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all ${
              index === currentSlide
                ? 'bg-black'
                : 'bg-gray-400'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default FeaturedCarousel;