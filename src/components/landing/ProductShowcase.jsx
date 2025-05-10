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
    <section className="container mx-auto py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* First Product Image */}
        <Link href={`/products?${fashionQueryString}`} className="block">
          <div className="relative aspect-[4/4] rounded-lg overflow-hidden shadow-md transition-transform hover:scale-[1.02] duration-300 cursor-pointer">
            <div className="absolute inset-0 bg-[#D9D9D9] rounded-lg"></div>
            <img
              src="/images/product-showcase/product-image-1.png"
              alt="Fashion Product Showcase"
              className="absolute inset-0 w-full h-full object-fit rounded-lg"
            />
            {/* Add overlay text */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
              <h3 className="text-white text-2xl font-bold">Fashion Collection</h3>
              <p className="text-white/80 mt-2">Explore our premium selection</p>
            </div>
          </div>
        </Link>

        {/* Second Product Image */}
        <Link href={`/products?${lifestyleQueryString}`} className="block">
          <div className="relative aspect-[4/4] rounded-lg overflow-hidden shadow-md transition-transform hover:scale-[1.02] duration-300 cursor-pointer">
            <div className="absolute inset-0 bg-[#D9D9D9] rounded-lg"></div>
            <img
              src="/images/product-showcase/product-image-2.png"
              alt="Lifestyle Product Showcase"
              className="absolute inset-0 w-full h-full object-fit rounded-lg"
            />
            {/* Add overlay text */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
              <h3 className="text-white text-2xl font-bold">Lifestyle Products</h3>
              <p className="text-white/80 mt-2">Discover quality essentials</p>
            </div>
          </div>
        </Link>
      </div>
    </section>
  );
};

export default ProductShowcase;