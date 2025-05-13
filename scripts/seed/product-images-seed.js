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

  // For product ID 3 - Electric Trimmer
  { product_id: 3, url: 'https://images.unsplash.com/photo-1508380702597-707c1b00695c?w=500&auto=format&fit=crop&q=60', key: 'products/3-image-0', alt_text: 'Product 3 image 1', position: 0, is_primary: true },
  { product_id: 3, url: 'https://images.unsplash.com/photo-1508380702597-707c1b00695c?w=500&auto=format&fit=crop&q=60&sat=-30', key: 'products/3-image-1', alt_text: 'Product 3 image 2', position: 1, is_primary: false },
  { product_id: 3, url: 'https://images.unsplash.com/photo-1508380702597-707c1b00695c?w=500&auto=format&fit=crop&q=60&blur=10', key: 'products/3-image-2', alt_text: 'Product 3 image 3', position: 2, is_primary: false },
  { product_id: 3, url: 'https://images.unsplash.com/photo-1508380702597-707c1b00695c?w=500&auto=format&fit=crop&q=60&bri=10', key: 'products/3-image-3', alt_text: 'Product 3 image 4', position: 3, is_primary: false },

  // For product ID 4 - Aftershave Balm
  { product_id: 4, url: 'https://images.unsplash.com/photo-1585751119414-ef2636f8aede?w=500&auto=format&fit=crop&q=60', key: 'products/4-image-0', alt_text: 'Product 4 image 1', position: 0, is_primary: true },
  { product_id: 4, url: 'https://images.unsplash.com/photo-1585751119414-ef2636f8aede?w=500&auto=format&fit=crop&q=60&sat=-30', key: 'products/4-image-1', alt_text: 'Product 4 image 2', position: 1, is_primary: false },
  { product_id: 4, url: 'https://images.unsplash.com/photo-1585751119414-ef2636f8aede?w=500&auto=format&fit=crop&q=60&blur=10', key: 'products/4-image-2', alt_text: 'Product 4 image 3', position: 2, is_primary: false },
  { product_id: 4, url: 'https://images.unsplash.com/photo-1585751119414-ef2636f8aede?w=500&auto=format&fit=crop&q=60&bri=10', key: 'products/4-image-3', alt_text: 'Product 4 image 4', position: 3, is_primary: false },

  // For product ID 5 - Men's Face Wash
  { product_id: 5, url: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=500&auto=format&fit=crop&q=60', key: 'products/5-image-0', alt_text: 'Product 5 image 1', position: 0, is_primary: true },
  { product_id: 5, url: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=500&auto=format&fit=crop&q=60&sat=-30', key: 'products/5-image-1', alt_text: 'Product 5 image 2', position: 1, is_primary: false },
  { product_id: 5, url: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=500&auto=format&fit=crop&q=60&blur=10', key: 'products/5-image-2', alt_text: 'Product 5 image 3', position: 2, is_primary: false },
  { product_id: 5, url: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=500&auto=format&fit=crop&q=60&bri=10', key: 'products/5-image-3', alt_text: 'Product 5 image 4', position: 3, is_primary: false },

  // For product ID 6 - Argan Oil Shampoo
  { product_id: 6, url: 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=500&auto=format&fit=crop&q=60', key: 'products/6-image-0', alt_text: 'Argan Oil Shampoo main image', position: 0, is_primary: true },
  { product_id: 6, url: 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=500&auto=format&fit=crop&q=60&sat=-30', key: 'products/6-image-1', alt_text: 'Argan Oil Shampoo side view', position: 1, is_primary: false },
  { product_id: 6, url: 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=500&auto=format&fit=crop&q=60&blur=10', key: 'products/6-image-2', alt_text: 'Argan Oil Shampoo ingredients', position: 2, is_primary: false },
  { product_id: 6, url: 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=500&auto=format&fit=crop&q=60&bri=10', key: 'products/6-image-3', alt_text: 'Argan Oil Shampoo in use', position: 3, is_primary: false },

  // For product ID 7 - Hydrating Conditioner
  { product_id: 7, url: 'https://images.unsplash.com/photo-1526947425960-945c6e72858f?w=500&auto=format&fit=crop&q=60', key: 'products/7-image-0', alt_text: 'Hydrating Conditioner main image', position: 0, is_primary: true },
  { product_id: 7, url: 'https://images.unsplash.com/photo-1526947425960-945c6e72858f?w=500&auto=format&fit=crop&q=60&sat=-30', key: 'products/7-image-1', alt_text: 'Hydrating Conditioner side view', position: 1, is_primary: false },
  { product_id: 7, url: 'https://images.unsplash.com/photo-1526947425960-945c6e72858f?w=500&auto=format&fit=crop&q=60&blur=10', key: 'products/7-image-2', alt_text: 'Hydrating Conditioner ingredients', position: 2, is_primary: false },
  { product_id: 7, url: 'https://images.unsplash.com/photo-1526947425960-945c6e72858f?w=500&auto=format&fit=crop&q=60&bri=10', key: 'products/7-image-3', alt_text: 'Hydrating Conditioner in use', position: 3, is_primary: false },

  // For product ID 8 - Hair Serum
  { product_id: 8, url: 'https://images.unsplash.com/photo-1567721913486-6585f069b332?w=500&auto=format&fit=crop&q=60', key: 'products/8-image-0', alt_text: 'Hair Serum main image', position: 0, is_primary: true },
  { product_id: 8, url: 'https://images.unsplash.com/photo-1567721913486-6585f069b332?w=500&auto=format&fit=crop&q=60&sat=-30', key: 'products/8-image-1', alt_text: 'Hair Serum side view', position: 1, is_primary: false },
  { product_id: 8, url: 'https://images.unsplash.com/photo-1567721913486-6585f069b332?w=500&auto=format&fit=crop&q=60&blur=10', key: 'products/8-image-2', alt_text: 'Hair Serum ingredients', position: 2, is_primary: false },
  { product_id: 8, url: 'https://images.unsplash.com/photo-1567721913486-6585f069b332?w=500&auto=format&fit=crop&q=60&bri=10', key: 'products/8-image-3', alt_text: 'Hair Serum in use', position: 3, is_primary: false },

  // For product ID 9 - Hair Mask
  { product_id: 9, url: 'https://images.unsplash.com/photo-1526947425960-945c6e72858f?w=500&auto=format&fit=crop&q=60', key: 'products/9-image-0', alt_text: 'Hair Mask main image', position: 0, is_primary: true },
  { product_id: 9, url: 'https://images.unsplash.com/photo-1526947425960-945c6e72858f?w=500&auto=format&fit=crop&q=60&sat=-30', key: 'products/9-image-1', alt_text: 'Hair Mask side view', position: 1, is_primary: false },
  { product_id: 9, url: 'https://images.unsplash.com/photo-1526947425960-945c6e72858f?w=500&auto=format&fit=crop&q=60&blur=10', key: 'products/9-image-2', alt_text: 'Hair Mask ingredients', position: 2, is_primary: false },
  { product_id: 9, url: 'https://images.unsplash.com/photo-1526947425960-945c6e72858f?w=500&auto=format&fit=crop&q=60&bri=10', key: 'products/9-image-3', alt_text: 'Hair Mask in use', position: 3, is_primary: false },

  // For product ID 10 - Hair Styling Gel
  { product_id: 10, url: 'https://images.unsplash.com/photo-1626015449568-e887bd02a2f4?w=500&auto=format&fit=crop&q=60', key: 'products/10-image-0', alt_text: 'Hair Styling Gel main image', position: 0, is_primary: true },
  { product_id: 10, url: 'https://images.unsplash.com/photo-1626015449568-e887bd02a2f4?w=500&auto=format&fit=crop&q=60&sat=-30', key: 'products/10-image-1', alt_text: 'Hair Styling Gel side view', position: 1, is_primary: false },
  { product_id: 10, url: 'https://images.unsplash.com/photo-1626015449568-e887bd02a2f4?w=500&auto=format&fit=crop&q=60&blur=10', key: 'products/10-image-2', alt_text: 'Hair Styling Gel ingredients', position: 2, is_primary: false },
  { product_id: 10, url: 'https://images.unsplash.com/photo-1626015449568-e887bd02a2f4?w=500&auto=format&fit=crop&q=60&bri=10', key: 'products/10-image-3', alt_text: 'Hair Styling Gel in use', position: 3, is_primary: false },

  // For product ID 11 - Facial Cleanser
  { product_id: 11, url: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500&auto=format&fit=crop&q=60', key: 'products/11-image-0', alt_text: 'Facial Cleanser main image', position: 0, is_primary: true },
  { product_id: 11, url: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500&auto=format&fit=crop&q=60&sat=-30', key: 'products/11-image-1', alt_text: 'Facial Cleanser side view', position: 1, is_primary: false },
  { product_id: 11, url: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500&auto=format&fit=crop&q=60&blur=10', key: 'products/11-image-2', alt_text: 'Facial Cleanser ingredients', position: 2, is_primary: false },
  { product_id: 11, url: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500&auto=format&fit=crop&q=60&bri=10', key: 'products/11-image-3', alt_text: 'Facial Cleanser in use', position: 3, is_primary: false },

  // For product ID 12 - Vitamin C Serum
  { product_id: 12, url: 'https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?w=500&auto=format&fit=crop&q=60', key: 'products/12-image-0', alt_text: 'Vitamin C Serum main image', position: 0, is_primary: true },
  { product_id: 12, url: 'https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?w=500&auto=format&fit=crop&q=60&sat=-30', key: 'products/12-image-1', alt_text: 'Vitamin C Serum side view', position: 1, is_primary: false },
  { product_id: 12, url: 'https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?w=500&auto=format&fit=crop&q=60&blur=10', key: 'products/12-image-2', alt_text: 'Vitamin C Serum ingredients', position: 2, is_primary: false },
  { product_id: 12, url: 'https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?w=500&auto=format&fit=crop&q=60&bri=10', key: 'products/12-image-3', alt_text: 'Vitamin C Serum in use', position: 3, is_primary: false },

  // For product ID 13 - Moisturizer
  { product_id: 13, url: 'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=500&auto=format&fit=crop&q=60', key: 'products/13-image-0', alt_text: 'Moisturizer main image', position: 0, is_primary: true },
  { product_id: 13, url: 'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=500&auto=format&fit=crop&q=60&sat=-30', key: 'products/13-image-1', alt_text: 'Moisturizer side view', position: 1, is_primary: false },
  { product_id: 13, url: 'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=500&auto=format&fit=crop&q=60&blur=10', key: 'products/13-image-2', alt_text: 'Moisturizer ingredients', position: 2, is_primary: false },
  { product_id: 13, url: 'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=500&auto=format&fit=crop&q=60&bri=10', key: 'products/13-image-3', alt_text: 'Moisturizer in use', position: 3, is_primary: false },

  // For product ID 14 - Body Lotion
  { product_id: 14, url: 'https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=500&auto=format&fit=crop&q=60', key: 'products/14-image-0', alt_text: 'Body Lotion main image', position: 0, is_primary: true },
  { product_id: 14, url: 'https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=500&auto=format&fit=crop&q=60&sat=-30', key: 'products/14-image-1', alt_text: 'Body Lotion side view', position: 1, is_primary: false },
  { product_id: 14, url: 'https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=500&auto=format&fit=crop&q=60&blur=10', key: 'products/14-image-2', alt_text: 'Body Lotion ingredients', position: 2, is_primary: false },
  { product_id: 14, url: 'https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=500&auto=format&fit=crop&q=60&bri=10', key: 'products/14-image-3', alt_text: 'Body Lotion in use', position: 3, is_primary: false },

  // For product ID 15 - Multivitamin
  { product_id: 15, url: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500&auto=format&fit=crop&q=60', key: 'products/15-image-0', alt_text: 'Multivitamin main image', position: 0, is_primary: true },
  { product_id: 15, url: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500&auto=format&fit=crop&q=60&sat=-30', key: 'products/15-image-1', alt_text: 'Multivitamin side view', position: 1, is_primary: false },
  { product_id: 15, url: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500&auto=format&fit=crop&q=60&blur=10', key: 'products/15-image-2', alt_text: 'Multivitamin ingredients', position: 2, is_primary: false },
  { product_id: 15, url: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500&auto=format&fit=crop&q=60&bri=10', key: 'products/15-image-3', alt_text: 'Multivitamin in use', position: 3, is_primary: false },
];

export default productImagesSeed;
