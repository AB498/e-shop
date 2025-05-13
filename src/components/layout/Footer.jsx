"use client";

const Footer = () => {
  return (
    <footer className="relative w-full text-white">
      {/* Background Image */}
      <div
        className="absolute inset-0 w-full h-full opacity-100 z-0"
        style={{
          backgroundImage: "url('/images/footer/footer-bg.png')",
          backgroundSize: "cover",
          backgroundPosition: "center"
        }}
      ></div>

      {/* Footer Content */}
      <div className="relative z-10 container mx-auto px-3 py-10 md:py-12">

        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-6">
          {/* Column 1 - Logo and Contact */}
          <div className="lg:col-span-2">
            <img
              src="/images/footer/logo.png"
              alt="Thai Bangla Store"
              className="h-12 mb-3"
            />
            <p className="text-xs mb-4 max-w-md leading-relaxed">
              From Bangkok to Dhaka — premium Thai imports
              and everyday Bangladeshi essentials delivered to
              your doorstep.
            </p>
            <address className="not-italic text-xs mb-6 leading-relaxed">
              <div className="flex items-center mb-1.5">
                <i className="fas fa-map-marker-alt text-[#25AA8A] mr-1.5"></i>
                <span>House: 06, Road: 3/B, Sector: 09, Uttara, Dhaka</span>
              </div>
              <div className="flex items-center mb-1.5">
                <i className="fas fa-phone-alt text-[#25AA8A] mr-1.5"></i>
                <span>+880 1407-016740</span>
              </div>
              <div className="flex items-center">
                <i className="fas fa-envelope text-[#25AA8A] mr-1.5"></i>
                <span>info@thaibanglastore.com</span>
              </div>
            </address>


          </div>

          {/* Column 2 - Categories */}
          <div>
            <h4 className="font-bold text-[13px] uppercase mb-3 leading-8">Categories</h4>
            <ul className="space-y-0">
              <li className="text-xs font-semibold leading-8">
                <a href="#" className="hover:text-[#25AA8A] transition-colors">Fashion Clothing</a>
              </li>
              <li className="text-xs font-semibold leading-8">
                <a href="#" className="hover:text-[#25AA8A] transition-colors">Bags & Handbags</a>
              </li>
              <li className="text-xs font-semibold leading-8">
                <a href="#" className="hover:text-[#25AA8A] transition-colors">Sport & Outdoors</a>
              </li>
              <li className="text-xs font-semibold leading-8">
                <a href="#" className="hover:text-[#25AA8A] transition-colors">Decor & Home</a>
              </li>
              <li className="text-xs font-semibold leading-8">
                <a href="#" className="hover:text-[#25AA8A] transition-colors">Electronic & Hitech</a>
              </li>
              <li className="text-xs font-semibold leading-8">
                <a href="#" className="hover:text-[#25AA8A] transition-colors">Beauty & Health</a>
              </li>
            </ul>
          </div>

          {/* Column 3 - Departments */}
          <div>
            <h4 className="font-bold text-[13px] uppercase mb-3 leading-8">Departments</h4>
            <ul className="space-y-0">
              <li className="text-xs font-semibold leading-8">
                <a href="#" className="hover:text-[#25AA8A] transition-colors">Supermarket</a>
              </li>
              <li className="text-xs font-semibold leading-8">
                <a href="#" className="hover:text-[#25AA8A] transition-colors">Fruit & Vegetable</a>
              </li>
              <li className="text-xs font-semibold leading-8">
                <a href="#" className="hover:text-[#25AA8A] transition-colors">Audio & Camera</a>
              </li>
              <li className="text-xs font-semibold leading-8">
                <a href="#" className="hover:text-[#25AA8A] transition-colors">Book Store</a>
              </li>
              <li className="text-xs font-semibold leading-8">
                <a href="#" className="hover:text-[#25AA8A] transition-colors">Cosmetics</a>
              </li>
            </ul>
          </div>

          {/* Column 4 - Food & Drinks */}
          <div>
            <h4 className="font-bold text-[13px] uppercase mb-3 leading-8">Food & Drinks</h4>
            <ul className="space-y-0">
              <li className="text-xs font-semibold leading-8">
                <a href="#" className="hover:text-[#25AA8A] transition-colors">Butter</a>
              </li>
              <li className="text-xs font-semibold leading-8">
                <a href="#" className="hover:text-[#25AA8A] transition-colors">Cheese</a>
              </li>
              <li className="text-xs font-semibold leading-8">
                <a href="#" className="hover:text-[#25AA8A] transition-colors">Eggs</a>
              </li>
              <li className="text-xs font-semibold leading-8">
                <a href="#" className="hover:text-[#25AA8A] transition-colors">Milk & Cream</a>
              </li>
              <li className="text-xs font-semibold leading-8">
                <a href="#" className="hover:text-[#25AA8A] transition-colors">Yogurt</a>
              </li>
              <li className="text-xs font-semibold leading-8">
                <a href="#" className="hover:text-[#25AA8A] transition-colors">Coffee</a>
              </li>
              <li className="text-xs font-semibold leading-8">
                <a href="#" className="hover:text-[#25AA8A] transition-colors">Drink Mixes & Juices</a>
              </li>
            </ul>
          </div>

          {/* Column 5 - Payment Methods */}
          <div className="col-span-2">
            {/* Newsletter Section */}
            <div className="mb-10">
              <h3 className="uppercase font-bold text-[13px] mb-2 leading-8">newsletter sign in</h3>
              <p className="text-xs mb-4 leading-relaxed">
                Stay connected with Thai Bangla Store and never miss an update!
              </p>

              <div className="flex flex-col md:flex-row max-w-xl flex-wrap gap-3">
                <div className="flex-grow basis-full bg-[#115343] border-2 border-[#25AA8A] rounded-full px-3 py-1.5 flex items-center mb-2 md:mb-0 md:mr-2">
                  <input
                    type="email"
                    placeholder="Your email here..."
                    className="bg-transparent border-none outline-none w-full text-[#25AA8A] placeholder-[#25AA8A] text-xs leading-relaxed"
                  />
                </div>
                <button className="bg-[#BC0000] text-white font-bold px-6 py-1.5 rounded-full uppercase text-xs leading-relaxed transition-colors hover:bg-[#a00000] whitespace-nowrap">
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