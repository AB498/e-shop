"use client";
import Link from 'next/link';

const ProductShowcase = () => {
  // Define the category IDs for the showcase products
  const showcaseCategories = {
    fashion: [6, 7], // Makeup and Perfume categories
    lifestyle: [3, 4], // Health and Beauty and Hot Offers categories
  };

  // Create query strings for the categories
  const fashionQueryString = `categoryId=${showcaseCategories.fashion.join(',')}&page=1`;
  const lifestyleQueryString = `categoryId=${showcaseCategories.lifestyle.join(',')}&page=1`;

  return (
    <section className="container max-w-6xl mx-auto py-4 sm:py-6 md:py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-10">
        {/* First Product Image */}
        <Link href={`/products?${fashionQueryString}`} className="block">
          <div className="relative aspect-[4/3] rounded-md overflow-hidden shadow-sm cursor-pointer">
            <div className="absolute inset-0 bg-[#D9D9D9] rounded-md"></div>
            <img
              src="/images/product-showcase/product-image-1.png"
              alt="Fashion Product Showcase"
              className="absolute inset-0 w-full h-full object-cover object-top rounded-md transition-transform hover:scale-[1.01] duration-300"
            />
            {/* Add overlay text */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3 sm:p-4">
              <h3 className="text-white text-lg sm:text-xl font-semibold">Fashion Collection</h3>
              <p className="text-white/80 mt-1 text-xs sm:text-sm">Explore our premium selection</p>
            </div>
          </div>
        </Link>

        {/* Second Product Image */}
        <Link href={`/products?${lifestyleQueryString}`} className="block">
          <div className="relative aspect-[4/3] rounded-md overflow-hidden shadow-sm cursor-pointer">
            <div className="absolute inset-0 bg-[#D9D9D9] rounded-md"></div>
            <img
              src="/images/product-showcase/product-image-2.png"
              alt="Lifestyle Product Showcase"
              className="absolute inset-0 w-full h-full object-cover object-top rounded-md transition-transform hover:scale-[1.01] duration-300"
            />
            {/* Add overlay text */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3 sm:p-4">
              <h3 className="text-white text-lg sm:text-xl font-semibold">Lifestyle Products</h3>
              <p className="text-white/80 mt-1 text-xs sm:text-sm">Discover quality essentials</p>
            </div>
          </div>
        </Link>
      </div>
    </section>
  );
};

export default ProductShowcase;