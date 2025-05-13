// Product seed data mapped to our 8 categories from images/categories
const productsSeed = [
  // Grooming (Category 1)
  { id: 1, name: 'Men\'s Shaving Kit', sku: 'GROOM-001', category_id: 1, price: 29.99, stock: 50, weight: 0.8, description: 'Complete shaving kit for men with razor and shaving cream.', image: 'https://images.unsplash.com/photo-1621607512214-68297480165e?w=500&auto=format&fit=crop&q=60' },
  { id: 2, name: 'Beard Oil', sku: 'GROOM-002', category_id: 1, price: 14.99, stock: 75, description: 'Nourishing beard oil for soft and manageable facial hair.', image: 'https://images.unsplash.com/photo-1621607512214-68297480165e?w=500&auto=format&fit=crop&q=60' },

  // Hair Care (Category 2)
  { id: 3, name: 'Argan Oil Shampoo', sku: 'HAIR-001', category_id: 2, price: 12.99, stock: 70, description: 'Nourishing shampoo with argan oil for all hair types.', image: 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=500&auto=format&fit=crop&q=60' },
  { id: 4, name: 'Hydrating Conditioner', sku: 'HAIR-002', category_id: 2, price: 12.99, stock: 65, description: 'Deep hydrating conditioner for smooth, silky hair.', image: 'https://images.unsplash.com/photo-1526947425960-945c6e72858f?w=500&auto=format&fit=crop&q=60' },

  // Health and Beauty (Category 3)
  { id: 5, name: 'Facial Cleanser', sku: 'HEALTH-001', category_id: 3, price: 12.99, stock: 65, description: 'Gentle facial cleanser for all skin types.', image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500&auto=format&fit=crop&q=60' },
  { id: 6, name: 'Vitamin C Serum', sku: 'HEALTH-002', category_id: 3, price: 24.99, stock: 40, description: 'Brightening vitamin C serum for radiant skin.', image: 'https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?w=500&auto=format&fit=crop&q=60' },

  // Hot Offers (Category 4)
  { id: 7, name: 'Limited Edition Gift Set', sku: 'OFFER-001', category_id: 4, price: 49.99, stock: 30, description: 'Special limited edition beauty gift set at 40% off.', image: 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=500&auto=format&fit=crop&q=60' },
  { id: 8, name: 'Skincare Bundle', sku: 'OFFER-002', category_id: 4, price: 59.99, stock: 25, description: 'Complete skincare routine bundle at special price.', image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500&auto=format&fit=crop&q=60' },

  // Kids and Baby (Category 5)
  { id: 9, name: 'Baby Shampoo', sku: 'KIDS-001', category_id: 5, price: 8.99, stock: 60, description: 'Gentle tear-free baby shampoo.', image: 'https://images.unsplash.com/photo-1594918195019-f6fddfc36b78?w=500&auto=format&fit=crop&q=60' },
  { id: 10, name: 'Baby Lotion', sku: 'KIDS-002', category_id: 5, price: 7.99, stock: 55, description: 'Gentle moisturizing lotion for baby\'s sensitive skin.', image: 'https://images.unsplash.com/photo-1594918195019-f6fddfc36b78?w=500&auto=format&fit=crop&q=60' },

  // Makeup (Category 6)
  { id: 11, name: 'Foundation', sku: 'MAKEUP-001', category_id: 6, price: 22.99, stock: 40, description: 'Long-wearing liquid foundation with medium coverage.', image: 'https://images.unsplash.com/photo-1631214524020-3aae896f59e9?w=500&auto=format&fit=crop&q=60' },
  { id: 12, name: 'Mascara', sku: 'MAKEUP-002', category_id: 6, price: 9.99, stock: 55, description: 'Volumizing and lengthening mascara for dramatic lashes.', image: 'https://images.unsplash.com/photo-1631214499983-1e8ad3a0bb28?w=500&auto=format&fit=crop&q=60' },

  // Perfume (Category 7)
  { id: 13, name: 'Floral Perfume', sku: 'PERFUME-001', category_id: 7, price: 59.99, stock: 30, description: 'Elegant floral perfume with notes of jasmine and rose.', image: 'https://images.unsplash.com/photo-1592945403407-9caf930b0c4d?w=500&auto=format&fit=crop&q=60' },
  { id: 14, name: 'Citrus Cologne', sku: 'PERFUME-002', category_id: 7, price: 49.99, stock: 25, description: 'Refreshing citrus cologne for men.', image: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?w=500&auto=format&fit=crop&q=60' },

  // Top Brands (Category 8)
  { id: 15, name: 'Luxury Face Cream', sku: 'BRAND-001', category_id: 8, price: 89.99, stock: 20, description: 'Premium face cream from top luxury skincare brand.', image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500&auto=format&fit=crop&q=60' },
  { id: 16, name: 'Designer Perfume', sku: 'BRAND-002', category_id: 8, price: 129.99, stock: 15, description: 'Signature scent from world-renowned fashion designer.', image: 'https://images.unsplash.com/photo-1592945403407-9caf930b0c4d?w=500&auto=format&fit=crop&q=60' },
];

export default productsSeed;
