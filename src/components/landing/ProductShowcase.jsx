"use client";

const ProductShowcase = () => {
  return (
    <section className="container mx-auto px-4 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* First Product Image */}
        <div className="relative aspect-[4/4] rounded-lg overflow-hidden shadow-md transition-transform cursor-pointer">
          <div className="absolute inset-0 bg-[#D9D9D9] rounded-lg"></div>
          <img
            src="/images/product-showcase/product-image-1.png"
            alt="Fashion Product Showcase"
            className="absolute inset-0 w-full h-full object-fit rounded-lg"
          />
          {/* Optional: Add overlay or text here if needed */}
        </div>

        {/* Second Product Image */}
        <div className="relative aspect-[4/4] rounded-lg overflow-hidden shadow-md transition-transform cursor-pointer">
          <div className="absolute inset-0 bg-[#D9D9D9] rounded-lg"></div>
          <img
            src="/images/product-showcase/product-image-2.png"
            alt="Lifestyle Product Showcase"
            className="absolute inset-0 w-full h-full object-fit rounded-lg"
          />
          {/* Optional: Add overlay or text here if needed */}
        </div>
      </div>
    </section>
  );
};

export default ProductShowcase; 