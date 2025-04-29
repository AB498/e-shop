import React from 'react';
import Image from 'next/image';
import Topbar from '../layout/Topbar';
import Navigation from '../layout/Navigation';
import ProductBreadcrumb from './ProductBreadcrumb';
import ProductLeftBar from './ProductLeftBar';
import DealsOfTheDay from '../deals/DealsOfTheDay';
import ProductList from './ProductList';
import Footer from '../layout/Footer';
import Copyright from '../layout/Copyright';

const ProductListingPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Topbar />
      <Navigation />

      <ProductBreadcrumb />

      <div className="container mx-auto px-4 py-6 flex gap-6">

        <ProductLeftBar />

        {/* Main Content */}
        <div className="flex-1 bg-[#FAF8F5] ">

          {/* Product Listing */}
          <ProductList />

          {/* Deals Of The Day Section */}
          <DealsOfTheDay />


        </div>


      </div>

      {/* Bottom Banner */}
      <div className="container mx-auto px-4 py-6 mb-10">
        <div className="bg-[url('/images/banner-background.png')] bg-cover bg-center rounded-[20px] p-10 relative overflow-hidden">
          <div className="max-w-lg relative z-10">
            <h2 className="text-[#253D4E] text-4xl font-bold leading-tight mb-4 ">
              Stay home & get your daily<br />
              needs from our shop
            </h2>
            <p className="text-[#7E7E7E] text-lg mb-8 ">Start You'r Daily Shopping with Nest Mart</p>

            <div className="flex">
              <input
                type="email"
                placeholder="Your emaill address"
                className="bg-white rounded-l-full py-4 px-6 w-full  text-[#838383]"
              />
              <button className="bg-[#3BB77E] text-white font-bold py-4 px-8 rounded-full -ml-6 tracking-wider ">
                Subscribe
              </button>
            </div>
          </div>

          {/* Banner Image */}
          <div className="absolute right-0 bottom-0 h-full w-1/2 flex items-end justify-end">
            <img
              src="/images/banner-image.png"
              alt="Banner"
              className="object-contain h-full"
            />
          </div>
        </div>
      </div>

      <Footer />
      <Copyright />
    </div>
  );
};

export default ProductListingPage;
