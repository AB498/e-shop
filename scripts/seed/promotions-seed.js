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
    link_url: '/products?categoryId=4',
    type: 'carousel',
    position: 'home',
    is_active: true,
    priority: 8,
  },

  // Banner promotions
  {
    title: 'Weekend Deal',
    description: 'Special offers every weekend',
    image_url: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&h=300&q=80',
    link_url: '/products?categoryId=3',
    type: 'banner',
    position: 'home',
    is_active: true,
    priority: 5,
  },

  // Weekly deals promotions
  {
    title: 'Fresh Fruits',
    description: '25% off on all fruits',
    image_url: 'https://images.unsplash.com/photo-1577401239170-897942555fb3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&h=600&q=80',
    link_url: '/products?categoryId=2',
    type: 'deal',
    position: 'home',
    is_active: true,
    priority: 7,
    discount: '25',
  },
  {
    title: 'Organic Vegetables',
    description: 'Buy 1 Get 1 Free',
    image_url: 'https://images.unsplash.com/photo-1505682634904-d7c8d95cdc50?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&h=600&q=80',
    link_url: '/products?categoryId=2',
    type: 'deal',
    position: 'home',
    is_active: true,
    priority: 6,
    discount: '50',
  },
  {
    title: 'Bakery Products',
    description: '30% off on all bakery items',
    image_url: 'https://images.unsplash.com/photo-1557925923-cd4648e211a0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&h=600&q=80',
    link_url: '/products?categoryId=4',
    type: 'deal',
    position: 'home',
    is_active: true,
    priority: 5,
    discount: '30',
  },
  {
    title: 'Dairy Products',
    description: 'Up to 20% off on dairy',
    image_url: 'https://images.unsplash.com/photo-1563865436874-9aef32095fad?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&h=600&q=80',
    link_url: '/products?categoryId=5',
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
    image_url: 'https://images.unsplash.com/photo-1607082349566-187342175e2f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&h=400&q=80',
    link_url: '/products?new=true',
    type: 'deal',
    position: 'category',
    is_active: true,
    priority: 3,
  }
];

export default promotionsSeed;
