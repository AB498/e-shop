"use client";

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { getActivePromotions } from '@/lib/actions/promotions';

const FeaturedCarousel = ({ initialPromotions = [] }) => {
  const [currentSlide, setCurrentSlide] = useState(1); // Start with slide 1 active
  const [slides, setSlides] = useState(initialPromotions);
  const totalSlides = slides.length;
  const autoPlayRef = useRef(null);
  const containerRef = useRef(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const intervalTime = 5000; // 5 seconds

  // Fetch promotions if none were provided
  useEffect(() => {
    const fetchPromotions = async () => {
      try {
        // Check if we have initial promotions
        if (initialPromotions && initialPromotions.length > 0) {
          console.log('Using server-provided promotions:', initialPromotions);
          setSlides(initialPromotions);
          return;
        }

        // If no initial promotions, fetch from client side
        console.log('No initial promotions, fetching from client side');
        const promotions = await getActivePromotions('carousel', 'home', 5);

        if (promotions && promotions.length > 0) {
          console.log('Fetched promotions from client side:', promotions);
          setSlides(promotions);
        } else {
          console.log('No promotions found, using default slides');
          // Fallback to default slides if no promotions found
          setSlides([
            {
              id: 0,
              title: 'Featured Slide 1',
              image_url: '/images/carousel/slide-1.png',
            },
            {
              id: 1,
              title: 'Featured Slide 2',
              image_url: '/images/carousel/slide-2.png',
            },
            {
              id: 2,
              title: 'Featured Slide 3',
              image_url: '/images/carousel/slide-3.png',
            }
          ]);
        }
      } catch (error) {
        console.error('Error fetching promotions:', error);
        // Fallback to default slides on error
        setSlides([
          {
            id: 0,
            title: 'Featured Slide 1',
            image_url: '/images/carousel/slide-1.png',
          },
          {
            id: 1,
            title: 'Featured Slide 2',
            image_url: '/images/carousel/slide-2.png',
          },
          {
            id: 2,
            title: 'Featured Slide 3',
            image_url: '/images/carousel/slide-3.png',
          }
        ]);
      }
    };

    fetchPromotions();
  }, [initialPromotions]);

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

  // Update container width and check device type on mount and resize
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
      }
      // Check if we're on a mobile device (width less than 640px - sm breakpoint in Tailwind)
      setIsMobile(window.innerWidth < 640);
    };

    // Initial measurement
    updateDimensions();

    // Add resize listener
    window.addEventListener('resize', updateDimensions);

    // Cleanup
    return () => window.removeEventListener('resize', updateDimensions);
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

  // Handle touch events for swipe functionality
  const handleTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 50) {
      // Swipe left, go to next slide
      nextSlide();
    }

    if (touchStart - touchEnd < -50) {
      // Swipe right, go to previous slide
      prevSlide();
    }

    // Reset values
    setTouchStart(0);
    setTouchEnd(0);
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
    const baseScale = 0.9;
    const activeScale = 1.1;
    const baseOpacity = 0.7;

    // Mobile view - show only one slide at a time with animation
    if (isMobile) {
      // For non-current slides, position them off-screen based on their distance
      if (!isCurrent) {
        // Position slides to the left or right based on their distance from current
        const direction = distance > 0 ? 1 : -1;
        return {
          zIndex: 10 - Math.abs(distance),
          opacity: 0.1, // Keep slight opacity for animation effect
          transform: `translateX(${direction * 100}%)`, // Move off-screen
          transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.5s ease',
          pointerEvents: 'none' // Prevent interaction with hidden slides
        };
      }

      // Current slide takes full width on mobile with animation
      return {
        zIndex: 20,
        opacity: 1,
        transform: 'translateX(0)',
        transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.5s ease'
      };
    }

    // Desktop view - show multiple slides
    // Calculate final values based on distance
    const zIndex = baseZIndex + (10 * (3 - Math.abs(distance)));
    let scale = isCurrent ? activeScale : baseScale;
    let opacity = isCurrent ? 1 : baseOpacity;

    // Only show 3 cards at most (current, 1 before, 1 after)
    if (Math.abs(distance) > 1) {
      opacity = 0;
      scale = 0;
    }

    // Position cards horizontally - responsive calculation
    // Use a percentage of container width or fallback to a reasonable default
    const slideWidth = containerWidth ? containerWidth / 3 : 350; // Each slide takes ~1/3 of container
    const translateX = distance * slideWidth;

    return {
      zIndex,
      opacity,
      transform: `translateX(${translateX}px) scale(${scale})`,
      transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.5s ease'
    };
  };

  return (
    <div className="relative w-full mb-10 mt-6 overflow-visible">
      {/* Carousel Container */}
      <div
        ref={containerRef}
        className="w-full aspect-video max-h-[480px] inset-0 flex items-center justify-center relative"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* All Slides */}
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute ${isMobile ? 'w-full' : 'w-[40%]'} aspect-video`}
            style={getSlideStyle(index)}
          >
            <div
              onClick={() => goToSlide(index)}
              className="relative w-full h-full rounded-lg shadow-lg overflow-hidden cursor-pointer"
              aria-label={`Go to slide ${index + 1}`}
            >
              {slide.link_url && (
                <Link href={slide.link_url} className="absolute inset-0 z-20" aria-label={slide.title || `Promotion ${index + 1}`} />
              )}
              <Image
                src={slide.image_url}
                alt={slide.title || 'Promotional slide'}
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
        className="flex absolute left-2 sm:-left-4 top-1/2 transform -translate-y-1/2 z-40 bg-white w-8 h-8 sm:w-12 sm:h-12 rounded-full items-center justify-center shadow-md hover:bg-gray-100 transition-colors"
        aria-label="Previous slide"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <button
        onClick={nextSlide}
        className="flex absolute right-2 sm:-right-4 top-1/2 transform -translate-y-1/2 z-40 bg-white w-8 h-8 sm:w-12 sm:h-12 rounded-full items-center justify-center shadow-md hover:bg-gray-100 transition-colors"
        aria-label="Next slide"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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