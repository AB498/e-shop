"use client";

const Footer = () => {
  return (
    <footer className="relative w-full bg-[#115343] text-white">
      {/* Background Image */}
      <div
        className="absolute inset-0 w-full h-full opacity-20 z-0"
        style={{
          backgroundImage: "url('/images/footer/footer-bg.png')",
          backgroundSize: "cover",
          backgroundPosition: "center"
        }}
      ></div>

      {/* Footer Content */}
      <div className="relative z-10 container mx-auto px-4 py-16">

        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-8">
          {/* Column 1 - Logo and Contact */}
          <div className="lg:col-span-2">
            <img
              src="/images/footer/logo.png"
              alt="Thai Bangla Store"
              className="h-16 mb-4"
            />
            <p className="text-sm mb-6 max-w-md leading-relaxed">
              From Bangkok to Dhaka — premium Thai imports
              and everyday Bangladeshi essentials delivered to
              your doorstep.
            </p>
            <address className="not-italic text-sm mb-8 leading-relaxed">
              House: 06, Road: 3/B, Sector: 09, Uttara, Dhaka<br />
              +880 1407-016740<br />
              info@thaibanglastore.com
            </address>

            {/* Social Media */}
            <div className="flex space-x-4">
              <a href="#" className="block hover:opacity-80 transition-opacity">
                <img src="/images/footer/social-1.png" alt="Social Media" className="h-6 w-6" />
              </a>
              <a href="#" className="block hover:opacity-80 transition-opacity">
                <img src="/images/footer/social-2.png" alt="Social Media" className="h-6 w-6" />
              </a>
              <a href="#" className="block hover:opacity-80 transition-opacity">
                <img src="/images/footer/social-3.png" alt="Social Media" className="h-6 w-6" />
              </a>
            </div>
          </div>

          {/* Column 2 - Categories */}
          <div>
            <h4 className="font-bold text-[15px] uppercase mb-4 leading-10">Categories</h4>
            <ul className="space-y-0">
              <li className="text-sm font-semibold leading-10">
                <a href="#" className="hover:text-[#25AA8A] transition-colors">Fashion Clothing</a>
              </li>
              <li className="text-sm font-semibold leading-10">
                <a href="#" className="hover:text-[#25AA8A] transition-colors">Bags & Handbags</a>
              </li>
              <li className="text-sm font-semibold leading-10">
                <a href="#" className="hover:text-[#25AA8A] transition-colors">Sport & Outdoors</a>
              </li>
              <li className="text-sm font-semibold leading-10">
                <a href="#" className="hover:text-[#25AA8A] transition-colors">Decor & Home</a>
              </li>
              <li className="text-sm font-semibold leading-10">
                <a href="#" className="hover:text-[#25AA8A] transition-colors">Electronic & Hitech</a>
              </li>
              <li className="text-sm font-semibold leading-10">
                <a href="#" className="hover:text-[#25AA8A] transition-colors">Beauty & Health</a>
              </li>
            </ul>
          </div>

          {/* Column 3 - Departments */}
          <div>
            <h4 className="font-bold text-[15px] uppercase mb-4 leading-10">Departments</h4>
            <ul className="space-y-0">
              <li className="text-sm font-semibold leading-10">
                <a href="#" className="hover:text-[#25AA8A] transition-colors">Supermarket</a>
              </li>
              <li className="text-sm font-semibold leading-10">
                <a href="#" className="hover:text-[#25AA8A] transition-colors">Fruit & Vegetable</a>
              </li>
              <li className="text-sm font-semibold leading-10">
                <a href="#" className="hover:text-[#25AA8A] transition-colors">Audio & Camera</a>
              </li>
              <li className="text-sm font-semibold leading-10">
                <a href="#" className="hover:text-[#25AA8A] transition-colors">Book Store</a>
              </li>
              <li className="text-sm font-semibold leading-10">
                <a href="#" className="hover:text-[#25AA8A] transition-colors">Cosmetics</a>
              </li>
            </ul>
          </div>

          {/* Column 4 - Food & Drinks */}
          <div>
            <h4 className="font-bold text-[15px] uppercase mb-4 leading-10">Food & Drinks</h4>
            <ul className="space-y-0">
              <li className="text-sm font-semibold leading-10">
                <a href="#" className="hover:text-[#25AA8A] transition-colors">Butter</a>
              </li>
              <li className="text-sm font-semibold leading-10">
                <a href="#" className="hover:text-[#25AA8A] transition-colors">Cheese</a>
              </li>
              <li className="text-sm font-semibold leading-10">
                <a href="#" className="hover:text-[#25AA8A] transition-colors">Eggs</a>
              </li>
              <li className="text-sm font-semibold leading-10">
                <a href="#" className="hover:text-[#25AA8A] transition-colors">Milk & Cream</a>
              </li>
              <li className="text-sm font-semibold leading-10">
                <a href="#" className="hover:text-[#25AA8A] transition-colors">Yogurt</a>
              </li>
              <li className="text-sm font-semibold leading-10">
                <a href="#" className="hover:text-[#25AA8A] transition-colors">Coffee</a>
              </li>
              <li className="text-sm font-semibold leading-10">
                <a href="#" className="hover:text-[#25AA8A] transition-colors">Drink Mixes & Juices</a>
              </li>


            </ul>



          </div>

          {/* Column 5 - Payment Methods */}
          <div className="col-span-2">
            {/* Newsletter Section */}
            <div className="mb-16">
              <h3 className="uppercase font-bold text-[15px] mb-2 leading-10">newsletter sign in</h3>
              <p className="text-sm mb-6 leading-loose">
                Stay connected with Thai Bangla Store and never miss an update!
              </p>

              <div className="flex flex-col md:flex-row max-w-xl">
                <div className="flex-grow bg-[#115343] border-2 border-[#25AA8A] rounded-2xl px-4 py-2 flex items-center mb-2 md:mb-0 md:mr-2">
                  <input
                    type="email"
                    placeholder="Your email here..."
                    className="bg-transparent border-none outline-none w-full text-[#25AA8A] placeholder-[#25AA8A] text-sm leading-loose"
                  />
                </div>
                <button className="bg-[#BC0000] text-white font-bold px-8 py-2 rounded-2xl uppercase text-sm leading-loose transition-colors hover:bg-[#a00000] whitespace-nowrap">
                  Subscribe
                </button>
              </div>
            </div>
          </div>


        </div>


      </div>


    </footer>
  );
};

export default Footer; 