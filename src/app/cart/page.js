'use client';

import React from 'react';
import { useCart } from '@/context/CartContext';

import Navigation from '@/components/layout/Navigation';
import Footer from '@/components/layout/Footer';
import Copyright from '@/components/layout/Copyright';
import CartItem from '@/components/cart/CartItem';
import CartSummary from '@/components/cart/CartSummary';
import EmptyCart from '@/components/cart/EmptyCart';
import Link from 'next/link';
import Image from 'next/image';
import DealsOfTheDay from '@/components/deals/DealsOfTheDay';

export default function CartPage() {
  const { cart } = useCart();

  return (
    <div className="min-h-screen flex flex-col px-4 py-8">
      

      <div className="container mx-auto border border-[rgba(0,0,0,0.1)] rounded-lg p-8 mt-8 bg-white">
        {cart.length > 0 ? (
          <>
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Cart Items */}
              <div className="flex-1">
                <div className="bg-white rounded-lg shadow-sm p-6 border border-[rgba(0,0,0,0.1)]">
                  {cart.map((item, index) => (
                    <React.Fragment key={item.id}>
                      <CartItem item={item} />
                      {index < cart.length - 1 && <hr className="border-t border-[rgba(0,0,0,0.1)] my-4" />}
                    </React.Fragment>
                  ))}
                </div>
              </div>

              {/* Cart Summary */}
              <div className="lg:w-1/3">
                <CartSummary />
              </div>
            </div>

            <div className="mt-8 text-center">
              <Link href="/products" className="text-[#444444] hover:text-[#006B51] transition-colors tracking-wider">
                Continue Shopping
              </Link>
            </div>
          </>
        ) : (
          <EmptyCart />
        )}
      </div>

      <div className="container mx-auto">
        <DealsOfTheDay />
      </div>

      <Footer />
      <Copyright />
    </div>
  );
}
