"use client";

const PopularCategories = () => {
  // Category data
  const categories = [
    {
      id: 1,
      name: "Vegetables & Fruits",
      image: "/images/categories/vegetables-fruits.jpg",
      subcategories: [
        "Fresh Fruits",
        "Fresh Vegetables",
        "Frozen Veg",
        "Leafies & Herbs",
        "Mushrooms"
      ]
    },
    {
      id: 2,
      name: "Dairy & Eggs",
      image: "/images/categories/vegetables-fruits.jpg", // Temporarily using the same image
      subcategories: [
        "Milk & Cream",
        "Butter & Cheese",
        "Eggs",
        "Yogurt",
        "Dairy Alternatives"
      ]
    },
    {
      id: 3,
      name: "Meat & Seafood",
      image: "/images/categories/vegetables-fruits.jpg", // Temporarily using the same image
      subcategories: [
        "Chicken",
        "Fish & Seafood",
        "Lamb & Goat",
        "Beef",
        "Sausages"
      ]
    },
    {
      id: 4,
      name: "Bakery & Snacks",
      image: "/images/categories/vegetables-fruits.jpg", // Temporarily using the same image
      subcategories: [
        "Bread",
        "Cookies & Biscuits",
        "Cakes & Pastries",
        "Chips & Crisps",
        "Chocolates"
      ]
    }
  ];

  return (
    <section className="container mx-auto px-4 py-10">
      {/* Section title */}
      <div className="flex items-center justify-start mb-6 relative h-10 gap-4">
        <img
          src="/images/topbar/icon-products.png"
          alt="Beauty & Makeup Icon"
          className="h-full aspect-square object-contain"
        />
        <h2 className="text-2xl font-semibold">Popular Categories</h2>
      </div>


      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative pb-10">
        {categories.map((category) => (
          <div key={category.id} className="flex bg-white rounded-[20px] shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            {/* Category Image */}
            <div className="relative w-48 h-48">
              <div className="absolute inset-0 bg-[#B74B4B] rounded-tl-[10px] rounded-tr-[10px]"></div>
              <img
                src={category.image}
                alt={category.name}
                className="absolute inset-0 w-full h-full object-cover rounded-tl-[10px] rounded-tr-[10px]"
              />
            </div>

            {/* Category Content */}
            <div className="p-5">
              <h3 className="font-semibold mb-4">{category.name}</h3>
              <ul className="line-clamp-4">
                {category.subcategories.map((subcategory, index) => (
                  <li key={index} className="leading-1 text-[#535353] text-sm hover:text-black hover:font-medium transition-colors cursor-pointer">
                    {subcategory}
                  </li>
                ))}
              </ul>
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

      </div>
    </section>
  );
};

export default PopularCategories; 