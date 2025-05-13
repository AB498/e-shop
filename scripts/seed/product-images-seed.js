// Product images seed data - creates multiple images for each product
// This uses the same images as the main product but creates variations
// In a real app, you would have different images for each product

// Hardcoded product images based on the products-seed.js data
const productImagesSeed = [
  // For product ID 1 - Men's Shaving Kit
  { product_id: 1, url: 'https://images.unsplash.com/photo-1621607512214-68297480165e?w=500&auto=format&fit=crop&q=60', key: 'products/1-image-0', alt_text: 'Product 1 image 1', position: 0, is_primary: true },
  { product_id: 1, url: 'https://images.unsplash.com/photo-1621607512214-68297480165e?w=500&auto=format&fit=crop&q=60&sat=-30', key: 'products/1-image-1', alt_text: 'Product 1 image 2', position: 1, is_primary: false },
  { product_id: 1, url: 'https://images.unsplash.com/photo-1621607512214-68297480165e?w=500&auto=format&fit=crop&q=60&blur=10', key: 'products/1-image-2', alt_text: 'Product 1 image 3', position: 2, is_primary: false },
  { product_id: 1, url: 'https://images.unsplash.com/photo-1621607512214-68297480165e?w=500&auto=format&fit=crop&q=60&bri=10', key: 'products/1-image-3', alt_text: 'Product 1 image 4', position: 3, is_primary: false },

  // For product ID 2 - Beard Oil
  { product_id: 2, url: 'https://images.unsplash.com/photo-1621607512214-68297480165e?w=500&auto=format&fit=crop&q=60', key: 'products/2-image-0', alt_text: 'Product 2 image 1', position: 0, is_primary: true },
  { product_id: 2, url: 'https://images.unsplash.com/photo-1621607512214-68297480165e?w=500&auto=format&fit=crop&q=60&sat=-30', key: 'products/2-image-1', alt_text: 'Product 2 image 2', position: 1, is_primary: false },
  { product_id: 2, url: 'https://images.unsplash.com/photo-1621607512214-68297480165e?w=500&auto=format&fit=crop&q=60&blur=10', key: 'products/2-image-2', alt_text: 'Product 2 image 3', position: 2, is_primary: false },
  { product_id: 2, url: 'https://images.unsplash.com/photo-1621607512214-68297480165e?w=500&auto=format&fit=crop&q=60&bri=10', key: 'products/2-image-3', alt_text: 'Product 2 image 4', position: 3, is_primary: false },

  // For product ID 3 - Argan Oil Shampoo (was ID 6)
  { product_id: 3, url: 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=500&auto=format&fit=crop&q=60', key: 'products/3-image-0', alt_text: 'Argan Oil Shampoo main image', position: 0, is_primary: true },
  { product_id: 3, url: 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=500&auto=format&fit=crop&q=60&sat=-30', key: 'products/3-image-1', alt_text: 'Argan Oil Shampoo side view', position: 1, is_primary: false },
  { product_id: 3, url: 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=500&auto=format&fit=crop&q=60&blur=10', key: 'products/3-image-2', alt_text: 'Argan Oil Shampoo ingredients', position: 2, is_primary: false },
  { product_id: 3, url: 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=500&auto=format&fit=crop&q=60&bri=10', key: 'products/3-image-3', alt_text: 'Argan Oil Shampoo in use', position: 3, is_primary: false },

  // For product ID 4 - Hydrating Conditioner (was ID 7)
  { product_id: 4, url: 'https://images.unsplash.com/photo-1526947425960-945c6e72858f?w=500&auto=format&fit=crop&q=60', key: 'products/4-image-0', alt_text: 'Hydrating Conditioner main image', position: 0, is_primary: true },
  { product_id: 4, url: 'https://images.unsplash.com/photo-1526947425960-945c6e72858f?w=500&auto=format&fit=crop&q=60&sat=-30', key: 'products/4-image-1', alt_text: 'Hydrating Conditioner side view', position: 1, is_primary: false },
  { product_id: 4, url: 'https://images.unsplash.com/photo-1526947425960-945c6e72858f?w=500&auto=format&fit=crop&q=60&blur=10', key: 'products/4-image-2', alt_text: 'Hydrating Conditioner ingredients', position: 2, is_primary: false },
  { product_id: 4, url: 'https://images.unsplash.com/photo-1526947425960-945c6e72858f?w=500&auto=format&fit=crop&q=60&bri=10', key: 'products/4-image-3', alt_text: 'Hydrating Conditioner in use', position: 3, is_primary: false },

  // For product ID 5 - Facial Cleanser (was ID 11)
  { product_id: 5, url: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500&auto=format&fit=crop&q=60', key: 'products/5-image-0', alt_text: 'Facial Cleanser main image', position: 0, is_primary: true },
  { product_id: 5, url: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500&auto=format&fit=crop&q=60&sat=-30', key: 'products/5-image-1', alt_text: 'Facial Cleanser side view', position: 1, is_primary: false },
  { product_id: 5, url: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500&auto=format&fit=crop&q=60&blur=10', key: 'products/5-image-2', alt_text: 'Facial Cleanser ingredients', position: 2, is_primary: false },
  { product_id: 5, url: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500&auto=format&fit=crop&q=60&bri=10', key: 'products/5-image-3', alt_text: 'Facial Cleanser in use', position: 3, is_primary: false },

  // For product ID 6 - Vitamin C Serum (was ID 12)
  { product_id: 6, url: 'https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?w=500&auto=format&fit=crop&q=60', key: 'products/6-image-0', alt_text: 'Vitamin C Serum main image', position: 0, is_primary: true },
  { product_id: 6, url: 'https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?w=500&auto=format&fit=crop&q=60&sat=-30', key: 'products/6-image-1', alt_text: 'Vitamin C Serum side view', position: 1, is_primary: false },
  { product_id: 6, url: 'https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?w=500&auto=format&fit=crop&q=60&blur=10', key: 'products/6-image-2', alt_text: 'Vitamin C Serum ingredients', position: 2, is_primary: false },
  { product_id: 6, url: 'https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?w=500&auto=format&fit=crop&q=60&bri=10', key: 'products/6-image-3', alt_text: 'Vitamin C Serum in use', position: 3, is_primary: false },

  // For product ID 7 - Limited Edition Gift Set (was ID 16)
  { product_id: 7, url: 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=500&auto=format&fit=crop&q=60', key: 'products/7-image-0', alt_text: 'Limited Edition Gift Set main image', position: 0, is_primary: true },
  { product_id: 7, url: 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=500&auto=format&fit=crop&q=60&sat=-30', key: 'products/7-image-1', alt_text: 'Limited Edition Gift Set side view', position: 1, is_primary: false },
  { product_id: 7, url: 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=500&auto=format&fit=crop&q=60&blur=10', key: 'products/7-image-2', alt_text: 'Limited Edition Gift Set contents', position: 2, is_primary: false },
  { product_id: 7, url: 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=500&auto=format&fit=crop&q=60&bri=10', key: 'products/7-image-3', alt_text: 'Limited Edition Gift Set packaging', position: 3, is_primary: false },

  // For product ID 8 - Skincare Bundle (was ID 17)
  { product_id: 8, url: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500&auto=format&fit=crop&q=60', key: 'products/8-image-0', alt_text: 'Skincare Bundle main image', position: 0, is_primary: true },
  { product_id: 8, url: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500&auto=format&fit=crop&q=60&sat=-30', key: 'products/8-image-1', alt_text: 'Skincare Bundle side view', position: 1, is_primary: false },
  { product_id: 8, url: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500&auto=format&fit=crop&q=60&blur=10', key: 'products/8-image-2', alt_text: 'Skincare Bundle contents', position: 2, is_primary: false },
  { product_id: 8, url: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500&auto=format&fit=crop&q=60&bri=10', key: 'products/8-image-3', alt_text: 'Skincare Bundle packaging', position: 3, is_primary: false },

  // For product ID 9 - Baby Shampoo (was ID 21)
  { product_id: 9, url: 'https://images.unsplash.com/photo-1594918195019-f6fddfc36b78?w=500&auto=format&fit=crop&q=60', key: 'products/9-image-0', alt_text: 'Baby Shampoo main image', position: 0, is_primary: true },
  { product_id: 9, url: 'https://images.unsplash.com/photo-1594918195019-f6fddfc36b78?w=500&auto=format&fit=crop&q=60&sat=-30', key: 'products/9-image-1', alt_text: 'Baby Shampoo side view', position: 1, is_primary: false },
  { product_id: 9, url: 'https://images.unsplash.com/photo-1594918195019-f6fddfc36b78?w=500&auto=format&fit=crop&q=60&blur=10', key: 'products/9-image-2', alt_text: 'Baby Shampoo ingredients', position: 2, is_primary: false },
  { product_id: 9, url: 'https://images.unsplash.com/photo-1594918195019-f6fddfc36b78?w=500&auto=format&fit=crop&q=60&bri=10', key: 'products/9-image-3', alt_text: 'Baby Shampoo in use', position: 3, is_primary: false },

  // For product ID 10 - Baby Lotion (was ID 22)
  { product_id: 10, url: 'https://images.unsplash.com/photo-1594918195019-f6fddfc36b78?w=500&auto=format&fit=crop&q=60', key: 'products/10-image-0', alt_text: 'Baby Lotion main image', position: 0, is_primary: true },
  { product_id: 10, url: 'https://images.unsplash.com/photo-1594918195019-f6fddfc36b78?w=500&auto=format&fit=crop&q=60&sat=-30', key: 'products/10-image-1', alt_text: 'Baby Lotion side view', position: 1, is_primary: false },
  { product_id: 10, url: 'https://images.unsplash.com/photo-1594918195019-f6fddfc36b78?w=500&auto=format&fit=crop&q=60&blur=10', key: 'products/10-image-2', alt_text: 'Baby Lotion ingredients', position: 2, is_primary: false },
  { product_id: 10, url: 'https://images.unsplash.com/photo-1594918195019-f6fddfc36b78?w=500&auto=format&fit=crop&q=60&bri=10', key: 'products/10-image-3', alt_text: 'Baby Lotion in use', position: 3, is_primary: false },

  // For product ID 11 - Foundation (was ID 26)
  { product_id: 11, url: 'https://images.unsplash.com/photo-1631214524020-3aae896f59e9?w=500&auto=format&fit=crop&q=60', key: 'products/11-image-0', alt_text: 'Foundation main image', position: 0, is_primary: true },
  { product_id: 11, url: 'https://images.unsplash.com/photo-1631214524020-3aae896f59e9?w=500&auto=format&fit=crop&q=60&sat=-30', key: 'products/11-image-1', alt_text: 'Foundation side view', position: 1, is_primary: false },
  { product_id: 11, url: 'https://images.unsplash.com/photo-1631214524020-3aae896f59e9?w=500&auto=format&fit=crop&q=60&blur=10', key: 'products/11-image-2', alt_text: 'Foundation swatches', position: 2, is_primary: false },
  { product_id: 11, url: 'https://images.unsplash.com/photo-1631214524020-3aae896f59e9?w=500&auto=format&fit=crop&q=60&bri=10', key: 'products/11-image-3', alt_text: 'Foundation in use', position: 3, is_primary: false },

  // For product ID 12 - Mascara (was ID 27)
  { product_id: 12, url: 'https://images.unsplash.com/photo-1631214499983-1e8ad3a0bb28?w=500&auto=format&fit=crop&q=60', key: 'products/12-image-0', alt_text: 'Mascara main image', position: 0, is_primary: true },
  { product_id: 12, url: 'https://images.unsplash.com/photo-1631214499983-1e8ad3a0bb28?w=500&auto=format&fit=crop&q=60&sat=-30', key: 'products/12-image-1', alt_text: 'Mascara side view', position: 1, is_primary: false },
  { product_id: 12, url: 'https://images.unsplash.com/photo-1631214499983-1e8ad3a0bb28?w=500&auto=format&fit=crop&q=60&blur=10', key: 'products/12-image-2', alt_text: 'Mascara brush', position: 2, is_primary: false },
  { product_id: 12, url: 'https://images.unsplash.com/photo-1631214499983-1e8ad3a0bb28?w=500&auto=format&fit=crop&q=60&bri=10', key: 'products/12-image-3', alt_text: 'Mascara in use', position: 3, is_primary: false },

  // For product ID 13 - Floral Perfume (was ID 31)
  { product_id: 13, url: 'https://images.unsplash.com/photo-1592945403407-9caf930b0c4d?w=500&auto=format&fit=crop&q=60', key: 'products/13-image-0', alt_text: 'Floral Perfume main image', position: 0, is_primary: true },
  { product_id: 13, url: 'https://images.unsplash.com/photo-1592945403407-9caf930b0c4d?w=500&auto=format&fit=crop&q=60&sat=-30', key: 'products/13-image-1', alt_text: 'Floral Perfume side view', position: 1, is_primary: false },
  { product_id: 13, url: 'https://images.unsplash.com/photo-1592945403407-9caf930b0c4d?w=500&auto=format&fit=crop&q=60&blur=10', key: 'products/13-image-2', alt_text: 'Floral Perfume packaging', position: 2, is_primary: false },
  { product_id: 13, url: 'https://images.unsplash.com/photo-1592945403407-9caf930b0c4d?w=500&auto=format&fit=crop&q=60&bri=10', key: 'products/13-image-3', alt_text: 'Floral Perfume in use', position: 3, is_primary: false },

  // For product ID 14 - Citrus Cologne (was ID 32)
  { product_id: 14, url: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?w=500&auto=format&fit=crop&q=60', key: 'products/14-image-0', alt_text: 'Citrus Cologne main image', position: 0, is_primary: true },
  { product_id: 14, url: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?w=500&auto=format&fit=crop&q=60&sat=-30', key: 'products/14-image-1', alt_text: 'Citrus Cologne side view', position: 1, is_primary: false },
  { product_id: 14, url: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?w=500&auto=format&fit=crop&q=60&blur=10', key: 'products/14-image-2', alt_text: 'Citrus Cologne packaging', position: 2, is_primary: false },
  { product_id: 14, url: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?w=500&auto=format&fit=crop&q=60&bri=10', key: 'products/14-image-3', alt_text: 'Citrus Cologne in use', position: 3, is_primary: false },

  // For product ID 15 - Luxury Face Cream (was ID 36)
  { product_id: 15, url: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500&auto=format&fit=crop&q=60', key: 'products/15-image-0', alt_text: 'Luxury Face Cream main image', position: 0, is_primary: true },
  { product_id: 15, url: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500&auto=format&fit=crop&q=60&sat=-30', key: 'products/15-image-1', alt_text: 'Luxury Face Cream side view', position: 1, is_primary: false },
  { product_id: 15, url: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500&auto=format&fit=crop&q=60&blur=10', key: 'products/15-image-2', alt_text: 'Luxury Face Cream texture', position: 2, is_primary: false },
  { product_id: 15, url: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500&auto=format&fit=crop&q=60&bri=10', key: 'products/15-image-3', alt_text: 'Luxury Face Cream in use', position: 3, is_primary: false },

  // For product ID 16 - Designer Perfume (was ID 37)
  { product_id: 16, url: 'https://images.unsplash.com/photo-1592945403407-9caf930b0c4d?w=500&auto=format&fit=crop&q=60', key: 'products/16-image-0', alt_text: 'Designer Perfume main image', position: 0, is_primary: true },
  { product_id: 16, url: 'https://images.unsplash.com/photo-1592945403407-9caf930b0c4d?w=500&auto=format&fit=crop&q=60&sat=-30', key: 'products/16-image-1', alt_text: 'Designer Perfume side view', position: 1, is_primary: false },
  { product_id: 16, url: 'https://images.unsplash.com/photo-1592945403407-9caf930b0c4d?w=500&auto=format&fit=crop&q=60&blur=10', key: 'products/16-image-2', alt_text: 'Designer Perfume packaging', position: 2, is_primary: false },
  { product_id: 16, url: 'https://images.unsplash.com/photo-1592945403407-9caf930b0c4d?w=500&auto=format&fit=crop&q=60&bri=10', key: 'products/16-image-3', alt_text: 'Designer Perfume in use', position: 3, is_primary: false },
];

export default productImagesSeed;
