"use client";

const WeeklyDiscounts = () => {
  // Product data (in a real app, this would come from an API)
  const products = [
    {
      id: 1,
      category: "T-Shirt",
      name: "Product Name Here",
      price: "৳86.00",
      discountPercentage: 10,
      color: "#f0f0f0" // Light gray placeholder color
    },
    {
      id: 2,
      category: "T-Shirt",
      name: "Product Name Here",
      price: "৳86.00",
      discountPercentage: 10,
      color: "#f0f0f0"
    },
    {
      id: 3,
      category: "T-Shirt",
      name: "Product Name Here",
      price: "৳86.00",
      discountPercentage: 10,
      color: "#f0f0f0"
    },
    {
      id: 4,
      category: "T-Shirt",
      name: "Product Name Here",
      price: "৳86.00",
      discountPercentage: 10,
      color: "#f0f0f0"
    },
    {
      id: 5,
      category: "T-Shirt",
      name: "Product Name Here",
      price: "৳86.00",
      discountPercentage: 10,
      color: "#f0f0f0"
    },
    {
      id: 6,
      category: "T-Shirt",
      name: "Product Name Here",
      price: "৳86.00",
      discountPercentage: 10,
      color: "#f0f0f0"
    }
  ];

  return (
    <section className="container mx-auto px-4 py-8">
      {/* Section title */}
      <div className="flex items-center justify-start mb-6 relative h-10 gap-4">
        <img
          src="/images/topbar/icon-daily-deal.png"
          alt="Beauty & Makeup Icon"
          className="h-full aspect-square object-contain"
        />
        <h2 className="text-2xl font-semibold">Weekly Discounts</h2>
      </div>

      {/* Products grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 relative">
        {products.map((product) => (
          <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden relative">
            {/* Product Image (placeholder) */}
            <div
              className="aspect-square relative"
              style={{ backgroundColor: product.color }}
            >
              {/* Discount tag */}
              <div className="absolute top-2 left-2">
                <div className="bg-[#006B51] text-white px-2 py-1 rounded-lg text-xs font-semibold">
                  -{product.discountPercentage}%
                </div>
              </div>

              {/* Wishlist icon */}
              <div className="absolute top-2 right-2">
                <img
                  src="/images/beauty-makeup/wishlist-icon.png"
                  alt="Add to wishlist"
                  className="w-6 h-6 cursor-pointer"
                />
              </div>
            </div>

            {/* Product Info */}
            <div className="p-3 text-center">
              <p className="text-[#A9A9A9] text-xs font-semibold uppercase">{product.category}</p>
              <h3 className="text-[#3F3F3F] text-base font-semibold mt-1">{product.name}</h3>

              {/* Price */}
              <div className="mt-2 flex items-center justify-center gap-2">
                <span className="text-[#E12625] text-sm font-normal">{product.price}</span>
                <span className="text-[#E12625] text-sm font-normal line-through">{product.price}</span>
              </div>
            </div>
          </div>
        ))}

        {/* Navigation Arrows */}
        <div className="absolute -left-4 top-1/2 transform -translate-y-1/2">
          <button className="bg-white rounded-md p-2 shadow-md hover:bg-gray-50 transition-colors">
            <img
              src="/images/categories/arrow-right.png"
              alt="Next"
              className="w-4 h-4"
            />
          </button>
        </div>
        <div className="absolute -right-4 top-1/2 transform -translate-y-1/2">
          <button className="bg-white rounded-md p-2 shadow-md hover:bg-gray-50 transition-colors">
            <img
              src="/images/categories/arrow-left.png"
              alt="Previous"
              className="w-4 h-4"
            />
          </button>
        </div>


        <div className="absolute -right-4 top-1/2 transform -translate-y-1/2 flex flex-col gap-3">
          <button className="bg-white rounded-md p-2 shadow-md">
            <img
              src="/images/beauty-makeup/arrow-right.png"
              alt="Next"
              className="w-4 h-4"
            />
          </button>
        </div>
      </div>
    </section>
  );
};

export default WeeklyDiscounts; 