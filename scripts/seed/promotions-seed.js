const promotionsSeed = [
  // Carousel promotions
  {
    title: 'Summer Sale',
    description: 'Get up to 50% off on summer essentials',
    image_url: '/images/carousel/slide-1.png',
    link_url: '/products?categoryId=1',
    type: 'carousel',
    position: 'home',
    is_active: true,
    priority: 10,
  },
  {
    title: 'Fresh Vegetables',
    description: 'Organic and locally sourced vegetables',
    image_url: '/images/carousel/slide-2.png',
    link_url: '/products?categoryId=2',
    type: 'carousel',
    position: 'home',
    is_active: true,
    priority: 9,
  },
  {
    title: 'Bakery Special',
    description: 'Freshly baked goods every morning',
    image_url: '/images/carousel/slide-3.png',
    link_url: '/products?category=4',
    type: 'carousel',
    position: 'home',
    is_active: true,
    priority: 8,
  },

  // Banner promotions
  {
    title: 'Weekend Deal',
    description: 'Special offers every weekend',
    image_url: '/images/banners/promo-bg.png',
    link_url: '/products?category=3',
    type: 'banner',
    position: 'home',
    is_active: true,
    priority: 5,
  },

  // Weekly deals promotions
  {
    title: 'Fresh Fruits',
    description: '25% off on all fruits',
    image_url: '/images/products/product-1.png',
    link_url: '/products?category=2',
    type: 'deal',
    position: 'home',
    is_active: true,
    priority: 7,
    discount: '25',
  },
  {
    title: 'Organic Vegetables',
    description: 'Buy 1 Get 1 Free',
    image_url: '/images/products/product-2.png',
    link_url: '/products?category=2',
    type: 'deal',
    position: 'home',
    is_active: true,
    priority: 6,
    discount: '50',
  },
  {
    title: 'Bakery Products',
    description: '30% off on all bakery items',
    image_url: '/images/products/product-3.png',
    link_url: '/products?category=4',
    type: 'deal',
    position: 'home',
    is_active: true,
    priority: 5,
    discount: '30',
  },
  {
    title: 'Dairy Products',
    description: 'Up to 20% off on dairy',
    image_url: '/images/products/product-4.png',
    link_url: '/products?category=5',
    type: 'deal',
    position: 'home',
    is_active: true,
    priority: 4,
    discount: '20',
  },

  // Other promotions
  {
    title: 'New Arrivals',
    description: 'Check out our latest products',
    image_url: '/images/banners/gluta-product.png',
    link_url: '/products?new=true',
    type: 'deal',
    position: 'category',
    is_active: true,
    priority: 3,
  }
];

export default promotionsSeed;
